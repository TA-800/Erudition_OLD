import { useContext } from "react";
import AuthContext from "../context/AuthContext";

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
            <h1>Logout</h1>
            <p>Are you sure you would like to logout?</p>
            <button onClick={() => logout()}>Logout</button>
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
                {/* <label htmlFor="password2">Confirm Password</label> */}
                {/* <input type="password" name="password2" id="password2" /> */}
                <button type="submit">Register</button>
            </form>
        </>
    );
}
