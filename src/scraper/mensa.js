import * as xml2js from "xml2js";
import axios from "axios";
import { promisify } from "util";
import { getCurrentDate } from "../util/date.js";

xml2js.Parser.prototype.parseStringPromise = promisify(xml2js.parseString);
const parser = new xml2js.Parser();
const URL = "https://xml.stw-potsdam.de/xmldata/gs/xml.php";

const scrape = async () => {
  try {
    let res = await axios.get(URL);
    let data = await parser.parseStringPromise(res.data);

    let menu = data.menu.datum.find(
      (datum) => datum.$.index === getCurrentDate()
    );

    let angebote = menu.angebotnr.map((angebot) => {
      return {
        title: angebot.titel[0],
        name: angebot.beschreibung[0],
        priceStudents: angebot.preis_s[0],
        priceGuests: angebot.preis_g[0],
      };
    });

    return angebote;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default scrape;
