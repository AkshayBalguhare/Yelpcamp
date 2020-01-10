const   express                 =   require("express"),
        app                     =   express(),
        bodyparser              =   require('body-parser'),
        mongoose                =   require('mongoose'),
        passport                =   require('passport'),
        localStrategy           =   require('passport-local'),
        passportLocalMongoose   =   require('passport-local-mongoose'),
        Campground              =   require("./models/campgrounds"),
        Comment                 =   require("./models/comment"),
        User                    =   require('./models/user'),
        seedDB                  =   require("./seeds"),
        methodOverride          =   require('method-override'),
        port                    =   process.env.PORT || 3000,
        flash                   =   require('connect-flash'),
        indexRoutes             =   require('./routes/index'),
        commentRoutes           =   require('./routes/comment'),
        campgroundRoutes        =   require('./routes/campground');
// seedDB();
console.log()
mongoose.connect(process.env.DATABASEURL,{ useNewUrlParser: true,useUnifiedTopology:true,useFindAndModify:false });

app.set("view engine","ejs");

app.locals.moment=require('moment');
app.use(express.static(__dirname+'/public'));
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(require('express-session')({
    secret:'I am the best',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");

    next();
});
app.use(indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comment',commentRoutes);

app.listen(port,()=>{
    console.log("The YelpCamp Server Has Started on ",port);
});


