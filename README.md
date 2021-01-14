# Ecommerce Backend API
## Installation
1. Clone this repo
2. Update the .env.example file by naming it ".env" and adding your proper MYSQL information. DB_USER, DB_PW, DB_NAME, optionally PORT.
 * Make sure you have a database with the same name on your machine
3. `cd` into the directory and type `npm install` to install dependencies
4. type `npm run start` into your command line, followed by an enter
  * You should see `🚀 listening on port 3001!`. If you specified your own port in your .env file, you'll see that instead.

## Usage

### The following models are accepted with all or some of the following body parameters.
#### Note that only POST and PUT accept body parameters

* category
  * name <i> { string } </i>

* tag
  * name <i> { string } </i>

* product
  * name <i>{ string }</i>
  * stock <i>{ integer }</i>
  * price <i>{ decimal number }</i>
  * category_id <i>{ the id of the product's category }</i>
  * tag_ids <i>{ an array of tag ids }</i>

### The following endpoints are accepted:

* GET /:model to read all instances of model ":model"
  * Responds with an array of objects of the desired model
* GET /:model/:id to read the instance ":id" of model ":model"
  * Responds with an object of the desired model
* POST /:model to create a new instance of model ":model"
  * Responds with a confirmation
* PUT /:model/:id to update the instance ":id" of model ":model"
  * Responds with a confirmation
* DELETE /:model/:id to delete the instance ":id" of model ":model"
  * Responds with a confirmation
