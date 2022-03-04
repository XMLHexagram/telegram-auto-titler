# telegram-auto-titler

A telegram bot write in deno, can auto give group member custom title.

## Why?

Some [IM](https://en.wikipedia.org/wiki/Instant_messaging) allows group members give themselves a custom title, it is very cool, but telegram doesn't allow it unless you are an admin.

This bot can auto set a custom title for group members by promote they a lowest permission admin and set title for them.

## How to use?

Add [hexagram_auto_titler_bot](https://t.me/hexagram_auto_titler_bot) to your group's admin list.

Call `/check` to check if the bot get enough permissions.

Then, your group members can use `/set_title` to set a title for themselves.

## Deploy by yourself using [deno deploy](https://deno.com/deploy)

+ Create a account on [deno deploy](https://deno.com/deploy).
+ Create a new project.
+ Click `Deploy URL` and paste this url: `https://raw.githubusercontent.com/XMLHexagram/telegram-auto-titler/main/src/index.ts`, then waiting for success.
+ Turn to Settings/Environment Variable.
  + set `WEBHOOK_URL`: a random string, like `/7f42257a-6e85-4b34-90ef-30e1769832c8` (must start with `/`).
  + set `BOT_TOKEN`: your bot token(SHOULD NOT start with `bot`).
  + set `MODE`: `PROD`.
+ open your local bash

```bash
curl -X "POST" "https://api.telegram.org/$YOUR_BOT_TOKEN/setWebhook" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "url": "https://$DENO_DEPLOY_DOMAIN/$WEBHOOK_URL"
}'
```

**change `$YOUR_BOT_TOKEN`(SHOULD start with `bot`), `$DENO_DEPLOY_DOMAIN`, `$WEBHOOK_URL` to your bot token, deno deploy base url and webhook url.**
**You can find `$DENO_DEPLOY_DOMAIN` in deno deploy overview page.**

+ now, enjoy this bot. 🎉

## How it works?

This bot works by give group member a lowest permission admin, and set a title for them.

## LIMIT

People only who promoted by this bot can use `/set_title`, this is duo to telegram admin promote chain.

This bot is only for small group, which less than 50 people.

Because [telegram limit](https://limits.tginfo.me/en), one group can only have 50 admins.

## Q & A

### Why not make empty permission admin?

Because telegram bot CAN NOT make empty permission admin due to [telegram bot api](https://core.telegram.org/bots/api#promotechatmember).

But you can manually close all their permissions.

### Bugs & Feature?

Feel free to [open an issue](https://github.com/XMLHexagram/telegram-auto-titler/issues).