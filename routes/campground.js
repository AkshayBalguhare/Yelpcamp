var express=require('express');
var router=express.Router();
var Campground=require('../models/campgrounds');
var middlewareObj=require('../middleware');


router.get('/',(req,res)=>{
  if(req.query.search)
  {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Campground.find({name:regex},(err,allcampgrounds)=>{
      if(err){
      console.log("error:",err);
      }
     
      else {   
        var noMatch;
        if(allcampgrounds.length<1)
          noMatch='campground not found, try again';
          
      res.render("campground/index",{campgrounds:allcampgrounds, page:'campgrounds',noMatch:noMatch});
      
    }
    });
  }

  else{
    Campground.find({},(err,allcampgrounds)=>{
     if(err)
     console.log("error:",err);
     var noMatch;
    res.render("campground/index",{campgrounds:allcampgrounds, page:'campgrounds',noMatch});
    });
  }
 });
//CREATE - add new campground to DB
router.post("/", middlewareObj.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var price= req.body.price;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  
    
    var newCampground = {name: name, image: image, description: desc, author:author, price:price};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            req.flash("success",'Added '+name);
            res.redirect("/campgrounds");
        }
    });
  });

 router.get('/new',middlewareObj.isLoggedIn,(req,res)=>{
 res.render('campground/new');
 });
 router.get('/:id',(req,res)=>{
     var id=req.params.id;
     Campground.findById(id).populate("comments likes").exec((err,foundCampground)=>{
         if(err || !foundCampground){
         console.log("error:",err);
         req.flash('error','campground not found');
         res.redirect('back');
         }
         else
         res.render("campground/show",{campground:foundCampground});
     });
 });
 router.get('/:id/edit',middlewareObj.checkCampgroundOwnership,(req,res)=>{
     Campground.findById(req.params.id,(err,campground)=>{
        if(err)
        console.log("error:",err);
        else
        res.render('campground/edit',{campground:campground});
     });
     
 });

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){

  
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect("/campgrounds/" + campground._id);
          }
      });
    });

router.delete('/:id',middlewareObj.checkCampgroundOwnership,(req,res)=>{
Campground.findByIdAndDelete(req.params.id,(err)=>{
        if(err)
        return redirect('/campgrounds/'+req.params.id);
        req.flash('error','campground deleted');
        res.redirect('/campgrounds');
    });
});

// Campground Like Route
router.post("/:id/like", middlewareObj.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
      if (err) {
          console.log(err);
          return res.redirect("/campgrounds");
      }

      // check if req.user._id exists in foundCampground.likes
      var foundUserLike = foundCampground.likes.some(function (like) {
          return like.equals(req.user._id);
      });

      if (foundUserLike) {
          // user already liked, removing like
          foundCampground.likes.pull(req.user._id);
      } else {
          // adding the new user like
          foundCampground.likes.push(req.user);
      }

      foundCampground.save(function (err) {
          if (err) {
              console.log(err);
              return res.redirect("/campgrounds");
          }
          return res.redirect("/campgrounds/" + foundCampground._id);
      });
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


 module.exports=router;