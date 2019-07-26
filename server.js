var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var bcrypt = require('bcrypt');
var mongojs = require('mongojs');
var LocalStrategy = require('passport-local').Strategy;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

var jwt = require('jsonwebtoken');
var passportJWT = require('passport-jwt');


var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = 'mycode11';
jwtOptions.passReqToCallback=true;

var strategy = new JwtStrategy(jwtOptions, function(req,jwt_payload, next) {
  var originalUrl=req.originalUrl;
  //console.log('url',originalUrl);
  //var user = users[_.findIndex(users, {id: jwt_payload.id})];
  db.signup_data.findOne({_id:mongojs.ObjectId(jwt_payload._id)},function(err,user){
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

})
passport.use(strategy);
app.use(passport.initialize());

app.use (express.static(__dirname+"/public"));
app.use('/app/*',express.static(__dirname+'/public/index.html'));


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://localhost:3000");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var db = mongojs('employee',['signup_data']);

/*function isValidUser(req,res,next){
    if(req.isAuthenticated()) next();
    else return res.status(401).json({message:'Unauthorized Request'});
  }*/

app.post('/signup',function(req,res){
    db.signup_data.find({email:req.body.email},function(err,doc){
        if(!err)
        {
            if(doc.length===0)
            {
              bcrypt.hash(req.body.password, 10, function(err, hash) {
                if(err){ res.json(false);};
                req.body.password=hash;
                db.signup_data.insert(req.body,function (err, docs) {
                    if(!err)
                    {
                        res.json(true);
                    }
                    else
                    {
                        res.json(false);
                    }
                   
                });
              });
              
            }
            else
            {
                res.json('duplicate');
            }

        }
        else
        {
            res.json(false);
        }
    })
    
   
});

passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(function(id, done) {
    db.signup_data.findOne({_id: mongojs.ObjectId(id)}, function(err, user) {
      done(err, user);
    });
  });

passport.use('local',new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
    },
    function (username, password, done) {
        db.signup_data.findOne({ email: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            var hash=user.password;
            bcrypt.compare(password, hash, function(err, ress) {
                // 
                if(ress === true)
                {
                    return done(null, user);
                }
                else
                {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            }) ;
            
            
        });
    }
));
  app.post('/login',function(req,res,next){
    passport.authenticate('local', function(err, user, info) {
        if (err) { return res.status(404).json(err); }

        if (!user) { return res.status(501).json(info); } 

        req.logIn(user, function(err) {
          if (err) { return res.status(501).json(err); }
          var token = jwt.sign(user, jwtOptions.secretOrKey, {expiresIn: 12000}); 
          return res.status(200).json({"token" : token,message:'Login Success'});
        });
      })(req, res, next);
   
});
app.get('/check_login',passport.authenticate('jwt', { session: false }),function(req,res){
    if(req.user){
      res.json(true);
    }
    else{
      res.json(false);
    }
})
/*app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});*/

app.get('/getData',passport.authenticate('jwt', { session: false }),function(req, res) {
db.signup_data.find(function(err, docs) {  
    if(docs.length===0)
     {
      res.json("nodata")
     }
     else
     {
      res.json(docs);
     }                 
    });
});


app.listen(3000);
console.log('server is running on 3000');