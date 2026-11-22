FROM jenkins/jenkins:lts-jdk17
USER root

# Node.js 22 (same major version as .nvmrc)
RUN apt-get update && apt-get install -y curl ca-certificates \
 && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
 && apt-get install -y nodejs \
 && rm -rf /var/lib/apt/lists/*

# Chromium + system libraries, in a shared folder readable by the jenkins user.
# IMPORTANT: keep this version equal to @playwright/test in package.json.
# If they differ, tests fail with "Executable doesn't exist" and the image must be rebuilt.
ENV PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
RUN npx --yes playwright@1.65.1 install --with-deps chromium \
 && chmod -R a+rX /opt/pw-browsers

USER jenkins

# Plugins: pipeline, git, junit (test trend), htmlpublisher (Playwright report)
RUN jenkins-plugin-cli --plugins workflow-aggregator git junit htmlpublisher
