//login &register
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const passport = require("passport");
//引入User.js
const User = require("../../models/User");
//引入keys
const keys = require("../../config/keys");

/*  $router GET api/users/test
    @desc 返回请求的json数据
    @access public
*/
// router.get("/test", (req, res) => {
//     res.json({ msg: "成功" });
// });

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
                return res.status(400).json("邮箱已被占用");
            } else {
                const avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });
                const newUser = new User({
                    name: req.body.name,
                    password: req.body.password,
                    email: req.body.email,
                    identity: req.body.identity,
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

/*  $router post api/users/login
    @desc 返回token 使用依赖:jwt passport
        获取token需要使用jsonwebtoken依赖
    @access public
*/
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    //查询数据库
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json("用户不存在");
            }
            //密码匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const rule = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            identity: user.identity
                        };
                        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            if (err) throw err;
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        });
                        //res.json({ msg: "密码匹配成功" });
                    } else {
                        return res.status(404).json("密码错误");
                    }
                });
        });
});

/*  $router GET api/users/current
    @desc return current user
    @access private
    验证token需要使用psssport和passport-jwt依赖
*/
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        //req.user
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        identity: req.user.identity
    });
});

module.exports = router;