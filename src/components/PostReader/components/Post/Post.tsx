import './Post.css';
import { PostProps } from "../PostList/PostList";

function formatDate(date: number) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        hour12: false,
        month: 'long', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric'
    }).format(date);
}

function Post({date, body}: PostProps) {
    return (
        <div className="post">
            <div className="post-date">{formatDate(date)}</div>
            <div className="post-body">{body}</div>
        </div>
    );
}

export default Post;