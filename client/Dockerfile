# Stage 1: build
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: production with nginx
FROM nginx:stable-alpine

# Копіюємо зібрані файли з першого stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Стартує nginx
CMD ["nginx", "-g", "daemon off;"]