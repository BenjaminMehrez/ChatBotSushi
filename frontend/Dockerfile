# Etapa de construcción
FROM node:18-alpine AS build
WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar todo el proyecto
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .

# Exponer el puerto 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
