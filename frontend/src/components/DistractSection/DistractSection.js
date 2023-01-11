import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
                    {["Games", "Did You Know", "Of The Day"].map((element) => (
                        <li
                            className={twMerge(CSSclasses.courseButton.base, "flex flex-row justify-center items-center gap-3")}
                            onClick={(e) => {
                                e.currentTarget.parentNode.childNodes.forEach((child) => {
                                    child.className = CSSclasses.courseButton.base;
                                });
                                e.currentTarget.className = twMerge(CSSclasses.courseButton.base, CSSclasses.courseButton.active);
                            }}>
                            {element}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right panel */}
            <div className="rp">
                <div className="rp__content">
                    <div className="flex flex-row justify-around my-2">
                        {["Hangman", "TicTacToe", "Snake"].map((game) => {
                            return (
                                <button
                                    className={twMerge(CSSclasses.add.base, "min-w-fit py-2 px-4 sm:px-2 after:content-['']")}>
                                    {game}
                                </button>
                            );
                        })}
                    </div>
                    <Hangman />
                </div>
            </div>
        </article>
    );
}

function Hangman() {
    const [word, setWord] = useState("quadrilateral");
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
        <div className="flex flex-col p-2 gap-y-2 bg-cyan-800">
            <div className="flex flex-row mdc:flex-col mdc:gap-y-1 text-cyan-100 text-2xl">
                <strong>{informed.join(" ")}</strong>
                <span className="ml-auto mdc:ml-0">
                    {wrong}
                    {typeof wrong === "number" ? `\\${maxWrong}` : ""}
                </span>
            </div>
            <div className="grid gap-1 sm:gap-y-2 grid-cols-[repeat(13,minmax(0,1fr))]">
                {"abcdefghijklmnopqrstuvwxyz".split("").map((letter) => {
                    return (
                        <button
                            key={letter}
                            className={
                                "btn-dark flex justify-center items-center p-1" + (guessed.includes(letter) ? " disabled" : "")
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
