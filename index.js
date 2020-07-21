const express = require("express");
const app = express();
const compression = require("compression");
const cryptoRandomString = require("crypto-random-string");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const conf = require("./config.json");
const cookieSession = require("cookie-session");
const email = require("./ses");
const csurf = require("csurf");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const deepai = require("deepai");
deepai.setApiKey("e8224e1f-c0f9-46e3-9c5c-ed4dfb29bc7f");
const { hash, compare } = require("./bc");

const db = require("./db");

const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const { log } = require("console");
const { SSL_OP_LEGACY_SERVER_CONNECT } = require("constants");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

app.use(compression());

app.use(express.json());
app.use(express.static("public"));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
// app.use(
//     cookiesession({
//         secret: "to much code ",
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    // console.log("req.csrfToken()", req.csrfToken());

    next();
});
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
app.post("/register", (req, res) => {
    // console.log("req.body", req.body);

    hash(req.body.pass)
        .then((hashp) => {
            db.addName(
                req.body.first,
                req.body.last,
                req.body.email,
                hashp
            ).then((results) => {
                // console.log("yyeess add");

                req.session.id = results.rows[0].id;
                // console.log("id  reg::::", req.session.id);
                res.json({ success: true });
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/uploadpic", uploader.single("file"), s3.upload, (req, res) => {
    // console.log("regfile ", req.file);
    if (req.file) {
        // console.log("req.body ", req.body);
        let url = conf.s3Url + req.file.filename;
        db.addimg(req.session.id, url)
            .then((dbreturn) => {
                // console.log("db return", dbreturn.rows);
                res.json(dbreturn.rows);
                // res.json({ success: true });
            })
            .catch((err) => {
                console.log("db erroor", err);
            });
    } else {
        res.json({ success: false });
    }
});
app.post("/imggameu", uploader.single("file"), s3.upload, async function (
    req,
    res
) {
    console.log("regfile ", req.file);
    if (req.file) {
        console.log("req.body ", req.body.fid);
        let url = conf.s3Url + req.file.filename;
        console.log("imgurl ", url);
        let bigid = 0;
        let smallid = 0;
        if (req.session.id > req.body.fid) {
            bigid = req.session.id;
            smallid = req.body.fid;
        } else {
            smallid = req.session.id;
            bigid = req.body.fid;
        }
        try {
            const dbreturn = await db.getimgmix(bigid, smallid);

            console.log("db return", dbreturn.rows);
            if (dbreturn.rowCount > 0) {
                console.log("yes it is biger ", dbreturn.rows[0].st_img);
                if (dbreturn.rows[0].st_img != null) {
                    try {
                        var resp = await deepai.callStandardApi(
                            "fast-style-transfer",
                            {
                                content: dbreturn.rows[0].st_img,
                                style: url,
                            }
                        );
                        console.log("img miixer response", resp.output_url);

                        const dbreturnimguu = await db.imggameuploadup(
                            bigid,
                            smallid,
                            url,
                            resp.output_url
                        );
                        //
                        console.log("db return after ", dbreturnimguu.rows);
                        res.json(dbreturnimguu.rows[0]);
                        // res.json({ success: true });
                    } catch (err) {
                        console.log("err", err);
                    }
                }
            } else {
                try {
                    const dbreturnimgu = await db.imggameupload(
                        bigid,
                        smallid,
                        url
                    );
                    //
                    // console.log("db return", dbreturnimgu.rows);
                    //             res.json(dbreturn.rows);
                    res.json({ success: true });
                } catch (err) {
                    console.log("err", err);
                }
            }

            // res.json({ success: true });
        } catch (err) {
            console.log("err", err);
        }

        //         })
        //         .catch((err) => {
        //             console.log("db erroor", err);
        //         });
    } else {
        res.json({ success: false });
    }
});

app.post("/imggame", async function (req, res) {
    console.log("image read ", req.body);
    let bigid = 0;
    let smallid = 0;
    if (req.session.id > req.body.fid) {
        bigid = req.session.id;
        smallid = req.body.fid;
    } else {
        smallid = req.session.id;
        bigid = req.body.fid;
    }
    try {
        const dbreturn = await db.getimgmix(bigid, smallid);

        console.log("db return", dbreturn.rows[0]);
        res.json(dbreturn);
    } catch (err) {
        console.log("err in index.js request for db user data ", err);
    }
});
app.post("/login", (req, res) => {
    console.log("req.body", req.body);

    db.getpass(req.body.email)
        .then((hpass) => {
            compare(req.body.pass, hpass.rows[0].password).then((match) => {
                // console.log("yyeess add");
                // req.session.alreadysingreg = true;
                // req.session.id = results.rows[0].id;
                // res.redirect("/petition");
                // console.log("match and id", match, hpass.rows[0].id);
                if (!match) {
                    res.json({ success: false });
                } else {
                    req.session.id = hpass.rows[0].id;
                    res.json({ success: true });
                }
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({ success: false });
        });
});
app.post("/bioupdate", async function (req, res) {
    // console.log("req.body", req.body);
    try {
        const dbdata = await db.updatebio(req.session.id, req.body.bio);
        // console.log("dbdata", dbdata);

        res.json({ data: dbdata.rows });
    } catch (err) {
        console.log(err);
    }
});
app.post("/sendfr", async function (req, res) {
    console.log("req.body sendfr", req.body.id);
    try {
        const dbdata = await db.sendfr(req.session.id, req.body.id);
        // console.log("dbdata", dbdata);

        res.json({ data: dbdata.rows });
    } catch (err) {
        console.log(err);
    }
});
app.post("/senddf", async function (req, res) {
    console.log("req.body sendfr", req.body.id);
    try {
        const dbdata = await db.senddf(req.session.id, req.body.id);
        // console.log("dbdata", dbdata);

        res.json({ data: dbdata.rows });
    } catch (err) {
        console.log(err);
    }
});
app.post("/sendaf", async function (req, res) {
    console.log("req.body sendfr", req.body.id);
    try {
        const dbdata = await db.sendaf(req.body.id, req.session.id);
        // console.log("dbdata", dbdata);

        res.json({ data: dbdata.rows });
    } catch (err) {
        console.log(err);
    }
});

app.post("/sendemail", (req, res) => {
    console.log("req.body", req.body);
    const secretCode = cryptoRandomString({
        length: 6,
    });
    db.getpass(req.body.email)
        .then((hpass) => {
            // console.log("hpass)", hpass.rowCount);
            if (hpass.rowCount == 1) {
                db.addchechvar(req.body.email, secretCode)
                    .then(() => {
                        email
                            .sendEmail(
                                req.body.email,
                                secretCode,
                                "chech code "
                            )
                            .then((data) => {
                                // console.log("data in sendemail", data);
                                res.json({ success: true });
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                res.json({ emailIsWrong: true });
                // console.log("email not found");
            }
        })
        .catch((err) => {
            console.log(err);
        });
});
app.post("/chechkthecode", (req, res) => {
    // console.log("req.body", req.body);

    db.getcode(req.body.email)
        .then((hpass) => {
            // console.log("hpass)", hpass);
            if (hpass.rowCount >= 1) {
                if (
                    hpass.rows[hpass.rows.length - 1].checkvar == req.body.code
                ) {
                    // console.log("yes it is match ");
                    hash(req.body.pass)
                        .then((hashp) => {
                            db.updatepass(req.body.email, hashp).then(() => {
                                // console.log("pass get update");
                                res.json({ success: true });
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    // console.log("it is not match ");
                    res.json({ codenotmacht: true });
                }
            } else {
                res.json({ codeexpire: true });
                console.log("code is expire");
            }
        })
        .catch((err) => {
            console.log(err);
        });
});
app.get("/getdata", async function (req, res) {
    try {
        const datareturn = await db.getdata(req.session.id);
        // console.log("datareturn", datareturn.rows);

        res.json({ data: datareturn.rows });
    } catch (err) {
        console.log("err in index.js request for db user data ", err);
    }
});
app.get("/user/:id.json", async function (req, res) {
    console.log("req.params", req.params.id);
    try {
        const datareturn = await db.getdata(req.params.id);
        // console.log("datareturn", datareturn.rows);

        res.json({ data: datareturn.rows });
    } catch (err) {
        console.log("err in index.js request for db user data ", err);
    }
});
app.get("/searchname/:searchname.json", async function (req, res) {
    console.log(" search name req.params", req.params.searchname);
    try {
        const datareturn = await db.getlistname(req.params.searchname);
        //console.log("datareturn", datareturn.rows);

        res.json({ data: datareturn.rows });
    } catch (err) {
        console.log("err in index.js request for db user data ", err);
    }
});
app.get("/friend/:fid.json", async function (req, res) {
    console.log(" search name req.params", req.session.id);
    try {
        const datareturn = await db.getfstatus(req.params.fid, req.session.id);
        //  console.log("datareturn", datareturn.rows);

        res.json({ data: datareturn });
    } catch (err) {
        console.log("err in index.js request for db user data ", err);
    }
});
app.get("/getfl.json", async function (req, res) {
    //  console.log(" search name req.params", req.session.id);
    try {
        const datareturn = await db.getfl(req.session.id);
        //console.log("datareturn", datareturn.rows);

        res.json({ data: datareturn });
    } catch (err) {
        console.log("err in index.js request for db user data ", err);
    }
});
app.get("/lastlist.json", async function (req, res) {
    try {
        const datareturn = await db.getlastlist();
        // console.log("datareturn", datareturn.rows);

        res.json({ data: datareturn.rows });
    } catch (err) {
        console.log("err in index.js request for db user data ", err);
    }
});
app.get("/Welcome", (req, res) => {
    if (req.session.id) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    if (!req.session.id) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function () {
    console.log("I'm listening.");
});
let online = {};

io.on("connection", async function (socket) {
    console.log(`socket .id  ${socket.id} is now `);
    const userId = socket.request.session.id;
    online[socket.id] = userId;
    console.log("omline list ", online);

    socket.on("disconnect", async function () {
        console.log(`socket with the id ${socket.id} is now disconnected`);
        delete online[socket.id];
        console.log("omline list ", online);
        let onlineid = {};
        for (let x in online) {
            console.log("for list ", x, " : ", online[x]);
            onlineid[online[x]] = x;
        }
        console.log("online lit in in id ", onlineid);
        let onlinelist = [];

        for (let i in onlineid) {
            try {
                const datareturn = await db.getdata(i);
                console.log("datareturn in lopp", datareturn.rows[0]);
                onlinelist.push(datareturn.rows[0]);
            } catch (err) {
                console.log("err in index.js request for db user data ", err);
            }
        }
        console.log("online names", onlinelist);

        io.sockets.emit("online", onlinelist);
    });
    let onlineid = {};
    for (let x in online) {
        console.log("for list ", x, " : ", online[x]);
        onlineid[online[x]] = x;
    }
    console.log("online lit in in id ", onlineid);
    let onlinelist = [];

    for (let i in onlineid) {
        try {
            const datareturn = await db.getdata(i);
            console.log("datareturn in lopp", datareturn.rows[0]);
            onlinelist.push(datareturn.rows[0]);
        } catch (err) {
            console.log("err in index.js request for db user data ", err);
        }
    }
    console.log("online names", onlinelist);

    io.sockets.emit("online", onlinelist);
    if (!socket.request.session.id) {
        return socket.disconnect(true);
    }

    socket.on("my incoming msg", (newmsg) => {
        console.log(("this new msg", newmsg));
    });
    console.log("i am ruuning ");
    try {
        const datareturn = await db.getmsg();
        // console.log("datareturn", datareturn.rows);
        io.sockets.emit("chatMessages", datareturn.rows.reverse());
    } catch (err) {
        console.log("err in index.js request for db user data ", err);
    }

    socket.on("My amazing chat message", (newMsg) => {
        // console.log('This message is coming from chat.js component', newMsg);
        // console.log('user who sent newMsg is: ', userId);

        // do a db query to store the new chat message into the chat table!!
        // also do a db query to get info about the user (first name, last name, img) - will probably need to be a JOIN
        // once you have your chat object, you'll want to EMIT it to EVERYONE so they can see it immediately.

        (async () => {
            console.log("i am ruuning from chat ", newMsg);
            try {
                const datareturn = await db.addnewmsg(userId, newMsg);
                const newmsgfull = await db.readtheonemsg(
                    datareturn.rows[0].id
                );

                console.log("datareturn new save", newmsgfull.rows);
                io.sockets.emit("chatnewMessages", newmsgfull.rows[0]);
            } catch (err) {
                console.log("err in index.js request for db user data ", err);
            }
        })();
        io.sockets.emit("addChatMsg", newMsg);
    });
});
