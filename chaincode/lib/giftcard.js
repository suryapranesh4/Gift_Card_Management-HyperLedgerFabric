const { Contract } = require('fabric-contract-api');
const cardGen = require('card-number-generator')

class GiftCard extends Contract {

    async initLedger(ctx) {
        // Initialize the gift card ledger
        const giftCards = [
            {
                id: cardGen({issuer: 'Visa'}),
                balance: 100,
                owner: 'Alice',
                issuer : 'Barry'
            },
            {
                id: cardGen({issuer: 'Visa'}),
                balance: 50,
                owner: 'Bob',
                issuer : 'Allen'
            }
        ];

        for (let i = 0; i < giftCards.length; i++) {
            await ctx.stub.putState(giftCards[i].id, Buffer.from(JSON.stringify(giftCards[i])));
            console.log('Added <--> ', giftCards[i]);
        }
    }

    async createGiftCard(ctx, issuer, owner, balance) {
        console.log("ctx : ",ctx);
        console.log("issuer : ",issuer);
        console.log("owner : ",owner);
        console.log("balance : ",balance);
        // Create a new gift card
        const giftCard = {
            id : cardGen({issuer: 'Visa'}),
            issuer,
            balance,
            owner
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(giftCard)));
        console.log('Gift card created: ', giftCard);
    }

    async getGiftCard(ctx, id) {
        // Get a gift card by ID
        const giftCardJSON = await ctx.stub.getState(id);

        if (!giftCardJSON || giftCardJSON.length === 0) {
            throw new Error(`Gift card ${id} does not exist.`);
        }

        const giftCard = JSON.parse(giftCardJSON.toString());
        console.log('Gift card retrieved: ', giftCard);
        return giftCard;
    }

    async getAllGiftCards(ctx) {
        // Get all gift cards in the ledger
        console.log("YESSSSSS",ctx);
        const iterator = await ctx.stub.getStateByRange('', '');

        const giftCards = [];

        while (true) {
            const result = await iterator.next();
            console.log("result:",result);

            if (result.value && result.value.value.toString()) {
                const giftCard = JSON.parse(result.value.value.toString());
                giftCards.push(giftCard);
            }

            if (result.done) {
                await iterator.close();
                console.log('All gift cards retrieved: ', giftCards);
                return giftCards;
            }
        }
    }

    async transferGiftCard(ctx, id, newOwner) {
        // Transfer a gift card to a new owner
        const giftCardJSON = await ctx.stub.getState(id);

        if (!giftCardJSON || giftCardJSON.length === 0) {
            throw new Error(`Gift card ${id} does not exist.`);
        }

        const giftCard = JSON.parse(giftCardJSON.toString());
        giftCard.owner = newOwner;

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(giftCard)));
        console.log(`Gift card ${id} transferred to ${newOwner}.`);
    }

    async redeemGiftCard(ctx, id) {
        // Redeem part of a gift card's balance
        const giftCardJSON = await ctx.stub.getState(id);

        if (!giftCardJSON || giftCardJSON.length === 0) {
            throw new Error(`Gift card ${id} does not exist.`);
        }

        const giftCard = JSON.parse(giftCardJSON.toString());
        if (giftCard.balance <= 0) {
            throw new Error(`Gift card ${id} does not have enough balance.`);
        }

        await ctx.stub.deleteState(id);
        console.log(`Gift card ${id} balance has been redeemed and gift card has been removed from the system.`);
    }

}

module.exports = GiftCard;