import { createContext, useEffect, useState } from "react";

const moreContext = createContext();
export default moreContext;

export function MoreProvider({ children }) {
    // All variables to save throughout the children components
    const [quote, setQuote] = useState(() => {
        // Quote saved in localStorage is in string format, so we need to parse it to array
        let quote = JSON.parse(localStorage.getItem("quote"));
        if (quote) return [quote.quote, quote.author];
        else return ["Let me show you what true resolve is.", "Naruto Uzumaki"];
    });

    // Quote example: "Let me show what true resolve is.", "Naruto Uzumaki"
    useEffect(() => {
        // Save quote to localStorage in JSON format
        localStorage.setItem(
            "quote",
            JSON.stringify({
                quote: quote[0],
                author: quote[1],
            })
        );
    }, [quote]);

    let context = {
        quote,
        setQuote,
    };

    return <moreContext.Provider value={context}>{children}</moreContext.Provider>;
}
