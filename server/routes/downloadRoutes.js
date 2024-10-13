const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

router.get('/download/:fileName', formController.downloadFile);

module.exports = router;