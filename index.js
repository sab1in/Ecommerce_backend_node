const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

const app = express();

const swaggerOptions = {
    
    swaggerDefinition: {
        info: {
            title: "Ecommerce API",
            description: 'node js api for ecommerce site',
            version: "1.0.0",
        },
    },
    components: {
        securitySchemes: {
          jwt: {
            type: "http",
            scheme: "bearer",
            in: "header",
            bearerFormat: "JWT"
          },
        }
    },
      security: [{
        jwt: []
      }],
    apis: ['routes/*.js'],
};




const swaggerDocs = swaggerJsdoc(swaggerOptions);
console.log(swaggerDocs);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
/**
 * @swagger
 * components:
 * securitySchemes:
 *   bearerAuth:            # arbitrary name for the security scheme
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT    # optional, arbitrary value for documentation purposes
 * security:
 *   - bearerAuth: []  
 */

//config dotenv to use (.env)
dotenv.config();

//connect to database
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("successfull");
}).catch((err)=>{
    console.log("error aako xa ta")
    console.log(err)
})

// to make that api accept json
app.use(express.json());

//cors
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","*");
    res.setHeader("Access-Control-Allow-Methods","*");
    next();
})

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);

//listening to the server
app.listen(process.env.PORT || 8000, ()=>{
    console.log("backend server is running");
})
