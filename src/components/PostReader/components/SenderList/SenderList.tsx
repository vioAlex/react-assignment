import Sender from "../Sender/Sender";
import { SenderListProps } from "../../PostReader";
import React from "react";
import { Sort, VMSender } from "../../PostsReader.service";
import { withSort } from "../../common/common";

export interface SenderProps {
    id: string;
    name: string;
    postCount: number;
}

function sendersCompare(senderA: VMSender, senderB: VMSender, direction: Sort) {
    if (senderA.name === senderB.name) return 0;
    return (senderA.name > senderB.name ? 1 : -1) * (direction === Sort.ASC ? 1 : -1);
}

function SenderList({list}: SenderListProps) {
    return (
        <div className="sender-list">
            {
                list.length ? list.map((sender) => {
                    let {id, name} = sender;
                    return <Sender key={id}
                                   id={id}
                                   postCount={sender.postCount}
                                   name={name}/>
                }) : <div>No one sender here.</div>
            }
        </div>
    );
}

export default withSort(SenderList, sendersCompare);