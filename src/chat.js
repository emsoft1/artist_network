import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

const Chat = () => {
    const elemRef = useRef();
    const chatmsg = useSelector((state) => state && state.msg);
    const onlinelist = useSelector((state) => state && state.list);

    useEffect(() => {
        console.log("i resived it ", chatmsg);
        console.log("i resived it ", onlinelist);
        // console.log("scroll Top: ", elemRef.current.scrollTop);
        // console.log("clientHeight: ", elemRef.current.clientHeight);

        // console.log("scrollHeight: ", elemRef.current.scrollHeight);
        // console.log('chat hooks component has mounted');
        console.log("elementRef = ", elemRef);
        if (elemRef.current) {
            console.log("yes");

            console.log("scroll Top: ", elemRef.current.scrollTop);
            console.log("clientHeight: ", elemRef.current.clientHeight);
            console.log("scrollHeight: ", elemRef.current.scrollHeight);
            elemRef.current.scrollTop =
                elemRef.current.scrollHeight - elemRef.current.clientHeight;
        }
    }); //chatmsg, onlinelist

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // this will prevent going to the next line
            socket.emit("My amazing chat message", e.target.value);
            e.target.value = ""; // clears input field after we click enter
        }
    };

    if (!chatmsg) {
        return null;
    }
    if (chatmsg && onlinelist) {
        return (
            <div className="mainchat">
                <div className="useri">
                    <h1>Online list </h1>
                    {onlinelist.map((user) => (
                        <div className="user" key={user.id}>
                            <div className="chatimgonlinecon">
                                <img
                                    src={user.imgurl}
                                    className="chatimgonline "
                                />
                            </div>
                            <h4>
                                {user.first} {user.last}
                            </h4>
                        </div>
                    ))}
                </div>{" "}
                <div>
                    <h1>MY Chat</h1>
                    <div className="useri" ref={elemRef}>
                        {chatmsg.map((user) => (
                            <div className="user" key={user.id}>
                                <div className="chatimgcon">
                                    <img
                                        src={user.imgurl}
                                        className="chatimgonline "
                                    />
                                </div>
                                <h5>
                                    {user.first} {user.last}
                                </h5>
                                <h4>{user.msgs}</h4>
                            </div>
                        ))}
                    </div>
                    <textarea onKeyDown={keyCheck}></textarea>
                </div>
            </div>
        );
    }
};
export default Chat;
