var express=require('express');
var router=express.Router();
var User=require('../models/user');
var passport=require('passport');

router.get('/',(req,res)=>{
    res.render("landing_pg")
});
router.get('/register',(req,res)=>{
    res.render('register',{page: 'register'});

});

router.post('/register',(req,res)=>{
    var newUser=new User({username: req.body.username});
    if(req.body.adminCode==='code0131'){
        newUser.isAdmin = true;
    }
    User.register(newUser,req.body.password,(err,user)=>{
        if(err)
        {
                
                req.flash('error',err.message);
                return res.redirect('/register');
        }
        passport.authenticate('local')(req,res,()=>{
            req.flash('success','registered succesfully, Welcome '+user.username);
            res.redirect('/campgrounds');
        });
    });
});
router.get('/login',(req,res)=>{
   
    res.render('login',{page:'login'});
});
router.post('/login',passport.authenticate('local',{
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
}),(req,res)=>{
   
});
router.get('/logout',(req,res)=>{
   
    req.logout();
    req.flash('success','logged out succesfully');
    res.redirect('/campgrounds');
});

module.exports=router;