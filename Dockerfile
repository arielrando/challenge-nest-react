# 1. Usamos una imagen de Node ligera
FROM node:20-alpine

# 2. Creamos el directorio de trabajo
WORKDIR /usr/src/app

# 3. Copiamos los archivos de definición de dependencias
COPY package*.json ./

# 4. Instalamos las dependencias
RUN npm install

# 5. Copiamos el resto del código fuente
COPY . .

# 6. Construimos la aplicación (NestJS compila a TS)
RUN npm run build

# 7. Exponemos el puerto que usa NestJS (3000 según tu main.ts)
EXPOSE 3000

# 8. Comando para arrancar en modo desarrollo con hot-reload
CMD ["npm", "run", "start:dev"]