import { AuthContext, useProvideAuth } from "../auth";
import React from "react";

function ProvideAuth({children}: { children: React.ReactChild }) {
    const auth = useProvideAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export default ProvideAuth;