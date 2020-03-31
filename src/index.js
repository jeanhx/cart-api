var express = require("express");
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000);

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

app.get("/cart/", (req, res, next) => {
	// Return cart
	res.json({
		'status': cart.status,
		'products': cart.products
	});
});

app.post("/cart/", (req, res, next) => {
	// Create a new cart
	cart = new Cart();
});

app.put("/cart/", (req, res, next) => {
	// Updates cart with body data; product id and quantity
	try {
		var status = req.body.status;
	}
	catch(err){
		res.json({'error': 'status not found'})
	}
	cart.status = status
	res.json({'success': 'cart status updated'})
});

app.delete("/cart/", (req, res, next) => {
	// Deletes cart
	var cartId = req.params.cartId
	try{
		cart = '';
		res.json({'success': 'removed'});
	} catch(err) {
		res.json({'error': 'could not find cart'});
	}
});
