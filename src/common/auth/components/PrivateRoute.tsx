import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../auth";
import React from "react";

function PrivateRoute({children, ...rest}: RouteProps) {
    let auth = useAuth();

    return (
        <Route
            {...rest}
            render={
                ({location}) => {
                    return auth.isAuthenticated() ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: {from: location}
                            }}
                        />
                    )
                }
            }
        />
    );
}

export default PrivateRoute;