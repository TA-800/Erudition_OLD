import { useState, useEffect, useRef } from "react";
import { useContext } from "react";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
// Context
import AuthContext from "../context/AuthContext";

export default function StudyHub() {
    const [courses, setCourses] = useState([]);

    const [modules, setModules] = useState([]);
    const [moduleNotes, setModuleNotes] = useState("");
    const [assignments, setAssignments] = useState([]);
    const [contact, setContact] = useState([]);

    const [readingText, setReadingText] = useState("");
    const [readingPanel, setReadingPanel] = useState(false);

    const { user, logout } = useContext(AuthContext);
    const contentRef = useRef();
    // const isFirstBreakpoint = useMediaPredicate("(max-width: 814px)");

    useEffect(() => {
        fetch("http://127.0.0.1:8000/backend/courses/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
        })
            .then((res) => {
                // If response is not 200 OK, throw an error
                if (res.status !== 200) {
                    return res.json().then((json) => {
                        throw new Error(
                            `${res.status} ${res.statusText}: ${
                                json.detail || json.username || json.password
                            }`
                        );
                    });
                }
                return res.json();
            })
            .then((data) => {
                setCourses(data);
            })
            .catch((errMessage) => {
                alert(errMessage);
                // Sign the user out
                logout();
            });
    }, []);

    function fetchData(course_code) {
        // Fetch content from backend depending on the content selected (contentRef)
        // and add it to the rp__content element
        const contentType = contentRef.current.value;
        fetch(`http://127.0.0.1:8000/backend/${contentType}/${course_code}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
        })
            .then((res) => {
                // If response is not 200 OK, throw an error
                if (res.status !== 200) {
                    return res.json().then((json) => {
                        throw new Error(
                            `${res.status} ${res.statusText} ${json.detail}`
                        );
                    });
                }
                return res.json();
            })
            .then((data) => {
                printContentToPanel(data, contentType);
            })
            .catch((errMessage) => {
                alert(errMessage);
            });
    }

    function printContentToPanel(data, contentType) {
        // Add class to rp__content
        const root = document.querySelector(".rp__content");
        root.classList.add(contentType);
        const comparison = contentType === "modules" ? "module" : contentType;
        // Hide other content
        outer: for (let child of root.childNodes) {
            for (let clName of child.classList) {
                if (clName.includes(comparison)) {
                    // This continue forces move onto next child
                    continue outer;
                }
            }

            // If this code is reached, the child does not have the comparison class
            child.classList.add("hidden");
        }
        switch (contentType) {
            case "modules":
                setModules(() =>
                    data.map((module, index) => {
                        if (index === 0) {
                            setModuleNotes(module.module_notes);
                        }
                        return (
                            <p
                                className="module"
                                key={module.id}
                                onClick={(e) => {
                                    // Remove active class from other modules
                                    e.currentTarget.parentNode.childNodes.forEach(
                                        (child) =>
                                            child.classList.remove("active")
                                    );
                                    e.currentTarget.classList.add("active");
                                    setModuleNotes(module.module_notes);
                                }}>
                                {index + 1}. {module.module_name}
                            </p>
                        );
                    })
                );
                break;
            case "assignments":
                break;
            case "contact":
                break;
        }
    }

    return (
        <>
            {/* Overlay panel for reading and editing text */}
            <div
                className={
                    readingPanel ? "read-overlay active" : "read-overlay"
                }>
                {moduleNotes}
            </div>
            <header>Good evening, {user}.</header>
            <p
                className="m-0 text-cyan-800 max-w-2xl
                        mdc:text-sm mdc:max-w-sm
            ">
                “Becoming Hokage does not mean people will acknowledge you, it
                is only when you are acknowledged by people that you can become
                Hokage” - Uchiha Itachi.
            </p>
            <hr />
            <br />
            <section className="courses">
                {/* Left panel */}
                <div className="lp">
                    <p className="lp__title">Courses</p>
                    <ul className="lp__list">
                        {courses.map((course) => (
                            <li
                                key={course.id}
                                onClick={(e) => {
                                    e.currentTarget.parentNode.childNodes.forEach(
                                        (child) => {
                                            child.classList.remove("active");
                                        }
                                    );
                                    e.currentTarget.classList.add("active");
                                    fetchData(course.id);
                                }}>
                                {course.course_code}
                            </li>
                        ))}
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
                                placeholder="Search"
                                className="bg-cyan-800 rounded-lg p-2 pl-8 text-cyan-100 w-full h-full focus:outline-none"
                                style={{
                                    boxShadow:
                                        "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -2px 0px #0AA4C2",
                                }}
                            />
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute top-1/3 left-2 text-cyan-100 opacity-50"
                            />
                        </div>
                        {/* Add button */}
                        <button
                            className="bg-cyan-800 text-cyan-100 rounded-lg w-1/6 mdc:w-10 h-12 mdc:h-10 p-2
                            flex flex-row justify-center items-center gap-1 after:content-['Add'] mdc:after:content-[]"
                            style={{
                                boxShadow:
                                    "inset 0px -2px 0px rgba(0,0,0,0.25)",
                            }}>
                            <FontAwesomeIcon icon={faPlusCircle} />
                        </button>
                        {/* Content selector drop-down */}
                        <select
                            ref={contentRef}
                            className="bg-cyan-800 text-cyan-100 rounded-lg w-1/6 h-12 mdc:h-10 p-2 mdc:ml-auto min-w-fit text-center
                        "
                            style={{
                                boxShadow:
                                    "inset 0px -2px 0px rgba(0,0,0,0.25)",
                            }}>
                            <option value="modules">Modules</option>
                            <option value="assignments">Assgnmts</option>
                            <option value="contact">Contact</option>
                        </select>
                    </div>
                    {/* Content panel */}
                    <div className="rp__content">
                        {/* Modules */}
                        <div className="module-wrapper flex flex-col text-cyan-100 bg-cyan-800 gap-4 p-2 rounded-md">
                            {modules}
                        </div>
                        <div className="module-notes-wrapper relative text-cyan-100 bg-cyan-800 p-2 rounded-md">
                            {moduleNotes}
                            <button
                                className="read-button absolute bottom-2 right-2 btn-dark w-16 h-9 z-20"
                                style={{
                                    boxShadow:
                                        "-2px -2px 5px 2px rgba(0,0,0,0.2)",
                                    display:
                                        moduleNotes === "" ? "none" : "block",
                                }}
                                onClick={(e) => {
                                    e.currentTarget.classList.toggle("push");
                                    setReadingPanel(!readingPanel);
                                }}>
                                Read
                            </button>
                        </div>
                        {/* Assignments */}
                        <div className="assignment-wrapper">{assignments}</div>
                        {/* Contact */}
                        <div className="contact-wrapper">{contact}</div>
                    </div>
                </div>
            </section>
        </>
    );
}
