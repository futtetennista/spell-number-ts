// https://github.com/nodejs/node/issues/32103#issuecomment-595806356
import translate from "./app.js";
const getInput = (event) => {
    if ("version" in event) {
        const apiGatewayEvent = event;
        if (apiGatewayEvent.body === null) {
            return null;
        }
        else {
            return JSON.parse(apiGatewayEvent.isBase64Encoded
                ? Buffer.from(apiGatewayEvent.body, "base64").toString()
                : apiGatewayEvent.body).number;
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
        const error = {
            statusCode: 400,
            headers: JSON.stringify({ "Content-Type": "application/json" }),
            body: "Please provide a number between [1, 1000]",
        };
        callback(error, null);
    }
    else {
        const result = translate({ low: 1, up: 1000 }, input.toString());
        switch (result.type) {
            case "error": {
                const response = {
                    statusCode: 400,
                    body: result.error,
                };
                callback(null, response);
                break;
            }
            case "success": {
                const response = {
                    statusCode: 200,
                    body: result.content,
                };
                callback(null, response);
                break;
            }
        }
    }
};
export default handler;
//# sourceMappingURL=index.js.map