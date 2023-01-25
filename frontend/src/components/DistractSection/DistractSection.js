import React, { useEffect, useState } from "react";
import randomWords from "random-words";
import { twMerge } from "tailwind-merge";
import { CSSclasses } from "../StudyHub";
import Stateless from "../Utilities/Stateless";

export default function DistractSection() {
    const [content, setContent] = useState("");

    return (
        <article className="distract">
            {/* Left panel */}
            <div className="lp">
                <p className="lp__title">Respite</p>
                <ul className="lp__list">
                    {["Games", "Trivia", "Of The Day"].map((element) => (
                        <li
                            key={element}
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
                    {content === "Games" ? (
                        <Games />
                    ) : content === "Trivia" ? (
                        <Trivia />
                    ) : content === "Of The Day" ? (
                        <OfTheDay />
                    ) : (
                        <Stateless contents="Select a section to check out" />
                    )}
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
                <div className="grid gap-1 sm:gap-y-2 grid-cols-[repeat(13,minmax(0,1fr))] sm:grid-cols-10">
                    {"abcdefghijklmnopqrstuvwxyz".split("").map((letter) => {
                        return (
                            <button
                                key={letter}
                                className={
                                    "btn-dark flex justify-center items-center" + (guessed.includes(letter) ? " disabled" : "")
                                }
                                onClick={(e) => onLetterClick(e)}
                                disabled={guessed.includes(letter) || typeof wrong !== "number"}>
                                {letter.toUpperCase()}
                            </button>
                        );
                    })}
                </div>
                <div className="grid grid-cols-2 gap-x-2">
                    <button className="btn-darker" onClick={reset}>
                        NEW
                    </button>
                    <button
                        className={"btn-darker" + (typeof wrong !== "number" ? " disabled" : "")}
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
                        <button
                            key={game}
                            className={twMerge(CSSclasses.add.base, "min-w-fit py-2 px-4 sm:px-2 after:content-['']")}>
                            {game}
                        </button>
                    );
                })}
            </div>
            <Hangman />
        </>
    );
}

function Trivia() {
    return <div>DID YOU KNOW THAT??</div>;
}

function OfTheDay() {
    const [option, setOption] = useState("Word");

    function Quote() {
        const [quote, setQuote] = useState("");

        useEffect(() => {
            fetch("https://quotes.rest/qod?language=en", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            })
                .then((res) => {
                    if (res.status !== 200) throw new Error("Error, try refreshing");
                    return res.json();
                })
                .then((data) => setQuote(data.contents.quotes[0].quote + "~" + data.contents.quotes[0].author))
                .catch((err) => setQuote(err));
        }, []);

        return (
            <div className="flex flex-col">
                {quote === ""
                    ? "Just a moment"
                    : quote.split("~").map((text, index) => (
                          <p key={index} className={index === 0 ? "text-2xl font-semibold" : "italic ml-auto"}>
                              {text}
                          </p>
                      ))}
            </div>
        );
    }
    function Word() {
        return <>Word OF THE DAY</>;
    }
    function Joke() {
        return <>Joke OF THE DAY</>;
    }

    return (
        <>
            <div className="flex flex-row justify-around my-2">
                {["Word", "Quote", "Joke"].map((element) => {
                    return (
                        <button
                            key={element}
                            className={twMerge(CSSclasses.add.base, "min-w-fit py-2 px-4 sm:px-2 after:content-['']")}
                            onClick={() => setOption(element)}>
                            {element}
                        </button>
                    );
                })}
            </div>
            <div className="bg-cyan-800 text-cyan-100 p-2">
                {option === "Word" ? <Word /> : option === "Quote" ? <Quote /> : <Joke />}
            </div>
        </>
    );
}
