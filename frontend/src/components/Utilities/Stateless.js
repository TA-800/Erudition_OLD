import { faBook, faCalendarWeek, faGamepad, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Stateless({ contents }) {
    return (
        <div className="bg-zinc-600 opacity-50 my-4 gap-2 flex flex-col justify-center items-center p-9">
            <FontAwesomeIcon
                icon={
                    contents.includes("assignments")
                        ? faPencil
                        : contents.includes("section")
                        ? faGamepad
                        : contents.includes("week")
                        ? faCalendarWeek
                        : faBook
                }
                size="10x"
            />
            <p className="text-lg sm:text-base">{contents}</p>
        </div>
    );
}
