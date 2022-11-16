FROM ubuntu:latest
WORKDIR /app
STOPSIGNAL SIGINT
EXPOSE 443:8443/tcp 80:8080/tcp
ENV KEY="" CERT="" RUNNINGON="railway"

# Install basic files
RUN apt update && apt install -y wget curl chromium-browser && wget -qO- https://raw.githubusercontent.com/Sirherobrine23/DebianNodejsFiles/main/debianInstall.sh | bash
ENTRYPOINT [ "node", "dist/api.js" ]
COPY ./package*.json ./
RUN npm ci
COPY ./ ./
RUN npm run build
