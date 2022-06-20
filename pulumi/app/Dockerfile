FROM amazon/aws-lambda-nodejs:14

ARG FUNCTION_DIR="/var/task"

RUN mkdir -p ${FUNCTION_DIR}

# Needed to make AWS lambda function use ES modules
COPY package.json ${FUNCTION_DIR}

COPY app.js ${FUNCTION_DIR}

COPY index.js ${FUNCTION_DIR}

CMD [ "index.handler" ]
