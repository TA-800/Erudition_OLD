import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import NewAssignment from "../Utilities/NewAssignment";
import AssignmentSelection from "../Utilities/AssignmentSelection";
import { addWeeks, endOfISOWeek, startOfISOWeek } from "date-fns";
import MyDatePicker from "../Utilities/MyDatePicker";
import AssignmentUnit from "../Utilities/AssignmentUnit";
import Stateless from "../Utilities/Stateless";
import {
    setNewAssignments,
    splitDate,
    assignmentSelectionChange,
    clearAssignmentSelection,
} from "../Utilities/AssignmentFunctions";
// Import url from Main.js
import { url } from "../Main";

export default function WeeklySection({ courses, assignments, setAssignments }) {
    const [selectedWeek, setSelectedWeek] = useState(null);

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

    // Group all the states and setState functions together into an object to pass it easily into
    // imported assignment functions
    const allAssignmentStates = {
        assignments: assignments,
        assignmentSelection: assignmentSelection,
        assignmentSelectionBox: assignmentSelectionBox,
        setAssignments: setAssignments,
        setAssignmentSelection: setAssignmentSelection,
        setAssignmentSelectionBox: setAssignmentSelectionBox,
    };

    // Fetch this week assignments from server
    useEffect(() => {
        fetch(url + "assignments/0", {
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
                setNewAssignments(data, true, { ...allAssignmentStates });
            })
            .catch((err) => alert(err.message));
    }, [selectedWeek]);

    return (
        <article className="weekly">
            {/* Left panel */}
            <div className="lp">
                <p className="lp__title">WEEK</p>
                <ul className="lp__list">
                    <li
                        className="course-button"
                        onClick={(e) => {
                            clearAssignmentSelection("weekly", { ...allAssignmentStates });
                            setAssignmentSelectionBox(false);
                            e.currentTarget.parentNode.childNodes.forEach((child) => {
                                child.className = "course-button";
                            });
                            e.currentTarget.className = "course-button course-button-active";
                            setSelectedWeek(new Date()); // Get today's date
                        }}>
                        This week
                    </li>
                    <li
                        className="course-button"
                        onClick={(e) => {
                            clearAssignmentSelection("weekly", { ...allAssignmentStates });
                            setAssignmentSelectionBox(false);
                            e.currentTarget.parentNode.childNodes.forEach((child) => {
                                child.className = "course-button";
                            });
                            e.currentTarget.className = "course-button course-button-active";
                            setSelectedWeek(addWeeks(new Date(), 1));
                        }}>
                        Next week
                    </li>
                    <li
                        className="course-button overflow-visible"
                        onClick={(e) => {
                            clearAssignmentSelection("weekly", { ...allAssignmentStates });
                            setAssignmentSelectionBox(false);
                            e.currentTarget.parentNode.childNodes.forEach((child) => {
                                child.className = "course-button";
                            });
                        }}>
                        <div className="w-full h-full flex items-center overflow-visible">
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
                    <div className="w-2/3 h-12 mdc:h-10 relative">
                        <input
                            type="text"
                            placeholder="Search assignments"
                            className="input-text pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <FontAwesomeIcon icon={faSearch} className="absolute top-1/3 left-2 text-cyan-100 opacity-50" />
                    </div>
                    {/* Add button */}
                    <button
                        className={createAssignment || selectedWeek === null ? "add disabled" : "add"}
                        onClick={() => setCreateAssignment(true)}
                        disabled={selectedWeek === null}>
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
                            allAssignmentStates={allAssignmentStates}
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
                                            allAssignmentStates={allAssignmentStates}
                                        />
                                    );
                                })}
                            {selectedWeek === null && <Stateless contents="Select a week to see work" />}
                            {selectedWeek !== null && searchedAssignments.length === 0 && (
                                <Stateless contents="No assignments to find" />
                            )}
                        </ul>
                    </div>
                    {assignmentSelectionBox && (
                        <AssignmentSelection
                            assignments={assignments}
                            assignmentSelection={assignmentSelection}
                            setAssignments={setAssignments}
                            setAssignmentSelectionBox={setAssignmentSelectionBox}
                            clearAssignmentSelection={() => {
                                clearAssignmentSelection("weekly", { ...allAssignmentStates });
                            }}
                        />
                    )}
                </div>
            </div>
        </article>
    );
}
