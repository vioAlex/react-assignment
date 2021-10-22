import './SortButtons.css';
import { Sort } from "../../PostsReader.service";
import { SortButtonProps } from "../../PostReader";

function SortButtons({direction, onSelect}: SortButtonProps) {

    function makeOnSortDirectionChange(direction: Sort) {
        return () => {
            onSelect(direction);
        };
    }

    return (
        <>
            <button name="sort-descending"
                    className={`posts-list-button${direction === Sort.DESC ? ' active' : ''}`}
                    title={"Sort posts by date: descending"}
                    onClick={makeOnSortDirectionChange(Sort.DESC)}>&darr;</button>

            <button name="sort-ascending"
                    className={`posts-list-button${direction === Sort.ASC ? ' active' : ''}`}
                    title={"Sort posts by date: ascending"}
                    onClick={makeOnSortDirectionChange(Sort.ASC)}>&uarr;</button>
        </>
    )
}

export default SortButtons;