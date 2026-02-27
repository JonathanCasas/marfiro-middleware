const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const platformService = require("../services/platform.service");

/**
 * Maneja el envío de mensajes directos desde SuiteCRM
 */
const handleDirectMessage = async (req, res) => {
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
  try {
    const { phone, type } = req.params;
    const payload = req.body;

    const authHeader = req.headers.authorization;

    const result = await platformService.forwardQueueMessage(
      { phone, type },
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

module.exports = {
  handleDirectMessage,
  handleQueueMessage,
};
