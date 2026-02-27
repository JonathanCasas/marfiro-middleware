const axios = require("axios");

class PlatformService {
  constructor() {
    this.baseUrl = process.env.PLATFORM_URL;
    this.token = process.env.PLATFORM_TOKEN;
  }

  /**
   * Public: Procesa y envía un mensaje directo desde SuiteCRM
   */
  async forwardDirectMessage(
    { phone, contactPhone, type },
    payload,
    authHeader,
  ) {
    let finalType = this._getPlatformTypePath(type);
    const path = `/api/v1/chat/${phone}/${finalType}`;
    const platformData = this._createPlatformPayload(
      type,
      contactPhone,
      payload,
    );

    console.log(`[Platform] Forwarding Direct Message: ${path}`);
    console.log(`[Platform] Payload:`, JSON.stringify(platformData, null, 2));

    return await this._sendRequest(path, platformData, authHeader);
  }

  /**
   * Public: Procesa mensajes en bloque (Bulk) de SuiteCRM
   */
  async forwardQueueMessage({ phone, type }, payload, authHeader) {
    const results = [];

    for (const item of payload.items) {
      const itemResults = await this._processBulkItem(
        phone,
        type,
        item,
        authHeader,
      );
      results.push(...itemResults);
    }

    return {
      total: results.length,
      success: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      detail: results,
    };
  }

  /**
   * Procesa un único item de la cola (que puede tener múltiples teléfonos)
   */
  async _processBulkItem(phone, type, item, authHeader) {
    const phones = Array.isArray(item.phones) ? item.phones : [item.phones];
    const itemResults = [];

    for (const targetNumber of phones) {
      let finalType = his._getPlatformTypePath(type);
      const path = `/api/v1/bulk/chat/${phone}/${finalType}`;
      const platformData = this._createPlatformPayload(
        type,
        targetNumber,
        item.content,
        item.subject,
      );

      try {
        const result = await this._sendRequest(path, platformData, authHeader);
        itemResults.push({ number: targetNumber, success: true, result });
      } catch (error) {
        itemResults.push({
          number: targetNumber,
          success: false,
          error: error.message,
        });
      }
    }
    return itemResults;
  }

  /**
   * Genera el payload específico para Platform basado en el tipo de SuiteCRM
   */
  _createPlatformPayload(suiteType, targetNumber, content, subject = "") {
    const base = { number: targetNumber };

    const transformers = {
      text: () => ({ ...base, text: content.message }),
      image: () => ({
        ...base,
        mediatype: "image",
        mimetype: content.contentType || "image/jpeg",
        caption: content.caption || "",
        media: content.media,
        fileName: content.name || subject || "image.jpg",
      }),
      media: () => ({
        ...base,
        mediatype: content.contentType?.includes("pdf") ? "document" : "media",
        mimetype: content.contentType,
        caption: content.caption || "",
        media: content.media,
        fileName: content.name || subject || "file",
      }),
      pdf: () => transformers["media"](), // Alias para bulk pdf
      url: () => ({
        ...base,
        mediatype: "video",
        mimetype: content.contentType || "video/mp4",
        caption: content.caption || "",
        media: content.media,
        fileName: "video.mp4",
      }),
    };

    const transform = transformers[suiteType];
    if (!transform) throw new Error(`Unsupported message type: ${suiteType}`);

    return transform();
  }

  /**
   * Mapea el tipo de SuiteCRM al segmento final del path de Platform
   */
  _getPlatformTypePath(suiteType) {
    const map = {
      text: "text",
      image: "media",
      media: "media",
      pdf: "media",
      url: "media",
    };
    return map[suiteType] || "media";
  }

  /**
   * Centraliza las peticiones HTTP con Axios
   */
  async _sendRequest(path, data, authHeader) {
    try {
      let finalUrl = `${this.baseUrl}${path}`;
      console.log(`[Platform] Forwarding Direct Message: ${finalUrl}`);
      const response = await axios.post(finalUrl, data, {
        headers: {
          Authorization: authHeader || `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      throw new Error(errorMsg);
    }
  }
}

module.exports = new PlatformService();
