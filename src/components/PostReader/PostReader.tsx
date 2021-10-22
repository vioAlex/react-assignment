import './PostReader.css';
import React, { useState } from "react";
import { Sort, usePostsData, VMPost, VMSender } from "./PostsReader.service";

import SenderList from "./components/SenderList/SenderList";
import PostList from "./components/PostList/PostList";
import SortButtons from "./components/SortButtons/SortButtons";
import Filter from "./components/Filter/Filter";

export interface ListProps {
    list: any[]
}

export interface PostListProps {
    list: VMPost[];
    onChangePage: (page: number) => void;
    pageCount: number;
}

export interface SenderListProps {
    list: VMSender[];
}

export interface SortButtonProps {
    direction: Sort,
    onSelect: (direction: Sort) => void
}

export interface FilterProps {
    name: string;
    onChange: (state: string) => void;
}

const postsPerPage = 100;

function PostReader() {
    const [sortDirection, setSortDirection] = useState(Sort.DESC);

    const {data, dispatch} = usePostsData();
    const {vmSenders, vmPosts} = data;

    const [pageFromTo, setPageFromTo] = useState({
        from: 0, to: 100
    });

    let posts = vmPosts.slice(pageFromTo.from, pageFromTo.to);

    if (0 === posts.length) {
        posts = vmPosts;
    }

    function onSenderFilterChange(filter: string) {
        dispatch('senderNameFilter', filter);
    }

    function onPostsFilterChange(filter: string) {
        dispatch('postBodyFilter', filter);
    }

    function onSort(direction: Sort) {
        setSortDirection(direction);
    }

    function onGetListHandler(page: number) {
        const from = (page - 1) * postsPerPage;
        const to = page * postsPerPage;

        setPageFromTo({
            from, to
        });
    }

    return (
        <div className="post-reader-layout">
            <div className="sender-list-filter-container">
                <Filter name="sender-list-filter-field" onChange={onSenderFilterChange}/>
            </div>
            <div className="post-list-manager-container">
                <div className="posts-list-sorting-buttons">
                    <SortButtons direction={sortDirection} onSelect={onSort}/>
                </div>
                <Filter name="post-list-filter-field" onChange={onPostsFilterChange}/>
            </div>
            <aside className="sender-list-container">
                <SenderList direction={Sort.ASC} list={vmSenders}/>
            </aside>
            <div className="post-list-container">
                {0 < vmPosts.length ? <PostList direction={sortDirection} list={posts}
                                                pageCount={Math.ceil(vmPosts.length / postsPerPage)}
                                                onChangePage={onGetListHandler}/> : 'No one posts here.'}
            </div>
        </div>
    );
}

export default PostReader;