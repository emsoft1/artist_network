import React from "react";
import ReactDOM from "react-dom";
import Helloworld from "./Helloworld";
import Welcome from "./Welcome";
import App from "./app";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
import { init } from "./socket";
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;
const userIsLogin = location.pathname != "/welcome";
if (!userIsLogin) {
    elem = <Welcome />;
} else {
    // elem = <h1>I will be the main social network app </h1>;
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main")); //<Helloworld />
