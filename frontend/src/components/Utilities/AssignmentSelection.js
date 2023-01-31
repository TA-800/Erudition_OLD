import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export default function AssignmentSelection({
    assignments,
    assignmentSelection,
    setAssignments,
    setAssignmentSelectionBox,
    clearAssignmentSelection,
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
                // Remove deleted assignments from state
                setAssignments(assignments.filter((assignment) => !assignmentSelection.includes(String(assignment.id))));
                clearAssignmentSelection();
            })
            .catch((err) => {
                alert(err);
            });
    }
    function markAssignmentsComplete() {
        // Delete assignments
        fetch(`http://127.0.0.1:8000/backend/assignments/0`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
            body: JSON.stringify({
                assignments: assignmentSelection, // Array of assignment IDs to mark complete
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
                // Update assignments in state by marking them complete
                setAssignments(
                    assignments.map((assignment) => {
                        if (assignmentSelection.includes(String(assignment.id)))
                            assignment.assignment_completed = data.find((a) => a.id === assignment.id).assignment_completed;
                        return assignment;
                    })
                );

                clearAssignmentSelection();
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
            wrapperRef.current.ontransitionend = () => {
                setAssignmentSelectionBox(false);
            };
            setMountAnimation(false);
        }
    }, [assignmentSelection]);

    return (
        <div ref={wrapperRef} className={mountAnimation ? "assignment-select assignment-select-active" : "assignment-select"}>
            <button className="btn-dark col-span-4 sm:col-span-5" onClick={markAssignmentsComplete}>
                <span>Mark as complete</span>
                <FontAwesomeIcon icon={faCheckCircle} />
            </button>
            <button className="btn-dark col-span-3 sm:col-span-2" onClick={deleteAssignments}>
                <span>Delete</span>
                <FontAwesomeIcon icon={faTrashAlt} />
            </button>
        </div>
    );
}
