var express = require("express");
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000);

var uuid = require("uuid")
var carts = {}

// Initialize product dictionary
var inventory_json = require('./products.json')
var inventory = {}
for (i=0; i < inventory_json.products.length; ++i){
	inventory[inventory_json.products[i].product_id]=inventory_json.products[i]

}

function Cart() {
	this.status = 'InProgress';
	this.products = {}
}

var cart = '';

app.get('/inventory', function (req, res) {
	// Return a list of all carts
	res.json(inventory)
})

app.get("/cart/:cartId/", (req, res, next) => {
	// Return cart with matching id
	cartId = req.params.cartId;
	res.json({
		'status': carts[cartId].status,
		'products': carts[cartId].products
	});
});

app.get('/cart', function (req, res) {
	// Return a list of all carts
	res.json(carts)
})

app.post("/cart/", (req, res, next) => {
	// Create a new cart and return id
	cartId = uuid.v4();
	carts[cartId] = new Cart(cartId);
	res.json(cartId);
});

app.put("/cart/:cartId/", (req, res, next) => {
	// Updates cart with body data; product id and quantity
	var cartId = req.params.cartId
	try {
		var status = req.body.status;
	}
	catch(err){
		res.json({'error': 'status not found'})
	}
	carts[cartId].status = status
	res.json({'success': 'cart status updated'})
});

app.delete("/cart/:cartId/", (req, res, next) => {
	// Deletes cart from cart dictionary
	var cartId = req.params.cartId
	if (carts.hasOwnProperty(cartId)){
		delete carts[cartId];
		res.json({'success': 'removed'});
	} else {
		res.json({'error': 'could not find cart'});
	}
});
