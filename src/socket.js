import * as io from "socket.io-client";
// import { chatMessages, chatMessage } from "./actions";
import { useSelector, useDispatch } from "react-redux";
import { readmsg, readnewmsg, online } from "./actions";
export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
        socket.on("chatMessages", (msg) => {
            store.dispatch(readmsg(msg));
            console.log(`
            Got a message in the client! I'm about to start the whole Redux process by dispatching here. My message is ${msg}
            `);
        });
        socket.on("online", (list) => {
            store.dispatch(online(list));
            console.log(`
            Got a message onlne list s ${list}
            `);
        });
        socket.on("chatnewMessages", (msg) => {
            store.dispatch(readnewmsg(msg));
            console.log(`
            Got a message in the client! I'm about to start the whole Redux process by dispatching here. My message is ${msg}
            `);
        });
        // socket.on("chatMessages", (msgs) => store.dispatch(chatMessages(msgs)));

        // socket.on("chatMessage", (msg) => store.dispatch(chatMessage(msg)));
    }
};
