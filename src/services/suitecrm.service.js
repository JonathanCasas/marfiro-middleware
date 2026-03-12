const axios = require("axios");

class SuiteCRMService {
  constructor() {
    this.baseUrl = process.env.SUITECRM_URL;
    this.token = process.env.SUITECRM_TOKEN;
  }

  /**
   * Public: Procesa el webhook recibido de Platform y lo envía a SuiteCRM
   */
  async sendToSuiteCRM(platformWebhook, authHeader) {
    console.log("[SuiteCRM] sendToSuiteCRM", JSON.stringify(platformWebhook));
    const transformedData = this._transformWebhookData(platformWebhook);
    console.log("[SuiteCRM] transformedData", JSON.stringify(transformedData));
    return await this._sendRequest(transformedData, authHeader);
  }

  /**
   * Transforma la estructura de Platform a la que espera SuiteCRM
   */
  _transformWebhookData(data) {
    // Si la data viene envuelta en un objeto 'message', la extraemos
    const payload = data.message || data;

    // Determinamos el cuerpo del mensaje: preferimos 'body', si no 'caption'
    const messageBody = payload.body || payload.caption || "";

    // Determinamos la dirección del mensaje basado en 'fromMe'
    const direction = payload.fromMe ? "OUTPUT" : "INPUT";

    // Determinamos la URL del adjunto (priorizando la del objeto messageFile si existe)
    const attachmentUrl = payload.url || payload.messageFile?.url || null;

    return {
      message: {
        contactPhone: payload.contactPhone || payload.remoteJid?.split("@")[0],
        body: messageBody,
        direction: direction,
        url: attachmentUrl,
        subject:
          payload.type !== "TEXT"
            ? `WhatsApp ${payload.type}`
            : "WhatsApp Message",
      },
    };
  }

  /**
   * Centraliza las peticiones HTTP hacia SuiteCRM
   */
  async _sendRequest(data, authHeader) {
    try {
      let finalUrl = `${this.baseUrl}`;
      console.log(`[SuiteCRM] Forwarding Webhook: ${finalUrl}`);
      console.log(`[SuiteCRM] Payload:`, JSON.stringify(data, null, 2));

      const response = await axios.post(finalUrl, data, {
        headers: {
          Authorization: authHeader || `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error("Error forwarding to SuiteCRM:", errorMsg, error);
      throw new Error(`SuiteCRM Error: ${errorMsg}`);
    }
  }
}

module.exports = new SuiteCRMService();
