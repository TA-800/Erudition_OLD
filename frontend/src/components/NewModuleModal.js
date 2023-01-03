import React, { useRef } from "react";
import Texteditor from "./Texteditor";
import { CSSclasses } from "./StudyHub";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";

export default function NewModuleModal({ modal, setModal }) {
    const quillRef = useRef();

    if (!modal) return null;

    const delta = {
        ops: [{ insert: "Start writing here.\n" }],
    };

    return (
        <div
            className="w-screen h-screen absolute top-0 left-0 z-[21] bg-black bg-opacity-80 backdrop-blur-lg backdrop-filter
            flex flex-col gap-y-10 p-[6.25rem_8vw] text-cyan-100">
            {/* Module title input */}
            <input
                className="bg-cyan-800 bg-opacity-25 rounded-lg p-2 pl-5 text-cyan-100 w-full h-12 focus:outline-none"
                placeholder="Module title"
            />

            {/* Save new module button */}
            <button className={twMerge(CSSclasses.editButton.base, CSSclasses.editButton.active)}>
                <FontAwesomeIcon icon={faCheck} />
            </button>
            {/* Text editor */}
            <Texteditor initial={JSON.stringify(delta)} qref={quillRef} />
            {/* Cancel new module button */}
            <button
                className={twMerge(CSSclasses.readButton.base, CSSclasses.readButton.active)}
                onClick={() => {
                    setModal(false);
                }}>
                <FontAwesomeIcon icon={faClose} />
            </button>
        </div>
    );
}
