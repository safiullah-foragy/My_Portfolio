const express = require('express');
const router = express.Router();
const multer = require('multer');
const profileController = require('../controllers/profileController');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.get('/', profileController.getProfile);
router.post('/', profileController.createOrUpdateProfile);
router.post('/upload', upload.single('image'), profileController.uploadImage);
router.delete('/', profileController.deleteProfile);

module.exports = router;
