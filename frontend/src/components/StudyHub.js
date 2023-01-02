import { useState, useEffect, useRef } from "react";
import { useContext } from "react";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faQuestion, faSearch } from "@fortawesome/free-solid-svg-icons";
// Context
import AuthContext from "../context/AuthContext";
// Components
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import Texteditor from "./Texteditor";

export default function StudyHub() {
    const [courses, setCourses] = useState([]);

    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState({});
    const [assignments, setAssignments] = useState([]);
    const [contact, setContact] = useState([]);

    const [readingPanel, setReadingPanel] = useState(false);
    const [editable, setEditable] = useState(false);
    const quillRef = useRef();

    const { user, logout } = useContext(AuthContext);
    const contentRef = useRef();

    // Fetch courses from backend
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
                        throw new Error(`${res.status} ${res.statusText}: ${json.detail || json.username || json.password}`);
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

    // // Debug console.log code
    // // Checks when state changes
    // useEffect(() => {
    //     console.table({
    //         name: selectedModule.module_name,
    //         notes: selectedModule.module_notesDelta,
    //     });
    // }, [selectedModule]);

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
                        throw new Error(`${res.status} ${res.statusText} ${json.detail}`);
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
                // Save the modules to state
                setModules(data);
                break;
            case "assignments":
                break;
            case "contact":
                break;
        }
    }

    function FormattedNotes(props) {
        if (!props.delta) return "Select a course to read module notes";
        const delta = JSON.parse(props.delta);
        const converter = new QuillDeltaToHtmlConverter(delta.ops, {});

        const html = converter.convert();

        return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }

    return (
        <>
            {/* Overlay panel for reading and editing text */}
            <div className={readingPanel ? "read-overlay active" : "read-overlay"}>
                {/* Reading or editing */}
                {!editable ? (
                    <FormattedNotes delta={selectedModule.module_notesDelta} />
                ) : (
                    <Texteditor initial={selectedModule.module_notesDelta} qref={quillRef} />
                )}
                {/* Edit button */}
                <button
                    className="edit-button fixed top-2 right-2 btn-dark w-16 h-9 z-20"
                    onClick={(e) => {
                        e.currentTarget.classList.toggle("active");
                        setEditable(!editable);
                        if (editable) {
                            // What to do when going from editable to not editable
                            // Get the text from the editor
                            const delta = quillRef.current.getContents();
                            const text = quillRef.current.getText();

                            // Send to backend
                            fetch(`http://127.0.0.1:8000/backend/modules/${selectedModule.id}`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: "Bearer " + localStorage.getItem("access"),
                                },
                                body: JSON.stringify({
                                    delta: JSON.stringify(delta),
                                    text: text,
                                }),
                            })
                                .then((res) => res.json())
                                .then((data) => {
                                    // Set the selected module to the new text
                                    setSelectedModule(data);
                                    // Also update the modules in state
                                    console.log(modules);
                                    console.table(modules);
                                    setModules(() => {
                                        // Create a new array-object from the old one
                                        const newModules = modules.map((module) => {
                                            // For each module, return the same module unless it is the one that was edited
                                            if (module.id === data.id) {
                                                return data;
                                            }
                                            return module;
                                        });
                                        return newModules;
                                    });
                                })
                                .catch((err) => alert(err));
                        } else {
                        }
                    }}>
                    {!editable ? "Edit" : "Save"}
                </button>
            </div>

            <header>Good evening, {user}.</header>
            <p
                className="m-0 text-cyan-800 max-w-2xl
                        mdc:text-sm mdc:max-w-sm
            ">
                “Becoming Hokage does not mean people will acknowledge you, it is only when you are acknowledged by people that
                you can become Hokage” - Uchiha Itachi.
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
                                    e.currentTarget.parentNode.childNodes.forEach((child) => {
                                        child.classList.remove("active");
                                    });
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
                                    boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -2px 0px #0AA4C2",
                                }}
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute top-1/3 left-2 text-cyan-100 opacity-50" />
                        </div>
                        {/* Add button */}
                        <button
                            className="bg-cyan-800 text-cyan-100 rounded-lg w-1/6 mdc:w-10 h-12 mdc:h-10 p-2
                            flex flex-row justify-center items-center gap-1 after:content-['Add'] mdc:after:content-[]"
                            style={{
                                boxShadow: "inset 0px -2px 0px rgba(0,0,0,0.25)",
                            }}>
                            <FontAwesomeIcon icon={faPlusCircle} />
                        </button>
                        {/* Content selector drop-down */}
                        <select
                            ref={contentRef}
                            className="bg-cyan-800 text-cyan-100 rounded-lg w-1/6 h-12 mdc:h-10 p-2 mdc:ml-auto min-w-fit text-center
                        "
                            style={{
                                boxShadow: "inset 0px -2px 0px rgba(0,0,0,0.25)",
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
                            {modules.map((module, index) => {
                                return (
                                    <p
                                        className="module"
                                        key={module.id}
                                        onClick={(e) => {
                                            e.currentTarget.parentNode.childNodes.forEach((child) => {
                                                child.classList.remove("active");
                                            });
                                            e.currentTarget.classList.add("active");
                                            setSelectedModule(module);
                                        }}>
                                        {index + 1}. {module.module_name}
                                    </p>
                                );
                            })}
                        </div>
                        <div className="module-notes-wrapper relative text-cyan-100 bg-cyan-800 p-2 rounded-md">
                            <FormattedNotes delta={selectedModule.module_notesDelta} />
                            <button
                                className="read-button absolute bottom-2 right-2 btn-dark w-16 h-9 z-20"
                                style={{
                                    display: selectedModule.module_notesDelta === "" ? "none" : "block",
                                }}
                                onClick={(e) => {
                                    e.currentTarget.classList.toggle("push");
                                    // Disable scrolling for the body
                                    document.querySelector("main").classList.toggle("scroll-lock");
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
