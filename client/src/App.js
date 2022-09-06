import './App.css';
import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Login from "./Login";
import Chat from "./Chat";
import Signup from "./Signup";
import Connect from "./Connect";
import NotFound from "./NotFound";
import {SocketContext, socket} from './contexts/socket';

const App = () => {
    return (
        <SocketContext.Provider value={socket}>
        <Router>
            <div>
                <Switch>
                    <Route path="/signup" exact>
                        <Signup />
                    </Route>
                    <Route path="/connect" exact>
                        <Connect />
                    </Route>
                    <Route path="/chat/conversation/">
                        <Chat />
                    </Route>
                    <Route path="/not-found" exact>
                        <NotFound />
                    </Route>
                    <Route path="/">
                        <Login />
                    </Route>
                </Switch>
            </div>
        </Router>
        </SocketContext.Provider>
    );
}

export default App;
