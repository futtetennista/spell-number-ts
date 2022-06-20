import express, { Express, Request, Response } from "express";

// https://github.com/nodejs/node/issues/32103#issuecomment-595806356
import translate from "../src/app.js";

const port = parseInt(process.env.PORT ?? "3000");

const app: Express = express();

app.get("/translate", (req: Request, res: Response) => {
  const inputQ = req.query;
  const result = translate({ low: 1, up: 1000 }, inputQ["q"] as string);
  switch (result.type) {
    case "error":
      res.status(400).send(result.error);
      break;
    case "success":
      res.status(200).send(result.content);
      break;
  }
});

const runServer = (port: number) => app.listen(port);

runServer(port);
