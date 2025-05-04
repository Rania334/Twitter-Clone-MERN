const express = require('express');
const router = express.Router();
const multer = require('multer');
const Image = require('../models/Image');

// Use memory storage for now (you can change it to disk or GridFS later)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route: POST /upload
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const newImage = new Image({
            img: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            },
        });
        await newImage.save();
        res.status(200).send('Image uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading image');
    }
});

// GET image by ID
router.get('/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) return res.status(404).send('Image not found');

        res.set('Content-Type', image.img.contentType);
        res.send(image.img.data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving image');
    }
});
// GET all image IDs
router.get('/', async (req, res) => {
    try {
        const images = await Image.find({}, '_id');
        res.status(200).json(images);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving images');
    }
});


module.exports = router;
