FROM node:20-alpine AS build
WORKDIR /app

#Copiar archivos de dependencias
COPY package.json package-lock.json ./
RUN npm ci

#Copiar el resto del código
COPY . .

#Construir la aplicación para producción
RUN npm run build

#Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine
#Copiar la configuración de Nginx creada anteriormente
COPY nginx.conf /etc/nginx/conf.d/default.conf
#Copiar los archivos construidos desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]