const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: auth managing api
 */

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *   tags: [Auth]
 *   description: register a new user
 *   parameters:
 *    - name: body
 *      in: body
 *      description: user object
 *      schema:
 *       type: object
 *       required: true
 *       properties:
 *        username:
 *           type: string
 *           required: true
 *        email:
 *           type: string
 *           required: true
 *        password:
 *           type: string
 *           required: true
 *   responses:
 *    '201':
 *      description: user created
 *    '400':
 *      description: bad request
 *    '500':
 *      description: internal server error
 */
//REGISTER
router.post("/register", async (req,res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });
 
    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    }catch (err){
        res.status(500).json(err);
    }
});


/**
 * @swagger
 * /api/auth/login:
 *  post:
 *   tags: [Auth]
 *   description: use to login
 *   parameters:
 *    - name: body
 *      in: body
 *      description: user object
 *      required: true
 *      schema:
 *       type: object
 *       required: true
 *       properties:
 *        username:
 *           type: string
 *           required: true
 *        password:
 *           type: string
 *           required: true
 *   responses:
 *    '200':
 *      description: login success
 *    '400':
 *      description: bad request
 *    '500':
 *      description: internal server error
 */
//Login
router.post("/login", async (req,res)=>{
    try{
        const user = await User.findOne({username: req.body.username});
        !user && res.status(401).json("Worng credentials!")

        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);
        const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

        OriginalPassword !==req.body.password && res.status(401).json("Worng credentials!")

        const accessToken = jwt.sign({
            id: user._id, isAdmin: user.isAdmin
        }, process.env.JWT_SEC, {expiresIn: "3d"})

        const {password, ...others} = user._doc;

        res.status(200).json({...others, accessToken});

    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router