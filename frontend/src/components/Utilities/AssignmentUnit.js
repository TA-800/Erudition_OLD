import React from "react";
import { twMerge } from "tailwind-merge";
import { CSSclasses } from "../StudyHub";

export default function AssignmentUnit({ assignment, splitDate, assignmentSelectionChange, allAssignmentStates }) {
    return (
        <li
            data-akey={assignment.id}
            className={
                assignment.assignment_completed
                    ? twMerge(CSSclasses.assignment.base, CSSclasses.assignment.completed)
                    : CSSclasses.assignment.base
            }>
            {/* Course of assignment */}
            <span className="sm:text-lg sm:col-start-1 sm:col-span-4 sm:py-1 sm:border-r-2 border-cyan-600 border-opacity-25">
                <strong>{assignment.course_code}</strong>
            </span>
            {/* Selection checkbox */}
            <div className="text-right pr-2 sm:pr-1 sm:row-start-2">
                <input
                    type="checkbox"
                    className="h-4"
                    onChange={(e) => assignmentSelectionChange(e, { ...allAssignmentStates })}
                />
            </div>
            {/* Name */}
            <div className="col-span-3 sm:row-start-2 sm:pb-1 flex items-center border-r-2 border-cyan-600 h-full border-opacity-25">
                <span style={{ overflowWrap: "anywhere" }}>{assignment.assignment_name}</span>
            </div>
            {/* Due date */}
            <span className="col-span-2 sm:col-span-3 sm:row-span-2 text-left" style={{ overflowWrap: "break-word" }}>
                {splitDate(assignment.assignment_due_date).map((date, index) => {
                    return <p key={index}>{date}</p>;
                })}
            </span>
            {/* Days left */}
            <span className="text-right sm:row-span-2">{assignment.days_left} days left</span>
        </li>
    );
}
