import React, { useEffect, useRef, useState } from "react";
import { faCheck, faClose, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ReadingPanel({
    selectedModule,
    setReadingPanel,
    setSelectedModule,
    setNewModules,
    FormattedNotes,
    Texteditor,
}) {
    const overlayRef = useRef();
    const quillRef = useRef();
    const [editable, setEditable] = useState(false);
    const [mountAnimation, setMountAnimation] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [ignoreUE, setIgnoreUE] = useState(false);

    function closeModal() {
        if (mounted) {
            setIgnoreUE(true);
            overlayRef.current.ontransitionend = (e) => {
                if (e.propertyName === "opacity") {
                    console.log("transitionend");
                    setReadingPanel(false);
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
            {/* Edit button */}
            <button
                className={editable ? "edit edit-active" : "edit"}
                onClick={() => {
                    setEditable(!editable);
                    if (editable) {
                        // What to do when going from editable to not editable
                        // -> SAVE CHANGES
                        // Get the text from the editor
                        const delta = quillRef.current.getContents();
                        const text = quillRef.current.getText();

                        // Send to backend
                        fetch(`http://127.0.0.1:8000/backend/modules/${selectedModule.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + localStorage.getItem("access"),
                            },
                            body: JSON.stringify({
                                delta: JSON.stringify(delta),
                                text: text,
                            }),
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                // Set the selected module to the new text
                                setSelectedModule(data);
                                // Update the modules in state
                                setNewModules(data);
                            })
                            .catch((err) => alert(err));
                    }
                }}>
                {/* If not editable, show edit icon, else show save icon */}
                {!editable ? <FontAwesomeIcon icon={faEdit} /> : <FontAwesomeIcon icon={faCheck} />}
            </button>

            {/* Main overlay */}
            <div ref={overlayRef} className={mountAnimation ? "read-overlay read-overlay-active" : "read-overlay"}>
                {/* Reading or editing */}
                {!editable ? (
                    <FormattedNotes delta={selectedModule.module_notesDelta} hide=" overflow-visible" />
                ) : (
                    <Texteditor initial={selectedModule.module_notesDelta} qref={quillRef} />
                )}
            </div>

            {/* Read button */}
            <button className="read-button read-button-active" onClick={closeModal}>
                <FontAwesomeIcon icon={faClose} />
            </button>
        </>
    );
}
