import {
    faClock,
    faComment,
    faCommentDots,
    faICursor,
    faMousePointer,
    faPerson,
    faSign,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-1">
            {/* Nice looking landing page keeping in theme of the website */}
            <div className="col-span-2 sm:col-span-1 mb-5">
                <Division
                    title="Looking for an easy, hassle-free way to organize notes and tasks?"
                    information="Well, you've come to the right place! Erudition is a platform for students where they can put together all
                    important study material and information in one neatly-organized place. It is a place where students can
                    discuss their doubts and help each other out. Also a place to play some mini-games and relax!"
                    isTitle
                />
            </div>
            <Division
                title="Easy to use"
                information="Easily navigate and quickly create stylized notes or assignments."
                icon={faClock}
            />
            <Division
                title="Discuss with friends"
                information="Know how others are doing by chatting with them in the discussions page."
                icon={faCommentDots}
            />
            <Division
                title="Personalize profiles"
                information="Add a picture to your profile and other information about yourself."
                icon={faPerson}
            />
            <Division
                title="Get started!"
                information="Get started by creating an account and logging in."
                isLogin
                icon={faMousePointer}
            />
        </div>
    );
}

function Division({ title, information, isTitle, isLogin, icon }) {
    const navigate = useNavigate();

    return (
        <div
            className={
                "relative flex flex-col justify-center gap-2 p-2 select-none " +
                (isTitle
                    ? ""
                    : "h-96 items-center border-2 border-zinc-500 border-opacity-50 hover:bg-zinc-500 hover:bg-opacity-5")
            }>
            {/* If orientation is right, make the title right-ended. If left, do nothing (or stick to defaults) */}
            <p className={isTitle ? "text-7xl mdc:text-5xl font-black mt-4" : "text-5xl mdc:text-3xl font-bold text-center"}>
                {title}
            </p>
            <p className={"info-text max-w-none" + (!isTitle ? " text-center" : "")}>{information}</p>
            {isLogin && (
                <button className="btn-light z-10" onClick={() => navigate("/login")}>
                    Click here to sign up.
                </button>
            )}
            {!isTitle && (
                <div className="absolute text-3xl md:text-2xl sm:text-xl opacity-10 z-0">
                    <FontAwesomeIcon icon={icon} size="10x" />
                </div>
            )}
        </div>
    );
}
