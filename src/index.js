var express = require("express");
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000);

var uuid = require("uuid");
var carts = {};

// Initialize product dictionary
var inventory_json = require("./products.json");
var inventory = {};
var i;
for (i=0; i < inventory_json.products.length; ++i){
    inventory[inventory_json.products[i].product_id]=inventory_json.products[i];
}

function Cart() {
    this.status = "InProgress";
    this.products = {};
}

function Product() {
    this.name = "";
    this.quantity = 0;
}

app.get("/inventory/", function (req, res) {
    // Return a list of all carts
    res.json(inventory);
});

app.get("/inventory/:productId/", function (req, res) {
    // Return a single product
    var productId = req.params.productId;
    if (inventory.hasOwnProperty(productId)){
        res.json(inventory[req.params.productId]);
    } else {
        res.status(404);
        res.json({"error": "could not find product"});
    }
});

app.get("/cart/:cartId/", (req, res, next) => {
    // Return cart with matching id
    var cartId = req.params.cartId;
    if (carts.hasOwnProperty(cartId)){
        res.json({
            "status": carts[cartId].status,
            "products": carts[cartId].products
        });
    } else {
        res.status(404);
        res.json({"error": "could not find cart"});
    }
});

app.get("/cart/", function (req, res) {
    // Return a list of all carts
    res.json(carts);
});

app.post("/cart/", (req, res, next) => {
    // Create a new cart and return id
    var cartId = uuid.v4();
    carts[cartId] = new Cart(cartId);
    res.status(201);
    res.json(cartId);
});

app.put("/cart/:cartId/", (req, res, next) => {
    // Updates status of the cart
    var cartId = req.params.cartId;
    try {
        var status = req.body.status;
    }
    catch(err){
        res.json({"error": "status not found"});
    }
    carts[cartId].status = status;
    res.json({"success": "cart status updated"});
});

app.delete("/cart/:cartId/", (req, res, next) => {
    // Deletes cart from cart dictionary
    var cartId = req.params.cartId;
    if (carts.hasOwnProperty(cartId)){
        delete carts[cartId];
        res.json({"success": "removed"});
    } else {
        res.status(404);
        res.json({"error": "could not find cart"});
    }
});

app.get("/cart/:cartId/product/:productId/", (req, res, next) => {
    // Views product detail in cart
    var cartId = req.params.cartId;
    var productId = req.params.productId;
    res.json(carts[cartId].products[productId]);
});

app.post("/cart/:cartId/product/:productId/", (req, res, next) => {
    // Creates product in cart
    var cartId = req.params.cartId;
    var productId = req.params.productId;
    try {
        var quantity = req.body.quantity;
    }
    catch(err){
        res.status(400);
        res.json({"error": "quantity not found in body"});
    }
    if (inventory.hasOwnProperty(productId) && quantity>inventory[productId].quantity){
        res.status(400);
        res.json({"error": "not enough products in inventory to satisfy request"});
    } else {
        if (carts.hasOwnProperty(cartId)){
            product = new Product();
            product.name = inventory[productId].name;
            product.quantity = quantity;
            carts[cartId].products[productId] = product;
            res.json({"success": "updated"});
        } else {
            res.status(404);
            res.json({"error": "could not find cart or product"});
        }
    }
});

app.put("/cart/:cartId/product/:productId/", (req, res, next) => {
    // Updates product in cart
    var cartId = req.params.cartId;
    var productId = req.params.productId;
    try {
        var quantity = req.body.quantity;
    }
    catch(err){
        res.status(400);
        res.json({"error": "quantity not found in body"});
    }
    if (inventory.hasOwnProperty(productId) && quantity>inventory[productId].quantity){
        res.status(400);
        res.json({"error": "not enough products in inventory to satisfy request"});
    } else {
        if (carts.hasOwnProperty(cartId)){
            carts[cartId].products[productId].quantity = quantity;
            res.json({"success": "updated"});
        } else {
            res.status(404);
            res.json({"error": "Could not find cart or product"});
        }
    }
});

app.delete("/cart/:cartId/product/:productId/", (req, res, next) => {
    // Deletes product in cart
    var cartId = req.params.cartId;
    var productId = req.params.productId;
    if (carts.hasOwnProperty(cartId) && carts[cartId].products.hasOwnProperty(productId)){
        delete carts[cartId].products[productId];
        res.json({"success": "product removed from cart"});
    } else {
        res.status(404);
        res.json({"error": "could not find cart or product"});
    }
});

app.get("/cart/:cartId/checkout/", (req, res, next) => {
    // Checkout the cart
    var cartId = req.params.cartId;
    var can_checkout = true;
    if (!carts.hasOwnProperty(cartId)){
        res.status(404);
        res.json({"error": "could not find cart or product"});
    } else {
        for (var productId in carts[cartId].products){
            if (!inventory.hasOwnProperty(productId) || carts[cartId].products[productId].quantity > inventory[productId].quantity){
                // Check whether product is valid or quantity in cart is more than inventory
                can_checkout = false;
                break;
            }
        }
        if (can_checkout){
            // If can checkout, remove the products from inventory and remove cart
            carts[cartId].status = 'Ordered';
            for (var productId in carts[cartId].products){
                inventory[productId].quantity -= carts[cartId].products[productId].quantity;
            }
            res.json({"success": "cart checked out"});
        } else {
            res.status(400);
            res.json({"error": "could not checkout"});
        }
    }
});