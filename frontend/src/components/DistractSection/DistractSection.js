import React, { useState } from "react";
import randomWords from "random-words";
import { twMerge } from "tailwind-merge";
import { CSSclasses } from "../StudyHub";

export default function DistractSection() {
    const [content, setContent] = useState("Games");

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
                                setContent(element);
                            }}>
                            {element}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right panel */}
            <div className="rp">
                <div className="rp__content">
                    {content === "Games" ? <Games /> : content === "Did You Know" ? <DidYouKnow /> : <OfTheDay />}
                </div>
            </div>
        </article>
    );
}

function Games() {
    function Hangman() {
        const [word, setWord] = useState(
            randomWords({
                exactly: 1,
                minLength: 6,
                maxLength: 10,
            })[0]
        );
        let hint = word[Math.floor(Math.random() * word.length)];
        const [informed, setInformed] = useState(word.split("").map((letter) => (letter === hint ? letter : "_")));
        const [guessed, setGuessed] = useState([hint]);
        const [wrong, setWrong] = useState(0);
        const maxWrong = 6;

        function onLetterClick(e) {
            const guessedLetter = e.currentTarget.textContent.toLowerCase();
            if (word.includes(guessedLetter)) {
                const string = word.split("").map((letter) => ([...guessed, guessedLetter].includes(letter) ? letter : "_"));
                if (!string.includes("_")) endGame("v");
                setInformed(string);
            } else {
                setWrong(wrong + 1);
                if (wrong + 1 === maxWrong) {
                    endGame("d");
                }
            }
            setGuessed([...guessed, guessedLetter]);
        }

        function reset() {
            const newWord = randomWords({
                exactly: 1,
                minLength: 6,
                maxLength: 10,
            })[0];
            hint = newWord[Math.floor(Math.random() * newWord.length)];
            setWord(newWord);
            setInformed(newWord.split("").map((letter) => (letter === hint ? letter : "_")));
            setGuessed([hint]);
            setWrong(0);
        }

        function endGame(outcome) {
            setWrong(outcome === "v" ? "Victory!" : "Defeat! Word: " + word);
        }

        function reveal(e) {
            endGame("d");
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
                                    "btn-dark flex justify-center items-center p-1" +
                                    (guessed.includes(letter) ? " disabled" : "")
                                }
                                onClick={(e) => onLetterClick(e)}
                                disabled={guessed.includes(letter) || typeof wrong !== "number"}>
                                {letter.toUpperCase()}
                            </button>
                        );
                    })}
                </div>
                <div className="grid grid-cols-2 gap-x-2">
                    <button
                        className="btn-dark mt-2 h-8 tracking-wider font-bold active:relative active:top-[2px]"
                        onClick={reset}>
                        NEW
                    </button>
                    <button
                        className={
                            "btn-dark mt-2 h-8 tracking-wider font-bold active:relative active:top-[2px]" +
                            (typeof wrong !== "number" ? " disabled" : "")
                        }
                        onClick={reveal}
                        disabled={typeof wrong !== "number"}>
                        REVEAL
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-row justify-around my-2">
                {["Hangman", "TicTacToe", "Snake"].map((game) => {
                    return (
                        <button className={twMerge(CSSclasses.add.base, "min-w-fit py-2 px-4 sm:px-2 after:content-['']")}>
                            {game}
                        </button>
                    );
                })}
            </div>
            <Hangman />
        </>
    );
}

function DidYouKnow() {
    return <div>DID YOU KNOW THAT??</div>;
}

function OfTheDay() {
    return <div>OF THE DAY</div>;
}
