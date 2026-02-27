const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const suitecrmService = require("../services/suitecrm.service");

/**
 * Recibe webhooks de Platform y los envía a SuiteCRM
 */
const handleWebhookFromPlatform = async (req, res) => {
  console.log(
    `[Platform] Incoming Webhook Request: ${req.method} ${req.originalUrl}`,
  );
  console.log(`[Platform] Payload:`, JSON.stringify(req.body, null, 2));

  try {
    const authHeader = req.headers.authorization;
    const result = await suitecrmService.sendToSuiteCRM(req.body, authHeader);
    res.status(200).json({
      success: true,
      message: "Webhook successfully forwarded to SuiteCRM",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  handleWebhookFromPlatform,
};
