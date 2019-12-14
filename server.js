/*jshint esversion: 6 */
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Hello world!");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`服务器启动成功:${port}`);
});