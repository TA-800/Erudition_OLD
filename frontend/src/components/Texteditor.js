import React, { useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function Texteditor({ initial, qref }) {
    const editorWrapper = useCallback((wrapper) => {
        // If for some reason the wrapper is null, return
        if (wrapper == null) return;

        // Clear the wrapper
        wrapper.innerHTML = "";

        const editor = document.createElement("div");
        // Set the initial value of the editor
        editor.textContent = initial;
        wrapper.append(editor);

        // Instantiate the Quill editor into the editor div
        const quillInstance = new Quill(editor, { theme: "snow" });
        qref.current = quillInstance;
    }, []);

    return (
        <div className="editorWrapper" ref={editorWrapper}>
            {/* Quill editor will be rendered here */}
        </div>
    );
}
