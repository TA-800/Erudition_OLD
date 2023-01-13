import CoursesSection from "./CoursesSection/CoursesSection";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import WeeklySection from "./WeeklySection/WeeklySection";
import DistractSection from "./DistractSection/DistractSection";

export const CSSclasses = {
    // className = "h-16"
    courseButton: {
        base: "relative flex justify-center items-center h-[3.5rem] w-full bg-cyan-400 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-lg transition-all duration-300 ease-out cursor-pointer",
        active: "bg-[#49cee9] border-2 border-black border-opacity-10 shadow-none font-extrabold text-xl tracking-wide",
    },
    search: {
        base: "bg-cyan-800 rounded-lg p-2 pl-8 text-cyan-100 w-full h-full focus:outline-none",
        // active: ""
    },
    dropdown: {
        base: "bg-cyan-800 text-cyan-100 rounded-lg w-1/6 h-12 mdc:h-10 p-2 mdc:ml-auto min-w-fit text-center",
        // active: "",
    },
    // On the span/module-text inside the div
    moduleButton: {
        base: "font-normal cursor-pointer transition-all duration-200 hover:tracking-[0.2px]",
        active: "font-bold tracking-[0.2px]",
    },
    add: {
        base: "bg-cyan-800 text-cyan-100 rounded-lg w-1/6 mdc:w-10 h-12 mdc:h-10 p-2 flex flex-row justify-center items-center gap-1 after:content-['Add'] mdc:after:content-[] shadow-[inset_0px_-2px_0px_rgba(0,0,0,0.25)] active:relative active:shadow-none active:top-[2px] transition-all duration-200",
        disabled: "pointer-events-none opacity-50",
    },
    editButton: {
        base: "fixed top-2 right-5 bg-[#032830] text-cyan-100 rounded-md w-20 h-9 z-30 border-2 border-white border-opacity-25 flex flex-row justify-center items-center gap-1 after:content-['Edit'] mdc:after:content-[]",
        active: "shadow-none after:content-['Save'] mdc:after:content-[]",
    },
    readButton: {
        base: "absolute bottom-2 right-5 bg-[#032830] text-cyan-100 rounded-md w-20 h-9 flex flex-row justify-center items-center gap-1 after:content-['Read'] mdc:after:content-[]",
        active: "fixed shadow-none border-2 border-white z-30 border-opacity-25 after:content-['Close'] mdc:after:content-[]",
    },
    assignment: {
        base: "bg-red-800 bg-opacity-50 text-white border-2 border-red-900 w-full min-h-[3.5rem] px-2 sm:px-1  items-center grid grid-cols-8 sm:grid-rows-[max-content_max-content] gap-x-1",
        completed: "bg-opacity-0 opacity-50 border-2 border-opacity-50 border-cyan-100",
    },
    newassignment: {
        base: "bg-cyan-900 text-cyan-100 w-full h-0 grid grid-cols-4 gap-y-2 gap-x-2 p-0 rounded-lg items-center overflow-x-hidden overflow-y-hidden transition-all duration-500",
        active: "bg-cyan-900 p-1 pb-3 mb-3 h-44",
    },
    assignmentSelect: {
        base: "bg-cyan-900 text-cyan-100 h-0 w-full grid grid-cols-7 items-center px-2 py-0 mt-0 gap-2 overflow-hidden transition-all duration-300",
        active: "h-16 mt-3 py-3",
    },
    readOverlay: {
        base: "bg-black bg-opacity-0 text-cyan-100 opacity-0 backdrop-blur-0 fixed top-0 left-0 w-screen h-screen z-[13] py-[6.25rem] px-[8vw] pointer-events-none transition-all duration-200",
        active: "bg-opacity-80 opacity-100 backdrop-blur-md pointer-events-auto overflow-scroll overflow-x-hidden",
    },
    overlay: {
        base: "w-screen h-screen fixed top-0 left-0 z-[21] bg-black bg-opacity-0 opacity-0 backdrop-blur-0 pointer-events-none flex flex-col gap-y-10 p-[6.25rem_8vw] text-cyan-100 transition-all duration-300",
        active: "bg-opacity-80 opacity-100 backdrop-blur-md pointer-events-auto overflow-auto",
    },
};

// <div className="bg-opacity-0 opacity-50 border-2 border-opacity-50 border-cyan-100"

export default function StudyHub() {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    return (
        <>
            <header>Good evening, {user}.</header>
            <p
                className="m-0 text-cyan-800 max-w-2xl
                    mdc:text-sm mdc:max-w-sm">
                “Becoming Hokage does not mean people will acknowledge you, it is only when you are acknowledged by people that
                you can become Hokage” - Uchiha Itachi.
            </p>
            <hr />

            <br />
            <CoursesSection courses={courses} setCourses={setCourses} assignments={assignments} setAssignments={setAssignments} />
            <br />

            <hr />

            <br />
            <WeeklySection courses={courses} assignments={assignments} setAssignments={setAssignments} />
            <br />

            <hr />
            <br />
            <DistractSection />
            <br />
        </>
    );
}
