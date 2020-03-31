# API Assignment

This assignment is to build out a RESTful shopping cart API.

## Instructions
* run `npm install` to install neccessary packages
* run `npm run build` to compile
* run `npm start` to start up the application


## Requirements
* npm 3.5.2
* node 8.10.0
* I developed this on ubuntu 18.04, but that shouldnt matter that much

### Products

Products for the cart in the `products.json` file in the `/src` dir of the repo.  The products will be a known so that you do not have to reproduce that lookup, so the products in the JSON file are the only valid products for this API.

### Cart Workflow

Cart workflow is located in the `docs` dir, both a PlantUML as well as the resultant flow.

### Workflow Rules

* A cart cannot be created and then checked out, a **MINIMUM** of five products must be in the cart for that cart to be Validated
* All products in a cart must be valid from the product API
* When moving the cart to Checkout, an inventory check must be done to ensure that the products in the cart to not exceed the inventory

### Api Endpoints
* localhost:3000/inventory - Get only; View available inventory
* localhost:3000/cart - Get, Post; View all carts, initialize a cart and return id
* localhost:3000/cart/:cartId/ - Get, Put, Delete; View a cart, Update a cart's status, and Delete the cart
* localhost:3000/cart/:cartId/product/:productId/ - Get, Put, Delete; View a product inside a cart, Add a product to the cart, Update the quantity of products in the cart, and Delete product in the cart
  * quantity is sent in via data payload in the body
