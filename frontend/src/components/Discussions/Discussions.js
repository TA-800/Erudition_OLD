import { faComments, faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { CSSclasses } from "../StudyHub";
import MegaThread from "./MegaThread";
import MiniThread from "./MiniThread";
import CreateNewThread from "./CreateNewThread";
import AuthContext from "../../context/AuthContext";

export default function Discussions() {
    const [universities, setUniversities] = useState([]);
    const [courses, setCourses] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [selectedDiscussion, setSelectedDiscussion] = useState({});
    const [search, setSearch] = useState("");
    const searchedDiscussions = useMemo(() => {
        return discussions.filter((discussion) => discussion.discussion_title.toLowerCase().includes(search.toLowerCase()));
    }, [search, discussions]);
    const [completeThread, setCompleteThread] = useState(false);
    const [createThread, setCreateThread] = useState(false);
    const { logout } = useContext(AuthContext);

    function activateFullThread() {
        setCreateThread(false);
        setCompleteThread(!completeThread);
        setSearch("");
    }
    function retrieveThread(id) {
        fetch(`http://127.0.0.1:8000/backend/discussions/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((json) => {
                        throw new Error(`${res.status} ${json.detail}`);
                    });
                }
                return res.json();
            })
            .then((data) => {
                setSelectedDiscussion(data);
                activateFullThread();
            })
            .catch((err) => console.log(err));
    }

    function fetchDiscussionData() {
        fetch("http://127.0.0.1:8000/backend/discussions/0", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((json) => {
                        throw new Error(`${res.status} ${json.detail}`);
                    });
                }
                return res.json();
            })
            .then((data) => {
                setDiscussions([...data]);
            })
            .catch((err) => console.log(err));
    }
    function fetchCourses() {
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
    }
    function fetchUniversities() {
        // Fetch university info
        fetch("http://127.0.0.1:8000/backend/university/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
        })
            .then((res) => {
                if (!res.ok)
                    return res.json().then((json) => {
                        throw new Error(`${res.status} ${res.statusText}: ${json.detail}`);
                    });
                return res.json();
            })
            .then((data) => setUniversities([...data]))
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        fetchDiscussionData();
        fetchCourses();
        fetchUniversities();
    }, []);

    return (
        <>
            <header className="font-bold">
                <div className="flex flex-row gap-x-2 items-center">
                    <FontAwesomeIcon icon={faComments} />
                    Discussions
                </div>
            </header>
            <p
                className="m-0 text-cyan-800 max-w-2xl
                    mdc:text-sm mdc:max-w-sm">
                Discuss, debate, and develop with your peers.
            </p>
            <hr />
            <br />
            {/* Threads container */}

            {!completeThread && (
                <Utility search={search} setSearch={setSearch} setCreateThread={setCreateThread} createThread={createThread} />
            )}
            {createThread && (
                <CreateNewThread
                    setCreateThread={setCreateThread}
                    courses={courses}
                    universities={universities}
                    setDiscussions={setDiscussions}
                />
            )}

            <div>
                {!completeThread &&
                    searchedDiscussions
                        .sort((a, b) => {
                            return new Date(b.discussion_date) - new Date(a.discussion_date);
                        })
                        .map((discussion) => {
                            const allProps = {
                                ...discussion,
                                setDiscussions: setDiscussions,
                                hoverable: true,
                                retrieveThread: retrieveThread,
                            };
                            return <MiniThread key={discussion.id} {...allProps} />;
                        })}
                {completeThread && (
                    <MegaThread
                        selectedDiscussion={selectedDiscussion}
                        setDiscussions={setDiscussions}
                        retrieveThread={retrieveThread}
                    />
                )}
            </div>
        </>
    );
}

function Utility({ search, setSearch, setCreateThread, createThread }) {
    return (
        <>
            {/* Utility bar */}
            <div className="bg-cyan-700 rounded-lg p-2 w-full h-fit flex flex-row items-center gap-2 mdc:text-sm">
                {/* Search bar with icon */}
                <div className="w-2/3 h-12 mdc:h-10 relative">
                    <input
                        type="text"
                        placeholder="Search discussions"
                        className={twMerge(CSSclasses.search.base)}
                        style={{
                            boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -2px 0px #0AA4C2",
                        }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute top-1/3 left-2 text-cyan-100 opacity-50" />
                </div>
                {/* Create button */}
                <button
                    className={
                        createThread
                            ? twMerge(
                                  CSSclasses.add.base,
                                  "after:content-['Create'] mdc:after:content-['Create'] mdc:w-auto disabled"
                              )
                            : twMerge(CSSclasses.add.base, "after:content-['Create'] mdc:after:content-['Create'] mdc:w-auto")
                    }
                    onClick={() => setCreateThread((prev) => !prev)}>
                    <FontAwesomeIcon icon={faPlusCircle} />
                </button>
            </div>
        </>
    );
}
