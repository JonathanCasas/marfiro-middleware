const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const platformService = require("../services/platform.service");

/**
 * Maneja el envío de mensajes directos desde SuiteCRM
 */
const handleDirectMessage = async (req, res) => {
  console.log(
    `[SuiteCRM] Incoming Direct Message Request: ${req.method} ${req.originalUrl}`,
  );
  console.log(`[SuiteCRM] Payload:`, JSON.stringify(req.body, null, 2));

  try {
    const { accountId, phone, contactPhone, type } = req.params;
    const payload = req.body;

    const authHeader = req.headers.authorization;

    const result = await platformService.forwardDirectMessage(
      { accountId, phone, contactPhone, type },
      payload,
      authHeader,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Maneja el encolamiento de mensajes (Bulk) desde SuiteCRM
 */
const handleQueueMessage = async (req, res) => {
  console.log(
    `[SuiteCRM] Incoming Queue Message Request: ${req.method} ${req.originalUrl}`,
  );
  console.log(`[SuiteCRM] Payload:`, JSON.stringify(req.body, null, 2));

  try {
    const { phone, type } = req.params;
    const payload = req.body;

    const authHeader = req.headers.authorization;
    console.log("[SuiteCRM] handleQueueMessage Before process message.");
    const result = await platformService.forwardQueueMessage(
      { phone, type },
      payload,
      authHeader,
    );

    res.status(200).json(result);
  } catch (error) {
    console.log("Error processing message", error);
    // console.log("[SuiteCRM] handleQueueMessage error", error);
    // console.log("[SuiteCRM] handleQueueMessage error", error.message);
    // console.log("[SuiteCRM] handleQueueMessage error", error.stack);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  handleDirectMessage,
  handleQueueMessage,
};
