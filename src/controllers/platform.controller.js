const suitecrmService = require('../services/suitecrm.service');

/**
 * Recibe webhooks de Platform y los envía a SuiteCRM
 */
const handleWebhookFromPlatform = async (req, res) => {
    try {
        const result = await suitecrmService.sendToSuiteCRM(req.body);
        res.status(200).json({
            success: true,
            message: 'Webhook successfully forwarded to SuiteCRM',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    handleWebhookFromPlatform
};
