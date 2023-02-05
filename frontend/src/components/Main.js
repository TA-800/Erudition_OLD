import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import StudyHub from "./StudyHub";
import LoginPage, { Logout } from "./Settings/LoginPage";
import NotFound from "./NotFound";
import Discussions from "./Discussions/Discussions";

// export const url = "https://erudition.up.railway.app/backend/"
export const url = "http://127.0.0.1:8000/backend/";

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
                    {/* Any other page, show 404 */}
                    <Route path="*" element={<NotFound />} />
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
