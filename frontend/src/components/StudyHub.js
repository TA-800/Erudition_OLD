import { useState, useEffect, useRef, useMemo } from "react";
import { useContext } from "react";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBookOpen,
    faCheck,
    faClose,
    faEdit,
    faPlusCircle,
    faSearch,
    faTrash,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
// Context
import AuthContext from "../context/AuthContext";
// Components
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import Texteditor from "./Texteditor";
// Other features
import { twMerge } from "tailwind-merge";
import NewCourseModal from "./NewCourseModal";
import NewModuleModal from "./NewModuleModal";
import ReadingPanel from "./ReadingPanel";

// CSS tailwind classes
export const CSSclasses = {
    // className = "after:"
    courseButton: {
        base: "relative flex justify-center items-center h-[3.5rem] w-full bg-cyan-400 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-lg transition-all duration-200",
        active: "bg-[#49cee9] border-2 border-black border-opacity-10 shadow-none font-extrabold text-lg tracking-wide",
    },
    // On the span/module-text inside the div
    moduleButton: {
        base: "font-normal cursor-pointer transition-all duration-200 hover:tracking-[0.2px]",
        active: "font-bold tracking-[0.2px]",
    },
    editButton: {
        base: "fixed top-2 right-5 btn-dark w-20 h-9 z-30 border-2 border-white border-opacity-25 flex flex-row justify-center items-center gap-1 after:content-['Edit'] mdc:after:content-[]",
        active: "shadow-none after:content-['Save'] mdc:after:content-[]",
    },
    readButton: {
        base: "absolute bottom-2 right-5 btn-dark w-20 h-9  flex flex-row justify-center items-center gap-1 after:content-['Read'] mdc:after:content-[]",
        active: "fixed shadow-none border-2 border-white z-30 border-opacity-25 after:content-['Close'] mdc:after:content-[]",
    },
    readOverlay: {
        base: "bg-black bg-opacity-0 text-cyan-100 opacity-0 backdrop-blur-0 fixed top-0 left-0 w-screen h-screen z-[13] py-[6.25rem] px-[8vw] pointer-events-none transition-all duration-200",
        active: "bg-opacity-80 opacity-100 backdrop-blur-md pointer-events-auto overflow-scroll",
    },
    overlay: {
        base: "w-screen h-screen fixed top-0 left-0 z-[21] bg-black bg-opacity-0 opacity-0 backdrop-blur-0 pointer-events-none flex flex-col gap-y-10 p-[6.25rem_8vw] text-cyan-100 transition-all duration-200",
        active: "bg-opacity-80 opacity-100 backdrop-blur-md pointer-events-auto overflow-auto",
    },
};

export default function StudyHub() {
    // First load to lock scrolls on overlay
    const [firstload, setFirstload] = useState(true);

    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState({});
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
    // For module creation
    const [moduleModal, setModuleModal] = useState(false);
    const [courseModal, setCourseModal] = useState(false);

    const [assignments, setAssignments] = useState([]);
    const [contact, setContact] = useState([]);

    const [readingPanel, setReadingPanel] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const contentRef = useRef();

    // Fetch courses from backend
    useEffect(() => {
        fetch("http://127.0.0.1:8000/backend/courses/0", {
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

    // Disable scrolling when overlays are active
    useEffect(() => {
        if (firstload) setFirstload(false);
        if (!firstload) document.querySelector("main").classList.toggle("scroll-lock");
    }, [moduleModal, courseModal, readingPanel]);

    // Debug console.log code
    // Checks when state changes
    // useEffect(() => {
    //     console.log("courses: ", courses);
    // }, [courses]);

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
                className={"formatted-text-wrapper max-h-[40rem]" + (readingPanel ? props.hide : " overflow-y-auto")}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    }

    function deleteModule(id) {
        // Display confirmation dialog
        if (window.confirm("Are you sure you want to delete this module?")) {
            // Delete module
            console.log("Deleting module with id: " + id);
            fetch(`http://127.0.0.1:8000/backend/modules/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("access"),
                },
            })
                .then((resp) => {
                    // If response is not 200 OK, throw an error
                    if (resp.status !== 200) {
                        return resp.json().then((json) => {
                            throw new Error(`${resp.status} ${resp.statusText} ${json.detail}`);
                        });
                    }
                    return resp.json();
                })
                .then((data) => {
                    const moduleToDelete = document.querySelector(`[data-mkey="${id}"]`);
                    moduleToDelete.ontransitionend = (event) => {
                        if (event.propertyName !== "max-height") return;
                        // Remove the module
                        setModules(modules.filter((module) => module.id !== id));
                        // Select someother module
                        if (selectedModule.id === id && modules.length > 0) {
                            simulateModuleSelect(modules[0].id);
                        }
                    };
                    moduleToDelete.className = twMerge(moduleToDelete.className, "max-h-0 py-0");
                })
                .catch((errMessage) => {
                    alert(errMessage);
                });
        }
    }

    function deleteCourse(id) {
        console.log("Deleting course with id: " + id);
        // Display confirmation dialog
        if (window.confirm("Are you sure you want to delete this course?")) {
            // Delete course
            console.log("Deleting course with id: " + id);
            fetch(`http://127.0.0.1:8000/backend/courses/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("access"),
                },
            })
                .then((resp) => {
                    // If response is not 200 OK, throw an error
                    if (resp.status !== 200) {
                        return resp.json().then((json) => {
                            throw new Error(`${resp.status} ${resp.statusText} ${json.detail}`);
                        });
                    }
                    return resp.json();
                })
                .then((data) => {
                    // Remove the course
                    console.log(data);
                })
                .catch((errMessage) => {
                    alert(errMessage);
                });
        }
    }

    // This function simulates a click on a module which will also update the selected module
    function simulateModuleSelect(module_id = 0) {
        const moduleToSelect = document.querySelector(`[data-mkey="${module_id}"]`).childNodes[0];
        moduleToSelect.click();
    }

    // This can be used to create a new module or update an existing module
    function setNewModules(newModuleData) {
        if (modules.find((module) => module.id === newModuleData.id)) {
            // Update existing module
            // Need to use this method to keep order of modules
            setModules(modules.map((module) => (module.id === newModuleData.id ? newModuleData : module)));
        } else {
            // Create new module
            setModules([...modules, newModuleData]);
        }
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
                        simulateModuleSelect(searchedModules[0].id);
                    } else {
                        // else, if we have no search results, set selected module to empty object
                        setSelectedModule({});
                    }
                }
            }
        }
    }, [search]);

    return (
        <>
            {moduleModal && (
                <NewModuleModal
                    className="absolute"
                    setModuleModal={setModuleModal}
                    course_id={selectedCourse.id}
                    setNewModules={setNewModules}
                />
            )}
            {courseModal && <NewCourseModal className="absolute" setCourseModal={setCourseModal} setCourses={setCourses} />}

            {/* Overlay panel for reading and editing text */}
            {readingPanel && (
                <ReadingPanel
                    className="absolute"
                    selectedModule={selectedModule}
                    setReadingPanel={setReadingPanel}
                    setSelectedModule={setSelectedModule}
                    setNewModules={setNewModules}
                    FormattedNotes={FormattedNotes}
                    Texteditor={Texteditor}
                />
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
                                    setSelectedCourse(course);
                                    fetchData(course.id);
                                }}>
                                {course.course_code}
                                <div
                                    className="absolute right-2"
                                    onClick={() => {
                                        deleteCourse(course.id);
                                    }}>
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        className="text-md cursor-pointer opacity-50 transition-all duration-200 hover:text-xl hover:opacity-90"
                                    />
                                </div>
                            </li>
                        ))}
                        <li
                            className={twMerge(CSSclasses.courseButton.base, "flex flex-row justify-center items-center gap-3")}
                            onClick={() => setCourseModal(true)}>
                            <FontAwesomeIcon icon={faPlusCircle} className="opacity-90" />
                            Add course
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
                            }}
                            onClick={() => {
                                if (selectedCourse.course_name !== undefined) setModuleModal(true);
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
                        {/* Module List */}
                        <div className="modules flex flex-col text-cyan-100 bg-cyan-800 p-2 rounded-md">
                            {searchedModules.map((module, index) => (
                                <div
                                    className="flex flex-row gap-x-2 items-center transition-all duration-500 max-h-28 py-2 overflow-hidden"
                                    data-mkey={module.id}
                                    key={module.id}>
                                    <span
                                        className={CSSclasses.moduleButton.base}
                                        onClick={(e) => {
                                            e.currentTarget.parentNode.parentNode.childNodes.forEach((child) => {
                                                child.childNodes[0].className = CSSclasses.moduleButton.base;
                                            });
                                            e.currentTarget.className = twMerge(
                                                CSSclasses.moduleButton.base,
                                                CSSclasses.moduleButton.active
                                            );
                                            setSelectedModule(module);
                                        }}>
                                        {index + 1}. {module.module_name}
                                    </span>
                                    <p className="ml-auto" onClick={() => deleteModule(module.id)}>
                                        <FontAwesomeIcon
                                            className="text-xs cursor-pointer w-4 opacity-50 transition-all duration-200 hover:text-sm hover:opacity-100"
                                            icon={faTrash}
                                        />
                                    </p>
                                </div>
                            ))}
                        </div>
                        {/* Module notes */}
                        <div className="modules-notes-wrapper relative text-cyan-100 bg-cyan-800 p-2 rounded-md">
                            <FormattedNotes delta={selectedModule.module_notesDelta} hide=" overflow-hidden" />

                            {/* Read button */}
                            <button
                                className={CSSclasses.readButton.base}
                                style={{
                                    display: selectedModule.module_name === undefined || readingPanel ? "none" : "flex",
                                }}
                                onClick={() => {
                                    setReadingPanel(true);
                                }}>
                                <FontAwesomeIcon icon={faBookOpen} />
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
