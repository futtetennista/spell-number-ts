// https://github.com/nodejs/node/issues/32103#issuecomment-595806356
import runServer from "./app.js"

const port = parseInt(process.env.PORT?? "3000")

runServer(port)
