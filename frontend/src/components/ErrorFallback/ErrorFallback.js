import { faCircle, faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function ErrorFallback() {
    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center text-3xl sm:text-2xl">
            <div className="flex justify-center items-center mb-5">
                <FontAwesomeIcon icon={faCode} size="7x" className="absolute opacity-30" />
                <FontAwesomeIcon icon={faCircle} size="10x" className="opacity-10 text-blue-500" />
            </div>
            <p>Sorry, something went wrong!</p>
            <p>Please refresh and try again.</p>
        </div>
    );
}

export default ErrorFallback;
