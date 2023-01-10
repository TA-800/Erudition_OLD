import React from "react";
import { twMerge } from "tailwind-merge";
import { CSSclasses } from "../StudyHub";

export default function AssignmentUnit({ assignment, splitDate, assignmentSelectionChange }) {
    return (
        <li
            data-akey={assignment.id}
            className={
                assignment.assignment_completed
                    ? twMerge(CSSclasses.assignment.base, CSSclasses.assignment.completed)
                    : CSSclasses.assignment.base
            }>
            {/* Course of assignment */}
            <span>
                <strong>{assignment.course_code}</strong>
            </span>
            {/* Selection checkbox */}
            <div className="text-right pr-2 sm:pr-1">
                <input type="checkbox" className="h-4" onChange={(e) => assignmentSelectionChange(e)} />
            </div>
            {/* Name */}
            <div className="col-span-3 flex items-center border-r-2 border-cyan-600 h-full border-opacity-25">
                <span style={{ overflowWrap: "anywhere" }}>{assignment.assignment_name}</span>
            </div>
            {/* Due date */}
            <span className="col-span-2 text-left" style={{ overflowWrap: "break-word" }}>
                {splitDate(assignment.assignment_due_date).map((date, index) => {
                    return <p key={index}>{date}</p>;
                })}
            </span>
            {/* Days left */}
            <span className="text-right">{assignment.days_left} days left</span>
        </li>
    );
}
