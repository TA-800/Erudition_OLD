import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Discussions() {
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
        </>
    );
}
