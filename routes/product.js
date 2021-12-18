const Product = require("../models/Product")
const router = require("express").Router();
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken")


/**
 * @swagger
 * tags:
 *  name: product
 *  description: product managing api
 */

/**
 * @swagger
 * /api/product:
 *  post:
 *   tags: [product]
 *   parameters:
 *     - name: body
 *       in: body
 *       description: product object
 *       required: true
 *       schema:
 *        type: object
 *        properties:
 *         title:
 *          type: string
 *          description: product title
 *          required: true
 *         desc:
 *          type: string
 *          description: product description
 *          required: true
 *         img:
 *          type: string
 *          description: product image
 *          required: true
 *         categories:
 *          type: array
 *          description: product categories
 *          required: true
 *          items:
 *              type: string
 *              required: true
 *         size:
 *          type: string
 *          description: product size
 *          required: true
 *         price:
 *          type: number
 *          description: product price
 *          required: true
 *         color:
 *          type: string
 *          description: product color
 *          required: true
 *   responses:
 *    '200':
 *      description: A successful response
 *    '500':
 *      description: Server error
 * 
 *   description: Use to get selected product
 *   
 */
//CREATE PRODUCT
router.post("/", verifyTokenAndAdmin, async (req, res)=>{
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }catch(err){
        res.status(500).json(err)
    }
})

/**
 * @swagger
 * /api/product/{id}:
 *  put:
 *   tags: [product]
 *   parameters:
 *     - name: id
 *       in: path
 *       description: id of the user
 *       required: true
 *       schema:
 *        type: string
 *     - name: body
 *       in: body
 *       description: product object
 *       required: true
 *       schema:
 *        type: object
 *        properties:
 *         title:
 *          type: string
 *          description: product title
 *          required: true
 *         desc:
 *          type: string
 *          description: product description
 *          required: true
 *         img:
 *          type: string
 *          description: product image
 *          required: true
 *         categories:
 *          type: array
 *          description: product categories
 *          required: true
 *          items:
 *              type: string
 *              required: true
 *         size:
 *          type: string
 *          description: product size
 *          required: true
 *         price:
 *          type: number
 *          description: product price
 *          required: true
 *         color:
 *          type: string
 *          description: product color
 *          required: true
 * 
 *   responses:
 *    '200':
 *      description: A successful response
 *    '500':
 *      description: Server error
 * 
 *   description: Use to update a product
 *   
 */

//UPDATE PRODUCT
router.put("/:id", verifyTokenAndAdmin, async (req, res)=>{
    try{
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    }catch(err){
        res.status(500).json(err);
    }
})


/**
 * @swagger
 * /api/product/{id}:
 *  delete:
 *   tags: [product]
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
 *   description: Use to get selected product
 *   
 */
//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("user has been deleted...");
    }catch(err){
        res.status(500).json(err);
    }
});


/**
 * @swagger
 * /api/product/find/{id}:
 *  get:
 *   tags: [product]
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
 *   description: Use to get selected product
 *   
 */
//GET PRODUCT
router.get("/find/:id", async (req, res)=>{
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    }catch(err){
        res.status(500).json(err);
    }
});

/**
 * @swagger
 * /api/product:
 *  get:
 *   tags: [product]
 *   responses:
 *     '200':
 *       description: A successful response
 *       schema:
 *             type: object
 *             properties:
 *               totalProduct:
 *                 type: integer
 *                 description: total number of product
 *               totalPage:
 *                 type: integer
 *                 description: total number of page
 *               limit:
 *                type: integer
 *                description: limit of product per page
 *               nextPage:
 *                 type: integer
 *                 description: next page
 *               prevPage:
 *                 type: integer
 *                 description: previous page
 *               cuttentPage:
 *                 type: integer
 *                 description: current page
 *               product:
 *                type: array
 *                description: array of product
 *                items:
 *                 type: object
 *                 properties:
 *                  _id:
 *                      type: string
 *                  title:
 *                     type: string
 *                  desc:
 *                    type: string
 *                  img:
 *                    type: string
 *                  categories:
 *                   type: array
 *                   description: array of categories
 *                   items:
 *                    type: string
 *                   
 *                  size:
 *                    type: string
 *                    description: size of product
 *                  color:
 *                   type: string
 *                   description: color of product
 *                  price:
 *                   type: number
 *                   description: price of product
 * 
 *     '500':
 *       description: Server error
 *   description: Use to get all user product
 */
//GET ALL PRODUCT
router.get("/", async (req, res)=>{
    const {page=1, limit=10} = req.query;
    const startIndex = (page-1)*limit;
    const lastIndex = page*limit;
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        let products;

        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5)
        } else if(qCategory){
            products = await Product.find({categories: {
                $in: [qCategory],
            }})
        } else {
            products = await Product.find();
        }
        const totalProduct = products.length;
        const totalPage = Math.ceil(totalProduct/limit);
        const nextPage = (lastIndex >= totalProduct) ? null : parseInt(page)+1;
        const prevPage = page ==  1 ? null : parseInt(page)-1;
        const finalResult = products.slice(startIndex, lastIndex);
        res.status(200).json({
            totalProduct,
            totalPage,
            limit,
            nextPage,
            prevPage,
            currentPage: page,
            products: [...finalResult]
        });
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router