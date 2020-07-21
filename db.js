const spicedPg = require("spiced-pg");

var db = spicedPg(
    process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/sndb"
);

module.exports.addName = (name, last, email, password) => {
    return db.query(
        `
    INSERT INTO users (first , last , email, password)
    VALUES ($1, $2,$3,$4)
    RETURNING id `,
        [name, last, email, password]
    );
};
module.exports.addnewmsg = (userid, newmsg) => {
    return db.query(
        `
    INSERT INTO msg (sender_id , msgs )
    VALUES ($1, $2)
    
    RETURNING   id`,
        [userid, newmsg]
    );
};
module.exports.sendaf = (sender_id, receiver_id) => {
    return db.query(
        `
         UPDATE friendships
SET accepted = TRUE
WHERE   receiver_id = $2 AND sender_id=$1
RETURNING id;
`,
        [sender_id, receiver_id]
    );
};
module.exports.sendfr = (sender_id, receiver_id) => {
    return db.query(
        `
    INSERT INTO friendships (sender_id , receiver_id )
    VALUES ($1, $2)
    RETURNING id `,
        [sender_id, receiver_id]
    );
};
module.exports.getpass = (email) => {
    return db.query(`SELECT password ,id FROM users WHERE email = $1`, [email]);
};
module.exports.getfstatus = (fid, id) => {
    return db.query(
        `SELECT * FROM friendships WHERE receiver_id = $1 AND sender_id=$2 OR (receiver_id = $2 AND sender_id = $1); `,
        [fid, id]
    );
};
module.exports.getfl = (id) => {
    return db.query(
        ` SELECT users.id, first, last, imgurl, accepted
  FROM friendships
  JOIN users
  ON (accepted = false AND receiver_id  = $1 AND sender_id = users.id)
  OR (accepted = true AND receiver_id  = $1 AND sender_id = users.id)
  OR (accepted = true AND   sender_id = $1 AND receiver_id= users.id) `,
        [id]
    );
};
module.exports.getmsg = () => {
    return db.query(
        ` SELECT msg.id as id, users.id as uid, first, last, imgurl, msgs
  FROM msg JOIN users ON msg.sender_id = users.id ORDER BY id DESC LIMIT 10
  `
    );
};
module.exports.readtheonemsg = (id) => {
    return db.query(
        ` SELECT msg.id as id, users.id as uid, first, last, imgurl, msgs
  FROM msg JOIN users ON msg.sender_id = users.id WHERE msg.id=$1
  `,
        [id]
    );
};
module.exports.senddf = (fid, id) => {
    return db.query(
        `DELETE FROM  friendships WHERE receiver_id = $1 AND sender_id=$2 OR (receiver_id = $2 AND sender_id = $1); `,
        [fid, id]
    );
};
module.exports.getdata = (id) => {
    return db.query(
        `SELECT  id ,first,last,imgurl,bio  FROM users WHERE id = $1`,
        [id]
    );
};
module.exports.getcode = (email) => {
    return db.query(
        `SELECT * FROM passresett
WHERE  CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' AND email= $1`,
        [email]
    );
};
module.exports.getlastlist = () => {
    return db.query(
        `SELECT id ,first,last,imgurl,bio FROM users ORDER BY id DESC LIMIT 3;`
    );
};
module.exports.getlistname = (val) => {
    return db.query(
        `SELECT id ,first,last,imgurl,bio FROM users WHERE first ILIKE $1  ORDER BY id DESC ;`,
        [val + "%"]
    );
};

module.exports.addimg = (id, imgurl) => {
    return db.query(
        `
         UPDATE users
SET imgurl = $2
WHERE  id= $1
RETURNING id,imgurl;
`,
        [id, imgurl]
    );
};
module.exports.updatebio = (id, bio) => {
    return db.query(
        `
         UPDATE users
SET bio = $2
WHERE  id= $1
RETURNING id,bio;
`,
        [id, bio]
    );
};

module.exports.addchechvar = (email, checkvar) => {
    return db.query(
        `
   INSERT INTO passresett (email, checkvar)
    VALUES ($1, $2);
     `,
        [email, checkvar]
    );
};
module.exports.updatepass = (email, pass) => {
    return db.query(
        `
  UPDATE users
SET password = $2
WHERE  email= $1;`,
        [email, pass]
    );
};

module.exports.imggameupload = (sender_id, reciver_id, imgulrinput, final) => {
    // console.log("this is my input", username, id, comments);

    return db.query(
        `

        INSERT INTO imagemix (sender_id,receiver_id,st_img,final_img)
    VALUES ($1, $2, $3, $4) 

    RETURNING id,sender_id,receiver_id,st_img,main_img,final_img;
    `,
        [sender_id, reciver_id, imgulrinput, final]
    );
};
module.exports.imggameuploadup = (
    sender_id,
    reciver_id,
    imgulrinput,
    final
) => {
    // console.log("this is my input", username, id, comments);

    return db.query(
        `
       UPDATE imagemix 
    SET main_img=$3, final_img=$4 
WHERE  sender_id=$1 AND receiver_id= $2
    RETURNING id,sender_id,receiver_id,final_img;
    `,
        [sender_id, reciver_id, imgulrinput, final]
    );
};
module.exports.getimgmix = (sender_id, reciver_id) => {
    return db.query(
        `SELECT * FROM imagemix
WHERE  sender_id=$1 AND receiver_id= $2`,
        [sender_id, reciver_id]
    );
};
