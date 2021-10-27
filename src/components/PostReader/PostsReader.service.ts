import * as API from "../../common/vendor-api";
import { useEffect, useState } from "react";
import { useAuth } from "../../common/auth/auth";

export enum Sort {
    ASC,
    DESC
}

export interface ActiveSenderParam {
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

interface SetFilterValue {
    (filter: AppFilterState | keyof AppFilterState, value?: string): DataProviderService;
}

interface DataProviderService {
    token: string;
    init: boolean;

    filter: AppFilterState,
    getData: () => Promise<DataMap>,

    setFilterValue: SetFilterValue,

    setData: (map: DataMap) => void;
    dispatch: SetFilterValue;
}

const dataProviderService: DataProviderService = {
    token: '',
    init: false,
    filter: initialFilterState,
    setData: () => void 0,
    dispatch: () => dataProviderService,
    setFilterValue(filter, value?) {

        if ('string' === typeof filter) {
            dataProviderService.filter = {
                ...dataProviderService.filter,
                [filter]: value
            };
        } else {
            dataProviderService.filter = filter;
        }

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
    dispatch: SetFilterValue
} {
    let {user, isAuthorized, signIn} = useAuth();
    const [data, setData] = useState<DataMap>(initialState);

    const setFilterValue: SetFilterValue = (filter, value?) => {
        dataProviderService.setFilterValue(filter, value).getData().then(setData);
        return dataProviderService;
    }

    const dispatch: SetFilterValue = (filter, value?) => {
        if (!isAuthorized()) {
            signIn(user).then(() => {
                setFilterValue(filter, value)
            });

            return dataProviderService;
        }

        setFilterValue(filter, value);
        return dataProviderService;
    }

    dataProviderService.token = user.token.value;
    dataProviderService.dispatch = dispatch;

    useEffect(() => {
        if (!dataProviderService.init) {
            dataProviderService.dispatch(dataProviderService.filter);
            dataProviderService.init = true;
        }
        console.log('init');
    }, []);

    return {
        data: data,
        dispatch
    };
}

export {
    usePostsData
};