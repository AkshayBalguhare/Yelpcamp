var Campground=require('../models/campgrounds');
var Comment=require('../models/comment');
var middlewareObj={};

middlewareObj.checkCampgroundOwnership = function(req,res,next)
{
    if(req.isAuthenticated())
        {
            Campground.findById(req.params.id,(err,foundCampground)=>{
               if(err|| !foundCampground){
                   console.log("error:",err);
                   req.flash('error','campground is not found');
                   res.redirect('back');
               }
               else
               {
                   if(foundCampground.author.id.equals(req.user._id)|| req.user.isAdmin )
                   return next();
                   else
                   {
                   req.flash('error','you don\'t have permission for that')
                   res.redirect('back');
                   }

               }
            });
        }
        else{
            req.flash('error','you don\'t have permisson for that')
            res.redirect('back');
         }
}
middlewareObj.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated())
     return next();
     req.flash('error','You must be logged in for that');
     res.redirect('/login')
}

middlewareObj.checkCommentOwnership = function (req,res,next)
{
    if(req.isAuthenticated())
        {
            Comment.findById(req.params.comment_id,(err,foundComment)=>{
               if(err || !foundComment){
                   console.log("error:",err);
                   req.flash('error','comment not found')
                   res.redirect('back');
               }
               else
               {
                  
                       if(foundComment.author.id.equals(req.user._id)||req.user.isAdmin)
                         return next();
                        else
                        {  
                            req.flash('error','you don\'t have permisson for that');
                            res.redirect('back');
                        }
                   }
                   })
                   }

        else{
        req.flash('error','you need to be logged in for that');
        res.redirect('back');
        }
}
module.exports =  middlewareObj;
