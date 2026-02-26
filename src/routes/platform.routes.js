const express = require('express');
const router = express.Router();
const platformController = require('../controllers/platform.controller');

// Receives webhook from Platform
router.post('/receive-webhook', platformController.handleWebhookFromPlatform);

module.exports = router;
