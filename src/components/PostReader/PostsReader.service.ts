import * as API from "../../common/vendor-api";
import { useEffect, useState } from "react";
import { useAuth } from "../../common/auth/auth";
import { useParams } from "react-router-dom";

export enum Sort {
    ASC,
    DESC
}

interface ActiveSenderParam {
    idActiveSenderParam: string | undefined;
}

interface AppFilterState {
    activeSender: string;
    senderNameFilter: string;
    postBodyFilter: string;
}

export interface VMSender {
    id: string;
    name: string;
    postCount: number;
}

export interface VMPost {
    id: string;
    idSender: string;
    date: number;
    body: string;
}

interface DataMap {
    vmSenders: VMSender[];
    vmPosts: VMPost[];
}


async function fetchPostsData(token: string): Promise<API.Post[]> {
    let result = await API.getPosts(token, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    return result.map((post: API.PostsResponse) => post.data.posts).flat();
}

function mapData(posts: API.Post[]): DataMap {
    let idSenders: string[] = [];

    return posts.reduce((acc: DataMap, post: API.Post): DataMap => {
        if (-1 === idSenders.indexOf(post.from_id)) {
            acc.vmSenders.push({
                id: post.from_id,
                name: post.from_name,
                postCount: 0
            });

            idSenders.push(post.from_id);
        }

        acc.vmPosts.push({
            id: post.id,
            idSender: post.from_id,
            date: Date.parse(post.created_time),
            body: post.message
        });

        return acc;
    }, {
        vmSenders: [],
        vmPosts: []
    });
}

function selectSendersByFilter(senders: VMSender[], senderNameFilter: string) {
    return senders.filter((sender) => {
        return -1 !== sender.name.toLowerCase().indexOf(senderNameFilter.toLowerCase());
    });
}

function selectSenderPosts(posts: VMPost[], idSender: string) {
    return posts.filter((post) => {
        return idSender === post.idSender;
    });
}

function selectSenderPostsByFilter(posts: VMPost[], idSenders: string[], postBodyFilter: string) {
    return idSenders.reduce((acc: VMPost[], idSender: string): VMPost[] => {
        return acc.concat(
            selectSenderPosts(posts, idSender).filter(
                (post: VMPost) => -1 !== post.body.toLowerCase().indexOf(postBodyFilter.toLowerCase())
            )
        );
    }, []);
}

function selectSenderPostsCount(posts: VMPost[], idSender: string) {
    return posts.filter(post => idSender === post.idSender).length
}

const getData = (function () {
    let mapping: DataMap;
    let _token: string;

    async function _mapData(token: string) {
        if (_token === token) {
            return mapping;
        } else {
            _token = token;
            return mapping = mapData(await fetchPostsData(token));
        }
    }

    return async function (
        token: string, filter: AppFilterState
    ): Promise<DataMap> {
        mapping = await _mapData(token);

        const {vmSenders, vmPosts} = await mapping;

        let senders = selectSendersByFilter(vmSenders, filter.senderNameFilter);
        let posts: VMPost[];

        let idSenders = senders.map(sender => sender.id);
        let filteredSenderPosts = selectSenderPostsByFilter(vmPosts, idSenders, filter.postBodyFilter);

        senders = senders.map((sender) => {
            return {
                ...sender,
                postCount: selectSenderPostsCount(filteredSenderPosts, sender.id)
            };
        });

        posts = Boolean(filter.activeSender) && (0 === filter.senderNameFilter.length || idSenders.includes(filter.activeSender)) ?
            selectSenderPosts(filteredSenderPosts, filter.activeSender) :
            filteredSenderPosts;

        return {vmSenders: senders, vmPosts: posts};
    };
})();

const initialState: DataMap = {
    vmSenders: [],
    vmPosts: []
};

const initialFilterState: AppFilterState = {
    activeSender: '',
    senderNameFilter: '',
    postBodyFilter: ''
}


interface DataProviderService {
    token: string;

    filter: AppFilterState,
    getData: () => Promise<DataMap>,

    setFilterValue: (type: keyof AppFilterState, value: string) => DataProviderService,

    setData: (map: DataMap) => void;
    dispatch: (type: keyof AppFilterState, value: string) => void;
}

const dataProviderService: DataProviderService = {
    token: '',
    filter: initialFilterState,
    setData: () => void 0,
    dispatch: () => void 0,
    setFilterValue(type, value) {
        dataProviderService.filter = {
            ...dataProviderService.filter,
            [type]: value
        };
        return dataProviderService;
    },
    async getData() {
        try {
            return await getData(dataProviderService.token, dataProviderService.filter);
        } catch (error) {
            return {vmSenders: [], vmPosts: []}
        }
    },
};

function usePostsData(): {
    data: DataMap;
    dispatch: (filter: keyof AppFilterState, value: string) => void
} {
    let {user, isAuthorized, signIn} = useAuth();
    const [data, setData] = useState(initialState);
    const params = useParams<ActiveSenderParam>();
    const activeSender = params.idActiveSenderParam || '';

    dataProviderService.token = user.token.value;
    dataProviderService.dispatch = dispatch;

    useEffect(() => {
        if ('undefined' !== typeof activeSender) {
            dataProviderService.dispatch('activeSender', activeSender);
        }
    }, [activeSender]);

    function setFilterValue(filter: keyof AppFilterState, value: string) {
        dataProviderService.setFilterValue(filter, value).getData().then(setData);
    }

    function dispatch(filter: keyof AppFilterState, value: string) {
        if (!isAuthorized()) {
            signIn(user).then(() => {
                setFilterValue(filter, value)
            });
            return;
        }

        setFilterValue(filter, value);
    }

    return {
        data: data,
        dispatch
    };
}

export {
    usePostsData
};