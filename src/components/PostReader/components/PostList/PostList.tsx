import { PostListProps } from "../../PostReader";
import { Sort, VMPost } from "../../PostsReader.service";
import React, { useEffect, useState } from "react";
import { withSort, WithSortProp } from "../../common/common";
import PageButtons from "../PageButtons/PageButtons";
import PostsPage from "../PostsPage/PostsPage";

export interface PostProps {
    date: number;
    body: string;
}

export interface PageButtonsProps {
    activePage: number;
    pageCount: number;
    onNavigate: (page: number) => void;
}

export type ListItems = PostListProps['list'];

function postsDateCreationCompare(postA: VMPost, postB: VMPost, direction: Sort) {
    let diff = postA.date - postB.date;

    if (direction === Sort.ASC) {
        return diff;
    } else {
        return diff * -1;
    }
}

export function PostList({list, pageCount, onChangePage}: PostListProps) {
    let [currentPage, setCurrentPage] = useState(1);

    function setPage(page: number) {
        onChangePage(page);
        setCurrentPage(page);
    }

    useEffect(() => {
        if (currentPage > pageCount) {
            setCurrentPage(1);
        }
    }, [currentPage, pageCount]);

    return (
        <div className="post-list">
            <div className="post-page">
                <PostsPage list={list}/>
            </div>
            <div className="page-buttons">
                <PageButtons pageCount={pageCount} activePage={currentPage} onNavigate={setPage}/>
            </div>
        </div>
    );
}

export default withSort<WithSortProp & PostListProps>(PostList, postsDateCreationCompare);