import React, { useState, useEffect } from "react";
import axios from "./axios";
import axiospostf from "./hooks/snedaxiospostid";
const FriendButton = (props) => {
    const [btext, setBtest] = useState("Request for friendship");
    const [mod, setMod] = useState(1);
    const [sendfrdata, sendfr, errorsendfr] = axiospostf("/sendfr", props.fid);
    const [sendafdata, sendaf, errorsendaf] = axiospostf("/sendaf", props.fid);
    const [senddfdata, senddf, errorsenddf] = axiospostf("/senddf", props.fid);
    useEffect(() => {
        console.log("id", props.fid);

        (async () => {
            console.log("button program check ");
            const { data } = await axios.get(`/friend/${props.fid}.json`);
            console.log("db f", data.data);
            if (data.data.rowCount != 0) {
                console.log("there is a accepted");
                if (data.data.rows[0].receiver_id == props.fid) {
                    if (data.data.rows[0].accepted == false) {
                        console.log("it you to they is false ");
                        setBtest("friendship is Request pending");
                        setMod(2);
                    } else if (data.data.rows[0].accepted) {
                        console.log("it is you to they true  ");
                        setBtest("unfirend");
                        setMod(3);
                    }
                } else {
                    if (data.data.rows[0].accepted == false) {
                        console.log("it is they to you  false ");
                        setBtest("accsept friendship");
                        setMod(4);
                    } else if (data.data.rows[0].accepted) {
                        console.log("it is they to you  true  ");
                        setBtest("unfirend");
                        setMod(3);
                    }
                }
            }
        })();

        // return () => {
        //     //     cleanup;
        // };
    }, []);

    const clickhandle = () => {
        if (mod == 1) {
            sendfr();
            setBtest("friendship is Request pending");
            setMod(2);
        } else if (mod == 4) {
            sendaf();
            setBtest("unfirend");
            setMod(3);
        } else if (mod == 3) {
            senddf();
            setBtest("Request for friendship");
            setMod(1);
        }
    };
    return (
        <div>
            <button onClick={clickhandle} className="button">
                {btext}
            </button>
        </div>
    );
};

export default FriendButton;
