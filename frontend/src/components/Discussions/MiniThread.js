import { faCommentAlt, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function MiniThread({
    id,
    author_name,
    discussion_title,
    discussion_desc,
    courses,
    comment_count,
    hoverable,
    retrieveThread,
}) {
    return (
        <div
            className={
                "bg-cyan-700 text-cyan-100 rounded-md p-2 my-2 border-2 border-cyan-600 flex flex-col gap-3 relative transition-all top-0 shadow-sm " +
                (hoverable ? "hover:-top-1 hover:shadow-lg hover:border-cyan-900" : "")
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
                <IconWithData icon={faCommentAlt} data={comment_count} />
                <IconWithData icon={faThumbsUp} data={0} />
            </div>
        </div>
    );
}

function IconWithData({ icon, data }) {
    return (
        <div className="flex flex-row items-center text-xl gap-2 opacity-70">
            <FontAwesomeIcon icon={icon} />
            <p>{data}</p>
        </div>
    );
}
