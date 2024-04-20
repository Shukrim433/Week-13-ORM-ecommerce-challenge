const router = require('express').Router();
const { Category, Product } = require('../../models'); //category and product are the only products imported so that means theyre only related to eachother

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [{model: Product}]  //return all of the associated product records for each category record
  })
  res.status(200).json(categoryData)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {  //SQL equiv: SELECT * FROM category WHERE id = req.params.id //req.params.id is the primary key column value
      include: [{model: Product}]                                 //SQL equiv: a JOIN statement to get the associated product records for each category record
    })

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryData)
  } catch(err){
    res.status(500).json(err)
  }
});


router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create(req.body)
    res.status(200).json(categoryData)
  } catch(err){
    res.status(500).json(err)
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryData = await Category.update(    
      {category_name: req.body.category_name},     
      {where: {id: req.params.id}}                 
    )

    if (!categoryData[0]) {//checks if no rows were affected by the update operation because:   
      res.status(404).json({ message: 'No category with this id!' });//In Sequelize, when you use the update method, it returns an array where the first element represents the number of rows affected by the update operation, and the second element contains the metadata associated with the operation.
      return;
    }

    res.status(200).json(categoryData)
  } catch(err){
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy(
      {where: {id: req.params.id}}
    )

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryData)
  } catch(err) {
    res.status(500).json(err)
  }
});

module.exports = router;
