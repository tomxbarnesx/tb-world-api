const express = require('express');
let Poem = require('../models/poem.model');

const router = express.Router();

/* GET tiles listing. */
router.get('/', async (req, res) => {
  Poem.find()
    .then(poems => res.json(poems))
    .catch(err => res.status(400).json('Error: ' + err));
});

/* GET single poem */
router.get('/:slug', async (req, res) => {
  try {
    // Poem.findById(req.params.id)
    Poem.findOne({slug: req.params.slug}, function(err, obj) {
      if (err) {
        return res.status(400).json("Error: " + err)
      }
      return res.json(obj)
    })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE poem */
router.delete('/:id', async (req, res) => {
  Poem.findByIdAndDelete(req.params.id)
    .then(() => res.json("Poem deleted."))
    .catch(err => res.status(400).json("Error: " + err));
});

/* UPDATE post */
router.post('/update/:id', async (req, res) => {
  Poem.findById(req.params.id)
    .then((poem) => {
      poem.title = req.body.title;
      poem.content = req.body.content;
      poem.mediaBackground = req.body.mediaBackground;
      poem.save()
        .then(() => res.json('Poem updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => {
      res.status(400).json("Error: " + err)
    });
});

/**
 * @route POST
 * @desc Upload post image
 * @access public
 */
router.post( '/create', async ( req, res ) => {
  const title = req.body.title;
  const content = req.body.content;
  const date = Date.parse(req.body.date);

  const newPoem = new Poem({
    title,
    content,
    date
  });

  if (req.body.mediaBackground) {
    newPoem.mediaBackground = req.body.mediaBackground
  }

  newPoem.save()
    .then(() => res.json('Poem added!'))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
