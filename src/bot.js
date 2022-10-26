import mensaMenu from "./scraper/mensa.js";
import {
  addSubscriber,
  removeSubscriber,
  updateMenu as updateMenuDB,
  isSubscriber,
  compareMenu,
  getSubscriber,
  getUnsubscribeMessage,
  getSubscribeMessage,
  stopSubscriber,
} from "./util/db.js";
import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { mensaMessage } from "./util/menuMessages.js";
import cron from "node-cron";

dotenv.config();
const TOKEN = process.env.TOKEN;

if (!TOKEN) throw new Error("TOKEN is not defined");

const bot = new Telegraf(TOKEN);
bot.launch();

bot.start((ctx) => {
  ctx.reply(
    `Willkommen zum Food@Griebnitzsee-Bot! \nUm tägliche Updates zu erhalten, führe /mensa aus. \nMöchtest du keine Updates mehr erhalten, so schicke einfach /stop. \nIch freue mich über dein /feedback!`
  );
});

bot.command("mensa", async (ctx) => {
  await subscribeCommand(ctx, "mensa");
});

bot.command("stop", async (ctx) => {
  await stopSubscriber(ctx.chat.id);
  ctx.reply("Du erhältst keine Benachrichtigungen mehr!");
});

bot.command("feedback", (ctx) => {
  ctx.reply(
    "Bitte schreibe eine private Nachricht mit deinem Feedback an @einjannis. Ich werde mich so schnell wie möglich bei dir melden."
  );
});

const subscribeCommand = async (ctx, key) => {
  try {
    if (await isSubscriber(key, ctx.chat.id)) {
      await removeSubscriber(key, ctx.chat.id);
      ctx.reply(await getUnsubscribeMessage(key));
    } else {
      await addSubscriber(key, ctx.chat.id);
      ctx.reply(await getSubscribeMessage(key));
    }
  } catch (err) {
    console.error(err);
    ctx.reply("Something went wrong");
  }
};

const updateMenu = async (key, menu, message) => {
  try {
    if (await compareMenu(key, menu)) {
      console.log(key + " menu is up to date");
      return;
    }

    await updateMenuDB(key, menu);
    await informSubscriber(key, message);
    console.log(key + " menu updated");
  } catch (err) {
    console.error(err);
  }
};

const informSubscriber = async (key, message) => {
  try {
    let subscriber = await getSubscriber(key);
    subscriber.forEach(async (chatId) => {
      try {
        await bot.telegram.sendMessage(chatId, message);
      } catch (err) {
        if (err.on.method === "sendMessage") {
          let chatId = err.on.payload.chat_id;

          switch (err.code) {
            case 400:
              console.log("Chat not found");
              await removeSubscriber(key, err.on.payload.chat_id);
              break;
            case 403:
              console.log("Bot is blocked by the user");
              await removeSubscriber(key, chatId);
              break;
            default:
              console.error(err);
          }
        } else {
          console.error(err);
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
};

const updateMensa = async () => {
  try {
    let menu = await mensaMenu();
    await updateMenu("mensa", menu, mensaMessage(menu));
  } catch (err) {
    console.error(err);
  }
};

cron.schedule("*/15 9-15 * * 1-5", updateMensa);
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
