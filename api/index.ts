import { Hono } from "hono";
import { cors } from "hono/cors";
import apiRouter from "./routes/api.js";
import { serve } from '@hono/node-server';
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    allowHeaders: ["Content-Type"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.route("/v1", apiRouter);

serve(app);
console.log("Start @ http://localhost:3000/api/v1")

// export const config = {
//   runtime: "edge",
// };

// export default handle(app);
