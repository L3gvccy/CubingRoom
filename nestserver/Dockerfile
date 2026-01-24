FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npx prisma migrate deploy --schema=./prisma/schema.prisma

# Збираємо проект
RUN npm run build

# -------------------
# Stage 2: production
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

ENV PORT=3001

EXPOSE $PORT

# Запуск бекенду
CMD ["node", "dist/main"]