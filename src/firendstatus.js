import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { receiveUsers, unfirend, acceptfr } from "./actions";
import Imggame from "./imggame";
const FirendStatus = () => {
    const dispatch = useDispatch();
    const userisf = useSelector(
        (state) =>
            state.firend && state.firend.filter((user) => user.accepted == true)
    );
    const usernotyet = useSelector(
        (state) =>
            state.firend &&
            state.firend.filter((user) => user.accepted == false)
    );
    useEffect(() => {
        dispatch(receiveUsers());
    }, []);
    // if (users) {
    console.log("redux user f", userisf);
    // }
    if (!userisf) {
        return null;
    }
    if (userisf != undefined) {
        const myfirend = (
            <div className="users">
                <h1> My firend:</h1>
                {userisf.map((user) => (
                    <div className="user" key={user.id}>
                        <div className="profilelogobig">
                            <img src={user.imgurl} className="profilepic" />
                        </div>
                        <h2>
                            {user.first} {user.last}
                        </h2>
                        <div className="buttons">
                            <button
                                className="button"
                                onClick={() => dispatch(unfirend(user.id))}
                            >
                                unfriend
                            </button>
                        </div>
                        <Imggame fid={user.id} />
                    </div>
                ))}
            </div>
        );
        const notyet = (
            <div className="users">
                <h1> pending :</h1> pending :
                {usernotyet.map((user) => (
                    <div className="user" key={user.id}>
                        <img src={user.imgurl} />
                        <h2>
                            {user.first} {user.last}
                        </h2>
                        <div className="buttons">
                            <button
                                className="button"
                                onClick={() => dispatch(acceptfr(user.id))}
                            >
                                accsept friendship
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );

        return (
            <div>
                {myfirend} {notyet}
            </div>
        );
    } else {
        return <div>wait for data</div>;
    }
};

export default FirendStatus;
