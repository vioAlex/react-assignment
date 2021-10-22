import { createContext, useContext, useState } from "react";
import * as API from "../vendor-api";

export interface UserLoginCredentials {
    name: string,
    email: string
}

interface AuthService {
    signIn: (credential: UserLoginCredentials) => Promise<TokenValue>;
    signOut: () => void;
    isExpiredToken: (token: TokenValue) => boolean;
}

export interface TokenValue {
    value: string;
    expired: number;
}

interface User {
    name: string;
    email: string;
    token: TokenValue;
}

interface AuthProvider {
    user: User;
    isAuthorized: () => boolean,
    isAuthenticated: () => boolean,
    signIn: (credentials: UserLoginCredentials) => Promise<void>;
    signOut: () => void;
}

export interface LocationType {
    from: { pathname: string };
}

const tokenLifetime = 60 * 60 * 1000;
const localStorageUserItemName = 'user';
const defaultUserState: User = {name: '', email: '', token: {value: '', expired: 0}};

const authService: AuthService = (function () {

    let request: Promise<string> | undefined;

    async function getSlToken(name: string, email: string): Promise<string> {
        return (await API.getRegisterToken(name, email)).data.sl_token
    }

    async function signIn(credentials: UserLoginCredentials): Promise<TokenValue> {
        request = request || getSlToken(credentials.name, credentials.email);

        request.finally(() => {
            setTimeout(() => {
                request = void 0;
            }, tokenLifetime / 2);
        });

        return {
            value: await request,
            expired: Date.now() + tokenLifetime
        };
    }

    function isExpiredToken(token: TokenValue) {
        return token.expired < Date.now()
    }

    return {
        signIn,
        signOut() {
            console.log(' sign out ')
        },
        isExpiredToken
    };
})();

function getCurrentUserState(): User {
    const localStorageValue = JSON.parse(localStorage.getItem(localStorageUserItemName) || 'null');

    if (null === localStorageValue) {
        return defaultUserState;
    }

    if (authService.isExpiredToken(localStorageValue.token)) {
        return {
            ...localStorageValue,
            token: defaultUserState.token
        }
    }

    return localStorageValue;
}

const AuthContext = createContext<AuthProvider>({
    user: defaultUserState,
    isAuthorized: () => false,
    isAuthenticated: () => false,
    signIn: () => Promise.resolve(),
    signOut: () => {
    }
});

function useProvideAuth(): AuthProvider {
    let auth: AuthService = authService;
    const [user, setUser] = useState<User>(getCurrentUserState());

    async function signIn(credential: UserLoginCredentials) {
        let tokenValue = await auth.signIn(credential);

        let user: User = {
            name: credential.name,
            email: credential.email,
            token: tokenValue
        };

        localStorage.setItem(localStorageUserItemName, JSON.stringify(user));
        setUser(user);
    }

    function signOut() {
        let userState: User = {
            ...user,
            token: {
                value: '',
                expired: 0
            }
        };

        localStorage.setItem(localStorageUserItemName, JSON.stringify(userState));
        auth.signOut();
        setUser(userState);
    }

    function isAuthorized() {
        return !auth.isExpiredToken(user.token);
    }

    function isAuthenticated() {
        return !!user.name && !!user.email;
    }

    return {
        user,
        isAuthorized,
        isAuthenticated,
        signIn,
        signOut
    };
}

function useAuth() {
    return useContext(AuthContext);
}

export {
    AuthContext,
    useProvideAuth,
    useAuth
};

export { default as PrivateRoute } from "./components/PrivateRoute";
export { default as ProvideAuth } from "./components/ProvideAuth";