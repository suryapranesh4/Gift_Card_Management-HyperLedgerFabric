import React from "react";
import { Link, useLocation } from "react-router-dom";
import cardIcon from "./../images/card.png";
import transferIcon from "./../images/transfer.png";
import cardsIcon from "./../images/cards.png";
import redeemIcon from "./../images/redeem.png";
import purchaseIcon from "./../images/purchase.png";
import copyrightIcon from "./../images/copyright.png";
import "./index.css";
import { NavigationPages, getSelectedPage } from "../utils/const";

export default function Navigation() {
  const location = useLocation();
  const [selectedPage, setSelectedPage] = React.useState(
    getSelectedPage(location.pathname)
  );
  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  return (
    <div className="navbar">
      <header>
        <div className="appTitle">
          <Link to="/" onClick={() => handlePageChange(NavigationPages.HOME)}>
            <div className="titleIcon">
              <img src={cardIcon} alt="cardIcon" />
              <div className="headers">
                <div className="titleHeader">Gift Card Management</div>
              </div>
            </div>
          </Link>
          <div className="copyrightIcon">
            <img src={copyrightIcon} alt="copyright" />
          </div>
        </div>
      </header>
      <div className="routes">
        <Link
          to="/"
          className={
            selectedPage === NavigationPages.TRANSACTIONS ||
            selectedPage === NavigationPages.HOME
              ? "selectedRoute"
              : ""
          }
          onClick={() => handlePageChange(NavigationPages.TRANSACTIONS)}
        >
          <img src={cardsIcon} alt="cardsIcon" />
          <div>Card Gallery</div>
        </Link>
        <Link
          to="/create"
          className={
            selectedPage === NavigationPages.CREATE
              ? "selectedRoute"
              : ""
          }
          onClick={() => handlePageChange(NavigationPages.CREATE)}
        >
          <img src={purchaseIcon} alt="purchaseIcon" />
          <div>Purcahse Gift Card</div>
        </Link>
        <Link
          to="/transfer"
          className={
            selectedPage === NavigationPages.TRANSFER
              ? "selectedRoute"
              : ""
          }
          onClick={() => handlePageChange(NavigationPages.TRANSFER)}
        >
          <img src={transferIcon} alt="transferIcon" />
          <div>Transfer</div>
        </Link>
        <Link
          to="/redeem"
          className={
            selectedPage === NavigationPages.REDEEM
              ? "selectedRoute"
              : ""
          }
          onClick={() => handlePageChange(NavigationPages.REDEEM)}
        >
          <img src={redeemIcon} alt="redeemIcon" />
          <div>Redeem</div>
        </Link>
      </div>
    </div>
  );
}
