import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import Settings from "./Settings";

export default function Login() {
    const { login } = useContext(AuthContext);

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={(e) => login(e)}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                <button type="submit">Login</button>
            </form>

            <Register />
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
            <p
                className="m-0 text-cyan-800 max-w-2xl
                    mdc:text-sm mdc:max-w-sm">
                Are you sure you would like to logout?
            </p>
            <hr />
            <br />
            <button className="btn-darker" onClick={logout}>
                Logout
            </button>
        </>
    );
}

export function Register() {
    const { register } = useContext(AuthContext);

    return (
        <>
            <h1>Register</h1>
            <form onSubmit={(e) => register(e)}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" />
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                <button type="submit">Register</button>
            </form>
        </>
    );
}
