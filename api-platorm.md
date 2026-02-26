/api/v1/chat/{phone}/text
{
  "number": "string",
  "text": "string"
}

/api/v1/chat/{phone}/sticker
{
  "number": "string",
  "sticker": "string"
}

/api/v1/chat/{phone}/media

{
  "number": "string",
  "mediatype": "string",
  "mimetype": "string",
  "caption": "string",
  "media": "string",
  "fileName": "string"
}

/api/v1/chat/{phone}/location
{
  "number": "string",
  "name": "string",
  "address": "string",
  "latitude": 0,
  "longitude": 0
}

/api/v1/chat/{phone}/contact

{
  "number": "string",
  "contact": [
    {
      "fullName": "string",
      "wuid": "string",
      "phoneNumber": "string",
      "organization": "string",
      "email": "string",
      "url": "string"
    }
  ]
}

/api/v1/chat/{phone}/audio

{
  "number": "string",
  "audio": "string"
}




Ahora los chats masivos, lo que debemos hacer es que como en singular recibimos un array de teléfonos, entonces nos toca enviar uno a uno a los endpoints dependiendo de lo que sea


/api/v1/bulk/chat/{phone}/text
{
  "number": "string",
  "text": "string"
}


/api/v1/bulk/chat/{phone}/sticker
{
  "number": "string",
  "sticker": "string"
}


/api/v1/bulk/chat/{phone}/media
{
  "number": "string",
  "mediatype": "string",
  "mimetype": "string",
  "caption": "string",
  "media": "string",
  "fileName": "string"
}


/api/v1/bulk/chat/{phone}/location
{
  "number": "string",
  "name": "string",
  "address": "string",
  "latitude": 0,
  "longitude": 0
}

/api/v1/bulk/chat/{phone}/contact
{
  "number": "string",
  "contact": [
    {
      "fullName": "string",
      "wuid": "string",
      "phoneNumber": "string",
      "organization": "string",
      "email": "string",
      "url": "string"
    }
  ]
}


/api/v1/bulk/chat/{phone}/audio
{
  "number": "string",
  "audio": "string"
}
