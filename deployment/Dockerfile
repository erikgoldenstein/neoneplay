FROM public.ecr.aws/docker/library/node:18.12-alpine3.17 as node

RUN npm install -g serve

FROM node as build

WORKDIR /app

COPY package*.json ./      

RUN npm ci 

# add app
COPY . .

RUN npm run build

FROM node as final

COPY package*.json ./                   

# Install only production dependencies
RUN npm ci --omit dev

# Copy transpiled js from builder stage into the final image
COPY --from=build /app/.next ./build

EXPOSE 3000
# start app
CMD ["serve", "-s", "build"]