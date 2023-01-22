import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import { CSSclasses } from "../StudyHub";
import { twMerge } from "tailwind-merge";

export default function Settings() {
    const [uni, setUni] = useState([]);
    const [allUnis, setAllUnis] = useState([]);
    const [loading, setLoading] = useState(true);
    const universitiesSelect = useRef();

    useEffect(() => {
        fetchUserUniversities();
        fetchAllUniversities();

        if (!loading) document.getElementById("year").value = 2;
    }, [loading]);

    function fetchUserUniversities() {
        fetch("http://127.0.0.1:8000/backend/university/", {
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
                setUni(data);
            })
            .catch((errMessage) => alert(errMessage));
    }

    function fetchAllUniversities() {
        fetch("http://127.0.0.1:8000/backend/alluniversities/", {
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
                setAllUnis(
                    data.map((u) => {
                        return { name: u.university_name, id: u.id };
                    })
                );
                setLoading(false);
            })
            .catch((errMessage) => alert(errMessage));
    }

    function Loading() {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-900"></div>
                <div>Loading information</div>
            </div>
        );
    }

    return (
        <>
            {loading && <Loading />}
            {!loading && (
                <>
                    <header className="font-bold">
                        <div className="flex flex-row gap-x-2 items-center">
                            <FontAwesomeIcon icon={faCog} />
                            Settings
                        </div>
                    </header>
                    <p
                        className="m-0 text-cyan-800 max-w-2xl
        mdc:text-sm mdc:max-w-sm">
                        Customize personal information or Erudition to your liking.
                    </p>
                    <hr />
                    <br />

                    <form>
                        <div className="flex flex-col gap-2">
                            <h2>Educational institutions</h2>
                            <Multiselect
                                className="bg-cyan-700 rounded-lg"
                                ref={universitiesSelect}
                                displayValue="name"
                                isObject={true}
                                onKeyPressFn={function noRefCheck() {}}
                                onRemove={function noRefCheck() {}}
                                onSearch={function noRefCheck() {}}
                                onSelect={function noRefCheck() {}}
                                showCheckbox={true}
                                selectedValues={allUnis.filter((u) => {
                                    return uni.some((un) => un.id === u.id);
                                })}
                                showArrow
                                avoidHighlightFirstOption
                                placeholder="Select colleges"
                                closeIcon="cancel"
                                options={allUnis}
                            />
                            <button type="button" className="btn-dark w-fit ml-auto">
                                Submit
                            </button>
                        </div>
                        <p>
                            You are currently enrolled in{" "}
                            {uni.map((univ, index) => (
                                <li key={index}>{univ.university_name}</li>
                            ))}
                        </p>
                        <br />
                        <div className="grid grid-flow-row gap-2 border-red-500 border-0">
                            <div className="flex flex-col gap-2">
                                <h2>Field of Specialization</h2>
                                <input
                                    className={twMerge(CSSclasses.search.base, " bg-cyan-700 p-2 rounded-md ")}
                                    type="text"
                                    name="major"
                                    placeholder="Type in your major"
                                    id="major"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h2>Year of Study</h2>
                                <input
                                    className={twMerge(CSSclasses.search.base, " bg-cyan-700 p-2 rounded-md ")}
                                    type="number"
                                    name="year"
                                    placeholder="Choose current year of your study"
                                    id="year"
                                    min={1}
                                    max={10}
                                />
                            </div>
                            <button className="btn-dark w-fit ml-auto">Save Profile</button>
                        </div>
                    </form>
                </>
            )}
        </>
    );
}
