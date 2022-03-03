import { Bot, Context } from "https://deno.land/x/grammy/mod.ts";
import { env } from "./env.ts";
import { TATError } from "./error.ts";

const bot = new Bot(env.BOT_TOKEN);

const me = await bot.api.getMe();

const meId = me.id;

await bot.api.setMyCommands([
  { command: "help", description: "show help message" },
  { command: "set_title", description: "customize my title" },
  { command: "check", description: "check missing permissions" },
]);

bot.command("help");

bot.command("set_title", async (ctx) => {
  try {
    // 0-16 characters, emoji are not allowed
    if (ctx.match.length > 16) {
      throw new TATError("LENGTH_LIMIT");
    }

    await check(ctx);

    const chatAdminMembers = await ctx.getChatAdministrators();

    // guard not from bot
    if (ctx.from?.is_bot) {
      throw new TATError("NOT_SERVE_BOT");
    }

    const admin = chatAdminMembers.find(
      (member) => member.user.id === ctx.from?.id
    );

    if (admin === undefined) {
      // not admin

      // create low permission admin
      await ctx.promoteAuthor({
        is_anonymous: false,
        can_manage_voice_chats: false,
        can_manage_chat: false,
        can_pin_messages: false,
        can_change_info: false,
        can_delete_messages: false,
        can_invite_users: false,
        can_promote_members: true,
      });

      console.log(ctx);

      await ctx.setChatAdministratorAuthorCustomTitle(ctx.match);
    } else {
      // is admin
      switch (admin.status) {
        case "creator":
          try {
            await ctx.setChatAdministratorAuthorCustomTitle(ctx.match);
          } catch (error) {
            throw new TATError("YOUR_ARE_CREATOR").setPayload(error);
          }
          break;
        case "administrator":
          console.log(ctx);

          if (env.MODE === "TEST") {
            ctx.reply(`TEST: admin.can_be_edited: ${admin.can_be_edited}`);
          }
          try {
            await ctx.setChatAdministratorAuthorCustomTitle(ctx.match);
          } catch (error) {
            throw new TATError("YOUR_ARE_ADMIN").setPayload(error);
          }
          break;
        default:
          break;
      }
    }

    await ctx.reply(`set your title to: ${ctx.match}`);
  } catch (error) {
    if (error instanceof TATError) {
      await ctx.reply(error.toResponse());
    } else {
      await ctx.reply(new TATError("UNKNOWN").setPayload(error).toResponse());
    }
  }
});

bot.command("check", async (ctx) => {
  try {
    await check(ctx);
    await ctx.reply("I have all needed permissions");
  } catch (error) {
    if (error instanceof TATError) {
      await ctx.reply(error.toResponse());
    } else {
      await ctx.reply(new TATError("UNKNOWN").setPayload(error).toResponse());
    }
  }
});

bot.start().finally(() => {
  console.log("bot ended");
});

async function check(ctx: Context) {
  const chatAdminMembers = await ctx.getChatAdministrators();
  // guard I am admin
  const me = chatAdminMembers.find((member) => member.user.id === meId);
  if (me === undefined || me.status !== "administrator") {
    throw new TATError("I_AM_NOT_ADMIN");
  }

  // guard permission
  const missingPermission: string[] = [];
  const chat = await ctx.getChat();
  if (chat.type === "group" || chat.type === "supergroup") {
    if (chat.permissions?.can_change_info) {
      if (!me.can_change_info) {
        missingPermission.push("can_change_info");
      }
    }
    if (chat.permissions?.can_pin_messages) {
      if (!me.can_pin_messages) {
        missingPermission.push("can_pin_messages");
      }
    }
  } else {
    throw new TATError("ERROR_CHAT_TYPE");
  }
  if (!me.can_promote_members) {
    missingPermission.push("can_promote_members");
  }
  if (missingPermission.length > 0) {
    throw new TATError(
      "MISSING_PERMISSION",
      `missing these permissions: ${missingPermission.join(", ")}`
    );
  }
}
