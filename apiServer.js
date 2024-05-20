const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;

// These lines will be explained in detail later in the unit
app.use(express.json());// process json
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
// These lines will be explained in detail later in the unit

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://CQUpass:admin@cluster0.2k3lnev.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// Global for general use
var userCollection;
var orderCollection;

client.connect(err => {
   userCollection = client.db("GiftDelivery").collection("users");
   orderCollection = client.db("GiftDelivery").collection("orders");
   

  // perform actions on the collection object
  console.log ('Database up!\n')
 
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

 
app.get('/getUserDataTest', (req, res) => {

	userCollection.find({}, {projection:{_id:0}}).toArray( function(err,docs) {
		if(err) {
		  console.log("Some error.. " + err + "\n");
		} else {
		   console.log( JSON.stringify(docs) + " have been retrieved.\n");
		   var str = "<h1>" + JSON.stringify(docs) + "</h1>"
		   str+= "<h1> Error: " +  err +  "</h1>"
		   res.send(str); 
		}

	});

});

 
app.post('/verifyUser', (req, res) => {

	loginData = req.body;

	console.log(loginData);

	userCollection.find({email:loginData.email, password:loginData.password}, {projection:{_id:0}}).toArray( function(err, docs) {
		if(err) {
		  console.log("Some error.. " + err + "\n");
		} else {
		    console.log(JSON.stringify(docs) + " have been retrieved.\n");
		   	res.status(200).send(docs);
		}	   
		
	  });

});

 
app.post('/checkUserEmail', (req, res) => {

	signUpData = req.body;

	console.log(signUpData);

	userCollection.find({email:signUpData.email}, {projection:{_id:0}}).toArray( function(err, docs) {
		if(err) {
		  console.log("Some error.. " + err + "\n");
		} else {
		    console.log(JSON.stringify(docs) + " have been retrieved.\n");
		   	res.status(200).send(docs);
		}	   
		
	  });

});


app.get('/getOrderData', (req, res) => {
    const userName = req.query.customerfName; // Retrieve user name from query parameter
    if (!userName) {
        return res.status(400).send("Missing user name in query parameter");
    }

    orderCollection.find({ customerfName: userName }, { projection: { _id: 0 } }).toArray((err, docs) => {
        if (err) {
            console.log("Error fetching orders:", err);
            return res.status(500).send("Error fetching orders");
        }
        console.log(docs.length + " orders retrieved for " + userName);
        res.json(docs);
    });
});


app.post('/postOrderData', function (req, res) {
    
    console.log("POST request received : " + JSON.stringify(req.body)); 
    
    orderCollection.insertOne(req.body, function(err, result) {
	       if (err) {
				console.log("Some error.. " + err + "\n");
	       }else {
			   // console.log(JSON.stringify(req.body) + " have been uploaded\n"); 
		    	res.send(JSON.stringify(req.body));
		 }
		
	});
       

});



app.post('/postUserData', function (req, res) {
    
    console.log("POST request received : " + JSON.stringify(req.body)); 
    
    userCollection.insertOne(req.body, function(err, result) {
	       if (err) {
				console.log("Some error.. " + err + "\n");
	       }else {
			    console.log(JSON.stringify(req.body) + " have been uploaded\n"); 
		    	res.send(JSON.stringify(req.body));
		 }
		
	});
       




});
app.delete('/deleteOrdersByName', (req, res) => {
  const userName = req.query.userName; // Assuming userName is sent in the query parameter

  if (!userName) {
      return res.status(400).send("User name is required to delete orders.");
  }

  orderCollection.deleteMany({ customerfName: userName }, (err, result) => {
      if (err) {
          console.log("Error deleting orders:", err);
          return res.status(500).send("Error deleting orders");
      }

      if (result.deletedCount > 0) {
          console.log(result.deletedCount + "  orders deleted for " + userName);
          res.status(200).send(result.deletedCount + " orders deleted");
      } else {
         console.log("No orders found for " + userName);
          res.status(200).send("No orders found ");
      }
  });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`) 
});
