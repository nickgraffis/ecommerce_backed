const router = require('express').Router();
const { Tag, Product, Category, ProductTag } = require('../models');

const models = {
  Product: {
    realted: [
      "{ model: Category }",
      "{ model: Tag, through: ProductTag, as: 'tags' }"
    ]
  },

  Category: {
    realted: [
      "{ model: Product }"
    ]
  },

  Tag: {
    realted: [
      "{ model: Product, through: ProductTag, as: 'products' }"
    ]
  }
}

const capitolize = (string) => {
  return string[0].toUpperCase() + string.substring(1)
}

router.get('/:model', async (req, res) => {
  try {
    const modelText = capitolize(req.params.model)
    const model = eval('models.' + modelText)

    if (!model) {
      res.status(404).json('This is not a route!');
    }

    let data
    const expression = ".findAll({" +
    `include: [${model.realted.join(', ')}]})`

    data = await eval(modelText + expression)

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:model/:id', async (req, res) => {
  try {
    const modelText = capitolize(req.params.model)
    const model = eval('models.' + modelText)

    if (!model) {
      res.status(404).json('This is not a route!');
    }

    let data

    const expression = `.findByPk(${req.params.id}, {
      include: [
        ${model.realted.join(', ')}
      ]
    })`

    data = await eval(modelText + expression)

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/:model', async (req, res) => {
  try {
    const modelText = capitolize(req.params.model)
    const model = eval('models.' + modelText)

    if (!model) {
      res.status(404).json('This is not a route!');
    }

    let data

    const expression = `.create(${JSON.stringify(req.body)})`

    data = await eval(modelText + expression)

    if (req.body.tag_ids.length && modelText === 'Product') {
      const productTags = req.body.tag_ids.map((tag_id) => {
        return {
          product_id: data.id,
          tag_id: parseInt(tag_id),
        };
      });
      const tags = await ProductTag.bulkCreate(productTags);
      res.status(200).json({
        data,
        tags,
      });
    } else {
      res.status(200).json(`Created new ${req.params.model}!`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:model/:id', async (req, res) => {
  try {
    const modelText = capitolize(req.params.model)
    const model = eval('models.' + modelText)

    if (!model) {
      res.status(404).json('This is not a route!');
    }

    let data

    const expression = `.update(${JSON.stringify(req.body)}, {
      where: { id: ${req.params.id} }
    });`

    if (modelText === 'Product' && req.body.tag_ids.length) {
      const tags = await ProductTag.findAll({ where: { product_id: req.params.id } });

      const tagIds = tags.map(({ tag_id }) => tag_id);

      const updatedTags = req.body.tag_ids
        .filter((tag_id) => !tags.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      const destroyedTags = tags
        .filter(({ tag_id }) => !req.body.tag_ids.includes(tag_id))
        .map(({ id }) => id);

      const updatedData = await Promise.all([
        ProductTag.destroy({ where: { id: destroyedTags } }),
        ProductTag.bulkCreate(updatedTags),
      ]);
    }

    data = await eval(modelText + expression)

    res.status(200).json(`Updated ${req.params.model} with id of ` + req.params.id);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:model/:id', async (req, res) => {
  try {
    const modelText = capitolize(req.params.model)
    const model = eval('models.' + modelText)

    if (!model) {
      res.status(404).json('This is not a route!');
    }

    let data

    const expression = `.destroy({
      where: { id: ${req.params.id} }
    })`

    data = await eval(modelText + expression)

    res.status(200).json(`Delted ${req.params.model} with an id of ${req.params.id}!`);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
