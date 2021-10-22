import Post from "../Post/Post";
import React from "react";
import { ListItems } from "../PostList/PostList";

function PostsPage({list}: { list: ListItems }) {
    return (
        <>
            {
                list.map((post) => {
                    let {id, date, body} = post;
                    return <Post key={id} date={date} body={body}/>
                })
            }
        </>
    )
}

export default PostsPage;