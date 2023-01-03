import React from "react";

export default function Modal({ open }) {
    if (!open) return null;

    return <div>Modal</div>;
}
