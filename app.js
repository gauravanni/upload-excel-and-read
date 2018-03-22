const express= require('express');
var path = require('path');
const bodyParser= require('body-parser');
var xlstojson = require("xls-to-json-lc");

const mongoose=require('./config/db');
const Item=require('./models/item');

const app=express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const multer = require('multer');
app.use(bodyParser.json());

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});

var upload = multer({ 
  storage: storage,
  fileFilter : function(req, file, callback) { //file filter
      if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
          return callback(new Error('Wrong extension type'));
      }
      callback(null, true);
  }
}).single('file');

app.post('/upload', function(req, res) {
  var exceltojson;
  upload(req,res,function(err){
      if(err){
           res.json({error_code:1,err_desc:err});
           return;
      }
      if(!req.file){
          res.json({error_code:1,err_desc:"No file passed"});
          return;
      }
      console.log();
      if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
          exceltojson = xlsxtojson;
      } else {
          exceltojson = xlstojson;
      }
      try {
          exceltojson({
              input: req.file.path,
              output: null, //since we don't need output.json
              lowerCaseHeaders:true
          }, function(err,result){
              if(err) {
                  return res.json({error_code:1,err_desc:err, data: null});
              } 
              Item.collection.insert(result,(err,docs)=>{
                res.status(200).send(docs);
              })
              
          });
      } catch (e){
          res.json({error_code:1,err_desc:"Corupted excel file"});
      }
  })
});

app.get('/',(req,res)=>{
  res.render('index');
});

app.post('/',(req,res)=>{
//   var newItem= new Item(req.body);
//   newItem.save().then((doc)=>{
//     res.send(doc);
//   },(e)=>{
//   res.status(400).send(e);
//   });
});

app.listen(3000,()=>{
  console.log('server started at port 3000');
});





