const router = require("express").Router();
const User = require("../models/User");
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken")

/**
 * @swagger
 * tags:
 *  name: user
 *  description: user managing api
 */

/**
 * @swagger
 * /api/user/{id}:
 *  put:
 *   tags: [user]
 *   description: Use to get all books
 *   parameters:
 *   - name: id
 *     in: path
 *     description: id of the user
 *     required: true
 *     type: string
 * 
 *   - name: body
 *     in: body
 *     description: User object that needs to be added to the database
 *     required: true
 *     schema:      # Request body contents
 *        type: object
 *        properties:
 *           username:
 *             type: string
 *           email:
 *             type: string
 *   responses:
 *    '200':
 *     description: A successful response
 * 
 */
router.put("/:id", verifyToken, async (req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.Pass_SEC
        ).toString()
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            {
                $set: req.body
            }, 
            {new: true}
        )
        res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json(err);
    }
})

/**
 * @swagger
 * /api/user/{id}:
 *  delete:
 *   tags: [user]
 *   description: Use to delete a selected user
 *   parameters:
 *   - name: id
 *     in: path
 *     description: id of the user
 *     required: true
 *     type: string
 *     responses:
 *      '200':
 *       description: A successful response
 * 
 */
//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")
    }catch(err){
        res.status(500).json(err)
    }
})


/**
 * @swagger
 * /api/user/find/{id}:
 *  get:
 *   tags: [user]
 *   description: Use to get all books
 *   parameters:
 *     - name: id
 *       in: path
 *       description: id of the user
 *       required: true
 *       schema:
 *        type: string
 *   responses:
 *    '200':
 *     description: A successful response
 * 
 */

//GET USERS
router.get("/find/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        const resuser = await User.findById(req.params.id)
        const {password, ...others} = resuser._doc;
        res.status(200).json({...others})
    }catch(err){
        res.status(500).json(err)
    }
})

/**
 * @swagger
 * /api/user:
 *  get:
 *   tags: [user]
 *   description: Use to get all books
 *   responses:
 *    '200':
 *     description: A successful response
 * 
 */

//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    const query = req.query.new;
    try{
        const resuser = query ? await User.find().sort({_id: -1}).limit(5) : await User.find();
        console.log(resuser._id)
        res.status(200).json(resuser)
    }catch(err){
        res.status(500).json(err)
    }
})

/**
 * @swagger
 * /api/user/stats:
 *  get:
 *   tags: [stats]
 *   description: Use to get all books
 *   responses:
 *    '200':
 *     description: A successful response
 * 
 */
//GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));

    try{
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear}}},
            {
                $project: {
                    month: { $month: "$createdAt"},
                },
            },
            {
                $group:{
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
        ])
        res.status(200).json(data)
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;