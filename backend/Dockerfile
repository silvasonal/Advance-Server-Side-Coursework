FROM node:16 AS builder

WORKDIR /app

COPY package*.json ./

# Install build dependencies and bcrypt
RUN apt-get update && apt-get install -y python3 make g++ \
    && npm install \
    && npm rebuild bcrypt --build-from-source

FROM node:16

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "start"]