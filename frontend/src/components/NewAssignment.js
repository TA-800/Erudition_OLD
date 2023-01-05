import React from "react";
import { twMerge } from "tailwind-merge";
import { CSSclasses } from "./StudyHub";

export default function NewAssignment() {
    return (
        <div className={twMerge(CSSclasses.assignment.base, "assignments-new-wrapper grid-cols-3 p-2 mb-3")}>
            <select className="">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
            <input type="text" placeholder="Assignment Name" />
            <input type="text" placeholder="Date: YYYY-MM-DD 18:00" />
            <textarea className="col-span-2" placeholder="Assignment Description"></textarea>
            <button className="bg-cyan-900 text-cyan-100 rounded-lg">Add Assignment</button>
            <input type="number" /> <input type="text" placeholder="Assignment Prefix" />
            <button className="bg-cyan-900 text-cyan-100 rounded-lg">Auto Generate</button>
        </div>
    );
}
