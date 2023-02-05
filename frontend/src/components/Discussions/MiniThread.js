import { faCommentAlt, faThumbsUp, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { url } from "../Main";

export default function MiniThread({ hoverable, hideOverflow, discussion, discussionState, setDiscussionState }) {
    const { user, userID } = useContext(AuthContext);
    const [liked, setLiked] = useState(discussion.all_users_liked.includes(user));
    const [likes, setLikes] = useState(discussion.all_users_liked.length);

    function deleteDiscussion(id) {
        fetch(url + `discussions/${id}`, {
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

    function likeDiscussion(id) {
        fetch(url + `discussions/${id}`, {
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
                // Data in this case is a single discussion object
                setLiked(!liked);
                setLikes(data.all_users_liked.length);
                setDiscussionState({ type: "updateDiscussion", payload: data });
            })
            .catch((err) => console.log(err));
    }

    return (
        <div
            className={
                "bg-zinc-700 p-2 pl-4 sm:pl-2 my-2 border-0 border-white border-opacity-25 flex flex-col gap-3 relative transition-all top-0 shadow-none hover:border-2 " +
                (hoverable ? "hover:-top-1 hover:shadow-lg" : "")
            }
            onClick={() => {
                // First, check if we are in mega thread mode
                if (discussionState.completeThread) {
                    // If we are, then we need to clear the mega thread state
                    setDiscussionState({ type: "setSelectedDiscussion", payload: null });
                } else {
                    // If we are not, then we need to set the mega thread state
                    setDiscussionState({ type: "setSelectedDiscussion", payload: discussion.id });
                }
            }}>
            {/* Discussion header */}
            <div className="flex flex-col gap-1">
                <p className="text-2xl">
                    <strong>{discussion.discussion_title}</strong>
                </p>
                <p className="opacity-70 text-sm">{discussion.author_name}</p>
                <span className="opacity-70 text-sm flex flex-row gap-x-1">
                    {discussion.courses.map((course) => (
                        <div
                            key={course}
                            className="bg-zinc-800 flex justify-center items-center py-1 px-2 rounded-full h-fit w-fit">
                            {course}
                        </div>
                    ))}
                </span>
            </div>
            {/* Discussion body */}
            <p className={"w-full whitespace-pre-wrap " + (hideOverflow ? "max-h-12 overflow-hidden" : "")}>
                {discussion.discussion_desc}
            </p>
            {/* Discussion data */}
            <div className="flex flex-row items-center gap-x-10">
                {/* Comment count */}
                <IconWithData icon={faCommentAlt} data={discussion.comment_count} />
                {/* Likes count */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        likeDiscussion(discussion.id);
                    }}>
                    <IconWithData icon={faThumbsUp} data={likes} liked={liked} />
                </div>
                {discussion.discussion_author === userID && (
                    <button
                        className="btn-dark flex flex-row gap-1 items-center text-sm ml-auto"
                        onClick={(e) => {
                            e.stopPropagation();
                            // First, confirm deletion, if confirmed, delete by calling deleteDiscussion
                            if (window.confirm("Are you sure you want to delete this discussion?")) {
                                deleteDiscussion(discussion.id);
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
        <div className={"flex flex-row items-center text-xl gap-2 opacity-70 " + (liked ? "text-blue-500 font-bold" : "")}>
            <FontAwesomeIcon icon={icon} />
            <p>{data}</p>
        </div>
    );
}
