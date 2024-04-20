const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [{model: Category}, {model: Tag, through: ProductTag}]
    })
    res.status(200).json(productData)
  } catch(err){
    res.status(500).json(err)
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id` // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{model: Category}, {model: Tag, through: ProductTag}]
    })

    if(!productData){
      res.status(404).json(productData)
      return
    }

    res.status(200).json(productData)
  } catch(err){
    res.status(500).json(err)
  }
});

// create new product  
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */

  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      //.map() function in JavaScript is used to iterate over each element of an array and transform each element into something else based on a provided function. 
      //.map() creates a new array by applying a callback Function to each element of the original array. and each element is then transformed based on what the function returns. (when applied to it)
      //The transformed elements are collected into a new array, which is returned as the result.
      if (req.body.tagIds.length) {          // checks if the user added tags to this new product 
        //.map() itterates through the tags they added and applies a callback function to each tag:
        const productTagIdArr = req.body.tagIds.map((tag_id) => { // creates an array of objects called productTagIdArr
          return {                                                // the callback function of .map() takes each tag element and transforms it to an object containing:
            product_id: product.id,                               // <-- the newly created product 
            tag_id,                                               // <-- and the tag itself   (tag_id is each element/tag in the tagIds array from the req.body)
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);           // then saves each object in the productTagIdArr to the Product database as a record each
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) { //only evaluates if both are true // Checks if tagIds exists in the 'update' request body || Checks if the tagIds array has any elements (>0)
        
        ProductTag.findAll({                           //retrieve the record from the ProductTag model...
          where: { product_id: req.params.id }         //where its product_id column is the same as the id of the product were updating
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);       
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy(
      {where: {id: req.params.id}}
    )

    if(!productData){
      res.status(404).json({message: 'No product with that id found!'})
    }

    res.status(200).json(productData)
  } catch(err) {
    res.status(500).json(err)
  }
});

module.exports = router;

  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */

 /* try {
    const productData = await Product.create(req.body)

    if(productData.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: productData.id,
          tag_id
        }
      })
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr)

      res.status(200).json({productData, productTagIds})
    } else {
      res.status(200).json(productData)
    }

    
  } catch(err){ res.status(500).json(err)
  }
  */


  // so when you create a product it returns an array of objects, each object is for each of the tagIds you put in the request body, and each onj
  //has the tagId that you entered and the productid aka the id of the new product youre creating (so all will be the same for the same product)

// so when you update a product it returns an array with a 1 -> [1]  indicates that one record was updated. aka the number of rows affected by 
//the .update()

//when you update a procucts tagIds:
/*
If the request body contains tagIds and the length of tagIds is greater than 0:
It retrieves all existing product tags associated with the updated product (identified by req.params.id).
It creates a filtered list of new tag_ids by comparing the existing tag_ids with the tagIds provided in the request body. Any new tag_ids are added to newProductTags.
It identifies the product tags that need to be removed by comparing the existing tag_ids with the tagIds provided in the request body. The IDs of the product tags to be removed are added to productTagsToRemove.
It deletes the product tags identified in productTagsToRemove from the database.
It creates new product tags using the data in newProductTags and adds them to the database.

also just returns [1] in postman
*/