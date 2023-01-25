import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { CSSclasses } from "../StudyHub";
import AuthContext from "../../context/AuthContext";
import Settings from "./Settings";
import { twMerge } from "tailwind-merge";

export default function LoginPage() {
    const [register, setRegister] = useState(false);

    return register ? (
        <>
            <br />
            <Register />
            <br />
            <a className="text-cyan-900 cursor-pointer" onClick={() => setRegister(!register)}>
                Already have an account? Click here to login.
            </a>
        </>
    ) : (
        <>
            <br />
            <Login />
            <br />
            <a className="text-cyan-900 cursor-pointer" onClick={() => setRegister(!register)}>
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

function Login() {
    const { login } = useContext(AuthContext);
    return (
        <>
            <h1>Login</h1>
            <br />
            <form onSubmit={(e) => login(e)} className="grid grid-flow-row gap-1">
                <input
                    className={twMerge(CSSclasses.search.base, "pl-2")}
                    style={{
                        boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -2px 0px #0AA4C2",
                    }}
                    placeholder="Username"
                    type="text"
                    name="username"
                    id="username"
                />
                <input
                    className={twMerge(CSSclasses.search.base, "pl-2")}
                    style={{
                        boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -2px 0px #0AA4C2",
                    }}
                    placeholder="Password"
                    type="password"
                    name="password"
                    id="password"
                />
                <button className="btn-darker" type="submit">
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
                <input
                    className={twMerge(CSSclasses.search.base, "pl-2")}
                    style={{
                        boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -2px 0px #0AA4C2",
                    }}
                    placeholder="Username"
                    type="text"
                    name="username"
                    id="username"
                />
                <input
                    className={twMerge(CSSclasses.search.base, "pl-2")}
                    style={{
                        boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -2px 0px #0AA4C2",
                    }}
                    placeholder="Email"
                    type="email"
                    name="email"
                    id="email"
                />
                <input
                    className={twMerge(CSSclasses.search.base, "pl-2")}
                    style={{
                        boxShadow: "inset 0px 2px 0px rgba(0,0,0,0.25), inset 0px -2px 0px #0AA4C2",
                    }}
                    placeholder="Password"
                    type="password"
                    name="password"
                    id="password"
                />
                <button className="btn-darker" type="submit">
                    Register
                </button>
            </form>
        </>
    );
}
