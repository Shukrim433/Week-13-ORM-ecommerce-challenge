# Week-13-ORM-ecommerce-challenge

## Description

- I wanted to build the back end for an e-commerce site.

## Process
- The first thing i did was set up my models(tables)
-defined all the columns for the category model
-defined all the columns for the product model
-defined all the columns for the tag model
-defined all the columns for the product_tag model

- Then i moved on to the routes.
-I started off with the category routes: i created a get request that queries the database to return all the records from the category model                                    and its associated product records from the product model
                                         then i created a get request that queries the database to return a single record from the categories model, and its associated product record from the product model, based on its id.
                                         then i created a post request that queries the database to create a record on the category model based on what the user inputs.
                                         then i created a put request that queries the database to update a record on the record model based on its id and with whatever the user chooses to update.
                                         then i created a delete request that queries the database to delete a record from the categories model based on its id.
-Then i did the exact same for thing for the tag and product routes but i made sure to use the "through" key word when including related data as i was dealing with a many to many relationship.

- Lastly for testing i did "npm i" to download all the dependencies, "psql -U postgres" to connect to the postgresql DBMS, "\i db/schema.sql" to create the ecommerce database, ".env" to privatise my connection information, "node seeds.index.js" to seed all my models with data, "npm run watch" to run/start up the whole server.
-and i used postman to test everything.


## Application

- this is a link to a demo:
https://app.screencastify.com/v3/watch/OBaLg3c3sCed2BZh1OI4