    const express = require("express");
    const cors = require("cors");
    const app = express();
    const Joi = require("joi");
    app.use(cors());
    app.use(express.static("public"));
    const multer = require("multer");
    const mongoose = require("mongoose"); 
    app.use("/uploads", express.static("uploads")); 

    const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
    });

    const upload = multer({ storage: storage });

    mongoose 
        .connect("mongodb+srv://GraceMackin:Pn5HltGQcWSpJ25c@mackinpallettrucking.yyxgq.mongodb.net/?retryWrites=true&w=majority&appName=mackinpallettrucking")
        .then(()=> { console.log("connected to mongodb, yay congrats!"); })
        .catch ((error) => { console.log ("couldn't connect to mongodb", error); })

    const reviewsSchema = new mongoose.Schema({ 
        companyName: String, 
        review: String, 
        reviewersName: String, 
        date: Date, 
        img: String, 
    })

    const Review = mongoose.model("Review", reviewsSchema); 
    
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

    app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
    });

    app.get("/api/reviews", async (req, res) => {
        const reviews = await Review.find(); 
        res.json(reviews);
    });

    app.get("/api/reviews/:id", async (req, res) => { 
        const reviews = await Review.findOne({_id:id}); 
        res.send(review); 
    }); 

    app.get("/api/contacts", (req, res) => {
        res.json(contacts);
        });

    app.post("/api/reviews", upload.single("img"), async (req, res) => {
        const result = validateReview(req.body);

        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }

        const review = new Review ({ 
            companyName: req.body.companyName,
            review: req.body.review,
            reviewersName: req.body.reviewersName,
            date: req.body.date,
        }); 

        if (req.file) {
            review.img = "images/" + req.file.filename;
        }

        const newReview = await review.save();
        res.send(newReview);  
        });

    app.put("/api/reviews/:id", upload.single("img"), async (req,res) => {
        console.log("hi"); 
        const result = validateReview(req.body); 
        
        
        if(result.error){
            res.status(400).send(result.error.details[0].message);
            return;
        }

        let fieldsToUpdate = { 
            companyName: req.body.companyName,
            review: req.body.review,
            reviewersName: req.body.reviewersName, 
            date: req.body.date
        }; 

        if(req.file){
            fieldsToUpdate.img = "images/" + req.file.filename;
        }
        
        const wentThrough = await Review.updateOne( 
            {_id: req.params.id}, fieldsToUpdate 
        );
        
        
        console.log(wentThrough); 
        const updatedReview = await Review.findOne({_id: req.params.id}); 
        
        console.log(updatedReview);
        res.send(updatedReview); 
    }); 
        // res.status(200).send(updatedReview);}); 
        

        
        app.delete("/api/reviews/:id", async (req,res)=>{
            const review = await Review.findByIdAndDelete(req.params.id); 
            res.send(review); 
        }); 
        
        const validateReview = (review) => {
            const schema = Joi.object({
                companyName: Joi.string().min(3).required(),
                review: Joi.string().min(3).required(),
                reviewersName: Joi.string().min(3).required(),
                date: Joi.string().min(3).required(),
            });

        return schema.validate(review);
        };

    app.listen(3003, () => {
    console.log("Listening....");
    });
