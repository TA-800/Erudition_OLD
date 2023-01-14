import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import MegaThread from "./MegaThread";
import MiniThread from "./MiniThread";

export default function Discussions() {
    const [discussions, setDiscussions] = useState([]);
    const [selectedDiscussion, setSelectedDiscussion] = useState({});
    const [search, setSearch] = useState("");
    const [searchedDiscussions, setSearchedDiscussions] = useMemo(() => {
        return discussions.filter((discussion) => discussion.discussion_title.includes(search));
    }, [search, discussions]);
    const [completeThread, setCompleteThread] = useState(false);

    function retrieveThread(id) {
        console.log(id);
        fetch(`http://127.0.0.1:8000/backend/discussions/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((json) => {
                        throw new Error(`${res.status} ${json.detail}`);
                    });
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setSelectedDiscussion(data);
                setCompleteThread(!completeThread);
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        fetch("http://127.0.0.1:8000/backend/discussions/0", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("access"),
            },
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((json) => {
                        throw new Error(`${res.status} ${json.detail}`);
                    });
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setDiscussions([...data]);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <>
            <header className="font-bold">
                <div className="flex flex-row gap-x-2 items-center">
                    <FontAwesomeIcon icon={faComments} />
                    Discussions
                </div>
            </header>
            <p
                className="m-0 text-cyan-800 max-w-2xl
                    mdc:text-sm mdc:max-w-sm">
                Discuss, debate, and develop with your peers.
            </p>
            <hr />
            {/* Threads container */}
            <div>
                {!completeThread &&
                    discussions.map((discussion) => {
                        const allProps = { ...discussion, hoverable: true, retrieveThread: retrieveThread };
                        return (
                            // <div key={discussion.id} onClick={() => retrieveThread(discussion.id)}>
                            <MiniThread key={discussion.id} {...allProps} />
                            // </div>
                        );
                    })}
                {completeThread && <MegaThread selectedDiscussion={selectedDiscussion} retrieveThread={retrieveThread} />}
            </div>
        </>
    );
}
