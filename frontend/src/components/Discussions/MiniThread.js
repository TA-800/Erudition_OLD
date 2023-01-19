import { faCommentAlt, faThumbsUp, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";

export default function MiniThread({
    id,
    author_name,
    discussion_title,
    discussion_desc,
    discussion_author,
    courses,
    comment_count,
    all_users_liked,
    hoverable,
    retrieveThread,
    setDiscussions,
}) {
    const { user, userID } = useContext(AuthContext);
    const [liked, setLiked] = useState(all_users_liked.includes(user));

    function deleteDiscussion(id) {
        fetch(`http://127.0.0.1:8000/backend/discussions/${id}`, {
            method: "DELETE",
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
                window.location.reload();
            })
            .catch((err) => console.log(err));
    }

    function likeComment(id) {
        fetch(`http://127.0.0.1:8000/backend/discussions/${id}`, {
            method: "PATCH",
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
                setLiked(!liked);
                setDiscussions((prev) => {
                    return prev.map((discussion) => {
                        if (discussion.id === id) {
                            return data;
                        }
                        return discussion;
                    });
                });
            })
            .catch((err) => console.log(err));
    }

    return (
        <div
            className={
                "bg-cyan-700 text-cyan-100 rounded-md p-2 my-2 border-2 border-cyan-600 flex flex-col gap-3 relative transition-all top-0 shadow-sm hover:border-cyan-900 " +
                (hoverable ? "hover:-top-1 hover:shadow-lg" : "")
            }
            onClick={() => retrieveThread(id)}>
            {/* Comment header */}
            <div className="flex flex-col gap-1">
                <p className="text-2xl">
                    <strong>{discussion_title}</strong>
                </p>
                <p className="opacity-70 text-sm">{author_name}</p>
                <span className="opacity-70 text-sm flex flex-row gap-x-1">
                    {courses.map((course) => (
                        <div
                            key={course}
                            className="bg-cyan-800 flex justify-center items-center py-1 px-2 rounded-full h-fit w-fit">
                            {course}
                        </div>
                    ))}
                </span>
            </div>
            {/* Comment body */}
            <p className="max-h-12 w-full overflow-hidden whitespace-pre-wrap">{discussion_desc}</p>
            {/* Comment data */}
            <div className="flex flex-row items-center gap-x-10">
                {/* Comment count */}
                <IconWithData icon={faCommentAlt} data={comment_count} />
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        likeComment(id);
                    }}>
                    <IconWithData icon={faThumbsUp} data={all_users_liked.length} liked={liked} />
                    {/* Likes count */}
                </div>
                {discussion_author === userID && (
                    <button
                        className="btn-dark flex flex-row gap-1 items-center text-sm ml-auto"
                        onClick={(e) => {
                            e.stopPropagation();
                            // First, confirm deletion, if confirmed, delete by calling deleteDiscussion
                            if (window.confirm("Are you sure you want to delete this discussion?")) {
                                deleteDiscussion(id);
                            }
                        }}>
                        DELETE
                        <FontAwesomeIcon icon={faTrashAlt} className="opacity-80" />
                    </button>
                )}
            </div>
        </div>
    );
}

function IconWithData({ icon, data, liked }) {
    return (
        <div className={"flex flex-row items-center text-xl gap-2 opacity-70 " + (liked ? "text-red-800 font-bold" : "")}>
            <FontAwesomeIcon icon={icon} />
            <p>{data}</p>
        </div>
    );
}
