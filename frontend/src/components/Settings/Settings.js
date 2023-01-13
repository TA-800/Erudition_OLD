import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function Settings() {
    const [uni, setUni] = useState([]);

    useEffect(() => {
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
                console.log(data);
                setUni(data.map((uni) => uni.university_name));
            })
            .catch((errMessage) => alert(errMessage));
    }, []);

    return (
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
                <label htmlFor="university">University</label>
                <input type="text" name="university" id="university" />
                <p>
                    You are currently enrolled in{" "}
                    {uni.map((univ, index) => (
                        <li key={index}>{univ}</li>
                    ))}
                </p>
                <br />
                <label htmlFor="major">Major</label>
                <input type="text" name="major" id="major" />
                <label htmlFor="year">Year</label>
                <input type="text" name="year" id="year" />
            </form>
        </>
    );
}
