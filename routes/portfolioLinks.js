const express = require('express');
let PortfolioLink = require('../models/portfolioLink.model');

const router = express.Router();

/* GET all links */
router.get('/', async (req, res) => {
  PortfolioLink.find()
    .then(links => res.json(links))
    .catch(err => res.status(400).json('Error: ' + err));
});

/* GET single link */
router.get('/:id', async (req, res) => {
	PortfolioLink.findById(req.params.id)
		.then((link) => res.json(link))
    .catch(err => {
      res.status(400).json("Error: " + err)
    });
});

/* DELETE poem */
router.delete('/:id', async (req, res) => {
  PortfolioLink.findByIdAndDelete(req.params.id)
    .then(() => res.json("Portfolio link deleted."))
    .catch(err => res.status(400).json("Error: " + err));
});

/* UPDATE post */
router.post('/update/:id', async (req, res) => {
  // If Success
  PortfolioLink.findById(req.params.id)
    .then((link) => {
      link.title = req.body.title;
      link.url = req.body.url;
      link.save()
        .then(() => res.json('Link updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => {
      res.status(400).json("Error: " + err)
    });
});

router.post('/create', async ( req, res ) => {
  const title = req.body.title;
  const url = req.body.url;

  const newPortfolioLink = new PortfolioLink({
    title,
    url,
  });

  newPortfolioLink.save()
    .then(() => res.json('Portfolio link added!'))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
