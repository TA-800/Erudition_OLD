import { useState, useEffect, useRef, useMemo } from "react";
import { useContext } from "react";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faCheck, faClose, faEdit, faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
// Context
import AuthContext from "../context/AuthContext";
// Components
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import Texteditor from "./Texteditor";
// Other features
import { twMerge } from "tailwind-merge";

export default function StudyHub() {
    const [courses, setCourses] = useState([]);

    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState({});
    const [search, setSearch] = useState("");
    const searchedModules = useMemo(() => {
        if (!search) return modules;

        return modules.filter((module) => {
            // return true (true returns the element (complete module) into a new "filtered" array)
            // if the module notes contains the search term
            return module.module_notes.toLowerCase().includes(search.toLowerCase());
        });
    }, [search, modules]);

    const [assignments, setAssignments] = useState([]);
    const [contact, setContact] = useState([]);

    const [readingPanel, setReadingPanel] = useState(false);
    const [editable, setEditable] = useState(false);
    const quillRef = useRef();

    const { user, logout } = useContext(AuthContext);
    const contentRef = useRef();

    // CSS style classes
    const CSSclasses = {
        courseButton: {
            base: "flex justify-center items-center h-[3.5rem] w-full bg-cyan-400 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-lg transition-all duration-200",
            active: "bg-[#49cee9] border-2 border-black border-opacity-10 shadow-none font-extrabold text-lg tracking-wide",
        },
        moduleButton: {
            base: "font-normal cursor-pointer transition-all duration-200 hover:tracking-[0.25px]",
            active: "font-semibold tracking-[0.25px]",
        },
        editButton: {
            base: "fixed top-2 right-5 btn-dark w-20 h-9 z-20 border-2 border-white border-opacity-25 flex flex-row justify-center items-center gap-1 after:content-['Edit'] mdc:after:content-[]",
            active: "shadow-none after:content-['Save'] mdc:after:content-[]",
        },
        readButton: {
            base: "absolute bottom-2 right-5 btn-dark w-20 h-9 z-20 flex-row justify-center items-center gap-1 after:content-['Read'] mdc:after:content-[]",
            active: "fixed shadow-none border-2 border-white border-opacity-25 after:content-['Close'] mdc:after:content-[]",
        },
        readOverlay: {
            base: "bg-black bg-opacity-0 text-cyan-100 opacity-0 backdrop-blur-0 fixed top-0 left-0 w-screen h-screen z-[13] py-[6.25rem] px-[8vw] pointer-events-none transition-all duration-200",
            active: "bg-opacity-80 opacity-100 backdrop-blur-md pointer-events-auto overflow-scroll",
        },
    };
    // <div className="" />;

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
    useEffect(() => {
        console.table(selectedModule);
    }, [selectedModule]);

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

        // Hide other content
        outer: for (let child of root.childNodes) {
            for (let clName of child.classList) {
                if (clName.includes(contentType)) {
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

        return (
            <div
                className={"formatted-text-wrapper max-h-[40rem]" + (readingPanel ? " overflow-visible" : " overflow-y-auto")}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    }

    // Show modules based on search
    useEffect(() => {
        if (search) {
            // If modules have been fetched from backend
            if (modules.length > 0) {
                // If selected module is part of searched modules, do nothing
                if (searchedModules.includes(selectedModule)) {
                } else {
                    // If selected module is not part of searched modules, and we have actual search results, set selected module to first module in searched modules
                    if (searchedModules.length > 0) {
                        setSelectedModule(searchedModules[0]);
                    }
                }
            }
        }
    }, [search]);

    return (
        <>
            {/* Overlay panel for reading and editing text */}
            <div
                className={
                    readingPanel
                        ? twMerge(CSSclasses.readOverlay.base, CSSclasses.readOverlay.active)
                        : CSSclasses.readOverlay.base
                }>
                {/* Reading or editing */}
                {!editable ? (
                    <FormattedNotes delta={selectedModule.module_notesDelta} />
                ) : (
                    <Texteditor initial={selectedModule.module_notesDelta} qref={quillRef} />
                )}
            </div>
            {/* Edit button */}
            {readingPanel && (
                <button
                    className={
                        editable ? twMerge(CSSclasses.editButton.base, CSSclasses.editButton.active) : CSSclasses.editButton.base
                    }
                    onClick={() => {
                        setEditable(!editable);
                        if (editable) {
                            // What to do when going from editable to not editable
                            // Get the text from the editor
                            const delta = quillRef.current.getContents();
                            const text = quillRef.current.getText();

                            // Send to backend
                            fetch(`http://127.0.0.1:8000/backend/modules/${selectedModule.id}`, {
                                method: "PUT",
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
                                    // Update the modules in state
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
                        }
                    }}>
                    {!editable ? <FontAwesomeIcon icon={faEdit} /> : <FontAwesomeIcon icon={faCheck} />}
                </button>
            )}

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
            <article className="courses">
                {/* Left panel */}
                <div className="lp">
                    <p className="lp__title">Courses</p>
                    <ul className="lp__list">
                        {courses.map((course) => (
                            <li
                                className={CSSclasses.courseButton.base}
                                key={course.id}
                                onClick={(e) => {
                                    e.currentTarget.parentNode.childNodes.forEach((child) => {
                                        child.className = CSSclasses.courseButton.base;
                                    });
                                    e.currentTarget.className = twMerge(
                                        CSSclasses.courseButton.base,
                                        CSSclasses.courseButton.active
                                    );
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
                                placeholder="Search notes"
                                className="bg-cyan-800 rounded-lg p-2 pl-8 text-cyan-100 w-full h-full focus:outline-none"
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
                        <div className="modules flex flex-col text-cyan-100 bg-cyan-800 gap-4 p-2 rounded-md">
                            {searchedModules.map((module, index) => (
                                <p
                                    className={CSSclasses.moduleButton.base}
                                    key={module.id}
                                    onClick={(e) => {
                                        e.currentTarget.parentNode.childNodes.forEach((child) => {
                                            child.className = CSSclasses.moduleButton.base;
                                        });
                                        e.currentTarget.className = twMerge(
                                            CSSclasses.moduleButton.base,
                                            CSSclasses.moduleButton.active
                                        );
                                        setSelectedModule(module);
                                    }}>
                                    {index + 1}. {module.module_name}
                                </p>
                            ))}
                        </div>
                        {/* Module notes */}
                        <div className="modules-notes-wrapper relative text-cyan-100 bg-cyan-800 p-2 rounded-md">
                            <FormattedNotes delta={selectedModule.module_notesDelta} />

                            {/* Read button */}
                            <button
                                className={
                                    readingPanel
                                        ? twMerge(CSSclasses.readButton.base, CSSclasses.readButton.active)
                                        : CSSclasses.readButton.base
                                }
                                style={{
                                    display: selectedModule.module_name === undefined ? "none" : "flex",
                                }}
                                onClick={() => {
                                    // Disable scrolling for the body
                                    document.querySelector("main").classList.toggle("scroll-lock");
                                    setReadingPanel(!readingPanel);
                                }}>
                                {readingPanel ? <FontAwesomeIcon icon={faClose} /> : <FontAwesomeIcon icon={faBookOpen} />}
                            </button>
                        </div>

                        {/* Assignments */}
                        <div className="assignment-wrapper">{assignments}</div>

                        {/* Contact */}
                        <div className="contact-wrapper">{contact}</div>
                    </div>
                </div>
            </article>
        </>
    );
}
