A. Escenario: Nuevo Mensaje (Entrante)


{
  "message": {
    "contactPhone": "573001234567",
    "body": "Hola, estoy interesado en sus servicios.",
    "direction": "INPUT", 
    "url": "[https://ejemplo.com/imagen_adjunta.jpg](https://ejemplo.com/imagen_adjunta.jpg)",
    "subject": "Asunto Opcional"
  }
}


Detalle de los campos:

contactPhone (String): Número de teléfono de la contraparte.

body (String): El contenido del texto del mensaje.

direction (String): Indica si es un mensaje de entrada o salida. Se esperan los valores "INPUT" (entrante) o "OUTPUT" (saliente).

url (String, opcional): Si el mensaje contiene un archivo adjunto, se pasa su URL. Si este campo existe, marca el check whatsapp_image.

