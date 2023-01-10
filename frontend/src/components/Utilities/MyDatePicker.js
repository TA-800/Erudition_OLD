import { enGB } from "date-fns/locale";
import React, { useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";

export default function MyDatePicker({ className, selected, customInput, onChange, showTimeSelect }) {
    useEffect(() => {
        registerLocale("en-GB", enGB);
    }, []);

    if (showTimeSelect) {
        return (
            <DatePicker
                className={className}
                locale="en-GB"
                selected={selected}
                customInput={customInput}
                onChange={onChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                timeCaption="time"
                dateFormat="PPp"
            />
        );
    } else
        return <DatePicker className={className} dateFormat="P" locale="en-GB" customInput={customInput} onChange={onChange} />;
}
