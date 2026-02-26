Documentación de Endpoints - API de WhatsAppEste documento detalla los endpoints construidos y consumidos por la clase dt_whatsapp_utils. Todas las peticiones HTTP se realizan mediante el método POST y comparten una configuración base obtenida de la administración del CRM (whatsapp_config).Configuración Base y CabecerasTodas las peticiones utilizan las siguientes variables de entorno/configuración:{baseUrl}: URL base de la API (whatsapp_config_whatsapp_url).{accountId}: ID de la cuenta de WhatsApp (whatsapp_config_whatsapp_account).{phone}: Número de teléfono emisor (whatsapp_config_waboxapp_mobile_number).{token}: Token de autenticación (whatsapp_config_waboxapp_token).Headers obligatorios en todas las peticiones:Content-Type: application/json
Authorization: Bearer {token}
1. Envío de Mensaje Directo (Chat)Este endpoint se utiliza para enviar un mensaje directamente a un contacto específico. Se construye en el método sendMessageToApi.URL: POST {baseUrl}/whatsapp/{accountId}/chats/{phone}/{contactPhone}/{type}Parámetros de Ruta:{contactPhone}: Número de teléfono del destinatario.{type}: Tipo de mensaje. Puede ser text, image, media o url.Estructuras de Datos (Body) según el tipoA. Tipo: Texto (type = 'text')Enviado desde send_whatsapp_message cuando no hay adjuntos.{
  "message": "Contenido del mensaje de texto",
  "customId": "uuid-generado-por-crm"
}
B. Tipo: Imagen (type = 'image')Enviado desde send_whatsapp_image.{
  "media": "base64_del_archivo_de_imagen...",
  "caption": "",
  "subject": "Nombre del Template (Opcional)",
  "customId": "uuid-generado-por-crm"
}
C. Tipo: Media / Documentos (type = 'media')Enviado desde send_whatsapp_message (con adjunto) o send_whatsapp_media.{
  "media": "base64_del_archivo...",
  "caption": "Contenido del mensaje que acompaña al archivo",
  "contentType": "application/pdf (o el mime type correspondiente)",
  "name": "nombre_del_archivo.pdf", 
  "subject": "Nombre del Template (Opcional)",
  "customId": "uuid-generado-por-crm"
}
D. Tipo: Video / URL (type = 'url')Enviado desde send_whatsapp_video. Nota: Aunque el tipo en la URL es 'url', el código envía un payload en base64.{
  "media": "base64_del_archivo_de_video...",
  "caption": "",
  "contentType": "video/mp4",
  "subject": "Nombre del Template (Opcional)",
  "customId": "uuid-generado-por-crm"
}
2. Encolar Mensajes Singulares (Bulk / Envíos Masivos)Este endpoint se utiliza para procesar envíos de plantillas (Templates) a múltiples números de forma masiva o individual pero a través de una cola. Se construye en el método enqueueSingularMessages.URL: POST {baseUrl}/queues/chats/singular/{phone}/{type}Parámetros de Ruta:{type}: Tipo de mensaje, dinámico según el método getType() (text, pdf, image, media).Estructuras de Datos (Body) según el contenidoA. Envío de Texto (Sin adjuntos){
  "items": [
    {
      "phones": ["numero_1", "numero_2"], 
      "content": {
        "message": "Cuerpo del mensaje parseado con los datos del módulo",
        "subject": "Nombre del Template"
      },
      "subject": "Nombre del Template"
    }
  ]
}
Nota: phones puede ser un Array (en sendBulkTemplate) o un String (en sendBulkTemplateSingle).B. Envío con Adjuntos (Imagen, PDF, Media){
  "items": [
    {
      "phones": ["numero_destinatario"],
      "content": {
        "media": "base64_del_archivo...",
        "contentType": "mime/type",
        "name": "nombre_del_archivo.ext",
        "subject": "Nombre del Template",
        "caption": "Cuerpo del mensaje parseado"
      },
      "subject": "Nombre del Template"
    }
  ]
}
