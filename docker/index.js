// https://github.com/nodejs/node/issues/32103#issuecomment-595806356
import translate from "./app.js";
// The payload in the event is different depending on how the lambda is configured
const getInput = (event) => {
    // version is an attribute of the `ProxyResult` type
    if ("version" in event) {
        const apiGatewayEvent = event;
        if (apiGatewayEvent.body === null) {
            return null;
        }
        else {
            const body = apiGatewayEvent.isBase64Encoded
                ? Buffer.from(apiGatewayEvent.body, "base64").toString()
                : apiGatewayEvent.body;
            return body === '' ? null : JSON.parse(body).number;
        }
    }
    else {
        return event.number;
    }
};
export const handler = (event, _context, callback) => {
    console.log("EVENT");
    for (let k in event) {
        console.log(`${k} = ${event[k]}`);
    }
    const input = getInput(event);
    if (input === null) {
        const response = {
            statusCode: 400,
            body: JSON.stringify({ message: "Please provide a number between [1, 1000]" }),
        };
        callback(null, response);
    }
    else {
        const result = translate({ low: 1, up: 1000 }, input.toString());
        switch (result.type) {
            case "error": {
                const response = {
                    statusCode: 400,
                    body: JSON.stringify({ message: result.error }),
                };
                callback(null, response);
                break;
            }
            case "success": {
                const response = {
                    statusCode: 200,
                    body: JSON.stringify({ result: result.content }),
                };
                callback(null, response);
                break;
            }
        }
    }
};
export default handler;
//# sourceMappingURL=index.js.map