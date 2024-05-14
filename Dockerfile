# Stage 1: Application Building

FROM node:20.13.1-alpine as build

WORKDIR /server-app

COPY package*.json ./

COPY server.js ./

# Only geoip-lite is needed for this project
RUN npm install geoip-lite


# Stage 2: Application Run

FROM node:20.13.1-alpine as production

LABEL org.opencontainers.image.authors="Jakub Kopeć"

WORKDIR /server-app

COPY --from=build /server-app .

# Port 3000 is exposed but if PORT is set in the environment variable it will be used instead
EXPOSE 3000

RUN apk add --no-cache curl

HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:3000 || exit 1

CMD ["node", "server.js"]


# Build the image

# docker build -t geoip-server .

# Run the container

# docker run -d -p 3000:3000 --name ip-check-server geoip-server

# Get logs

# docker logs ip-check-server

# Check how many layers are in the image

# docker inspect --format="{{len .RootFS.Layers}}" geoip-server

