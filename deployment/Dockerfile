FROM public.ecr.aws/docker/library/node:18.12-alpine3.17 as node

FROM node as build

WORKDIR /app

COPY package*.json ./      

RUN npm ci 

# add app
COPY . .


EXPOSE 3000
# start app
CMD ["npm", "run", "dev"]