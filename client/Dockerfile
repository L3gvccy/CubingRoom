# Stage 1: build React
FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: nginx
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]