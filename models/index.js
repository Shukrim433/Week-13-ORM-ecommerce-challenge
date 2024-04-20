// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');


//one to many
// Categories have many Products: 1 category has many products
Category.hasMany(Product,{
  foreignKey: 'category_id',
  onDelete: 'CASCADE'
})
                                                                      // } "category_id" is the foreign key that links these two models together
// Products belongsTo Category: each product belongs to 1 category
Product.belongsTo(Category, {
  foreignKey: 'category_id'
})


//many to many
// Products belongToMany Tags (through ProductTag): 1 product can have multiple tags associated with it***
Product.belongsToMany(Tag, {
  through: ProductTag,            // Use through for many-to-many associations
  foreignKey: 'product_id',
  onDelete: 'CASCADE'
})

// Tags belongToMany Products (through ProductTag):  1 tag can be associated with multiple products***
Tag.belongsToMany(Product, {
  through: ProductTag,            // Use through for many-to-many associations
  foreignKey: 'tag_id',
  onDelete: 'CASCADE',
})

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};


/*** example, if you have a product like "T-shirt," it might be associated with tags like "clothing," "fashion," and "apparel." */
/*** example, the tag "clothing" might be associated with various products like "T-shirt," "pants," and "jackets." */

/***ProductTag model acts as a junction or pivot table that facilitates this many-to-many relationship. It contains foreign keys that reference
the id columns of both the Product and Tag tables. This setup allows for efficient querying and management of the relationships between products 
and tags. */


/*  1.     1 category has many products
           many products belong to 1 category
*/

/*  2.     a product can have many tags
           a tag can have many products associated with it
*/