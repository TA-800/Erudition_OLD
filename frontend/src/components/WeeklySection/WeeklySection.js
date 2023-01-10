import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";
import { CSSclasses } from "../StudyHub";
import NewAssignment from "../Utilities/NewAssignment";
import AssignmentSelection from "../Utilities/AssignmentSelection";
import { addWeeks, endOfISOWeek, startOfISOWeek } from "date-fns";
import MyDatePicker from "../Utilities/MyDatePicker";
import AssignmentUnit from "../Utilities/AssignmentUnit";

export default function WeeklySection({ courses, assignments, setAssignments }) {
    const [selectedWeek, setSelectedWeek] = useState(new Date());

    const [search, setSearch] = useState("");
    const searchedAssignments = useMemo(() => {
        // Get all assignments that are due in the selected week.
        const start = startOfISOWeek(selectedWeek);
        const end = endOfISOWeek(selectedWeek);

        const weekFilteredAssignments = assignments.filter((assignment) => {
            const assignmentDate = new Date(assignment.assignment_due_date);
            return assignmentDate >= start && assignmentDate <= end;
        });

        if (!search) return weekFilteredAssignments;

        return weekFilteredAssignments.filter((assignment) => {
            // return true (true returns the element (complete assignment) into a new "filtered" array)
            // if the assignment name contains the search term
            return assignment.assignment_name.toLowerCase().includes(search.toLowerCase());
        });
    }, [search, assignments, selectedWeek]);
    const [createAssignment, setCreateAssignment] = useState(false);
    const [assignmentSelection, setAssignmentSelection] = useState([]);
    const [assignmentSelectionBox, setAssignmentSelectionBox] = useState(false);

    // Fetch this week assignments from server
    useEffect(() => {
        fetch("http://127.0.0.1:8000/backend/assignments/0", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
        })
            .then((res) => {
                if (res.status !== 200) {
                    return res.json().then((json) => {
                        throw new Error(`${res.status} ${res.statusText} ${json.detail}`);
                    });
                }
                return res.json();
            })
            .then((data) => {
                setNewAssignments(data, true);
            })
            .catch((err) => alert(err.message));
    }, [selectedWeek]);

    // useEffect(() => {
    //     const date = new Date();
    //     console.log(date);
    //     const start = startOfISOWeek(date);
    //     const end = endOfISOWeek(date);
    //     console.log(start, end);
    // }, []);

    // ASSIGNMENTS' FUNCTIONS
    function setNewAssignments(newAssignmentData, fetch = false) {
        let newAssignments = [];
        // Force array mapping
        if (!Array.isArray(newAssignmentData)) newAssignments.push(newAssignmentData);
        else {
            newAssignments = newAssignmentData;
        }
        newAssignments = newAssignments.map((assignment) => {
            // Convert date to local time string
            assignment.assignment_due_date = new Date(assignment.assignment_due_date).toString();
            return assignment;
        });

        // Replace all assignments with newAssignmentData when fetching from server
        if (fetch) {
            setAssignments(newAssignments);
        }
        // Else just append new assignments to assignments
        else {
            setAssignments([...assignments, ...newAssignments]);
        }
    }
    function splitDate(date) {
        let hours = parseInt(date.substring(0, 21).slice(16, 18));
        let minutes = date.substring(0, 21).slice(19);
        let time =
            hours > 12
                ? `${hours - 12}:${minutes}`
                : `${hours.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })}:${minutes}`;
        return [`${date.substring(0, 21).slice(0, 10)}`, `${time} ${hours >= 12 ? "PM" : "AM"}`]; // Thu Jan 05, 1:00 PM
    }
    function assignmentSelectionChange(e) {
        const assignmentID = e.target.parentNode.parentNode.getAttribute("data-akey");
        // If checked, add to assignmentSelection
        if (e.target.checked) {
            setAssignmentSelection([...assignmentSelection, assignmentID]);
            setAssignmentSelectionBox(true);
        }
        // If unchecked, remove from assignmentSelection
        else {
            setAssignmentSelection(assignmentSelection.filter((assignment) => assignment !== assignmentID));
        }
    }
    function clearAssignmentSelection(panel = "courses") {
        // Deselect all selected assignments
        document.querySelectorAll(`article.${panel} input[type=checkbox]`).forEach((el) => {
            el.checked = false;
        });
        setAssignmentSelection([]);
    }

    return (
        <article className="weekly">
            {/* Left panel */}
            <div className="lp">
                <p className="lp__title">WEEK</p>
                <ul className="lp__list">
                    <li
                        className={CSSclasses.courseButton.base}
                        onClick={(e) => {
                            clearAssignmentSelection();
                            setAssignmentSelectionBox(false);
                            e.currentTarget.parentNode.childNodes.forEach((child) => {
                                child.className = CSSclasses.courseButton.base;
                            });
                            e.currentTarget.className = twMerge(CSSclasses.courseButton.base, CSSclasses.courseButton.active);
                            setSelectedWeek(new Date()); // Get today's date
                        }}>
                        This week
                    </li>
                    <li
                        className={CSSclasses.courseButton.base}
                        onClick={(e) => {
                            clearAssignmentSelection();
                            setAssignmentSelectionBox(false);
                            e.currentTarget.parentNode.childNodes.forEach((child) => {
                                child.className = CSSclasses.courseButton.base;
                            });
                            e.currentTarget.className = twMerge(CSSclasses.courseButton.base, CSSclasses.courseButton.active);
                            setSelectedWeek(addWeeks(new Date(), 1));
                        }}>
                        Next week
                    </li>
                    <li
                        className={twMerge(CSSclasses.courseButton.base, "overflow-visible")}
                        onClick={() => {
                            clearAssignmentSelection();
                            setAssignmentSelectionBox(false);
                        }}>
                        <div className="w-full h-full flex items-center">
                            <MyDatePicker
                                customInput={<button className="w-full h-14">Choose week</button>}
                                onChange={(date) => setSelectedWeek(date)}
                            />
                        </div>
                    </li>
                </ul>
            </div>

            {/* Right panel */}
            <div className="rp">
                {/* Utility bar */}
                <div className="p-2 w-full h-fit flex flex-row gap-6 mdc:gap-1 mdc:text-sm">
                    {/* Search bar with icon */}
                    <div className="w-4/6 mdc:w-2/4 h-12 mdc:h-10 relative">
                        <input
                            type="text"
                            placeholder="Search notes"
                            className={CSSclasses.search.base}
                            style={{
                                boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -2px 0px #0AA4C2",
                            }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <FontAwesomeIcon icon={faSearch} className="absolute top-1/3 left-2 text-cyan-100 opacity-50" />
                    </div>
                    {/* Add button */}
                    <button
                        className={createAssignment ? twMerge(CSSclasses.add.base, CSSclasses.add.disabled) : CSSclasses.add.base} //"bg-cyan-800 text-cyan-100 rounded-lg w-1/6 mdc:w-10 h-12 mdc:h-10 p-2 flex flex-row justify-center items-center gap-1 after:content-['Add'] mdc:after:content-[]"
                        style={{
                            boxShadow: "inset 0px -2px 0px rgba(0,0,0,0.25)",
                        }}
                        onClick={() => setCreateAssignment(true)}>
                        <FontAwesomeIcon icon={faPlusCircle} />
                    </button>
                </div>

                {/* Content panel */}
                <div className="rp__content">
                    {createAssignment && (
                        <NewAssignment
                            setCreateAssignment={setCreateAssignment}
                            courses={courses}
                            selectedCourse={{ course_name: "all" }}
                            setNewAssignments={setNewAssignments}
                        />
                    )}
                    {/* Assignments */}
                    <div className="weekly-assignment-wrapper max-h-96 overflow-auto">
                        <ul className="flex flex-col w-full gap-y-3">
                            {searchedAssignments
                                .sort(
                                    (a, b) =>
                                        // Sort by completed, then by time
                                        (a.assignment_completed ? 1 : 0) - (b.assignment_completed ? 1 : 0) ||
                                        new Date(a.assignment_due_date) - new Date(b.assignment_due_date)
                                )
                                .map((assignment) => {
                                    return (
                                        <AssignmentUnit
                                            key={assignment.id}
                                            assignment={assignment}
                                            splitDate={splitDate}
                                            assignmentSelectionChange={assignmentSelectionChange}
                                        />
                                    );
                                })}
                        </ul>
                    </div>
                    {assignmentSelectionBox && (
                        <AssignmentSelection
                            assignments={assignments}
                            assignmentSelection={assignmentSelection}
                            setAssignments={setAssignments}
                            setAssignmentSelectionBox={setAssignmentSelectionBox}
                            clearAssignmentSelection={() => {
                                clearAssignmentSelection("weekly");
                            }}
                        />
                    )}
                </div>
            </div>
        </article>
    );
}
