import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCropSimple, faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons";
import MiniThread from "./MiniThread";
import AuthContext from "../../context/AuthContext";

export default function MegaThread({ discussionState, setDiscussionState }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localSelectedDiscussion, setLocalSelectedDiscussion] = useState({});

    useEffect(() => {
        // This function will retrieve thread data (comments) from backend and also
        // set localSelectedDiscussion to the data retrieved and setLoading to false
        retrieveThread(discussionState.selectedDiscussion, setLocalSelectedDiscussion, setLoading, setComments);
    }, []);

    function deleteComment(id) {
        fetch(`http://127.0.0.1:8000/backend/comments/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((json) => {
                        throw new Error(`${res.status} ${res.statusText}: ${json.detail}`);
                    });
                }
                return res.json();
            })
            .then((data) => {
                setComments(comments.filter((comment) => comment.id !== id));
            })
            .catch((err) => console.log(err));
    }

    function Loading() {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-900"></div>
                <div>Loading all those comments!</div>
            </div>
        );
    }

    return (
        <>
            {loading && <Loading />}
            {!loading && (
                <>
                    <MiniThread
                        hoverable={false}
                        hideOverflow={false}
                        discussion={localSelectedDiscussion.discussion}
                        discussionState={discussionState}
                        setDiscussionState={setDiscussionState}
                    />
                    <div className=" bg-cyan-800 bg-opacity-90 text-cyan-100 rounded-md flex flex-col gap-2 p-2">
                        {comments.map((comment) => {
                            const commentProps = { ...comment, deleteComment: () => deleteComment(comment.id) };
                            return <Comment key={comment.id} {...commentProps} />;
                        })}
                        <NewComment
                            discussionState={discussionState}
                            comments={comments}
                            setDiscussionState={setDiscussionState}
                            setComments={setComments}
                        />
                    </div>
                </>
            )}
        </>
    );
}

function Comment({ comment_author, commentor_name, commentor_avatar, time_elapsed, comment_text, deleteComment }) {
    const { userID } = useContext(AuthContext);

    return (
        <div className="bg-cyan-900 flex flex-col rounded-md p-2 gap-2">
            <span className="flex flex-row gap-2">
                <div className="flex flex-row gap-2 items-center">
                    {/* Image */}
                    <img src={`http://127.0.0.1:8000${commentor_avatar}`} className="h-[50px] avatar" alt="User avatar" />
                    {/* User name */}
                    <strong>{commentor_name}</strong>
                    {/* Time */}
                    <i className="opacity-50">{time_elapsed}</i>
                    {/* Delete button */}
                    {comment_author === userID && (
                        <FontAwesomeIcon icon={faTrash} className="opacity-30 hover:opacity-90" onClick={deleteComment} />
                    )}
                </div>
            </span>
            <span> {comment_text}</span>
        </div>
    );
}

function NewComment({ discussionState, comments, setDiscussionState, setComments }) {
    const [newComment, setNewComment] = useState("");

    function handleOnChange(value) {
        setNewComment(value);
    }

    function submitComment() {
        fetch(`http://127.0.0.1:8000/backend/discussions/${discussionState.selectedDiscussion}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
            body: JSON.stringify({
                content: newComment,
            }),
        })
            .then((res) => {
                if (res.status !== 201) {
                    return res.json().then((json) => {
                        throw new Error(`${res.status} ${json.detail}`);
                    });
                }
                return res.json();
            })
            .then((data) => {
                // Clear the comment box
                setNewComment("");
                document.querySelector("textarea").value = "";
                // Add the new comment to the list of comments
                setComments([...comments, data]);
                setDiscussionState({ type: "addComment", payload: discussionState.selectedDiscussion });
            })
            .catch((err) => console.log(err));
    }

    // Function that returns JSX which allows the user to create a new comment
    return (
        <div className="bg-slate-800 p-2 rounded-lg sticky -bottom-24 flex flex-row gap-2">
            <textarea
                onChange={(e) => handleOnChange(e.target.value)}
                className="bg-cyan-900 text-cyan-100 w-full h-full resize-none rounded-md p-2"
                placeholder="Write a comment..."
            />
            <button
                className={
                    "btn-dark flex flex-row justify-center items-center gap-1 sm:gap-0" + (newComment === "" ? " disabled" : "")
                }
                onClick={submitComment}>
                <span className="after:content-['Submit'] sm:after:content-[]" />
                <FontAwesomeIcon icon={faPaperPlane} />
            </button>
        </div>
    );
}

// Fetch discussion comments data of clicked discussion
function retrieveThread(id, setLocalSelectedDiscussion, setLoading, setComments) {
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
            setLocalSelectedDiscussion(data);
            setComments(data.comments);
            setLoading(false);
        })
        .catch((err) => console.log(err));
}
