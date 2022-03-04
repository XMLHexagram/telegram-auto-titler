import { configSync } from "https://deno.land/std@0.127.0/dotenv/mod.ts";

switch (Deno.env.get("MODE")) {
  case "TEST":
    Deno.env.set("WEBHOOK_URL", "/test");
    configSync({ export: true });
    break;
  case "PROD":
    break;
  default:
    console.error("missing mode");
    Deno.exit(1);
    break;
}

const TATEnv = ["BOT_TOKEN", "MODE", "WEBHOOK_URL"] as const;

type TATEnvType = typeof TATEnv[number];

type TATEnvMapType = { [key in TATEnvType]: string };

const getEnv = (key: TATEnvType): string => {
  const result = Deno.env.get(key);
  if (result === undefined) {
    throw new Error(`${key} not found`);
  } else {
    return result;
  }
};

export const env = TATEnv.map((value) => ({ [value]: getEnv(value) })).reduce(
  (acc, cur) => ({ ...acc, ...cur }),
  {}
) as TATEnvMapType;
