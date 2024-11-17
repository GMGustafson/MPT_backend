const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
app.use(cors());
app.use(express.static("public"));
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

const upload = multer({ storage: storage });
  

const reviews = [
        {
            "companyName": "Equal Exchange",
            "review": "Mackin Pallet has been fantastic to work with. We, here at Equal Exchange, have been partners with Dan and Jennifer for about 5 years. The pallet condition, which is very important in this industry, along with the service provided is top notch. We greatly value our partnership with Mackin Pallet and know we can depend on them throughout the year. ", 
            "date": "September 19th, 2024", 
            "reviewersName": "Steve Bolton" , 
            "image" : "EE.jpg" 
    
        },
        {
            "companyName":"Spilldam Environmental Inc." ,
            "review":"We have been a customer of Mackin Pallet and Trucking since 2010.  Dan provides a great product and exception service!", 
            "date": "September 19th, 2024", 
            "reviewersName": "Tim Prevost", 
            "image" : "Spilldam.jpg" 
        },
        {
            "companyName": "Suncor Stainless Inc.",
            "review":"Suncor Stainless inc has been buying pallets from Mackin for over 20 years.  The prices & quality are great, and the service couldn’t be better.", 
            "date": "September 20th, 2024", 
            "reviewersName": "Melissa Perkins ", 
            "image" : "Suncor.jpg"
        },
        {
            "companyName":"Custom Blends/ Cindy’s Kitchen Inc. ",
            "review": "I’ve been working with Mackin Pallet & Trucking for a half dozen years. Dan’s service is second to none. He builds our pallets to spec and has same day delivery service. I have recently used his shipping service which was very convenient for me. Dan builds a quality product at a competitive price. His service is the best! It’s a perfect fit for my company's needs.", 
            "date": "October 10th, 2024" , 
            "reviewersName": "Michael Iolli", 
            "image" : "C.png"
        },
        {
            "companyName":"Gem Gravure Co., Inc.- Massachusetts",
            "review": "Gem Gravure has been calling Mackin Pallet since November of 2021 for the removal of used and damaged pallets. Dan Mackin has always provided prompt service and they are a very reliable supplier. The same can be said for the office staff. They were very receptive when we suggested ACH payment versus check payment when paying invoices for their services. We are very happy with our relationship with Mackin Pallet.",
            "date": "October 10th, 2024" , 
            "reviewersName": "Kim Cushing", 
            "image" : "gem.jpg"
        }
    
]; 

const contacts = [
    {
        "id": "papa",
        "name": "Daniel E. Mackin",
        "position": "President",
        "phone": "(508) - 584 - 4248",
        "email": "mackinpallet@gmail.com",
        "image": "papa.jpg"
    },
    {
        "id": "mom",
        "name": "Jennifer P. Mackin Bruce",
        "position": "Chief Financial Officer",
        "phone": "(508) - 612 - 0831",
        "email": "mackinpallet@gmail.com",
        "image": "mom.jpg"
    },
    {
        "id": "nana",
        "name": "Rhonda M. Mackin",
        "position": "Clerk",
        "phone": "(508) - 584 - 4248",
        "email": "mackinpallet@gmail.com",
        "image": "nana.jpg"
    }
];

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/reviews", (req,res)=>{
    res.json(reviews);
});


app.post("/api/reviews",upload.single("img"), (req, res)) =>{
    console.log("in a post request");
    
    const result = validateReview(req.body); 

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        console.log("I have an error");
        return;
    }; 

    const Review = 
    { 
        companyName: req.body.companyName, 
        review: req.body.review, 
        reviewersName: req.body.reviewersName, 
        date: req.body.date, 
    }; 

    if (req.file) {
       reviews.image = req.file.filename;
      }

      Reviews.push(Review);

      console.log(Review);
      res.status(200).send(Review);
    };
    
    const validateReview = (Review) => {
      const schema = Joi.object({
        companyName: Joi.string().min().required(),
        review: Joi.string().min().required(),
        reviewersName: Joi.string().min().required(),
        date: Joi.string().min().required(),
      });

      return schema.validate(Review);
    };


 


app.get("/api/contacts", (req, res) => {
    res.json(contacts);
});

app.listen(3003, () => {
    console.log("Listening.... ");
});

