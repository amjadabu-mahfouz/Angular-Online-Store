const port = 8989; 
const DB_PATH = '.\\ecommerceDB.db';

const https = require('https')
const fs = require('fs')

const express = require('express');
const session = require('express-session');

// parse application/json >> for POST request
var bodyParser = require('body-parser');

var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(DB_PATH);






//for JWT ==> user authentication session data
const jwt = require("jsonwebtoken");

//used to validate JWT, must set the "secret" with a public key
//const expressJwt = require('express-jwt');
const { expressjwt: expressJwt } = require("express-jwt");

//the json web key set is used to generate rotating public keys
const jwksRsa = require('jwks-rsa');




// pass the express-jwt a public RSA key and you will get a middleware function that will throw error if JWT is not in the headers or if JWT is expired ==> used for validation
/**
// DOESNT WORK WITH LOCALHOAST / SELF-SIGNED CERT
const checkIfAuthenticated = expressJwt({
	
	secret: jwksRsa.expressJwtSecret({
        cache: true, // when set to true, the key returned is chached for 10hours with a max of 5 chached keys
        rateLimit: true,  // if set to true, no more than 10 requests will be made per minute
        jwksUri: "https://localhost:8989/.well-known/jwks.json" //must supply a uri < https://{yourDomain}/.well-known/jwks.json >
    }),
    algorithms: ['RS256']
	
}); 

const PUBLIC_RSA_KEY_GEN = jwksRsa({
  jwksUri: "https://localhost:8989/.well-known/jwks.json",
   requestHeaders: {'user-agent': 'some-user-agent'},
  timeout: 30000 // Defaults to 30s
});

async function getRSAKey(){
	const kid = 'RkI5MjI5OUY5ODc1N0Q4QzM0OUYzNkVGMTJDOUEzQkFCOTU3NjE2Rg'; //randomly generate this keyid
	const key = await PUBLIC_RSA_KEY_GEN.getSigningKey(kid);
	const signingKey = key.getPublicKey();
	//console.log("KEY TEST " + signingKey);
}
getRSAKey();



const checkIfAuthenticated = expressJwt({
	secret: RSA_PUBLIC_KEY,
    algorithms: ['RS256']
}); 

**/

const RSA_PRIVATE_KEY = fs.readFileSync('./KEY_GEN/pr.pem', "utf8");
const RSA_PUBLIC_KEY = fs.readFileSync('./KEY_GEN/pu.pem', "utf8");





app.use(bodyParser.json());




const crypto = require('crypto');

//app.enable('trust proxy');
app.set('trust proxy', 1) // trust first proxy







const httpsOptions = {
    key: fs.readFileSync('C:\\Users\\user\\Desktop\\Web Design\\E-commerce Site\\angular Proj\\certTest\\security\\cert.key'),
    cert: fs.readFileSync('C:\\Users\\user\\Desktop\\Web Design\\E-commerce Site\\angular Proj\\certTest\\security\\www.localhost.cer'),
	ca: ['C:\\Users\\user\\Desktop\\Web Design\\E-commerce Site\\angular Proj\\certTest\\security\\www.localhost.cer']
}

const cors = require('cors');
app.use(cors( {
    origin: ['http://localhost:4200', 'https://localhost:4200'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
} ));

app.use(session({
    secret: 'MySecret123456MySecret',
    resave: true,
    saveUninitialized: true,
    cookie: {
		sameSite : "none",
        secure: true,
    },
}));

/**
// allow cross-site requests
app.use(function(req, res, next) {
res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
res.header('Access-Control-Allow-Headers', 'Content-Type');
res.header('Access-Control-Allow-Credentials', 'true');
res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS, HEAD');
next();
});

**/





//GET PRODUCTS
 app.use("/getProducts", (req, res) => 
 {
   
   let cat = req.body.category;
   
	//console.log(req.session.cart);
	//console.log(req.body);
	

	   if(cat == "everything"){
		   
		   query = "select * from products"
		   db.all(query, (err, rows) =>
		   {
			
			   if (err == null)
			   {
				   
				   res.write(JSON.stringify(rows));
				   res.end();
			   }
			   else
			   {
				   res.end("Error " + err);
			   }
		   });
		   
	   }
	   else{
		   
		   query = "select * from products where category = ?"
		   db.all(query, cat, (err, rows) =>
		   {
			
			   if (err == null)
			   {
				   
				   res.write(JSON.stringify(rows));
				   res.end();
			   }
			   else
			   {
				   res.end("Error " + err);
			   }
		   });
 
	   }
	

  });




 app.post("/updateCart", (req,res) =>
 {
	let item = req.body;
	//console.log("this is the item: " +  item.id);
	//console.log("this is the cart: " + req.session.cart);

	
	if (!req.session.cart && item.id){
		req.session.cart = [];
	}
	
	
	
	let ind = 0;
	let inCart = false;
	let nullCheck = (item.id != null && item.id != undefined && item.id > 0);
	//console.log("NC " + nullCheck);	
	//undefined/null check
	if (nullCheck){ 									       
	
		for(x of req.session.cart){
			//match found
			if(x.id == item.id){  
				//qty > 0
				if(parseInt(item.qty) > 0){  			
					req.session.cart[ind] = item;
					inCart = true;	
				}
				//qty == 0
				else{ 
					//console.log("qty == 0 ");			
					req.session.cart.splice(ind, 1);// 2nd parameter ==> remove only 1 item
				}
			}
			ind ++;
		}
		
	}
	
	if(nullCheck && !inCart && (item.qty > 0) ){
		req.session.cart.push(item);
	}
	//console.log("*********************************");
	res.end(JSON.stringify(req.session.cart));
	
 });  


//GET ITEMS FROM DB CORRISPONDING TO CART ITEMS
 app.use("/getCartItems", (req,res) =>
 {

	let arrayStr = [];
	let returnVal = [];
	
	//check is session cart exists
	if(!req.session.cart || req.session.cart.length == 0){
		//console.log("No Cart Returned!!");
		res.write(JSON.stringify("empty cart"));
		res.end();
	}
	else{
		//console.log("Cart Returned!!");
		for(x of req.session.cart){
			arrayStr.push(x.id);
		}
		
		let arrayStr2 = arrayStr.toString();
		
		
		query = "select * from products where id in ("+ arrayStr.toString()+")"
		db.all(query, (err, rows) =>
		{
				
			if (err == null)
			{
					   	
				for (var i = 0; i < rows.length; i++) {
					//console.log("loop test: " + rows[i].product_name);
					returnVal.push({
						id: rows[i].id,
						product_name : rows[i].product_name,
						img : rows[i].img,
						desc :  rows[i].desc,
						price : rows[i].price,
						qty : req.session.cart[i].qty	
					});			
				}
				
				//console.log("RETURN VALUE " + returnVal);
				res.write(JSON.stringify(returnVal));
				res.end();

			}
			else
			{
				res.end("Error " + err);
			}
		});
		
	}
	

 });  





app.use("/userSignUp", (req,res) =>
 {

	
	let pw = req.body.user_secret.toString();
	let email = req.body.email.toString();
	let dob = req.body.dob.toString();
	let firstName = req.body.first_name;
	let lastName = req.body.last_name;
	let country = req.body.country;
	let prov = req.body.prov;
	
	
	( async () =>{
		let userInDB = await checkIfUserExists(email);
		//console.log("number of matching rows:  " + userInDB);
		
		if(userInDB == 0){
			
			let saltNhash = createHashNSalt(pw);  //returns an array ==> 1st[0] element = salt, 2nd[1] = hash

			let params = [firstName, lastName, email, saltNhash[1], saltNhash[0], dob, country, prov];
			//console.log(params);
			
			query = "insert into users (first_name, last_name, email, hash, salt, dob, country, prov_state) values (?, ?, ?, ?, ?, ?, ?, ?);"
			db.all(query, params, (err, rows) => {
				
				if (err == null){
					res.end(JSON.stringify({msg : "New user created!"}));
				}
				else{
					res.end("Error " + err);
				   }
			});	
			
		}
		else{
			
			res.end(JSON.stringify({msg : "This user already exists!"}));
		}
			
		
	})()
	
 });




app.use("/userCheckout", (req,res) =>
 {
	let  jwtToken = req.headers.authorization;
	let jwtVal = checkJWT(jwtToken);
	 
	if( !(jwtVal == "expired" || jwtVal == "undefined") ){
		
		let checkOutArr = [];
		
		checkOutArr.push(req.body.full_name);
		checkOutArr.push(req.body.email);
		checkOutArr.push(req.body.address);
		checkOutArr.push(req.body.city);
		checkOutArr.push(req.body.prov);
		checkOutArr.push(req.body.zip);
		checkOutArr.push(req.body.card_name);
		checkOutArr.push(req.body.card_number);
		checkOutArr.push(req.body.exp_month);
		checkOutArr.push(req.body.exp_year);
		checkOutArr.push(req.body.ccv);
		checkOutArr.push(jwtVal);

		//console.log("USER LOGGED IN");
		//console.log(req.body);
		let checkoutID = -1;
		
		//insert checkout/billing info
		query = "insert into userCheckout (full_name, email, address, city, prov, zip, card_name, card_number, exp_month, exp_year, ccv, user_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
		db.all(query, checkOutArr, (err, rows) => {
		 if (err == null){
			//console.log("INSERT SUCCESS"); 
		 }
		 else{
			res.end("Error " + err);
		 }
		});
		
		//retrieve that same row inputted inorder to get the autogenerated ID field (so it can be used as a foreign key)
		query = "select * from userCheckout where full_name == ? AND email == ? AND address == ? AND city == ? AND prov == ? AND zip == ? AND card_name == ? AND card_number == ? AND exp_month == ? AND exp_year == ? AND ccv == ? AND user_id ==?;"
		db.all(query, checkOutArr, (err, rows) => {
		 if (err == null){

			checkoutID = rows[rows.length - 1].id;
		 
			if(checkoutID > 0){
				//insert each cart item into the userCart(userCheckout) table for further statistical analysis in the future
				let cartItemArr = [];
				//console.log("INSERTING into CARTTABLE");
				for(let cartItem of req.body.cart){
					
					cartItemArr.push(cartItem.product_id);
					cartItemArr.push(checkoutID);
					cartItemArr.push(cartItem.qty);
					cartItemArr.push(cartItem.price);
					
					//console.log(cartItemArr);
					
					//finally, insert the cart information with the checkoutID as the foreign key
					query = "insert into userCart (product_id, checkout_id, qty, price) values (?, ?, ?, ?);"
					db.all(query, cartItemArr, (err, rows) => {
					 if (err == null){

					 }
					 else{
						res.end("Error " + err);
					 }
					});
					
					cartItemArr = [];
				}
				//after the cart items are added to DB, reset the cart session & end session
				req.session.cart = [];
				res.end(JSON.stringify({msg: "checkout success"}));
			}
		 
		 
		 }
		 else{
			res.end("Error " + err);
		 }
		});
		


	
	}
	else{
		
		//console.log("USER LOGIN REQUIRED/JWT EXPIRED");
		res.end(JSON.stringify({msg : "session expired"}));
	}
	

	 
});


function checkJWT(tkn){

	if(tkn){
		
		//console.log("JWT found!");
		
		try{
			const payloadTest = jwt.verify(tkn, RSA_PUBLIC_KEY, { algorithms: 'RS256'});
			//console.log("JWT PAYLOAD: " + payloadTest);
			//console.log("JWT PAYLOAD email: " + payloadTest.user);
			return payloadTest.user;
			
		}
		catch(error){
			//console.log("JWT ERROR: " + error);
			return "expired";
		}
		
	}
	else{
		//console.log("No JWT found!");
		return "undefined";
	}
	
}


app.use("/userLogin", (req,res) =>
 {
	
	let email = req.body.email;
	let pw = req.body.pw;
	
	let  jwtToken = req.headers.authorization;
	

	let jwtVal = checkJWT(jwtToken);
	//console.log("JWT CHECK RETURNED: " + jwtVal);
	

	query = "select * from users where email == ?"
		db.all(query, email, (err, rows) => {
			
			if (err == null){
				//console.log("rows returned" + rows.length);
				if(rows.length == 0){
					res.end( JSON.stringify({msg : "This user does not exist!"}) );
				}
				else{
				
					let salt = rows[0].salt;
					let dbHash = rows[0].hash;
					//console.log("this is salt from row: " + salt + "    and dbhash: " + dbHash);
					
					let hash = crypto.pbkdf2Sync(pw, salt, 10000, 64, `sha512`).toString(`hex`);

					if(dbHash == hash){
						//console.log("WE FOUND A MATCH");
						
						if(jwtVal == "expired" || jwtVal == "undefined" || jwtVal != email){						
			
							//console.log("MAKING JWT, 1HOUR EXPIRATION TIME");
							const token = jwt.sign({"user":email}, RSA_PRIVATE_KEY, {
								algorithm: 'RS256',
								expiresIn: 60 * 60, 
								jwtid: crypto.randomBytes(20).toString(),
							});
							res.end(JSON.stringify({msg : "login Success!", username: rows[0].first_name + " " +rows[0].last_name,  token: token}));
						}
						//console.log("THIS IS THE TOKEN GENERATED: " + token);
						res.end(JSON.stringify({msg : "login Success!"}));
					}
					else res.end(JSON.stringify({msg : "Invalid Password"}));
					
				}
			}
			else{
				res.end("Error " + err);
			   }
		   });	

 });



 



function createHashNSalt(userSecret){
	// Creating a unique salt 
    let salt = crypto.randomBytes(16).toString('hex');
  
    // Hashing user's salt and secret/password with 10,000 iterations, 64 length using sha512 digest
    let hash = crypto.pbkdf2Sync(userSecret, salt, 10000, 64, `sha512`).toString(`hex`);
	
	return [salt, hash];
}


//check DB for user and return number of rows (-1 if user does nto exist, and 1 if they do)
async function checkIfUserExists(email){
	
	//console.log("THIS IS THE SEARCH USERNAME: " + email);
	
	
	let waitForRows = new Promise(function(resolve){
		
		let rowNum = -1;
		
		query = "select COUNT(*) as rowCount from users where email == ?"
		rowNum = db.all(query, email, (err, rows) => {
			
		if (err == null){
			rowNum = rows[0].rowCount;
			resolve(rowNum);
		}
		else{
			//console.log("Error " + err);
			resolve(-1);
		}
	});	
			
	});
	
	
	
	
	
	

	//let returnVal = await waitForRows;
	//console.log("LAST ROW CHECK;  " + returnVal);
	return await waitForRows;
}



/**


app.use("/getCart", (req,res) =>
 {

		   query = "select * from products"
		   db.all(query, (err, rows) =>
		   {
			
			   if (err == null)
			   {
				   
				   res.write(JSON.stringify(rows));
				   res.end();
			   }
			   else
			   {
				   res.end("Error " + err);
			   }
		   });

 });  


// --------------------------------------SERVER
var server = app.listen(port, function()
{
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://%s:%d', host, port);
});
**/

const server = https.createServer(httpsOptions, app)
    .listen(port, () => {
        console.log('server running at ' + port)
})







