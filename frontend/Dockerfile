# ---- build stage ----------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# The API base URL is baked in at build time by Vite.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- runtime stage --------------------------------------------------------
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
# SPA routing: unknown paths must fall through to index.html, otherwise a
# refresh on /portal or /admin 404s.
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
