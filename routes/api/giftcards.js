const express = require("express");
const router = express.Router();
const mapper = require('../../endpoint/mapping')
const cardGen = require('card-number-generator')

router.get("/getAllCards", async (req, res) => {
  console.log("GET /getAllCards Route called");

  try {
    const result = await mapper.getAllGiftCards();
    // const result = [
    //   {id : cardGen({issuer: 'Visa'}), issuer : 'surya', owner : 'Surya', balance : 100},
    //   {id : cardGen({issuer: 'Visa'}), issuer : 'shantanu', owner : 'Shantanu', balance : 10},
    //   {id : cardGen({issuer: 'Visa'}), issuer : 'vishnu', owner : 'Vishnu', balance : 50},
    // ]
    console.log("All gift cards :",result);
    res.json(result); 
  } catch (error) {
    console.log("ERROR while retrieving all gift cards : ", error.message);
    return res.status(500).send("Server Error");
  }
});

router.post("/create", async (req, res) => {
  console.log("GET /create Route called");
  const { issuer, owner, balance } = req.body;

  console.log("Issuer :", issuer, "\n");
  console.log("Name on the card:", owner, "\n");
  console.log("Balance on the gift Card:", balance, "\n");

  try {
    const result = await mapper.createGiftCard(issuer, owner, balance);
    console.log("Create gift card :",result);
    res.json(result); 
  } catch (error) {
    console.log("ERROR while creating gift card : ", error.message);
    return res.status(500).send("Server Error");
  }
});

router.post("/transfer", async (req, res) => {
  console.log("GET /tranfer Route called");
  const { id,newOwner } = req.body;
  console.log("Gift Card id :",id, "\n");
  console.log("New Owner on the card :", newOwner, "\n");

  try {
    const result = await mapper.transferGiftCard(id,newOwner);
    console.log("Transfer gift card :",result);
    res.json(result); 
  } catch (error) {
    console.log("ERROR while tranferring gift card : ", error.message);
    return res.status(500).send("Server Error");
  }
});

router.post("/redeem", async (req, res) => {
  console.log("GET /redeem Route called");
  const { id } = req.body;
  console.log("Gift Card id :",id, "\n");

  try {
    const result = await mapper.redeemGiftCard(id);
    console.log("Redeem gift card :",result);
    res.json(result); 
  } catch (error) {
    console.log("ERROR while redeeming gift card : ", error.message);
    return res.status(500).send("Server Error");
  }
});


module.exports = router;
