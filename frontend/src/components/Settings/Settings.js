import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import { CSSclasses } from "../StudyHub";
import { twMerge } from "tailwind-merge";
import AuthContext from "../../context/AuthContext";

export default function Settings() {
    const { userID, imageURL, setImageURL } = useContext(AuthContext);
    const [userState, setUserState] = useState({
        first: "",
        last: "",
        unis: [],
        field: "",
        year: 1,
        avatar: imageURL,
    });
    const [allUnis, setAllUnis] = useState([]);
    const [chooseOther, setChooseOther] = useState(false);
    const [loading, setLoading] = useState(true);
    const universitiesSelect = useRef();

    // Fetch all initial data
    useEffect(() => {
        fetchUserUniversities();
        fetchAllUniversities();
        fetchUserProfile();

        if (!loading) setInitalValues();
    }, [loading]);

    // Console debug
    useEffect(() => {
        console.log("User state changed");
        console.log(userState);
    }, [userState]);

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
                // setUni(data);
                setUserState((prev) => ({ ...prev, unis: data }));
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
            })
            .catch((errMessage) => alert(errMessage));
    }

    function fetchUserProfile() {
        fetch(`http://127.0.0.1:8000/backend/userProfile/${userID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
        })
            .then((res) => {
                if (res.status !== 200) throw new Error("Error fetching user image");
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setUserState({
                    ...userState,
                    first: data.first_name,
                    last: data.last_name,
                    field: data.field,
                    year: data.year,
                });
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function sendSettings(e) {
        e.preventDefault();
        console.log("Sending settings");
        const data = {
            avatar: e.target.avatar.files[0],
            first: e.target.first.value,
            last: e.target.last.value,
            field: e.target.field.value,
            year: e.target.year.value,
            unis: chooseOther ? e.target.other.value : universitiesSelect.current.getSelectedItems(),
        };
        console.log(data);
        fetch(`http://127.0.0.1:8000/backend/userProfile/${userID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                // Reload page to update user data
                window.location.reload();
            })
            .catch((err) => console.log(err));
    }

    // Populate input elements with user data
    function setInitalValues() {
        document.getElementById("first").value = userState.first;
        document.getElementById("last").value = userState.last;
        document.getElementById("field").value = userState.field;
        document.getElementById("year").value = userState.year;
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

                    <form onSubmit={(e) => sendSettings(e)}>
                        <div className="flex flex-col gap-2 mb-3">
                            <img
                                src={`http://127.0.0.1:8000${imageURL}`}
                                className="sm:h-[300px] h-[350px] self-center avatar hover:scale-105"
                                alt="User avatar"
                            />
                            <h2>Avatar</h2>
                            <input
                                className={twMerge(CSSclasses.search.base, " bg-cyan-700 p-2 rounded-md ")}
                                type="file"
                                name="avatar"
                                placeholder="Select your display picture"
                                id="avatar"
                            />
                        </div>
                        <div className="grid grid-flow-col grid-cols-2 sm:grid-flow-row sm:grid-rows-2 sm:grid-cols-none gap-2">
                            <div className="flex flex-col gap-2">
                                <h2>First Name</h2>
                                <input
                                    className={twMerge(CSSclasses.search.base, " bg-cyan-700 p-2 rounded-md ")}
                                    type="text"
                                    name="first"
                                    placeholder="Type in your first name"
                                    id="first"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h2>Last Name</h2>
                                <input
                                    className={twMerge(CSSclasses.search.base, " bg-cyan-700 p-2 rounded-md ")}
                                    type="text"
                                    name="last"
                                    placeholder="Type in your first name"
                                    id="last"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            <h2>Educational institutions</h2>
                            {!chooseOther ? (
                                <Multiselect
                                    ref={universitiesSelect}
                                    className="bg-cyan-700 rounded-lg"
                                    displayValue="name"
                                    isObject={true}
                                    onKeyPressFn={function noRefCheck() {}}
                                    onRemove={function noRefCheck() {}}
                                    onSearch={function noRefCheck() {}}
                                    onSelect={function noRefCheck() {}}
                                    showCheckbox={true}
                                    selectedValues={allUnis.filter((u) => {
                                        return userState.unis.some((un) => un.id === u.id);
                                    })}
                                    showArrow
                                    avoidHighlightFirstOption
                                    placeholder="Select colleges"
                                    closeIcon="cancel"
                                    options={allUnis}
                                />
                            ) : (
                                <input
                                    className={twMerge(CSSclasses.search.base, " bg-cyan-700 p-2 rounded-md ")}
                                    type="text"
                                    name="other"
                                    placeholder="Type in your university name"
                                    id="other"
                                />
                            )}

                            <a onClick={() => setChooseOther(!chooseOther)} className="text-cyan-900 cursor-pointer ml-auto">
                                {!chooseOther ? "Select a different university" : "Select university from list"}
                            </a>
                        </div>
                        {userState.unis.length === 0 && <p>Enroll in a university now to get started</p>}
                        {userState.unis.length > 0 && (
                            <p>
                                You are currently enrolled in{" "}
                                {userState.unis.map((univ, index) => (
                                    <li key={index}>{univ.university_name}</li>
                                ))}
                            </p>
                        )}
                        <br />
                        <div className="grid grid-flow-row gap-2 border-red-500 border-0">
                            <div className="flex flex-col gap-2">
                                <h2>Field of Specialization</h2>
                                <input
                                    className={twMerge(CSSclasses.search.base, " bg-cyan-700 p-2 rounded-md ")}
                                    type="text"
                                    name="field"
                                    placeholder="Type in your major"
                                    id="field"
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
