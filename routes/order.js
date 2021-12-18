const router = require("express").Router();
const Order = require("../models/Order")
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken")

/**
 * @swagger
 * tags:
 *  name: Order
 *  description: Order management
 * 
 */
/**
 * @swagger
 * tags:
 *  name: stats
 *  description: stats management
 * 
 */

/**
 * @swagger
 * /api/order:
 *  post:
 *   description: Create a new order
 *   tags: [Order]
 *   parameters:
 *    - name: body
 *      in: body
 *      schema:
 *          type: object
 *          properties:
 *              userId:
 *                  type: string
 *                  required: true
 *                  description: User id
 *              products:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          productId:
 *                              type: string
 *                              required: true
 *                              description: Product id
 *                          quantity:
 *                              type: integer
 *                              required: true
 *                              description: Quantity of product
 * 
 *   responses:
 *    '200':
 *      description: Successfully created
 *    '400': 
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
 *    '500':
 *      description: Internal server error
 * 
 */

//CREATE
router.post("/", verifyToken, async (req, res)=>{
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    }catch(err){
        res.status(500).json(err)
    } 
})

/**
 * @swagger
 * /api/order/{id}:
 *  put:
 *   description: update a new order
 *   tags: [Order]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      required: true
 *      description: Order id
 *    - name: body
 *      in: body
 *      schema:
 *          type: object
 *          properties:
 *              userId:
 *                  type: string
 *                  required: true
 *                  description: User id
 *              products:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          productId:
 *                              type: string
 *                              required: true
 *                              description: Product id
 *                          quantity:
 *                              type: integer
 *                              required: true
 *                              description: Quantity of product
 * 
 *   responses:
 *    '200':
 *      description: Success
 *    '400': 
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
 *    '500':
 *      description: Internal server error
 * 
 */
//UPDATE PRODUCT
router.put("/:id", verifyTokenAndAdmin, async (req, res)=>{
    try{
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    }catch(err){
        res.status(500).json(err);
    }
})

/**
 * @swagger
 * /api/order/{id}:
 *  delete:
 *   description: use to delete order
 *   tags: [Order]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      required: true
 *      description: Order id
 * 
 *   responses:
 *    '200':
 *      description: Success
 *    '400': 
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
 *    '500':
 *      description: Internal server error
 * 
 */
//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted...");
    }catch(err){
        res.status(500).json(err);
    }
});

/**
 * @swagger
 * /api/order/find/{userId}:
 *  get:
 *   description: use to find order by user id
 *   tags: [Order]
 *   parameters:
 *    - name: userId
 *      in: path
 *      schema:
 *       type: string
 *      required: true
 *      description: Order id
 * 
 *   responses:
 *    '200':
 *      description: Success
 *      schema:
 *           type: object
 *           properties:
 *             userId:
 *                type: string
 *                required: true
 *                description: User id
 *             products:
 *                type: array
 *                items:
 *                 type: object
 *                 properties:
 *                  productId:
 *                    type: string
 *                    required: true
 *                    description: Product id
 *                  quantity:
 *                    type: integer
 *                    required: true
 *                    description: Quantity of product
 *    '400': 
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
 *    '500':
 *      description: Internal server error
 * 
 */
//GET USER ORDER
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res)=>{
    try{
        const orders = await Order.find({userId: req.params.userId});
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
});

/**
 * @swagger
 * /api/order:
 *  get:
 *   description: use to get all order
 *   tags: [Order]
 *   parameters:
 *    - name: userId
 *      in: path
 *      schema:
 *       type: string
 *      required: true
 *      description: Order id
 * 
 *   responses:
 *    '200':
 *      description: Success
 *      schema:
 *       type: array
 *       items:
 *           type: object
 *           properties:
 *             userId:
 *                type: string
 *                required: true
 *                description: User id
 *             products:
 *                type: array
 *                items:
 *                 type: object
 *                 properties:
 *                  productId:
 *                    type: string
 *                    required: true
 *                    description: Product id
 *                  quantity:
 *                    type: integer
 *                    required: true
 *                    description: Quantity of product
 *    '400': 
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
 *    '500':
 *      description: Internal server error
 * 
 */
//GET ALL 
router.get("/", verifyTokenAndAdmin, async (req, res)=>{
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
});

/**
 * @swagger
 * /api/order/income:
 *  get:
 *   description: use to income
 *   tags: [stats]
 *   responses:
 *    '200':
 *      description: Success
 *      schema:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           _id:
 *             type: string
 *             description: month number
 *           total:
 *             type: integer
 *             description: total income
 *    '400':
 *     description: Bad request
 *    '401':
 *     description: Unauthorized
 *    '500':
 *     description: Internal server error
 * 
 */
//GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() -1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1));

    try{
        const income = await Order.aggregate([
            { $match: {createdAt: { $gte: previousMonth}}},
            {
                $project: {
                    month: { $month: "$createdAt"},
                    sales: "$amount"
                },
            },
            {
                $group:{
                    _id:"$month",
                    total: { $sum: "$sales"},
                },
            },
        ]);
        res.status(200).json(income);
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router