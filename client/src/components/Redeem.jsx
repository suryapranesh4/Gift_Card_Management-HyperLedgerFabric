import React, { useEffect, useState } from "react";
import "./index.css";

import redeemGiftCard from "../api/redeemGiftCard";
import getAllCards from "../api/getAllCards";
import Loader from "./Loader";

import Card from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

export default function Redeem() {
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

  const redeem = async () => {
    await redeemGiftCard(cards[0]?.id);
  };

  return (
    <div className="transactions">
      <div className="transactionHistory">
        {loading ? <Loader /> : 
         <div className="transferCard">
         {cards && cards.length > 0 ? (
           <React.Fragment>
             <Card
               number={"4096 3456 1159 0523"}
               name={cards[0]?.owner}
               issuer={"Walmart"}
             />
             <div className="submit redeem">
               <button
                 className="submitTransfer"
                 onClick={() => redeem()}
               >
                 Redeem
               </button>
             </div>
           </React.Fragment>
         ) : (
           <div className="noCards">No Cards distributed</div>
         )}
       </div>}
      </div>
    </div>
  );
}
