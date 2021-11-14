require('dotenv').config();

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Student = require('../models/student');
var User = require('../models/user');
var Sanction = require('../models/Sanction');
var Statistic = require('../models/Statistical');
var Report = require('../models/report');
var Archived = require('../models/archived');
var Token = require('../models/token');


const requestAccessToken = ( user ) => {
  return jwt.sign( user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' } );
};

const authentication = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[ 1 ];

  if( !token ) return res.sendStatus( 401 );

  jwt.verify( token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if( err ) return res.sendStatus( 401 );

    req.user = user;
    next();
  });
}

// ================ Authentication routes ==================

/* GET home page. */
router.get('/verify-me', authentication, async (req, res, next) => {
  // If a request came here then it is authorized
 	console.log( req.user );
 	
  return res.json({ user: req.user, message: `Welcome ${ req.user.username }`});
});


router.post('/sign-in', async (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username: username, password: password }, (err, doc) => {
    if( err ) return res.sendStatus( 500 );

    if( doc ){
    	console.log( doc );
  		if( doc.status === 'active' ){
  			console.log('here');
  			console.log(doc.status === 'active');

	      const user = { name: username };
	      const accessToken = requestAccessToken( user );
	      const refreshToken = jwt.sign( user, process.env.REFRESH_TOKEN_SECRET );

	      Token.create({ code: refreshToken }, err => {
	        if( err ) return res.sendStatus( 500 );

	        let path = '';

	        switch( doc.role ){
	        	case 'admin':
	        		path = '/admin';
	        		break;

	        	case 'sysadmin':
	        		path = '/system-admin';
	        		break;

	        	case 'adminstaff':
	        		path = '/administrative-staff';
	        		break;

	        	default:
							path = '/student';	        		
	        		break;
	        }

	        return res.json({
	          message: `Welcome ${ username }!`,
	          accessToken,
	          refreshToken,
	          role: doc.role,
	          path 
	        });
	      });
  		}
  		else{
  			console.log('here2');
  			return res.sendStatus( 403 );
  		}
    }
    else{
      return res.status( 403 ).json({
        message: 'Incorrect password or username'
      });
    }
  });
});


router.post('/sign-up', async (req, res, next) => {
  const { username, password, masterPass } = req.body;

  User.findOne({ username: username }, (err, doc) => {
    if( err ) return res.sendStatus( 500 );

    if( doc ) return res.status( 403 ).json({ message: 'Username is already used' });

    const user = { name: username };
    const accessToken = requestAccessToken( user );
    const refreshToken = jwt.sign( user, process.env.REFRESH_TOKEN_SECRET );


    User.find({}, (err, doc) => {
      if( err ) return res.sendStatus( 500 );

      let role = 'normal';

      if( !doc.length ) role = 'admin';

      if( role === 'normal' ){
        User.find({ password: masterPass }, (err, doc) => {
          if( err ) return res.sendStatus( 500 );

          if( doc.length ){
            // create token and then the account
            Token.create({ code: refreshToken }, err => {
              if( err ) return res.sendStatus( 500 );

              User.create({ role: role, username: username, password: password }, err => {
                if( err ) return res.sendStatus( 500 );

                return res.json({
                  message: `Welcome ${ username }!`,
                  accessToken,
                  refreshToken
                });
              })
            });
          }
          else{
            return res.status( 403 ).json({
              message: 'Master password is Incorrect'
            })
          }
        });
      }
      else{
        // Create as an admin
        Token.create({ code: refreshToken }, err => {
          if( err ) return res.sendStatus( 500 );

          User.create({ role: role, username: username, password: password }, err => {
            if( err ) return res.sendStatus( 500 );

            return res.json({
              message: `Welcome ${ username }!`,
              accessToken,
              refreshToken
            });
          })
        });
      }
    });
  });
});


router.delete('/sign-out', authentication, async ( req, res ) => {
  Token.deleteOne({ code: req.body.token }, (err) => {
    if( err ) return res.sendStatus( 503 );

    return res.sendStatus( 200 );
  });
});


router.post('/auth/refresh-token', async ( req, res ) => {
  const { rtoken } = req.body;

  if( !rtoken ) return res.sendStatus( 403 );

  Token.find({ code: rtoken }, (err, token) => {
    if( err ) return res.sendStatus( 503 );

    if( !token && !token.length ) return res.sendStatus( 403 );

    jwt.verify( rtoken, process.env.REFRESH_TOKEN_SECRET, ( err, user ) => {
      if( err ) return res.sendStatus( 403 );

      const accessToken = requestAccessToken({ name: user.name });

      return res.status( 200 ).json({ 
        message: 'token has been received successfully ', 
        accessToken: accessToken
      });
    });
  });
});

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.render('index', { title: 'Express' });
});


// router.post('/signin', async( req, res ) => {
// 	const { username, password } = req.body;

// 	User.findOne({ username: username, password: password }, (err, doc) => {
// 		if( err ) return res.sendStatus( 503 );

// 		console.log( doc );

// 		if( doc ) return res.status( 200 ).json({ message: 'Successful' });

// 		return res.status( 403 ).json({ message: 'Username or password is wrong'});
// 	});
// });


router.get('/student-data', async( req, res ) => {
	Student.find({}, (err, doc) => {
		if( err ) return res.sendStatus( 503 );

		return res.json( doc );
	});
});


module.exports = router;
