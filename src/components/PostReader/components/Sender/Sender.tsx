import './Sender.css';
import { SenderProps } from '../SenderList/SenderList';

function Sender({id, name, postCount, active, onSelect}: SenderProps) {
    return (
        <div className={active ? 'sender selected' : 'sender'}
             title={name}
             data-post-count={postCount}>
            <div tabIndex={0} onKeyPress={(e) => {
                e.preventDefault();
                (e.code === 'Space' || e.code === 'Enter') && onSelect(id);
            }} onClick={() => {onSelect(id)}}>
                {name}
            </div>
        </div>
    );
}

export default Sender;