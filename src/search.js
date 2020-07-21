import React, { useState, useEffect } from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
export default function Searchlist(props) {
    const [users, setUser] = useState({});
    const [searchname, setSearchname] = useState("");
    let loaded = false;
    useEffect(() => {
        if (searchname != "") {
            (async () => {
                console.log("seach name in sereffect", searchname);

                send(searchname);
            })();
        } else {
            (async () => {
                const { data } = await axios.get(`/lastlist.json`);
                console.log("data for me ", data);
                await setUser(data);
                console.log("user", users);
            })();
        }
    }, [searchname]);

    console.log("usercheck", users);
    async function send(name) {
        const { data } = await axios.get(`/searchname/${name}.json`);
        console.log("data", data);
        await setUser(data);
        console.log("user", users);
    }
    var g = users;
    const onError = (idx) => {
        // let g = [...users];
        console.log("idx", idx);

        g.data[idx].imgurl = "user.png";

        console.log("test ", g);
        setUser({ ...users });
        // g[idx].imgurl =
    }; //     "https://s3.amazonaws.com/emsoftimageboard001/FSpePBBBSoV5XJ5WiCoE08bvMQ1W4Ugh.jpg";

    // setUser(g);};
    async function changehandle(e) {
        await setSearchname(e.target.value);
        console.log("input", searchname);
    }
    var s = "";
    if (users.data) {
        return (
            <div className="searchmain">
                <input type="text" onChange={changehandle} />
                {users.data.map((x, index) => {
                    return (
                        <Link to={"/user/" + x.id} key={x.id}>
                            <div key={x.id} className="searchlist">
                                <div className="searchimgcon">
                                    <img
                                        src={x.imgurl}
                                        onError={() => {
                                            onError(index);
                                            //   console.log("idx", index);
                                        }}
                                        className="searchimg"
                                    />
                                </div>
                                <div>
                                    {x.first} {x.last}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    } else {
        return <div>waiting for data</div>;
    }
}
