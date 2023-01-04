import React, { useRef, useState, useEffect } from "react";
import Texteditor from "./Texteditor";
import { CSSclasses } from "./StudyHub";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";

export default function NewModuleModal({ setModuleModal, course_id, setNewModules }) {
    const quillRef = useRef();
    const moduleNameRef = useRef();
    const [mountAnimation, setMountAnimation] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [ignoreUE, setIgnoreUE] = useState(false);

    const clearInputs = () => {
        moduleNameRef.current.value = "";
        quillRef.current.setContents([{ insert: "\n" }]);
    };

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
            .catch((error) => alert(error));

        // Close modal
        closeModal();
    }

    function closeModal() {
        if (mounted) {
            setIgnoreUE(true);
            moduleNameRef.current.parentElement.ontransitionend = (e) => {
                if (e.propertyName === "opacity") {
                    console.log("transitionend");
                    clearInputs();
                    setModuleModal(false);
                }
            };
            setMountAnimation(false);
        }
    }

    useEffect(() => {
        if (ignoreUE) return;
        setMounted(true);

        let timeout = setTimeout(() => {
            setMountAnimation(true);
        }, 10);

        return () => {
            clearTimeout(timeout);
        };
    });

    return (
        <>
            {/* Save new module button */}
            <button
                className={mountAnimation ? twMerge(CSSclasses.editButton.base, CSSclasses.editButton.active) : "hidden"}
                onClick={saveModule}>
                <FontAwesomeIcon icon={faCheck} />
            </button>

            <div
                className={
                    mountAnimation ? twMerge(CSSclasses.overlay.base, CSSclasses.overlay.active) : CSSclasses.overlay.base
                }>
                <p className="text-5xl font-extrabold uppercase mdc:text-2xl">Add a new module</p>

                {/* Module title input */}
                <input
                    ref={moduleNameRef}
                    className="bg-cyan-800 bg-opacity-25 rounded-lg p-2 pl-5 text-cyan-100 w-full h-12 border-b border-cyan-700 border-opacity-50 focus:outline-none"
                    placeholder="Module title"
                />

                {/* Text editor */}
                <Texteditor initial={null} qref={quillRef} />
            </div>
            {/* Cancel new module button */}
            <button
                className={mountAnimation ? twMerge(CSSclasses.readButton.base, CSSclasses.readButton.active) : "hidden"}
                onClick={closeModal}>
                <FontAwesomeIcon icon={faClose} />
            </button>
        </>
    );
}
