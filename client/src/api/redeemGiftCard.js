import { baseURL } from "../utils/const";

export default async function redeemGiftCard(id) {
  let redeemResponse = {};
  try {
    await fetch(`${baseURL}/giftcards/redeem`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id
      }),
    })
      .then((response) => response.json())
      .then((data) => (redeemResponse = data));
    return redeemResponse;
  } catch (error) {
    console.log("Error :", error);
    return error;
  }
}
