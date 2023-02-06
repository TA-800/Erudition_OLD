import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useRef, useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import AuthContext from "../../context/AuthContext";
import { url } from "../Main";

export default function Settings() {
    const { userID, imageURL } = useContext(AuthContext);
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
                // setUni(data);
                setUserState((prev) => ({ ...prev, unis: data }));
            })
            .catch((errMessage) => alert(errMessage));
    }

    function fetchAllUniversities() {
        fetch(url + "alluniversities/", {
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
        fetch(url + `userProfile/${userID}`, {
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
                setUserState((prev) => ({
                    ...prev,
                    first: data.first_name,
                    last: data.last_name,
                    field: data.field,
                    year: data.year,
                }));
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function sendSettings(e) {
        // If e is null/undefined, then this function was called from the Remove Display Picture link
        if (!e) {
            fetch(url + `userProfile/${userID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("access"),
                },
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Error removing display picture");
                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                });
            // End the function
            return;
        }

        e.preventDefault();
        // console.log("Sending settings");
        // Get saveprofile-btn element and modify its text to show that the settings are being saved
        let savebtn = document.getElementById("saveprofile-btn");
        savebtn.textContent = "Saving...";
        savebtn.className += " disabled";
        savebtn.disabled = true;

        // Create form data
        const data = new FormData();
        data.append("avatar", e.target.avatar.files[0]);
        data.append("first", e.target.first.value);
        data.append("last", e.target.last.value);
        data.append("field", e.target.field.value);
        data.append("year", e.target.year.value);
        data.append("unis", chooseOther ? e.target.other.value : JSON.stringify(universitiesSelect.current.getSelectedItems()));

        fetch(url + `userProfile/${userID}`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
            body: data,
        })
            .then((res) => res.json())
            .then((d) => {
                // console.log(d);
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
                    <p className="info-text">Customize personal information or Erudition to your liking.</p>
                    <hr />
                    <br />

                    <form onSubmit={(e) => sendSettings(e)}>
                        <div className="flex flex-col gap-2 mb-3">
                            <img
                                src={`${imageURL}`}
                                className="sm:h-[300px] h-[350px] self-center avatar hover:scale-105"
                                onClick={() => {
                                    // Simulate click on file input
                                    document.getElementById("avatar").click();
                                }}
                                alt="User avatar"
                            />
                            <a className="link w-fit" onClick={() => sendSettings()}>
                                Remove display image
                            </a>
                            <h2>Display Image</h2>
                            <input
                                className="input-text"
                                type="file"
                                accept="image/*"
                                name="avatar"
                                placeholder="Select your display picture"
                                id="avatar"
                            />
                        </div>
                        <div className="grid grid-flow-col grid-cols-2 sm:grid-flow-row sm:grid-rows-2 sm:grid-cols-none gap-2">
                            <div className="flex flex-col gap-2">
                                <h2>First Name</h2>
                                <input
                                    className="input-text"
                                    type="text"
                                    name="first"
                                    placeholder="Type in your first name"
                                    id="first"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h2>Last Name</h2>
                                <input
                                    className="input-text"
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
                                    className="bg-zinc-900"
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
                                    className="input-text"
                                    type="text"
                                    name="other"
                                    placeholder="Type in your university name"
                                    id="other"
                                />
                            )}

                            <a onClick={() => setChooseOther(!chooseOther)} className="link ml-auto">
                                {!chooseOther ? "Select a different university" : "Select university from list"}
                            </a>
                        </div>
                        {userState.unis.length === 0 && <p>Enroll in a university now to get started</p>}
                        {userState.unis.length > 0 && (
                            <p className="info-text">
                                You can see courses and discussions for{" "}
                                {userState.unis.map((univ, index) => (
                                    <li key={index} className="ml-8">
                                        {univ.university_name}
                                    </li>
                                ))}
                            </p>
                        )}
                        <br />
                        <div className="grid grid-flow-row gap-2 border-red-500 border-0">
                            <div className="flex flex-col gap-2">
                                <h2>Field of Specialization</h2>
                                <input
                                    className="input-text"
                                    type="text"
                                    name="field"
                                    placeholder="Type in your major"
                                    id="field"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h2>Year of Study</h2>
                                <input
                                    className="input-text"
                                    type="number"
                                    name="year"
                                    placeholder="Choose current year of your study"
                                    id="year"
                                    min={1}
                                    max={10}
                                />
                            </div>
                            <button className="btn-light ml-auto" id="saveprofile-btn">
                                Save Profile
                            </button>
                        </div>
                    </form>
                </>
            )}
        </>
    );
}
