import React, { useRef } from "react";
import Texteditor from "./Texteditor";
import { CSSclasses } from "./StudyHub";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";

export default function NewModuleModal({ moduleModal, setModuleModal, course_id, setNewModules }) {
    const quillRef = useRef();
    const moduleNameRef = useRef();

    if (moduleModal) {
        // Add scroll lock to main
        document.querySelector("main")?.classList.add("scroll-lock");
    } else {
        // Remove scroll lock from main
        document.querySelector("main")?.classList.remove("scroll-lock");
    }

    function saveModule() {
        const newModuleTitle = moduleNameRef.current.value;
        const newModuleContentsDelta = JSON.stringify(quillRef.current.getContents());
        const newModuleContentsText = quillRef.current.getText();
        // Send to backend
        fetch(`http://127.0.0.1:8000/backend/modules/${course_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
            body: JSON.stringify({
                title: newModuleTitle,
                delta: newModuleContentsDelta,
                text: newModuleContentsText,
            }),
        })
            .then((resp) => {
                if (resp.status !== 201) {
                    return resp.json().then((json) => {
                        throw new Error(`${resp.status} ${resp.statusText} ${json.detail}`);
                    });
                }
                return resp.json();
            })
            .then((data) => {
                // Update modules
                console.log(data);
                setNewModules(data);
            })
            .catch((error) => console.log(error));

        // Close modal
        setModuleModal(false);
    }

    return (
        <div className={moduleModal ? twMerge(CSSclasses.overlay.base, CSSclasses.overlay.active) : CSSclasses.overlay.base}>
            {/* Save new module button */}
            <button className={twMerge(CSSclasses.editButton.base, CSSclasses.editButton.active)} onClick={saveModule}>
                <FontAwesomeIcon icon={faCheck} />
            </button>
            {/* Module title input */}
            <input
                ref={moduleNameRef}
                className="bg-cyan-800 bg-opacity-25 rounded-lg p-2 pl-5 text-cyan-100 w-full h-12 border-b border-cyan-700 border-opacity-50 focus:outline-none"
                placeholder="Module title"
            />

            {/* Text editor */}
            <Texteditor initial={null} qref={quillRef} />
            {/* Cancel new module button */}
            <button
                className={twMerge(CSSclasses.readButton.base, CSSclasses.readButton.active)}
                onClick={() => {
                    setModuleModal(false);
                }}>
                <FontAwesomeIcon icon={faClose} />
            </button>
        </div>
    );
}
