import './Login.css';
import { LocationType, useAuth } from "../../common/auth/auth";
import { useHistory, useLocation } from "react-router-dom";
import React from "react";

function Login() {
    let auth = useAuth();
    let history = useHistory();
    let location = useLocation<LocationType>();
    let user = auth.user;

    let {from} = location.state || {from: {pathname: "/"}};

    function validate() {
        return 42;
    }

    function login(form: HTMLFormElement) {
        const name = form.userName.value;
        const email = form.userEmail.value;

        if (!validate()) return;
        form.submitButton.disabled = true;

        auth.signIn({
            name: name,
            email: email
        }).then(() => {
            history.replace(from);
        }, (error) => {
            form.submitButton.disabled = false;
            console.error('sign in error', error);
        });
    }

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        login(event.currentTarget);
    }

    return (
        <div className="modeless-container">
            <div className="dialog-like">
                <h1 className="dialog-like-title">Login</h1>
                <form action="/" onSubmit={onSubmit}>

                    <label>Name <input type="text" name="userName" defaultValue={user.name} required autoFocus
                                       minLength={1}
                                       autoComplete="off"/></label>
                    <label>Email <input type="email" name="userEmail" defaultValue={user.email} required
                                        autoComplete="off"/></label>

                    <div className="buttons-set">
                        <button type="submit" name="submitButton">GO</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;

