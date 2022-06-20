// https://github.com/nodejs/node/issues/32103#issuecomment-595806356
import translate from "./app.js";
import { APIGatewayEvent, Context } from "aws-lambda";

// The event type if the lambda is not behind an API gateway
type RawEvent = { number: string | number };

const getInput = (
  event: RawEvent | APIGatewayEvent
): number | string | null => {
  if ("version" in event) {
    const apiGatewayEvent = event as APIGatewayEvent;
    if (apiGatewayEvent.body === null) {
      return null;
    } else {
      return JSON.parse(
        apiGatewayEvent.isBase64Encoded
          ? Buffer.from(apiGatewayEvent.body, "base64").toString()
          : apiGatewayEvent.body
      ).number;
    }
  } else {
    return (event as RawEvent).number;
  }
};

export const handler = (
  event: RawEvent | APIGatewayEvent,
  _context: Context,
  callback: any
): void => {
  console.log("EVENT");
  for (let k in event as any) {
    console.log(`${k} = ${(event as any)[k]}`);
  }
  const input = getInput(event);
  if (input === null) {
    const error = {
      statusCode: 400,
      headers: JSON.stringify({ "Content-Type": "application/json" }),
      body: "Please provide a number between [1, 1000]",
    };
    callback(error, null);
  } else {
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
