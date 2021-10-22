import './Filter.css';
import { FilterProps } from "../../PostReader";
import { ChangeEvent } from "react";

function debounce<T extends Function>(fn: T, wait: number = 0) {
    let timeout: any;
    return function (...args: any) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, wait);
    };
}

function Filter(props: FilterProps) {
    function onFilterChange(e: ChangeEvent<HTMLInputElement>) {
        props.onChange(e.target.value);
    }

    return (
        <input type="text"
               className="filter-field"
               placeholder="Search"
               autoComplete={'off'}
               {...props}
               onChange={debounce(onFilterChange)}/>
    );
}

export default Filter;