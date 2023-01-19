import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons";
import MiniThread from "./MiniThread";
import AuthContext from "../../context/AuthContext";

export default function MegaThread({ selectedDiscussion, retrieveThread, setDiscussions }) {
    const allProps = {
        ...selectedDiscussion.discussion,
        hoverable: false,
        retrieveThread: retrieveThread,
        setDiscussions: setDiscussions,
    };

    const [comments, setComments] = useState(selectedDiscussion.comments);

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

    return (
        <>
            <MiniThread {...allProps} />
            <div className=" bg-cyan-800 bg-opacity-90 text-cyan-100 rounded-md flex flex-col gap-2 p-2">
                {comments.map((comment) => {
                    const commentProps = { ...comment, deleteComment: () => deleteComment(comment.id) };
                    return <Comment key={comment.id} {...commentProps} />;
                })}
                <NewComment
                    selectedDiscussion={selectedDiscussion}
                    setDiscussions={setDiscussions}
                    comments={comments}
                    setComments={setComments}
                />
            </div>
        </>
    );
}

function Comment({ comment_author, commentor_name, time_elapsed, comment_text, deleteComment }) {
    const { userID } = useContext(AuthContext);

    return (
        <div className="bg-cyan-900 flex flex-col rounded-md p-2">
            <span className="flex flex-row gap-2">
                <strong>{commentor_name}</strong>
                <i className="opacity-50">{time_elapsed}</i>
                {comment_author === userID && (
                    <FontAwesomeIcon icon={faTrash} className="ml-auto opacity-30 hover:opacity-90" onClick={deleteComment} />
                )}
            </span>
            <span> {comment_text}</span>
        </div>
    );
}

function NewComment({ selectedDiscussion, setDiscussions, comments, setComments }) {
    const [newComment, setNewComment] = useState("");

    function handleOnChange(value) {
        setNewComment(value);
    }

    function submitComment() {
        fetch(`http://127.0.0.1:8000/backend/discussions/${selectedDiscussion.discussion.id}`, {
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
                setComments([...comments, data]);
                // Update discussion's comment count
                setDiscussions((prev) => {
                    return prev.map((discussion) => {
                        if (discussion.id === selectedDiscussion.discussion.id) {
                            return { ...discussion, comment_count: discussion.comment_count + 1 };
                        }
                        return discussion;
                    });
                });
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
