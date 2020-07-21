import React, { useState, useEffect } from "react";
import axios from "../axios";

export default function axiospostf(path, id) {
    const [error, setError] = useState();
    var redata;
    console.log("path and id ", path, id);

    async function submit() {
        console.log("run in hook");

        try {
            const { data } = await axios.post(path, { id: id });
            if (data.success) {
                redata = data;
            } else {
                setError(true);
            }
        } catch (err) {
            console.log("send axio post f id", err);
        }
    }
    return [redata, submit, error];
}
