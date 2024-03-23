import CoinService from "./coin.js";

class IAPService {
    static async processProductPurchase(productId, userId) {
        try {
            userId = parseInt(userId);
            console.log(productId, " . " + userId);
            const match = productId.match(/^(\d+)_coins$/);
            if (match) {
                const amount = parseInt(match[1], 10); 
                await CoinService.addCoins(userId, amount);
            }
        } catch (err) {
            throw new Error("Error processing product purchase:" + err);
        }
    }
}

export default IAPService;
