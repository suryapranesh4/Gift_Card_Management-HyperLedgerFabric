import React, { useEffect, useState } from "react";
import "./index.css";

import getAllCards from "../api/getAllCards";
import Loader from "./Loader";

import Card from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

export default function Transactions() {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);

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

  return (
    <div className="transactions">
      <div className="transactionHistory">
        {loading ? (
          <Loader />
        ) : (
          <React.Fragment>
            {cards && cards.length > 0 ? (
              <div className="allCards">
                {cards.map((card, i) => {
                  let { id, owner, balance, issuer } = card;
                  return (
                    <div className="eachCard">
                      <Card number={id} name={owner} issuer={"Walmart"}/>
                      <div className="balance">
                        <strong className="balanceLabel">Balance</strong>
                        <strong>${balance}</strong>
                      </div>
                      <div className="balance">
                        <strong className="balanceLabel">Issuer</strong>
                        <strong>{issuer}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="noCards">No Cards distributed</div>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
