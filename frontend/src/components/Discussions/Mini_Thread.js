import { faCommentAlt, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Mini_Thread({ discussion_author, discussion_title, discussion_desc, discussion_courses, comment_count }) {
    return (
        <div className="bg-cyan-700 text-cyan-100 rounded-md p-2 my-2 border-2 border-cyan-800 flex flex-col gap-y-3">
            {/* Comment header */}
            <div className="flex flex-col">
                <p className="text-2xl">
                    <strong>{discussion_title}</strong>
                </p>
                <p className="opacity-70 text-sm">{"discussion_author"}</p>
                <p className="opacity-70 text-sm">{discussion_courses}</p>
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
