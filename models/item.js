var mongoose= require('mongoose');

var Item=mongoose.model('Item',{
    title:{
      type:String,
      required:true,
      minlength:1,
      trim:true
    },
    url:{
      type:String,
      required:true,
      minlength:1,
      trim:true
    },
    category:{
      type:String,
      required:true,
      minlength:1,
      trim:true
    }
});

module.exports=Item;