const axios = require('axios');

class SuiteCRMService {
    constructor() {
        this.baseUrl = process.env.SUITECRM_URL;
        this.token = process.env.SUITECRM_TOKEN;
    }

    /**
     * Public: Procesa el webhook recibido de Platform y lo envía a SuiteCRM
     */
    async sendToSuiteCRM(platformWebhook) {
        const transformedData = this._transformWebhookData(platformWebhook);
        return await this._sendRequest('/webhook-receiver', transformedData);
    }

    /**
     * Transforma la estructura de Platform a la que espera SuiteCRM
     */
    _transformWebhookData(data) {
        // Determinamos el cuerpo del mensaje: preferimos 'body', si no 'caption'
        const messageBody = data.body || data.caption || '';
        
        // Determinamos la dirección del mensaje basado en 'fromMe'
        const direction = data.fromMe ? 'OUTPUT' : 'INPUT';

        // Determinamos la URL del adjunto (priorizando la del objeto messageFile si existe)
        const attachmentUrl = data.url || data.messageFile?.url || null;

        return {
            message: {
                contactPhone: data.contactPhone || data.remoteJid?.split('@')[0],
                body: messageBody,
                direction: direction,
                url: attachmentUrl,
                subject: data.type !== 'TEXT' ? `WhatsApp ${data.type}` : 'WhatsApp Message'
            }
        };
    }

    /**
     * Centraliza las peticiones HTTP hacia SuiteCRM
     */
    async _sendRequest(path, data) {
        try {
            const response = await axios.post(`${this.baseUrl}${path}`, data, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            console.error('Error forwarding to SuiteCRM:', errorMsg);
            throw new Error(`SuiteCRM Error: ${errorMsg}`);
        }
    }
}

module.exports = new SuiteCRMService();
