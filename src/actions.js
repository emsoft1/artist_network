import axios from "./axios";

export function fn() {
    return {
        type: "CHANGE_STATE",
    };
}

export async function receiveUsers() {
    const { data } = await axios.get("/getfl.json");
    console.log("redux from db", data);
    return {
        type: "RECEIVE_FIREND",
        firend: data.data.rows,
    };
}

export async function unfirend(id) {
    await axios.post("/senddf", { id });
    return {
        type: "UNFIREND",
        id,
    };
}
export async function acceptfr(id) {
    await axios.post("/sendaf", { id });
    return {
        type: "FIREND_A",
        id,
    };
}

export async function readmsg(msg) {
    // await axios.post("/sendaf", { id });
    return {
        type: "LAST_MSG",
        msg,
    };
}
export async function readnewmsg(msg) {
    // await axios.post("/sendaf", { id });
    return {
        type: "NEW_MSG",
        newmsg: msg,
    };
}
export async function online(list) {
    // await axios.post("/sendaf", { id });
    return {
        type: "READ_LIST",
        list,
    };
}
