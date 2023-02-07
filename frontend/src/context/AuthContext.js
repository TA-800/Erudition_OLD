import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { url } from "../components/Main";

const AuthContext = createContext();
export default AuthContext;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() =>
        localStorage.getItem("access") ? jwt_decode(localStorage.getItem("access")).username : null
    );
    const [userID, setUserID] = useState(() =>
        localStorage.getItem("access") ? jwt_decode(localStorage.getItem("access")).user_id : null
    );
    const [imageURL, setImageURL] = useState(null);

    const [firstLoad, setFirstLoad] = useState(true);
    const navigate = useNavigate();

    function getUserImage() {
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
                setImageURL(data.avatar);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function updateUser(token) {
        if (token === null) {
            setUser(null);
            setUserID(null);
            return;
        }
        setUser(jwt_decode(token).username);
        setUserID(jwt_decode(token).user_id);
    }

    function login(e, u, p) {
        console.log("login called with url: " + url + "login/");

        if (e === null) {
            e = {
                target: { username: { value: u }, password: { value: p } },
            };
        } else {
            e.preventDefault();
        }

        fetch(url + "login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value,
            }),
        })
            .then((res) => {
                // If response is not 200 OK, throw an error
                if (res.status !== 200) {
                    return res.json().then((json) => {
                        throw new Error(`${res.status} ${res.statusText}: ${json.detail || json.username || json.password}`);
                    });
                }
                return res.json();
            })
            .then((data) => {
                // Store the access and refresh tokens in localStorage
                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);
                updateUser(data.access);
                // Navigate to the home page
                navigate("/studyhub");
            })
            .catch((errMessage) => {
                alert(errMessage);
            });
    }

    function logout() {
        // Remove the tokens from localStorage
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        // Set the user to null
        updateUser(null);
        // Navigate to the login page
        navigate("/landing");
    }

    function register(e) {
        e.preventDefault();

        const username = e.target.username.value;
        const password = e.target.password.value;

        fetch(url + "register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then((res) => {
                // If response is not 201 CREATED, throw an error
                if (res.status !== 201) {
                    return res.json().then((json) => {
                        throw new Error(`${res.status} ${res.statusText}: ${json.detail || json.username || json.password}`);
                    });
                }
                // Else, log the user in
                login(null, username, password);
            })
            .catch((errMessage) => {
                alert(errMessage);
            });
    }

    function updateToken() {
        fetch(url + "refresh/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refresh: localStorage.getItem("refresh"),
            }),
        })
            .then((res) => {
                // If response is not 200 OK, throw an error
                if (res.status !== 200) {
                    return res.json().then((json) => {
                        throw new Error(`${res.status} ${res.statusText}\n${json.detail}`);
                    });
                }
                return res.json();
            })
            .then((data) => {
                // Store the new access token in localStorage
                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);
                updateUser(data.access);
                console.log("Token updated");
            })
            .catch((errMessage) => {
                console.log(errMessage);
                logout();
            });

        // Set the firstLoad state after first render
        if (firstLoad) {
            setFirstLoad(false);
        }
    }

    function Loading() {
        return <div>Loading...</div>;
    }

    useEffect(() => {
        if (firstLoad) {
            updateToken();
        }

        // If the user is not null, get the user image
        if (user !== null) {
            getUserImage();
        }

        // Call the updateToken function every 4 minutes
        let interval = setInterval(() => {
            if (user !== null) {
                updateToken();
            }
        }, 4 * 60 * 1000);
        // Clear the interval when the component is unmounted
        return () => clearInterval(interval);
    }, [user]);

    let context = {
        user: user,
        userID: userID,
        imageURL: imageURL,
        setImageURL: setImageURL,
        register: register,
        login: login,
        logout: logout,
    };

    return <AuthContext.Provider value={context}>{firstLoad ? <Loading /> : children}</AuthContext.Provider>;
}
