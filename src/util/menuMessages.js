import { getMenu } from "./db.js";
import { getWeekDay, getCurrentDate } from "./date.js";

const mensaMessage = (menu) => {
  return `🍴 Speiseplan (Mensa) für ${getWeekDay()}, den ${getCurrentDate()}: \n${menu
    .map(
      (offer) =>
        `🍽️ ${offer.title} \n${offer.name} \n💰 ${offer.priceStudents}€ | ${offer.priceGuests}€ \n`
    )
    .join("\n")}`;
};

export { mensaMessage };
