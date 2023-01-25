import CoursesSection from "./CoursesSection/CoursesSection";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import WeeklySection from "./WeeklySection/WeeklySection";
import DistractSection from "./DistractSection/DistractSection";

export default function StudyHub() {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    return (
        <>
            <header>Good evening, {user}.</header>
            <p className="info-text">
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
