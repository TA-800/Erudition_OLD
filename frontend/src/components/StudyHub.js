import CoursesSection from "./CoursesSection/CoursesSection";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import WeeklySection from "./WeeklySection/WeeklySection";
import DistractSection from "./DistractSection/DistractSection";
import { MoreProvider } from "../context/moreContext";
import { url } from "./Main";
import { useNavigate } from "react-router-dom";

export default function StudyHub() {
    const { user } = useContext(AuthContext);
    const [userUniversites, setUserUniversities] = useState([]);
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    function fetchUserUniversities() {
        fetch(url + "university/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
        })
            .then((res) => {
                // If response is not 200 OK, throw an error
                if (res.status !== 200) {
                    return res.json().then((json) => {
                        throw new Error(`${res.status} ${res.statusText}: ${json.detail}`);
                    });
                }
                return res.json();
            })
            .then((data) => {
                setUserUniversities(data);
                setLoading(false);
            })
            .catch((errMessage) => {
                console.log(errMessage);
            });
    }

    function Loading() {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-1 pt-3">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-zinc-500"></div>
                <p className="info-text">Loading page!</p>
            </div>
        );
    }

    useEffect(() => {
        // Fetch user universities/colleges
        fetchUserUniversities();
    }, [user]);

    return (
        <>
            <header>Welcome, {user}.</header>
            <p className="info-text">
                “Becoming Hokage does not mean people will acknowledge you, it is only when you are acknowledged by people that
                you can become Hokage” - Uchiha Itachi.
            </p>
            {loading ? (
                <Loading />
            ) : (
                <>
                    {userUniversites.length === 0 ? (
                        <>
                            <br />
                            <div className="flex flex-col gap-y-2">
                                <p>
                                    <span className="text-xl">
                                        You are not currently enrolled yourself in any of the educational institutions
                                        (schools/colleges/universities).
                                    </span>
                                    <br />
                                    <span className="info-text">
                                        To be able to use Erudition's services, you must be in at least one educational
                                        institution.
                                    </span>
                                </p>
                                {/* Show span with link taking to settings route */}
                                <span tabIndex={0} className="link" onClick={() => navigate("/settings")}>
                                    Click here to add a university/college.
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <hr />

                            <br />
                            <CoursesSection
                                courses={courses}
                                setCourses={setCourses}
                                assignments={assignments}
                                setAssignments={setAssignments}
                            />
                            <br />

                            <hr />

                            <br />
                            <WeeklySection courses={courses} assignments={assignments} setAssignments={setAssignments} />
                            <br />

                            <hr />
                            <br />
                            <MoreProvider>
                                <DistractSection />
                            </MoreProvider>
                            <br />
                        </>
                    )}
                </>
            )}
        </>
    );
}
