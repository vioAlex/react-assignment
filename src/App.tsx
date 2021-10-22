import React from 'react';
import './App.css';

import { PrivateRoute, ProvideAuth } from "./common/auth/auth";

import Login from './components/Login/Login';
import PostReader from './components/PostReader/PostReader';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
    return (
        <div className="App" id="App">
            <ProvideAuth>
                <Router>
                    <Switch>
                        <Route path="/login">
                            <Login/>
                        </Route>
                        <PrivateRoute exact path="/">
                            <PostReader/>
                        </PrivateRoute>
                        <PrivateRoute path="/:idActiveSenderParam" children={<PostReader/>}/>
                    </Switch>
                </Router>
            </ProvideAuth>
        </div>
    );
}

export default App;
