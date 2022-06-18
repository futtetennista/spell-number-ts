import express, { Express, Request, Response} from "express";

// https://github.com/nodejs/node/issues/32103#issuecomment-595806356
import translate from "../lib/app.js"

const port = parseInt(process.env.PORT?? "3000")

const app: Express = express();

app.get("/translate", (req: Request, res: Response) => {
  const inputQ = req.query;
  const { data, error } = translate(1, 1000, inputQ["q"] as string);
  if (error) {
      res.status(400).send(error)
  } else {
      res.status(200).send(data)
  }
});

const runServer = (port: number) => app.listen(port);

runServer(port);
