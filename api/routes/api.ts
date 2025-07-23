import { Hono } from "hono";
import studentsRouter from "./students.js";
import { bearerAuth } from "hono/bearer-auth";
import { env } from "hono/adapter";

const apiRouter = new Hono();

apiRouter.get("/", (c) => {
  return c.json({ message: "Students API" });
});

apiRouter.use(
  "*",
  bearerAuth({
    verifyToken: async (token, c) => {
      const secret = process.env.API_SECRET;

      if (!secret) {
        // This is a server-side configuration error.
        console.error("API_SECRET environment variable not defined. Make sure you have a .env file and call dotenv.config().");
        return false;
      }

      // Securely compare the token from the request with your secret.
      return token === secret;
    },
  })
);

apiRouter.route("/students", studentsRouter);

export default apiRouter;
