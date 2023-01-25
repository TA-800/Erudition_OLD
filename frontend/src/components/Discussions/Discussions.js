import { faComments, faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useMemo, useReducer } from "react";
import { twMerge } from "tailwind-merge";
import { CSSclasses } from "../StudyHub";
import MegaThread from "./MegaThread";
import MiniThread from "./MiniThread";
import CreateNewThread from "./CreateNewThread";
import AuthContext from "../../context/AuthContext";

export default function Discussions() {
    const { logout } = useContext(AuthContext);

    const initialDiscussionState = () => {
        return {
            universities: [],
            courses: [],
            discussions: [],
            selectedDiscussion: null, // This is discussion id
            search: "",
            completeThread: false,
            createThread: false,
        };
    };

    const [discussionState, setDiscussionState] = useReducer(
        (state, action) => {
            // In this function, we can do some logic to determine what the new state should be
            if (action.type === "setUniversities") {
                return { ...state, universities: action.payload };
            }
            if (action.type === "setCourses") {
                return { ...state, courses: action.payload };
            }
            // For fetching all discussions (first time page load)
            if (action.type === "setDiscussions") {
                return { ...state, discussions: action.payload };
            }
            // For updating a discussion (like/unlike)
            if (action.type === "updateDiscussion") {
                // Payload in this case is the updated discussion object
                const updatedDiscussions = state.discussions.map((discussion) => {
                    if (discussion.id === action.payload.id) {
                        // Manually update all_users_liked
                        return action.payload;
                    }
                    return discussion;
                });
                return { ...state, discussions: updatedDiscussions };
            }
            // For adding a new discussion (after creating a new thread)
            if (action.type === "addDiscussion") {
                return { ...state, discussions: [...state.discussions, action.payload] };
            }
            // For adding a new comment (after creating a new comment in mega thread)
            if (action.type === "addComment") {
                // Update all_users_liked in discussions
                const updatedDiscussions = state.discussions.map((discussion) => {
                    if (discussion.id === action.payload) {
                        discussion.comment_count += 1;
                    }
                    return discussion;
                });
                return { ...state, discussions: updatedDiscussions };
            }
            if (action.type === "setSelectedDiscussion") {
                // If the payload is null, we want to clear the selected discussion and go back to the list of discussions
                if (action.payload === null) {
                    return { ...state, selectedDiscussion: null, completeThread: false };
                }
                // Otherwise, we want to set the selected discussion and show the full thread
                return { ...state, selectedDiscussion: action.payload, completeThread: true };
            }
            if (action.type === "setSearch") {
                return { ...state, search: action.payload };
            }
            if (action.type === "setCreateThread") {
                return { ...state, createThread: action.payload };
            }
            if (action.type === "reset") {
                return initialDiscussionState();
            }
            return state;
        },
        // Initial state
        {
            universities: [],
            courses: [],
            discussions: [],
            selectedDiscussion: {},
            search: "",
            completeThread: false,
            createThread: false,
        },
        initialDiscussionState
    );

    // Searched discussions
    const searchedDiscussions = useMemo(() => {
        return discussionState.discussions.filter((discussion) => {
            return discussion.discussion_title.toLowerCase().includes(discussionState.search.toLowerCase());
        });
    }, [discussionState.discussions, discussionState.search]);

    // Fetch all discussions
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
                setDiscussionState({ type: "setDiscussions", payload: data });
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
                // setCourses(data);
                setDiscussionState({ type: "setCourses", payload: data });
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
            .then((data) =>
                // setUniversities(data);
                setDiscussionState({ type: "setUniversities", payload: data })
            )
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        // Fetch all discussions for the user
        fetchDiscussionData();
        // Fetch all courses of the user
        fetchCourses();
        // Fetch all universities of the user
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

            {/* Utility bar */}
            {!discussionState.completeThread && (
                <Utility discussionState={discussionState} setDiscussionState={setDiscussionState} />
            )}
            {/* Create new thread component */}
            {discussionState.createThread && (
                <CreateNewThread discussionState={discussionState} setDiscussionState={setDiscussionState} />
            )}

            <div>
                {/* Show all threads/discussions if no thread has been clicked on */}
                {!discussionState.completeThread &&
                    searchedDiscussions
                        .sort((a, b) => {
                            return new Date(b.discussion_date) - new Date(a.discussion_date);
                        })
                        .map((discussion) => {
                            return (
                                <MiniThread
                                    key={discussion.id}
                                    hoverable={true}
                                    hideOverflow={true}
                                    discussion={discussion}
                                    discussionState={discussionState}
                                    setDiscussionState={setDiscussionState}
                                />
                            );
                        })}
                {/* Show a complete thread/discussion hath it been clicked on */}
                {discussionState.completeThread && (
                    <MegaThread discussionState={discussionState} setDiscussionState={setDiscussionState} />
                )}
            </div>
        </>
    );
}

function Utility({ discussionState, setDiscussionState }) {
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
                        value={discussionState.search}
                        onChange={(e) => setDiscussionState({ type: "setSearch", payload: e.target.value })}
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute top-1/3 left-2 text-cyan-100 opacity-50" />
                </div>
                {/* Create button */}
                <button
                    className={
                        discussionState.createThread
                            ? twMerge(
                                  CSSclasses.add.base,
                                  "after:content-['Create'] mdc:after:content-['Create'] mdc:w-auto disabled"
                              )
                            : twMerge(CSSclasses.add.base, "after:content-['Create'] mdc:after:content-['Create'] mdc:w-auto")
                    }
                    onClick={() => setDiscussionState({ type: "setCreateThread", payload: !discussionState.createThread })}>
                    <FontAwesomeIcon icon={faPlusCircle} />
                </button>
            </div>
        </>
    );
}
