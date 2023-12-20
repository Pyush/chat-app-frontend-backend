# Building layer
FROM node:18-alpine as development

RUN npm install -g @nestjs/cli

WORKDIR /app

# Copy configuration files
COPY tsconfig*.json ./
COPY package*.json ./

RUN npm install --legacy-peer-deps

ENV DATABASE_URL mongodb://localhost:27027/chatAppDB
ENV NODE_ENV development
ENV JWT_SECRET piyush@123

# Install dependencies from package-lock.json, see https://docs.npmjs.com/cli/v7/commands/npm-ci
RUN npm ci

# Copy application sources (.ts, .tsx, js)
COPY src/ src/

# Build application (produces dist/ folder)
RUN npm run build

# Runtime (production) layer
FROM node:18-alpine as production

RUN npm install -g @nestjs/cli

WORKDIR /app

# Copy dependencies files
COPY package*.json ./

RUN npm install --legacy-peer-deps

ENV DATABASE_URL mongodb://localhost:27027/chatAppDB
ENV NODE_ENV development
ENV JWT_SECRET piyush@123

# Install runtime dependecies (without dev/test dependecies)
RUN npm ci --production

# Copy production build
COPY --from=development /app/dist/ ./dist/

# Expose application port
EXPOSE 3000

# Start application
CMD [ "node", "dist/main.js" ]



