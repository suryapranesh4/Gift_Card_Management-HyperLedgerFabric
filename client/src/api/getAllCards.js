import { baseURL } from "../utils/const";

export default async function getAllCards() {
  let data = [];
  try {
    await fetch(`${baseURL}/giftcards/getAllCards`)
      .then((response) => response.json())
      .then((cards) => data = cards);
    return data;
  } catch (error) {
    console.log("Error :", error);
  }
}
