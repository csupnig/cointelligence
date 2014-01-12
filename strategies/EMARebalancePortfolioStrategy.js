(function (window, undefined) {
	
	'use strict';
	
			 
	var RebalanceStrategy = function (options) {
        this.title = "EMA Rebalance portfolio";
        this.id = "emarebalanceportfolio";

        this.distance = 0.5;
        this.mintrade = 0.1;
        this.emaparam = 10;
        this.trade = true;
        this.dontsellbelow = 10;
        this.currentdistance = 0;
        this.currentmustbuy = 0;
        this.currentprice = 0;
        this.currentemavalue = 0;
        this.template = 'partials/emarebalanceportfolio.html';
	};

    RebalanceStrategy.prototype.handle = function (candleArray, portfolio) {

        var that = this;

        //Fetch and convert parameters
        var distance = Number(this.distance);
        var mintrade = Number(this.mintrade);
        var emaparam = Number(this.emaparam);
        var dontsellbelow = Number(this.dontsellbelow);

        var instruments = MathUtil.getInstrumentArray(candleArray, 'close');
        var EMA10 = MathUtil.EMA(instruments, emaparam);
        var fiat_have = portfolio.fiat;
        var asset_have = portfolio.asset;

        var price = instruments[0];

        var diffObject = getDiff(price, asset_have, fiat_have);
        var perc_diff = diffObject.perc_diff;
        var must_buy = diffObject.must_buy;

        //Update display
        this.currentmustbuy = must_buy;
        this.currentdistance = perc_diff;
        this.currentprice = price;
        this.currentemavalue = EMA10[0];

        if (this.trade && perc_diff > distance) {
            if (must_buy > mintrade && price < EMA10[0]) {
                portfolio.getPossiblePrice(must_buy, 'buy', function(ppo){
                    //check if ppo is still within buy limits
                    var actualPrice = ppo.price;
                    var diffObject = getDiff(actualPrice, asset_have, fiat_have);
                    var perc_diff = diffObject.perc_diff;
                    var must_buy = diffObject.must_buy;
                     if (perc_diff > distance) {
                        if (must_buy > mintrade && actualPrice < EMA10[0]) {
                            console.log('buying', must_buy, actualPrice, ppo);
                            portfolio.buy({amount:must_buy, rate:actualPrice});
                        }
                    }
                });
            } else  if (price > dontsellbelow && must_buy < -mintrade && price > EMA10[0]) {
                portfolio.getPossiblePrice(must_buy, 'sell', function(ppo){
                    //check if ppo is still within sell limits
                    var actualPrice = ppo.price;
                    var diffObject = getDiff(actualPrice, asset_have, fiat_have);
                    var perc_diff = diffObject.perc_diff;
                    var must_buy = diffObject.must_buy;
                    if (perc_diff > distance && must_buy < -mintrade) {
                        console.log('selling', must_buy, actualPrice, ppo);
                        portfolio.sell({amount:Math.abs(must_buy), rate:actualPrice});
                    }
                });
            }
        }
    };

    function getDiff(price, asset_have, fiat_have) {
        var asset_value = asset_have * price;
        var diff = fiat_have - asset_value;
        var diff_asset = diff / price;

        var must_buy = diff_asset / 2;
        var perc_diff = diff_asset / asset_have * 100;
        return {'perc_diff':Math.abs(perc_diff), 'must_buy':must_buy};
    }

    var strat = new RebalanceStrategy();

    strategyHolder.register(strat.id, strat);
	
})(window);