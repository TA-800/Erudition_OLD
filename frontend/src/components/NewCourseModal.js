import React, { useEffect, useRef, useState } from "react";
import { CSSclasses } from "./StudyHub";
import { twMerge } from "tailwind-merge";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NewCourseModal({ setCourseModal, setCourses }) {
    const overlayRef = useRef();
    // For (un)mount animation
    const [mountAnimation, setMountAnimation] = useState(false);

    const clearFormInputs = () => {
        document.querySelector("input[name='code']").value = "";
        document.querySelector("input[name='name']").value = "";
        document.querySelector("textarea[name='desc']").value = "";
        document.querySelector("input[name='instructor']").value = "";
        document.querySelector("input[name='contact']").value = "";
        document.querySelector("input[name='office_hours']").value = "";
    };

    function saveCourse(newCourse) {
        console.log(newCourse);
        // Send to backend
        fetch("http://127.0.0.1:8000/backend/courses/0", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
            body: JSON.stringify(newCourse),
        })
            .then((resp) => {
                if (resp.status !== 201) {
                    return resp.json().then((json) => {
                        throw new Error(`${resp.status} ${resp.statusText} ${json.detail}`);
                    });
                }
                return resp.json();
            })
            .then((data) => {
                // Update courses to frontend
                setCourses((courses) => [...courses, data]);
            })
            .catch((error) => alert(error));

        // Close modal
        setCourseModal(false);
    }

    function closeModal() {
        overlayRef.current.ontransitionend = (e) => {
            if (e.propertyName === "opacity") {
                clearFormInputs();
                setCourseModal(false);
            }
        };
        setMountAnimation(false);
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
        <>
            {/* Save new course button */}
            <button
                className={mountAnimation ? twMerge(CSSclasses.editButton.base, CSSclasses.editButton.active) : "hidden"}
                onClick={() => {
                    saveCourse({
                        course_code: document.querySelector("input[name='code']").value.toUpperCase(),
                        course_name: document.querySelector("input[name='name']").value,
                        course_description: document.querySelector("textarea[name='desc']").value,
                        course_instructor: document.querySelector("input[name='instructor']").value,
                        course_instructor_contact: document.querySelector("input[name='contact']").value,
                        course_instructor_office_hours: document.querySelector("input[name='office_hours']").value,
                    });
                }}>
                <FontAwesomeIcon icon={faCheck} />
            </button>
            <div
                ref={overlayRef}
                className={
                    mountAnimation ? twMerge(CSSclasses.overlay.base, CSSclasses.overlay.active) : CSSclasses.overlay.base
                }>
                <p className="text-6xl font-extrabold uppercase mdc:text-3xl">Add a new course</p>

                <form className="new-course-form flex flex-col gap-y-2">
                    <div className="grid grid-cols-2 gap-x-2 mdc:flex mdc:flex-col mdc:gap-y-2">
                        <div>
                            Course Code*
                            <input
                                className="bg-cyan-800 bg-opacity-25 rounded-lg p-2 pl-5 text-cyan-100 w-full h-12 border-b border-cyan-700 border-opacity-50 focus:outline-none"
                                placeholder="e.g. COMP101"
                                name="code"
                            />
                        </div>
                        <div>
                            Course Name
                            <input
                                className="bg-cyan-800 bg-opacity-25 rounded-lg p-2 pl-5 text-cyan-100 w-full h-12 border-b border-cyan-700 border-opacity-50 focus:outline-none"
                                placeholder="e.g. Introduction to Computer Science"
                                name="name"
                            />
                        </div>
                    </div>
                    Course Description
                    <textarea
                        className="bg-cyan-800 bg-opacity-25 rounded-lg p-2 pl-5 text-cyan-100 w-full h-24 border-b border-cyan-700 border-opacity-50 focus:outline-none"
                        placeholder="e.g. This course introduces learners to the very basic concepts of CS and Python."
                        name="desc"></textarea>
                    Course Instructor
                    <input
                        className="bg-cyan-800 bg-opacity-25 rounded-lg p-2 pl-5 text-cyan-100 w-full h-12 border-b border-cyan-700 border-opacity-50 focus:outline-none"
                        placeholder="e.g. Dr John Doe"
                        name="instructor"
                    />
                    Course Instructor Contact
                    <input
                        className="bg-cyan-800 bg-opacity-25 rounded-lg p-2 pl-5 text-cyan-100 w-full h-12 border-b border-cyan-700 border-opacity-50 focus:outline-none"
                        placeholder="e.g. johndoe@gmail.com, +1 (012) 345 6789"
                        name="contact"
                    />
                    Course Instructor Office Hours
                    <input
                        className="bg-cyan-800 bg-opacity-25 rounded-lg p-2 pl-5 text-cyan-100 w-full h-12 border-b border-cyan-700 border-opacity-50 focus:outline-none"
                        placeholder="e.g. Mon, 11am - 12pm; Wed, 2pm - 3pm; Fri, 4pm - 5pm"
                        name="office_hours"
                    />
                </form>
            </div>
            <button
                className={mountAnimation ? twMerge(CSSclasses.readButton.base, CSSclasses.readButton.active) : "hidden"}
                onClick={closeModal}>
                <FontAwesomeIcon icon={faClose} />
            </button>
        </>
    );
}
