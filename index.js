const express = require('express');
var bodyParser = require('body-parser');
const multer  = require('multer')
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var filepath = "";
let DbService = require("./db");
let dbservice = DbService.getDbServiceInstance();
let {CatagorySchema}= require('./validate');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        let ext;
    if(file.mimetype === "video/mp4")
     ext = '.mp4'
     if(file.mimetype === "image/jpg")
     ext = '.jpg'
     if(file.mimetype === "image/jpeg")
     ext = '.jpeg'
     if(file.mimetype === "image/png")
     ext = '.png'
     
     filepath = file.fieldname + Date.now() + ext
    cb(null,filepath);
    }
  })
const upload = multer({ storage: storage })
const port = 8080;

//post catagories
app.post('/createcatagory',(req,res,next) => {
    let validation = CatagorySchema.validate(req.body);
    if(validation.error){
        res.status(400);
        res.send(validation.error.message);
    }
    else{
        dbservice.postCatagory({
            catagory:req.body.catagory
         })
         .then((response) => {
             res.send(response);
         })
    }
})

//list CATAGORIZED articles
app.get('/getcatarticles',(req,res,next) => {
    let catagories ;
    if (typeof req.query.catagory === 'string' || req.query.catagory instanceof String)
        {
            console.log("string");
            catagories = new Array(req.query.catagory); 
        }
    else {
            console.log("not string");
            catagories = req.query.catagory; 
    }

    
        dbservice.getCatArticles({catagories:catagories})
        .then(response => {
             res.send(response);
         })
    })
//list articles
app.get('/getarticles',(req,res,next) => {
    
        dbservice.getArticles()
        .then(response => {
             res.send(response);
         })
    })
//list catagories
app.get('/getcatagory',(req,res,next) => {
    
        dbservice.getCatagory()
        .then(response => {
             res.send(response);
         })
    })

//edit articles
app.put('/editarticle/:articleid',(req,res) => {
    if('description' in req.body){
        dbservice.putArticle({itemkey:'description',data:req.body.description,id:req.params.articleid})
        .then((response) => {console.log(response);})
    }
    else if('heading' in req.body){
        dbservice.putArticle({itemkey:'heading',data:req.body.heading,id:req.params.articleid})
        .then((response) => {console.log(response);})
    }
    else if('time' in req.body){
        dbservice.putArticle({itemkey:'time',data:req.body.time,id:req.params.articleid})
        .then((response) => {console.log(response);})
    }
    else if('verified' in req.body){
        dbservice.putArticle({itemkey:'verified',data:req.body.verified,id:req.params.articleid})
        .then((response) => {console.log(response);})
    }
    else if('newest' in req.body){
        dbservice.putArticle({itemkey:'newest',data:req.body.newest,id:req.params.articleid})
        .then((response) => {console.log(response);})
    }
    else if('trending' in req.body){
        dbservice.putArticle({itemkey:'trending',data:req.body.trending,id:req.params.articleid})
        .then((response) => {console.log(response);})
    }
    else{
        res.send("invalid feild")
    }
    res.send("edited succesfully")

})
//post articles
app.post('/createarticle',upload.single('poster'),(req,res,next) => {
   let catagories = [] ;
    if (typeof req.body.catagories === 'string' || req.body.catagories instanceof String)
        {
            console.log("string");
            catagories = new Array(req.body.catagories); 
            console.log(catagories);

        }
    else {
        console.log("not string");
        catagories = req.body.catagories; 
        console.log(catagories);

    }

    dbservice.postArticle({
       heading:req.body.heading, 
       time:req.body.read_time, 
       description:req.body.description,
       image:req.file.filename,
       verified:req.body.verified, 
       newest:req.body.newest, 
       trending:req.body.trending,
       catagories:catagories,
    })
    .then((response) => {
        console.log(response);
        res.send(response);
    })

})

//list articles
app.delete('/deletearticle/:id',(req,res,next) => {
    
    dbservice.deleteArticle({id:req.params.id})
    .then(response => {
         res.send(response);
     })
})

app.listen(port,() => console.log("listening.."));
