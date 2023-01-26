import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Settings from "./Settings";

export default function LoginPage() {
    // Redirect to studyhub if user is logged in
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    if (user !== null) navigate("/studyhub");

    const [register, setRegister] = useState(false);

    return register ? (
        <>
            <br />
            <Register />
            <br />
            <a className="link" onClick={() => setRegister(!register)}>
                Already have an account? Click here to login.
            </a>
        </>
    ) : (
        <>
            <br />
            <Login />
            <br />
            <a className="link" onClick={() => setRegister(!register)}>
                Don't have an account? Click here to register.
            </a>
        </>
    );
}

export function Logout() {
    const { logout } = useContext(AuthContext);

    return (
        <>
            <Settings />
            <br />
            <br />
            <header className="font-bold">
                <div className="flex flex-row gap-x-2 items-center">
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Logout
                </div>
            </header>
            <p className="info-text">Are you sure you would like to logout?</p>
            <hr />
            <br />
            <button className="btn-light" onClick={logout}>
                Logout
            </button>
        </>
    );
}

function Login() {
    const { login } = useContext(AuthContext);
    return (
        <>
            <h1>Login</h1>
            <br />
            <form onSubmit={(e) => login(e)} className="grid grid-flow-row gap-1">
                <input className="input-text" placeholder="Username" type="text" name="username" id="username" />
                <input className="input-text" placeholder="Password" type="password" name="password" id="password" />
                <button className="btn-light" type="submit">
                    Login
                </button>
            </form>
        </>
    );
}

function Register() {
    const { register } = useContext(AuthContext);

    return (
        <>
            <h1>Register</h1>
            <br />
            <form onSubmit={(e) => register(e)} className="grid grid-flow-row gap-1">
                <input className="input-text" placeholder="Username" type="text" name="username" id="username" />
                <input className="input-text" placeholder="Email" type="email" name="email" id="email" />
                <input className="input-text" placeholder="Password" type="password" name="password" id="password" />
                <button className="btn-light" type="submit">
                    Register
                </button>
            </form>
        </>
    );
}
