import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    return (
        <div className="flex flex-col gap-32">
            {/* Nice looking landing page keeping in theme of the website */}
            <Division
                title="Looking for an easy, hassle-free way to organize notes and tasks?"
                information="Well, you've come to the right place! Erudition is a platform for students where they can put together all
                    important study material and information in one neatly-organized place. It is a place where students can
                    discuss their doubts and help each other out. Also a place to relax!"
                isTitle
            />

            <Division title="Easy to use" information="Easy to use, navigate, and create stylized notes or assignments." />
            <Division
                title="Discuss with friends"
                information="Know how others are doing by chatting with them in the discussions page."
            />
            <Division
                title="Personalize profiles"
                information="Add a picture to your profile and other information about yourself."
            />
            <Division title="Get started!" information="Get started by creating an account and logging in." isLogin />
        </div>
    );
}

function Division({ title, information, isTitle, isLogin }) {
    const navigate = useNavigate();

    return (
        <div className={"flex flex-col gap-2 " + (isTitle ? "" : "items-center")}>
            {/* If orientation is right, make the title right-ended. If left, do nothing (or stick to defaults) */}
            <p className={isTitle ? "text-7xl mdc:text-5xl font-black mt-20 mdc:mt-5" : "text-5xl mdc:text-3xl font-bold"}>
                {title}
            </p>
            <p className="info-text">{information}</p>
            {isLogin && (
                <button className="btn-light" onClick={() => navigate("/login")}>
                    Click here to sign up.
                </button>
            )}
        </div>
    );
}
