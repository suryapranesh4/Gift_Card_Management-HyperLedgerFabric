import React, { useEffect, useState } from "react";
import "./index.css";

import tranferGiftCard from "../api/tranferGiftCard";
import getAllCards from "../api/getAllCards";
import Loader from "./Loader";

import Card from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

export default function Transfer() {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [owner, setOwner] = useState("");

  useEffect(() => {
    setLoading(true);
    async function getData() {
      const data = await getAllCards();
      setCards(data);
    }
    getData();

    //Adding 2 second timeout to show loader :)
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const transfer = async () => {
    await tranferGiftCard(cards[0]?.id,owner);
  };

  return (
    <div className="transactions">
      <div className="transactionHistory">
        {loading ? (
          <Loader />
        ) : (
          <div className="transferCard">
            {cards && cards.length > 0 ? (
              <React.Fragment>
                <Card
                  number={"4096 3456 1159 0523"}
                  name={cards[0].owner}
                  issuer={"Walmart"}
                />
                <div className="transferData">
                  <div className="inputs">
                    <strong>New owner </strong>
                    <div>
                      <input
                        name="owner"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="submit">
                  <button
                    className="submitTransfer"
                    onClick={() => transfer()}
                  >
                    Submit
                  </button>
                </div>
              </React.Fragment>
            ) : (
              <div className="noCards">No Cards distributed</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
