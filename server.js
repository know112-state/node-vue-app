/*jshint esversion: 6 */
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ecmascript = require("ecmascript6");
const passport = require("passport");

const app = express();
//引入users.js
const users = require("./routes/api/users");

//DB config
const db = require("./config/keys").mongoURI;

//使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connect to mongodb 连接数据库
mongoose.connect(db)
    .then(() => console.log("数据库连接成功"))
    .catch(err => console.log(err));


//初始化passport
app.use(passport.initialize());
//引入passport文件
require("./config/passport")(passport);


// app.get("/", (req, res) => {
//     res.send("Hello world!");
// });

//使用routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`服务器启动成功:${port}`);
});