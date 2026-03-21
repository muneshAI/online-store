FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY server.js ./
COPY public ./public
COPY data ./data
COPY .gitignore ./.gitignore
EXPOSE 8000
CMD ["npm", "start"]
