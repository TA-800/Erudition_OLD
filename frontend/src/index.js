import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <HashRouter hashType="hashbang">
            <AuthProvider>
                <App />
            </AuthProvider>
        </HashRouter>
    </React.StrictMode>
);
