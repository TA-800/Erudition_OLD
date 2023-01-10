// ASSIGNMENTS' FUNCTIONS
export function setNewAssignments(newAssignmentData, fetch = false, { assignments, setAssignments }) {
    let newAssignments = [];
    // Force array mapping
    if (!Array.isArray(newAssignmentData)) newAssignments.push(newAssignmentData);
    else {
        newAssignments = newAssignmentData;
    }
    newAssignments = newAssignments.map((assignment) => {
        // Convert date to local time string
        assignment.assignment_due_date = new Date(assignment.assignment_due_date).toString();
        return assignment;
    });

    // Replace all assignments with newAssignmentData when fetching from server
    if (fetch) {
        setAssignments(newAssignments);
    }
    // Else just append new assignments to assignments
    else {
        setAssignments([...assignments, ...newAssignments]);
    }
}
export function splitDate(date) {
    let hours = parseInt(date.substring(0, 21).slice(16, 18));
    let minutes = date.substring(0, 21).slice(19);
    let time =
        hours > 12
            ? `${hours - 12}:${minutes}`
            : `${hours.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })}:${minutes}`;
    return [`${date.substring(0, 21).slice(0, 10)}`, `${time} ${hours >= 12 ? "PM" : "AM"}`]; // Thu Jan 05, 1:00 PM
}
export function assignmentSelectionChange(e, { assignmentSelection, setAssignmentSelection, setAssignmentSelectionBox }) {
    console.log(e);
    const assignmentID = e.target.parentNode.parentNode.getAttribute("data-akey");
    // If checked, add to assignmentSelection
    if (e.target.checked) {
        setAssignmentSelection([...assignmentSelection, assignmentID]);
        setAssignmentSelectionBox(true);
    }
    // If unchecked, remove from assignmentSelection
    else {
        setAssignmentSelection(assignmentSelection.filter((assignment) => assignment !== assignmentID));
    }
}
export function clearAssignmentSelection(panel = "courses", { setAssignmentSelection }) {
    // Deselect all selected assignments
    document.querySelectorAll(`article.${panel} input[type=checkbox]`).forEach((el) => {
        el.checked = false;
    });
    setAssignmentSelection([]);
}
