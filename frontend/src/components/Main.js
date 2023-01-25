import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import StudyHub from "./StudyHub";
import LoginPage, { Logout } from "./Settings/LoginPage";
import Discussions from "./Discussions/Discussions";

export default function Main() {
    return (
        <main>
            <Routes>
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoutes />}>
                    <Route path="/" element={<Navigate to="/studyhub" />} />
                    <Route path="/studyhub" element={<StudyHub />} />
                    <Route path="/discussions" element={<Discussions />} />
                    <Route path="/settings" element={<Logout />} />
                </Route>

                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </main>
    );
}

function ProtectedRoutes() {
    const { user } = useContext(AuthContext);

    return user !== null ? <Outlet /> : <Navigate to="/login" />;
}
