FROM jenkins/jenkins:lts-jdk17
USER root

# Node.js 22 (потрібен для Playwright-тестів)
RUN apt-get update && apt-get install -y curl ca-certificates \
 && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
 && apt-get install -y nodejs \
 && rm -rf /var/lib/apt/lists/*

# Браузер Chromium + системні бібліотеки, у спільну папку (доступну користувачу jenkins)
ENV PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
RUN npx --yes playwright@1.65.1 install --with-deps chromium \
 && chmod -R a+rX /opt/pw-browsers

# Дозволяємо git читати змонтований репозиторій
RUN git config --system --add safe.directory '*'

USER jenkins

# Плагіни: pipeline, git, junit (графік тестів), htmlpublisher (Playwright-звіт)
RUN jenkins-plugin-cli --plugins workflow-aggregator git junit htmlpublisher
