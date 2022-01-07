const express = require('express');
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );
const url = require('url');
let MediaTile = require('../models/mediaTile.model')

const router = express.Router();

// Setting the bucke
const s3 = new aws.S3({
 accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 Bucket: process.env.AWS_BUCKET_NAME,
});

// Single file upload
const mediaUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
    }
  }),
  limits:{ fileSize: 22282810 },
    fileFilter: function( req, file, cb ){
      checkFileType( file, cb );
  }
}).single('file');

/**
 * Check File Type
 * @param file
 * @param cb
 * @return {*}
 */
function checkFileType( file, cb ){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|mp4|mov/;
  // Check ext
  const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
  // Check mime
  const mimetype = filetypes.test( file.mimetype );
  if( mimetype && extname ){
    return cb( null, true );
   } else {
    cb( 'Error: Invalid file type!' );
   }
}

/* GET tiles listing. */
router.route('/').get((req, res) => {
  MediaTile.find()
    .then(tiles => res.json(tiles))
    .catch(err => res.status(400).json('Error: ' + err));
});

/* GET single tile */
router.route('/:id').get((req, res) => {
  MediaTile.findById(req.params.id)
    .then(tile => res.json(tile))
    .catch(err => res.status(400).json("Error: " + err));
});

/* DELETE tile */
router.route('/:id').delete((req, res) => {
  MediaTile.findByIdAndDelete(req.params.id)
    .then(() => res.json("Poem deleted."))
    .catch(err => res.status(400).json("Error: " + err));
});

/* UPDATE tile */
router.route('/update/:id').post((req, res) => {
  if (req.file) {
    console.log("FILE!")
    mediaUpload(req, res, ( error ) => {
      if (error) {
        console.log( 'errors', error );
        return res.json( { error: error } );
      } else {
        // If File not found
        if(req.file === undefined){
          console.log( 'Error: No File Selected!' );
          return res.json( 'Error: No File Selected' );
        }
      }
    })
  }
  MediaTile.findById(req.params.id)
    .then((mT) => {
      if (req.file) {
        mT.mediaName = req.file.key;
        mT.mediaLocation = req.file.location;
      }
      mT.title = req.body.title;

      mT.save()
        .then(() => res.json('Media tile updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});

/**
 * @route POST
 * @desc Upload post image
 * @access public
 */
router.post( '/upload', ( req, res ) => {
  mediaUpload(req, res, ( error ) => {
    if(error){
      console.log( 'errors', error );
      res.json( { error: error } );
    } else {
      // If File not found
      if(req.file === undefined){
        console.log( 'Error: No File Selected!' );
        res.json( 'Error: No File Selected' );
      } else {
        // If Success
        const mediaName = req.file.key;
        const mediaLocation = req.file.location;
        const title = req.body.title;
        const date = Date.parse(req.body.date);

        const newVT = new MediaTile({
          mediaName,
          mediaLocation,
          title,
          date,
        });

        newVT.save()
          .then(() => res.json('Media tile added!'))
          .catch(err => res.status(400).json("Error: " + err));
      }
    }
   });
});

module.exports = router;