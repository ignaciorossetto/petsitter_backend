#DEFINIMOS IMAGEN BASE
FROM node

#CREAMOS CARPETA DONDE SE GUARDARA EL PROYECTO
WORKDIR /app

#COPIAMOS PACKAGE JSON DE NUESTRA CARPETA LOCAL A NUESTRA CARPETA DE OPERACIONES
COPY package*.json ./

#CORREMOS EL COMANDO PARA INSTALAR LAS DEPENDENCIAS 
RUN npm install

#TOMAMOS EL CODIGO DEL APLICATIVO
COPY . .

#HABILITAMOS UN PUERTO QUE ESCUCHE NUESTRA COMPUTADORA
EXPOSE 5000

#TENGO DUDAS DE SI EN PACAKGE.JSON ESTA NODEMON INDEX.JS....
CMD ["npm", "start"]