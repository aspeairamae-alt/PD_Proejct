FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN npm --prefix backend install --omit=dev

# Copy backend source
COPY backend ./backend

ENV NODE_ENV=production
EXPOSE 5007

CMD ["node", "backend/src/server.js"]
