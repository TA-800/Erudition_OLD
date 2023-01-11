import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { CSSclasses } from "../StudyHub";

export default function DistractSection() {
    return (
        <article className="distract">
            {/* Left panel */}
            <div className="lp">
                <p className="lp__title">Respite</p>
                <ul className="lp__list">
                    <li
                        className={twMerge(CSSclasses.courseButton.base, "flex flex-row justify-center items-center gap-3")}
                        onClick={(e) => {
                            e.currentTarget.parentNode.childNodes.forEach((child) => {
                                child.className = CSSclasses.courseButton.base;
                            });
                            e.currentTarget.className = twMerge(CSSclasses.courseButton.base, CSSclasses.courseButton.active);
                        }}>
                        Games
                    </li>
                    <li
                        className={twMerge(CSSclasses.courseButton.base, "flex flex-row justify-center items-center gap-3")}
                        onClick={(e) => {
                            e.currentTarget.parentNode.childNodes.forEach((child) => {
                                child.className = CSSclasses.courseButton.base;
                            });
                            e.currentTarget.className = twMerge(CSSclasses.courseButton.base, CSSclasses.courseButton.active);
                        }}>
                        Of the Day's
                    </li>
                    <li
                        className={twMerge(CSSclasses.courseButton.base, "flex flex-row justify-center items-center gap-3")}
                        onClick={(e) => {
                            e.currentTarget.parentNode.childNodes.forEach((child) => {
                                child.className = CSSclasses.courseButton.base;
                            });
                            e.currentTarget.className = twMerge(CSSclasses.courseButton.base, CSSclasses.courseButton.active);
                        }}>
                        Did you know?
                    </li>
                </ul>
            </div>

            {/* Right panel */}
            <div className="rp">
                <div className="rp__content">
                    <Hangman />
                </div>
            </div>
        </article>
    );
}

function Hangman() {
    const [word, setWord] = useState("hi");
    const [informed, setInformed] = useState(() => word.split("").map((letter) => "_"));
    const [guessed, setGuessed] = useState([]);
    const [wrong, setWrong] = useState(0);
    const maxWrong = 6;

    function onLetterClick(e) {
        const guessedLetter = e.currentTarget.textContent.toLowerCase();
        if (word.includes(guessedLetter)) {
            const string = word.split("").map((letter) => ([...guessed, guessedLetter].includes(letter) ? letter : "_"));
            if (!string.includes("_")) setWrong("Victory!");
            setInformed(string);
        } else {
            setWrong(wrong + 1);
            if (wrong + 1 === maxWrong) {
                setWrong("Defeat! Word : " + word);
            }
        }
        setGuessed([...guessed, guessedLetter]);
    }

    function reset() {
        setWord("quadrilateral");
        setInformed(word.split("").map((letter) => "_"));
        setGuessed([]);
        setWrong(0);
    }

    return (
        <div className="flex flex-col p-2 gap-y-2">
            <div className="flex flex-row text-cyan-100 text-2xl">
                <strong>{informed.join(" ")}</strong>
                <span className="ml-auto">
                    {wrong}
                    {typeof wrong === "number" ? `\\${maxWrong}` : ""}
                </span>
            </div>
            <div className="grid gap-1 grid-rows-2 grid-flow-col">
                {"abcdefghijklmnopqrstuvwxyz".split("").map((letter) => {
                    return (
                        <button
                            key={letter}
                            className={
                                "btn-dark flex justify-center items-center w-full h-full" +
                                (guessed.includes(letter) ? " disabled" : "")
                            }
                            onClick={(e) => onLetterClick(e)}
                            disabled={guessed.includes(letter)}>
                            {letter.toUpperCase()}
                        </button>
                    );
                })}
            </div>
            <button className="btn-dark mt-2 h-8" onClick={reset}>
                RESET
            </button>
        </div>
    );
}
