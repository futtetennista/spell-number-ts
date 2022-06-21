import { APIGatewayEvent, Context, Callback, ProxyResult } from "aws-lambda";

// https://github.com/nodejs/node/issues/32103#issuecomment-595806356
import spellNumber from "./app.js";

// The event type if the lambda is not behind an API gateway
type RawEvent = { number: string | number };

// The payload in the event is different depending on how the lambda is configured
const getInput = (
  event: RawEvent | APIGatewayEvent
): number | string | null => {
  // version is an attribute of the `ProxyResult` type
  if ("version" in event) {
    const apiGatewayEvent = event as APIGatewayEvent;
    if (apiGatewayEvent.body === null) {
      return null;
    } else {
      const body = apiGatewayEvent.isBase64Encoded
        ? Buffer.from(apiGatewayEvent.body, "base64").toString()
        : apiGatewayEvent.body;
      return body === "" ? null : JSON.parse(body).number;
    }
  } else {
    return (event as RawEvent).number;
  }
};

export const handler = (
  event: RawEvent | APIGatewayEvent,
  _context: Context,
  callback: Callback<ProxyResult | null>
): void => {
  console.log("EVENT");
  for (let k in event as any) {
    console.log(`${k} = ${(event as any)[k]}`);
  }
  const input = getInput(event);
  if (input === null) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: "Please provide a number between [1, 1000]",
      }),
    };
    callback(null, response);
  } else {
    const result = spellNumber({ low: 1, up: 1000 }, input.toString());
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
