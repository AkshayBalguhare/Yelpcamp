var express=require('express');
var router=express.Router({mergeParams:true});
var Campground=require('../models/campgrounds');
var Comment=require('../models/comment');
var middlewareObj=require('../middleware');

router.get('/new',middlewareObj.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,foundCampground)=>{
        if(err)
        console.log("error:",err);
        else
        res.render("comment/new",{campground:foundCampground});
    });
 });
 router.post('/',middlewareObj.isLoggedIn,(req,res)=>{
     Campground.findById(req.params.id,(err,foundCampground)=>{
         if(err)
         console.log("error:",err);
         else
         { 
             Comment.create(req.body.comment,(err,comment)=>{
                 if(err)
                 console.log("error:",err);
                 else
                 {
                     comment.author.id=req.user._id;
                     comment.author.username=req.user.username;
                     comment.save();
                     foundCampground.comments.push(comment);
                     foundCampground.save();
                     req.flash('success','comment added');
                     res.redirect('/campgrounds/'+foundCampground._id);
                 }
             });
         }
         
     });
 });
 router.get('/:comment_id/edit',middlewareObj.checkCommentOwnership,(req,res)=>{
     
    Campground.findById(req.params.id,(err,campground)=>
    {
        if(err || !campground){
            console.log("error:",err);
            req.flash('error','campground not found');
            res.redirect('back');
            }
        else
        {
            
           Comment.findById(req.params.comment_id,(err,comment)=>{
            if(err){
            console.log("error:",err);
            return res.redirect('back');
            }
            res.render('comment/edit',{campground_id:req.params.id, comment:comment});
     });   
        }
    });
 });

 router.put('/:comment_id',middlewareObj.checkCommentOwnership,(req,res)=>{
     
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,comment)=>{
     if(err){
     console.log("error:",err);
     res.redirect('back');
     }
     req.flash('success','comment updated')
     res.redirect('/campgrounds/'+req.params.id);  
});   
});

router.delete('/:comment_id',middlewareObj.checkCommentOwnership,(req,res)=>{

    Comment.findByIdAndDelete(req.params.comment_id,(err)=>
    {
        if(err)
            console.log("error:",err);
        req.flash('success','comment deleted');
        res.redirect('/campgrounds/'+req.params.id);
            
    })
})


module.exports=router;