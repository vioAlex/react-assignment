import './Sender.css';
import { Link, useRouteMatch } from "react-router-dom";
import { SenderProps } from '../SenderList/SenderList';

function Sender({id, name, postCount}: SenderProps) {
    let match = useRouteMatch({
        path: `/${id}`,
        exact: true
    });

    return (
        <div className={match ? 'sender selected' : 'sender'}
             title={name}
             data-post-count={postCount}>
            <Link tabIndex={0} to={`/${id}`}>
                {name}
            </Link>
        </div>
    );
}

export default Sender;