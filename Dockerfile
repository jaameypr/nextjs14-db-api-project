# Step 1: Use a Node.js base image
FROM node:18-alpine AS builder

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of the app files and build the app
COPY . .
RUN npm run build

# Step 5: Start a minimal base image for the production app
FROM node:18-alpine

# Step 6: Set the working directory for the production stage
WORKDIR /app

# Step 7: Copy only the production build from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Step 8: Set environment variables and expose ports
ENV NODE_ENV=production
EXPOSE 3000

# Step 9: Start the application
CMD ["npm", "start"]
