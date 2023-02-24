import React, { useEffect, useState } from "react";
import "./index.css";
import Card from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

import createGiftCard from "../api/createGiftCard";
import Loader from "./Loader";

export default function Create() {
  const [loading, setLoading] = useState(false);
  const number = "";
  const [owner, setOwner] = useState("");
  const [issuer, setIssuer] = useState("");
  const [balance, setBalance] = useState();

  useEffect(() => {
    setLoading(true);
    //Adding 2 second timeout to show loader :)
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const createCard = async() => {
    await createGiftCard(issuer,owner,balance);
    setIssuer('');
    setOwner('');
    setBalance('');
  }

  return (
    <div className="transactions">
      <div className="transactionHistory">
        {loading ? (
          <Loader />
        ) : (
          <React.Fragment>
            <Card number={number} name={owner}/>
            <div className="transferData">
              <div className="inputs">
                <strong>Issuer </strong>
                <div>
                  <input
                    name="issuer"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                  />
                </div>
              </div>
              <div className="inputs">
                <strong>Name on Card </strong>
                <div>
                  <input
                    name="name"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                  />
                </div>
              </div>
              <div className="inputs">
                <strong>Balance </strong>
                <div>
                  <input
                    type="number"
                    name="balance"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="submit">
              <button className="submitTransfer" onClick={() => createCard()}>
                Submit
              </button>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
