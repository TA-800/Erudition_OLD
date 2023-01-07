import React, { useEffect, useRef, useState } from "react";
import { CSSclasses } from "./StudyHub";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

export default function AssignmentSelection({
    assignments,
    assignmentSelection,
    setAssignments,
    setAssignmentSelection,
    setAssignmentSelectionBox,
}) {
    const wrapperRef = useRef(null);
    // For (un)mount animation
    const [mountAnimation, setMountAnimation] = useState(false);

    function deleteAssignments() {
        // Delete assignments
        fetch(`http://127.0.0.1:8000/backend/assignments/0`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
            body: JSON.stringify({
                assignments: assignmentSelection, // Array of assignment IDs to delete
            }),
        })
            .then((res) => {
                if (res.status !== 200) {
                    return res.json().then((json) => {
                        throw new Error(`${res.status} ${res.statusText} ${json.detail}}`);
                    });
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                // Remove deleted assignments from state
                setAssignments(assignments.filter((assignment) => !assignmentSelection.includes(String(assignment.id))));
                setAssignmentSelection([]);
            })
            .catch((err) => {
                alert(err);
            });
    }

    // When mounting
    useEffect(() => {
        let timeout = setTimeout(() => {
            setMountAnimation(true);
        }, 10);

        return () => {
            clearTimeout(timeout);
        };
    }, []);
    // When unmounting
    useEffect(() => {
        if (assignmentSelection.length === 0) {
            wrapperRef.current.ontransitionend = (e) => {
                if (e.propertyName === "height") {
                    setAssignmentSelectionBox(false);
                }
            };
            setMountAnimation(false);
        }
    }, [assignmentSelection]);

    return (
        <div
            ref={wrapperRef}
            className={
                mountAnimation
                    ? twMerge(CSSclasses.assignmentSelect.base, CSSclasses.assignmentSelect.active)
                    : CSSclasses.assignmentSelect.base
            }>
            <div className="flex flex-row gap-1 items-center cursor-pointer hover:text-lg">
                <span>Mark as complete</span>
                <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className="flex flex-row gap-1 items-center cursor-pointer hover:text-lg" onClick={deleteAssignments}>
                <span>Delete</span>
                <FontAwesomeIcon icon={faTrashAlt} />
            </div>
        </div>
    );
}
