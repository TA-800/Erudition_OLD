import Multiselect from "multiselect-react-dropdown";
import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { CSSclasses } from "../StudyHub";

export default function CreateNewThread({ courses, setCreateThread }) {
    const newThreadRef = useRef();
    const coursesTagged = useRef(null);
    // For (un)mount animation
    const [mountAnimation, setMountAnimation] = useState(false);
    // let courseList = courses.map((course) => course.course_code);
    let courseList = courses.map((course) => {
        return { name: course.course_code, id: course.id };
    });

    function closeNewThread() {
        newThreadRef.current.ontransitionend = (e) => {
            if (e.propertyName === "height") {
                setCreateThread(false);
            }
        };
        setMountAnimation(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(e.target.name.value);
        console.log(e.target.content.value);
        console.log(coursesTagged.current.getSelectedItems());
        closeNewThread();
    }

    useEffect(() => {
        let timeout = setTimeout(() => {
            setMountAnimation(true);
        }, 10);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div
            ref={newThreadRef}
            className={
                mountAnimation ? twMerge(CSSclasses.newThread.base, CSSclasses.newThread.active) : CSSclasses.newThread.base
            }>
            <form className="flex flex-col p-2 gap-2" onSubmit={(e) => handleSubmit(e)}>
                <input
                    name="name"
                    type="text"
                    className={twMerge(CSSclasses.search.base, "col-span-2 p-2")}
                    style={{
                        boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -1px 0px rgb(10,164,194,0.65)",
                    }}
                    placeholder="Title"
                />
                <Multiselect
                    ref={coursesTagged}
                    displayValue="name"
                    isObject={true}
                    onKeyPressFn={function noRefCheck() {}}
                    onRemove={function noRefCheck() {}}
                    onSearch={function noRefCheck() {}}
                    onSelect={function noRefCheck() {}}
                    options={courseList}
                    selectionLimit={3}
                    showCheckbox={true}
                    showArrow
                    avoidHighlightFirstOption
                    placeholder="Tag courses"
                    closeIcon="cancel"
                />
                <textarea
                    name="content"
                    className={twMerge(CSSclasses.search.base, "p-2 col-span-3 resize-none")}
                    placeholder="Discussion Content"
                    style={{
                        scrollbarWidth: "none",
                        boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -1px 0px rgb(10,164,194,0.65)",
                    }}></textarea>
                <div className="grid grid-cols-2 gap-2">
                    {/* Create/Submit new thread button */}
                    <button className="btn-dark">Create</button>
                    {/* Cancel button */}
                    <button type="button" className="btn-dark" onClick={closeNewThread}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
