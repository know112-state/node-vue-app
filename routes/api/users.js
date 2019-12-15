//login &register
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
//引入User.js
const User = require("../../models/User");

/*  $router GET api/users/test
    @desc 返回请求的json数据
    @access public
*/
router.get("/test", (req, res) => {
    res.json({ msg: "成功" });
});

/*  $router post api/users/register
    @desc 返回请求的json数据
    @access public
*/
router.post("/register", (req, res) => {
    // console.log(req.body);
    //查询数据库中是否拥有此邮箱
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.status(400).json({ email: "邮箱已被占用" });
            } else {
                const avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });
                const newUser = new User({
                    name: req.body.name,
                    password: req.body.password,
                    email: req.body.email,
                    avatar: avatar
                });
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;

                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        });
});

module.exports = router;