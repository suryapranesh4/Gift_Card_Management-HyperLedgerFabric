import { baseURL } from "../utils/const";

export default async function transferGiftCard(id,newOwner) {
  let transferResponse = {};
  try {
    await fetch(`${baseURL}/giftcards/transfer`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        newOwner
      }),
    })
      .then((response) => response.json())
      .then((data) => (transferResponse = data));
    return transferResponse;
  } catch (error) {
    console.log("Error :", error);
    return error;
  }
}
