import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { twMerge } from "tailwind-merge";
import { CSSclasses } from "./StudyHub";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight, faClose, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

export default function NewAssignment({ setCreateAssignment }) {
    const [auto, setAuto] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const newAssignmentRef = useRef();
    // For (un)mount animation
    const [mountAnimation, setMountAnimation] = useState(false);
    const [ignoreUE, setIgnoreUE] = useState(false);

    function closeNewAssignment() {
        setIgnoreUE(true);
        newAssignmentRef.current.ontransitionend = (e) => {
            if (e.propertyName === "height") {
                setCreateAssignment(false);
            }
        };
        setMountAnimation(false);
    }

    useEffect(() => {
        if (ignoreUE) return;

        let timeout = setTimeout(() => {
            setMountAnimation(true);
        }, 10);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div
            ref={newAssignmentRef}
            className={
                "assignments-new-wrapper " +
                (mountAnimation
                    ? twMerge(CSSclasses.newassignment.base, CSSclasses.newassignment.active)
                    : CSSclasses.newassignment.base)
            }>
            {auto ? (
                <AutoAssignment startDate={startDate} setStartDate={setStartDate} />
            ) : (
                <ManualAssignment startDate={startDate} setStartDate={setStartDate} />
            )}
            <div className="flex flex-row justify-around col-start-4">
                <FontAwesomeIcon
                    icon={faTimesCircle}
                    className="text-2xl"
                    onClick={() => {
                        closeNewAssignment();
                    }}
                />
                <FontAwesomeIcon
                    className="text-2xl"
                    icon={auto ? faCircleArrowLeft : faCircleArrowRight}
                    onClick={() => {
                        setAuto(!auto);
                    }}
                />
            </div>
        </div>
    );
}

function ManualAssignment({ startDate, setStartDate }) {
    return (
        <>
            {/* Course select */}
            <select
                className={twMerge(CSSclasses.dropdown.base, "h-full w-full")}
                style={{
                    boxShadow: "inset 0px -2px 0px rgba(0,0,0,0.25)",
                }}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
            {/* Assignment Name */}
            <input
                type="text"
                className={twMerge(CSSclasses.search.base, "col-span-2 p-2")}
                style={{
                    boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -1px 0px rgb(10,164,194,0.65)",
                }}
                placeholder="New Assignment Name"
            />
            {/* CALENDAR */}
            <div className="">
                <DatePicker
                    className={twMerge(CSSclasses.search.base, "p-2 text-center")}
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="MMM d yyyy h:mm aa"
                />
            </div>
            {/* Assignment desc */}
            <textarea
                className={twMerge(CSSclasses.search.base, "p-2 col-span-3 resize-none")}
                placeholder="Assignment Description"
                style={{
                    boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -1px 0px rgb(10,164,194,0.65)",
                }}></textarea>
            {/* Assignment submit */}
            <button
                className="bg-cyan-800 text-cyan-100 rounded-lg after:content-['Add_Assignment'] sm:after:content-['Add_Asgnmt.'] h-full"
                style={{
                    boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -1px 0px rgb(10,164,194,0.65)",
                }}></button>
        </>
    );
}

function AutoAssignment({ startDate, setStartDate }) {
    return (
        <>
            {/* Course select */}
            <select
                className={twMerge(CSSclasses.dropdown.base, "h-full w-full")}
                style={{
                    boxShadow: "inset 0px -2px 0px rgba(0,0,0,0.25)",
                }}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
            {/* Frequency select */}
            <select
                className={twMerge(CSSclasses.dropdown.base, "h-full w-full min-w-0")}
                style={{
                    boxShadow: "inset 0px -2px 0px rgba(0,0,0,0.25)",
                }}>
                <option value="1">Daily</option>
                <option value="2">Weekly</option>
                <option value="3">Monthly</option>
            </select>
            {/* CALENDAR */}
            <div className="col-span-2 flex justify-center">
                <DatePicker
                    className={twMerge(CSSclasses.search.base, "p-2 text-left")}
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    timeCaption="time"
                    dateFormat="MMM d yyyy h:mm aa"
                />
            </div>
            {/* Assignment auto number */}
            <input
                type="number"
                className="bg-cyan-800 text-cyan-100 rounded-lg h-full px-2 text-center"
                style={{
                    boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -1px 0px rgb(10,164,194,0.65)",
                }}
                placeholder="Auto Amount"
            />
            {/* Assignment desc */}
            <textarea
                className={twMerge(CSSclasses.search.base, "p-2 col-span-3 resize-none")}
                placeholder="Assignment Description"
                style={{
                    boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -1px 0px rgb(10,164,194,0.65)",
                }}></textarea>
            {/* Assignment auto name */}
            <input
                type="text"
                className={twMerge(CSSclasses.search.base, "col-span-2 p-2")}
                style={{
                    boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -1px 0px rgb(10,164,194,0.65)",
                }}
                placeholder="Auto Assignment Prefix"
            />
            {/* Assignment auto submit */}
            <button
                className="bg-cyan-800 text-cyan-100 rounded-lg h-full"
                style={{
                    boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -1px 0px rgb(10,164,194,0.65)",
                }}>
                Auto Generate
            </button>
        </>
    );
}
