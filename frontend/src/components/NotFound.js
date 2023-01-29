import { faCircle, faLocationPinLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function NotFound() {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center text-3xl sm:text-2xl">
            <div className="relative flex justify-center items-center mb-5">
                <span className="absolute text-9xl opacity-10 font-black -rotate-[70deg] tracking-wide top-10 -left-32">404!</span>
                <FontAwesomeIcon icon={faLocationPinLock} size="7x" className="absolute opacity-30" />
                <FontAwesomeIcon icon={faCircle} size="10x" className="opacity-10 text-blue-500" />
            </div>
            <p>The page you're looking for is lost in the void.</p>
            <p className="text-2xl sm:text-lg">Let's go back to the home page and try again.</p>
        </div>
    );
}
