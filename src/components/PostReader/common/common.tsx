import React from "react";
import { Sort } from "../PostsReader.service";
import { ListProps } from "../PostReader";

export interface WithSortProp extends ListProps {
    direction: Sort;
}

interface SortFunction {
    (a: any, b: any, direction: Sort): number
}

export function withSort<T extends WithSortProp = WithSortProp>(WrappedComponent: React.ComponentType<T>, sortFunction: SortFunction) {
    const displayName =
        WrappedComponent.displayName || WrappedComponent.name || "Component";

    const ListWithSort = ({direction, ...props}: T) => {
        let _props = {
            ...props,
            list: props.list.sort((a, b) => sortFunction(a, b, direction))
        };
        return <WrappedComponent {...(_props as T)} />;
    }

    ListWithSort.displayName = `withSort(${displayName})`;
    return ListWithSort;
}