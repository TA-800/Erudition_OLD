import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import MyDatePicker from "../Utilities/MyDatePicker";

export default function NewAssignment({ setCreateAssignment, courses, selectedCourse, setNewAssignments, allAssignmentStates }) {
    const [auto, setAuto] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const newAssignmentRef = useRef();
    // For (un)mount animation
    const [mountAnimation, setMountAnimation] = useState(false);

    function closeNewAssignment() {
        newAssignmentRef.current.ontransitionend = (e) => {
            if (e.propertyName === "height") {
                setCreateAssignment(false);
            }
        };
        setMountAnimation(false);
    }

    function submitAssignment(e) {
        e.preventDefault();
        const form = e.target.parentElement;
        if (!form.name.value && !auto) {
            form.name.placeholder = "Please enter a name!!";
            return;
        }
        const data = {
            // Select the first course if none is selected
            course: form.course.value || courses[0].id,
            due_date: startDate.toUTCString(),
            name: form.name.value,
            desc: form.desc.value,
            auto_amount: auto ? form.auto_amount.value : 0,
            auto_freq: auto ? form.freq.value : 0,
        };

        fetch(`https://erudition.up.railway.app/backend/assignments/${form.course.value}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (res.status !== 201) {
                    return res.json().then((json) => {
                        throw new Error(`${res.status} ${res.statusText} ${json.detail}`);
                    });
                }
                return res.json();
            })
            .then((received) => {
                let receivedAssignment;
                if (Array.isArray(received) && received.length > 0) receivedAssignment = received[0];
                else receivedAssignment = received;
                if (selectedCourse.course_name === "all" || selectedCourse.id === receivedAssignment.assignment_course) {
                    setNewAssignments(received, false, { ...allAssignmentStates });
                }
            })
            .catch((err) => {
                alert(err);
            });

        closeNewAssignment();
    }

    useEffect(() => {
        let timeout = setTimeout(() => {
            setMountAnimation(true);
        }, 10);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <form
            ref={newAssignmentRef}
            className={"assignments-new-wrapper " + (mountAnimation ? "new-assignment new-assignment-active" : "new-assignment")}>
            {auto ? (
                <AutoAssignment startDate={startDate} setStartDate={setStartDate} courses={courses} />
            ) : (
                <ManualAssignment startDate={startDate} setStartDate={setStartDate} courses={courses} />
            )}
            {/* Assignment submit */}
            <button
                className={
                    "btn-dark h-full " +
                    (auto
                        ? "after:content-['Auto_Generate'] sm:after:content-['Auto_Gen.']"
                        : "after:content-['Add_Assignment'] sm:after:content-['Add_Asgnmt.']")
                }
                onClick={(e) => submitAssignment(e)}
            />
            <div className="grid grid-flow-col gap-2 col-start-3 col-span-2">
                <button
                    type="button"
                    className="btn-dark before:content-['Close'] sm:before:content-['']"
                    onClick={() => {
                        closeNewAssignment();
                    }}>
                    <FontAwesomeIcon className="text-2xl hover:text-white transition-all duration-200" icon={faTimesCircle} />
                </button>
                <button
                    type="button"
                    className="btn-dark before:content-['Auto'] sm:before:content-['']"
                    onClick={() => {
                        setAuto(!auto);
                    }}>
                    <FontAwesomeIcon
                        className="text-2xl hover:text-white transition-all duration-200"
                        icon={auto ? faCircleArrowLeft : faCircleArrowRight}
                    />
                </button>
            </div>
        </form>
    );
}

function ManualAssignment({ startDate, setStartDate, courses }) {
    return (
        <>
            {/* Course select */}
            <select
                name="course"
                className="dropdown min-w-0"
                style={{
                    boxShadow: "inset 0px -2px 0px rgba(0,0,0,0.25)",
                }}>
                {courses.map((course) => {
                    return (
                        <option key={"asgnmnt-course-select-" + course.id} value={course.id}>
                            {course.course_code}
                        </option>
                    );
                })}
            </select>
            {/* Assignment Name */}
            <input
                name="name"
                type="text"
                className="input-text col-span-2"
                style={{
                    boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -1px 0px rgb(10,164,194,0.65)",
                }}
                placeholder="New Assignment Name"
            />
            {/* CALENDAR */}
            <div>
                <MyDatePicker
                    className="input-text text-left"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showTimeSelect
                />
            </div>
            {/* Assignment desc */}
            <textarea
                name="desc"
                className="input-text col-span-3 resize-none"
                placeholder="Assignment Description"
                style={{
                    scrollbarWidth: "none",
                    boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -1px 0px rgb(10,164,194,0.65)",
                }}></textarea>
        </>
    );
}

function AutoAssignment({ startDate, setStartDate, courses }) {
    return (
        <>
            {/* Course select */}
            <select name="course" className="dropdown min-w-0">
                {courses.map((course) => {
                    return (
                        <option key={"asgnmnt-course-select-" + course.id} value={course.id}>
                            {course.course_code}
                        </option>
                    );
                })}
            </select>
            {/* Assignment auto name */}
            <input name="name" type="text" className="input-text col-span-2" placeholder="Auto Assignment Prefix" />
            {/* CALENDAR */}
            <div className="col-span-1 flex justify-center">
                <MyDatePicker
                    className="input-text col-span-2 text-left"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showTimeSelect
                />
            </div>
            {/* Assignment auto number */}
            <input
                name="auto_amount"
                defaultValue={0}
                min={0}
                type="number"
                className="input-text text-center"
                placeholder="Auto Amount"
            />
            {/* Assignment desc */}
            <textarea
                name="desc"
                className="input-text col-span-3 resize-none"
                placeholder="Assignment Description"
                style={{
                    scrollbarWidth: "none",
                }}></textarea>
            {/* Frequency select */}
            <select
                name="freq"
                className="dropdown min-w-0"
                style={{
                    boxShadow: "inset 0px -2px 0px rgba(0,0,0,0.25)",
                }}>
                <option value="1">Daily</option>
                <option value="2">Weekly</option>
                <option value="3">Monthly</option>
            </select>
        </>
    );
}
