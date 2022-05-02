FROM debian:latest
RUN apt update && apt install -y wget
RUN VERSION=$(wget -qO- https://api.github.com/repos/Sirherobrine23/DebianNodejsFiles/releases/latest |grep 'name' | grep "nodejs"|grep "$(dpkg --print-architecture)"|cut -d '"' -f 4 | sed 's|nodejs_||g' | sed -e 's|_.*.deb||g'|sort | uniq|tail -n 1); wget -q "https://github.com/Sirherobrine23/DebianNodejsFiles/releases/download/debs/nodejs_${VERSION}_$(dpkg --print-architecture).deb" -O /tmp/nodejs.deb && dpkg -i /tmp/nodejs.deb && rm -rfv /tmp/nodejs.deb && npm install -g npm@latest
RUN npm i -g pm2
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build
EXPOSE 3000:3000/tcp
ENTRYPOINT [ "pm2-runtime", "start", "-i", "-1", "dist/cjs/api/index.js" ]