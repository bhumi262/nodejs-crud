import express from 'express';
import mongoose, { mongo } from 'mongoose';
import orderRoutes from './Route/orderRoutes.js'
import bodyParser from 'body-parser';
import session from 'express-session';

const app = express();


app.use(session({
    secret: "bhumi",
    resave: false,
    saveUninitialized: true
  }));
  

app.use((req,res,next)=>{
    res.locals.message=req.session.message;
    delete req.session.message;
    next();
})
// Middleware to parse JSON bodies
app.use(express.json());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setting template  view engine
app.set("view engine", "ejs")

// Use the router middleware
app.use("",orderRoutes);




//  database connection 
mongoose.connect("mongodb://127.0.0.1:27017/orders").then(() => {
    console.log("database connected succesfullyy...")
}).catch((err) => {
    console.log("database not connected", err)
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
});



app.listen(5000, () => {
    console.log("server is running at port 5000..")
});