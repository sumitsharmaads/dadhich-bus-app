# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY dist ./dist
EXPOSE 4000
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
