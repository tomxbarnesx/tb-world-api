const express = require('express');
let Poem = require('../models/poem.model')

const router = express.Router();

/* GET tiles listing. */
router.route('/').get((req, res) => {
  Poem.find()
    .then(poems => res.json(poems))
    .catch(err => res.status(400).json('Error: ' + err));
});

/* GET single poem */
router.route('/:slug').get((req, res) => {
  // Poem.findById(req.params.id)
  Poem.findOne({slug: req.params.slug}, function(err, obj) {
    if (err) {
      return res.status(400).json("Error: " + err)
    }
    return res.json(obj)
  })
    // .then(poem => res.json(poem))
    // .catch(err => res.status(400).json("Error: " + err));
});

/* DELETE poem */
router.route('/:id').delete((req, res) => {
  Poem.findByIdAndDelete(req.params.id)
    .then(() => res.json("Poem deleted."))
    .catch(err => res.status(400).json("Error: " + err));
});

/* UPDATE post */
router.route('/update/:id').post((req, res) => {
  // If Success
  Poem.findById(req.params.id)
    .then((poem) => {
      poem.title = req.body.title;
      poem.content = req.body.content;

      poem.save()
        .then(() => res.json('Poem updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});

/**
 * @route POST
 * @desc Upload post image
 * @access public
 */
router.post( '/create', ( req, res ) => {
  const title = req.body.title;
  const content = req.body.content;
  const date = Date.parse(req.body.date);

  const newPoem = new Poem({
    title,
    content,
    date
  });
  newPoem.save()
    .then(() => res.json('Poem added!'))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;