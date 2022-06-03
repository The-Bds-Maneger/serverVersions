FROM debian:latest
ARG DEBIAN_FRONTEND="noninteractive"
RUN apt update && apt install -y git curl wget sudo procps zsh tar screen ca-certificates procps lsb-release xdg-utils g++ gconf-service

# Install Docker and Docker Compose
VOLUME [ "/var/lib/docker" ]
RUN curl https://get.docker.com | sh && \
  compose_version="$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep tag_name | cut -d \" -f 4)"; \
  wget -q https://github.com/docker/compose/releases/download/${compose_version}/docker-compose-`uname -s`-`uname -m` -O /usr/local/bin/docker-compose && \
  chmod +x -v /usr/local/bin/docker-compose

# Create docker and minikube start script
ARG DOCKERD_ARGS="--experimental"
RUN (\
echo '#''!/bin/bash';\
echo "set -e";\
echo 'if ! [[ -f "/var/run/docker.sock" ]];then';\
echo "  (sudo dockerd ${DOCKERD_ARGS}) &";\
echo "  sleep 5s";\
echo "fi";\
echo 'if ! [[ -z "$@" ]]; then';\
echo '  sh -c "$@"';\
echo "fi";\
echo "";\
echo '# Check docker is running';\
echo "while true; do";\
echo "  if ! ((ps -ef | grep -v grep | grep -q dockerd) || (docker info &> /dev/null)); then";\
echo "    break";\
echo "  fi";\
echo "  sleep 4s";\
echo "done";\
echo "";\
echo "echo Dockerd stopped";\
echo "exit 2") | tee /usr/local/bin/start.sh && chmod +x /usr/local/bin/start.sh

# Set default entrypoint
ENTRYPOINT [ "/usr/local/bin/start.sh" ]

# Add non root user
ARG USERNAME=devcontainer
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN groupadd --gid $USER_GID $USERNAME && \
  adduser --disabled-password --gecos "" --shell /usr/bin/zsh --uid $USER_UID --gid $USER_GID $USERNAME && \
  usermod -aG sudo $USERNAME && echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/$USERNAME && \
  chmod 0440 /etc/sudoers.d/$USERNAME && usermod -aG docker $USERNAME

USER $USERNAME
WORKDIR /home/$USERNAME

# Install oh my zsh
RUN yes | sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" && \
  git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting && \
  git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions && \
  sed -e 's|ZSH_THEME=".*"|ZSH_THEME="strug"|g' -i ~/.zshrc && sed -e 's|plugins=(.*)|plugins=(git docker zsh-syntax-highlighting zsh-autosuggestions)|g' -i ~/.zshrc