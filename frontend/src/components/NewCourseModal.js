import React, { useRef } from "react";
import { CSSclasses } from "./StudyHub";
import { twMerge } from "tailwind-merge";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NewCourseModal({ courseModal, setCourseModal, setCourses }) {
    const courseNameRef = useRef();

    function saveCourse(newCourse) {
        // Send to backend
        // Update courses to frontend
        setCourses((courses) => [...courses, newCourse]);

        // Close modal
        setCourseModal(false);
    }

    if (courseModal) {
        // Add scroll lock to main
        document.querySelector("main")?.classList.add("scroll-lock");
    } else {
        // Remove scroll lock from main
        document.querySelector("main")?.classList.remove("scroll-lock");
    }

    return (
        <div className={courseModal ? twMerge(CSSclasses.overlay.base, CSSclasses.overlay.active) : CSSclasses.overlay.base}>
            {/* Save new module button */}
            <button
                className={twMerge(CSSclasses.editButton.base, CSSclasses.editButton.active)}
                onClick={() => {
                    saveCourse({
                        id: 99,
                        course_user: "ta800",
                        course_name: courseNameRef.current.value,
                        course_description: "Course description",
                        course_instructor: "Instructor",
                        course_instructor_contact: "Instructor contact",
                        course_instructor_office_hours: "Instructor office hours",
                    });
                }}>
                <FontAwesomeIcon icon={faCheck} />
            </button>
            <div className="flex flex-col gap-y-2">
                <div className="grid grid-cols-2 gap-x-2 mdc:flex mdc:flex-col mdc:gap-y-2">
                    <div>
                        Course Code*
                        <input
                            ref={courseNameRef}
                            className="bg-cyan-800 bg-opacity-25 rounded-lg p-2 pl-5 text-cyan-100 w-full h-12 border-b border-cyan-700 border-opacity-50 focus:outline-none"
                            placeholder="e.g. COMP101"
                        />
                    </div>
                    <div>
                        Course Name
                        <input
                            ref={courseNameRef}
                            className="bg-cyan-800 bg-opacity-25 rounded-lg p-2 pl-5 text-cyan-100 w-full h-12 border-b border-cyan-700 border-opacity-50 focus:outline-none"
                            placeholder="e.g. Introduction to Computer Science"
                        />
                    </div>
                </div>
                Course Description
                <textarea
                    className="bg-cyan-800 bg-opacity-25 rounded-lg p-2 pl-5 text-cyan-100 w-full h-24 border-b border-cyan-700 border-opacity-50 focus:outline-none"
                    placeholder="e.g. This course introduces learners to the very basic concepts of CS and Python."></textarea>
                Course Instructor
                <input
                    ref={courseNameRef}
                    className="bg-cyan-800 bg-opacity-25 rounded-lg p-2 pl-5 text-cyan-100 w-full h-12 border-b border-cyan-700 border-opacity-50 focus:outline-none"
                    placeholder="e.g. Dr John Doe"
                />
                Course Instructor Contact
                <input
                    ref={courseNameRef}
                    className="bg-cyan-800 bg-opacity-25 rounded-lg p-2 pl-5 text-cyan-100 w-full h-12 border-b border-cyan-700 border-opacity-50 focus:outline-none"
                    placeholder="e.g. johndoe@gmail.com, +1 (012) 345 6789"
                />
                Course Instructor Office Hours
                <input
                    ref={courseNameRef}
                    className="bg-cyan-800 bg-opacity-25 rounded-lg p-2 pl-5 text-cyan-100 w-full h-12 border-b border-cyan-700 border-opacity-50 focus:outline-none"
                    placeholder="e.g. Mon, 11am - 12pm; Wed, 2pm - 3pm; Fri, 4pm - 5pm"
                />
            </div>
            <button
                className={twMerge(CSSclasses.readButton.base, CSSclasses.readButton.active)}
                onClick={() => {
                    setCourseModal(false);
                }}>
                <FontAwesomeIcon icon={faClose} />
            </button>
        </div>
    );
}
