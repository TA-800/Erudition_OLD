import React, { useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function Texteditor({ initial, qref }) {
    const editorWrapper = useCallback((wrapper) => {
        // If for some reason the wrapper is null, return
        if (wrapper == null) return;

        // Clear the wrapper
        wrapper.innerHTML = "";
        // Create a div to hold the editor
        const editor = document.createElement("div");
        wrapper.append(editor);
        // Instantiate the Quill editor into the editor div
        const quillInstance = new Quill(editor, { theme: "snow" });
        // Set the initial value of the editor
        console.log(initial);
        quillInstance.setContents(JSON.parse(initial).ops);
        // Set the reference to the Quill instance for use in other components
        qref.current = quillInstance;
    }, []);

    return (
        <div className="editorWrapper" ref={editorWrapper}>
            {/* Quill editor will be rendered here */}
        </div>
    );
}
