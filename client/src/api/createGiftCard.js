import { baseURL } from "../utils/const";

export default async function createGiftCard(issuer,owner,balance) {
  try {
    await fetch(`${baseURL}/giftcards/create`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        issuer,
        owner,
        balance,
      }),
    })
      .then((response) => response.json())
    return true;
  } catch (error) {
    console.log("Error :", error);
    return error;
  }
}
