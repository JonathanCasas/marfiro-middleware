const express = require("express");
const router = express.Router();
const suitecrmController = require("../controllers/suitecrm.controller");

/**
 * 1. Envío de Mensaje Directo (Chat)
 * URL: POST {baseUrl}/whatsapp/{accountId}/chats/{phone}/{contactPhone}/{type}
 */
router.post(
  "/whatsapp/:accountId/chats/:phone/:contactPhone/:type",
  suitecrmController.handleDirectMessage,
);

/**
 * 2. Encolar Mensajes Singulares (Bulk / Envíos Masivos)
 * URL: POST {baseUrl}/queues/chats/singular/{phone}/{type}
 */
router.post(
  "/queues/chats/singular/:phone/:type",
  suitecrmController.handleQueueMessage,
);

module.exports = router;
