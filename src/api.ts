import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { webhookCallbackHandler } from "./bot.ts";
import { env } from "./env.ts";

const router = new Router();
router.get("/ping", (ctx) => {
  ctx.response.body = { ping: "pong" };
});

router.post(env.WEBHOOK_URL, async (ctx) => {
  console.log("get request");
  const handler = webhookCallbackHandler();
  try {
    await handler(ctx);
  } catch (err) {
    console.error(err);
  }
  ctx.response.status = 200;
  ctx.response.body = {};
  return;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", (e) => {
  console.info(`Listening on port ${e.hostname}:${e.port}`);
});
await app.listen({ port: 8080 });
