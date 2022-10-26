import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import _ from "lodash";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "/../../db.json");

const adapter = new JSONFile(file);
const db = new Low(adapter);

const isSubscriber = async (key, chatId) => {
  try {
    await db.read();
    return db.data[key].subscriber.find((id) => id === chatId);
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getSubscriber = async (key) => {
  try {
    await db.read();
    return db.data[key].subscriber;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const addSubscriber = async (key, chatId) => {
  try {
    await db.read();
    if (!db.data[key].subscriber.find((id) => id === chatId))
      db.data[key].subscriber.push(chatId);
    await db.write();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const removeSubscriber = async (key, chatId) => {
  try {
    await db.read();
    db.data[key].subscriber = db.data[key].subscriber.filter(
      (id) => id !== chatId
    );
    await db.write();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getMenu = async (key) => {
  try {
    await db.read();
    return db.data[key].menu;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const compareMenu = async (key, menu) => {
  try {
    await db.read();
    return _.isEqual(db.data[key].menu, menu);
  } catch (err) {
    console.error(err);
    return false;
  }
};

const updateMenu = async (key, menu) => {
  try {
    await db.read();
    db.data[key].menu = menu;
    await db.write();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const stopSubscriber = async (chatId) => {
  try {
    await db.read();
    for (let key in db.data) {
      db.data[key].subscriber = db.data[key].subscriber.filter(
        (id) => id !== chatId
      );
    }
    await db.write();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getSubscribeMessage = async (key) => {
  try {
    await db.read();
    return db.data[key].subscribeMessage;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getUnsubscribeMessage = async (key) => {
  try {
    await db.read();
    return db.data[key].unsubscribeMessage;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export {
  addSubscriber,
  removeSubscriber,
  updateMenu,
  stopSubscriber,
  isSubscriber,
  compareMenu,
  getSubscriber,
  getMenu,
  getSubscribeMessage,
  getUnsubscribeMessage,
};
