import React from "react";
import { PageButtonsProps } from "../PostList/PostList";

function PageButtons({pageCount, activePage, onNavigate}: PageButtonsProps) {
    return (
        <>
            {
                Array.from({length: pageCount}).map((e, pageIndex: number) => {
                    return (
                        <button key={pageIndex}
                                className={`posts-list-button${pageIndex === activePage - 1 ? ' active' : ''}`}
                                onClick={() => onNavigate(pageIndex + 1)}>{pageIndex + 1}</button>
                    );
                })
            }
        </>
    )
}

export default PageButtons;