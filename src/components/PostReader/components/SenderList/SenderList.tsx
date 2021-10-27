import Sender from "../Sender/Sender";
import { SenderListProps } from "../../PostReader";
import React, { useEffect, useState } from "react";
import { ActiveSenderParam, Sort, VMSender } from "../../PostsReader.service";
import { withSort, WithSortProp } from "../../common/common";
import { useParams } from "react-router-dom";

export interface SenderProps {
    id: string;
    name: string;
    postCount: number;
    active: boolean;
    onSelect: (id: string) => void
}

function sendersCompare(senderA: VMSender, senderB: VMSender, direction: Sort) {
    if (senderA.name === senderB.name) return 0;
    return (senderA.name > senderB.name ? 1 : -1) * (direction === Sort.ASC ? 1 : -1);
}

function SenderList({ list, onSelect }: SenderListProps) {
    const [idActiveSender, setIdActiveSender] = useState('');
    const params = useParams<ActiveSenderParam>();
    const idActiveSenderParam = params.idActiveSenderParam || '';

    useEffect(() => {
        setIdActiveSender(idActiveSenderParam);
    }, [idActiveSenderParam]);

    function onSenderSelect(id: string) {
        setIdActiveSender(id);
        onSelect(id);
    }

    return (
        <div className="sender-list">
            {
                list.length ? list.map((sender) => {
                    let {id, name, postCount} = sender;
                    return <Sender key={id}
                                   id={id}
                                   active={id === idActiveSender}
                                   postCount={postCount}
                                   name={name}
                                   onSelect={onSenderSelect}/>
                }) : <div>No one sender here.</div>
            }
        </div>
    );
}

export default withSort<WithSortProp & SenderListProps>(SenderList, sendersCompare);