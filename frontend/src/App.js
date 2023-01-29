import "./App.css";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import ErrorFallback from "./components/ErrorFallback/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";

function App() {
    return (
        <>
            <Navbar />
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Main />
            </ErrorBoundary>
        </>
    );
}

export default App;
