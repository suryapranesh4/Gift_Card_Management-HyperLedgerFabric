import React from "react";
import cardIcon from "../images/card.png";

export default function Loader() {
  return (
    <div className="loader">
      <img src={cardIcon} alt="Loader" />
    </div>
  );
}
