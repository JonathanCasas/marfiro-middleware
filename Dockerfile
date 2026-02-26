# Usamos una imagen de Node.js estable y ligera
FROM node:22-alpine

# Directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias de producción
RUN npm ci --only=production

# Copiamos el resto del código
COPY . .

# Exponemos el puerto definido en el .env (por defecto 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
