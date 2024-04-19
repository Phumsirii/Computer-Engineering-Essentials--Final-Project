FROM node:21-alpine3.18

ENV MONGO_URL=mongodb+srv://Phumsiri:6530322721@gartuc.tgnijza.mongodb.net/Gartuc?retryWrites=true&w=majority

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
