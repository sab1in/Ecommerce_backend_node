const router = require("express").Router();
const Cart = require("../models/Cart")
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken")

/**
 * @swagger
 * tags:
 *  name: cart
 *  description: cart managing api
 */

/**
 * @swagger
 * /api/cart:
 *  post:
 *   tags: [cart]
 *   description: Use to create a new cart
 *   parameters: 
 *      - name: body
 *        in : body
 *        required: true
 *        schema:
 *          type: object
 *          properties: 
 *              userId: 
 *                  type: string
 *   responses:
 *    '200':
 *     description: A successful response
 * 
 */

//CREATE
router.post("/", verifyToken, async (req, res)=>{
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    }catch(err){
        res.status(500).json(err)
    }
})

/**
 * @swagger
 * /api/cart/{id}:
 *  put:
 *   tags: [cart]
 *   description: Use to update a cart
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *        type: string
 *     - name: body
 *       in: body
 *       required: true
 *       schema:
 *        type: object
 *        properties:
 *          userId:
 *              type: string
 *          products:
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                     productId:
 *                        type: string
 *                     quantity:
 *                        type: number
 * 
 *   responses:
 *    '200':
 *      description: A successful response
 *    '500':
 *      description: A server error
 */
//UPDATE cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res)=>{
    try{
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedCart);
    }catch(err){
        res.status(500).json(err);
    }
})

/**
 * @swagger
 * /api/cart/{id}:
 *  delete:
 *   tags: [cart]
 *   parameters:
 *     - name: id
 *       in: path
 *       description: id of the user
 *       required: true
 *       schema:
 *        type: string
 *   responses:
 *    '200':
 *      description: A successful response
 *    '500':
 *      description: Server error
 * 
 *   description: Use to delete selected cart
 *   
 */
//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted...");
    }catch(err){
        res.status(500).json(err);
    }
});

/**
 * @swagger
 * /api/find/{userId}:
 *  get:
 *   tags: [cart]
 *   description: Use to get user cart
 *   parameters:
 *      - name: userId
 *        in: path
 *        description: id of the user
 *        schema:
 *          type: string
 *        required: true
 *   responses:
 *    '200':
 *     description: A successful response
 * 
 */
//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res)=>{
    try{
        const cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart);
    }catch(err){
        res.status(500).json(err);
    }
});

/**
 * @swagger
 * /api/cart:
 *  get:
 *   tags: [cart]
 *   description: Use to get all user cart
 *   responses:
 *    '200':
 *     description: A successful response
 * 
 */
//GET ALL 
router.get("/", verifyTokenAndAuthorization, async (req, res)=>{
    try{
        const carts = await Cart.find();
        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router