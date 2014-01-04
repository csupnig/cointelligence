(function (window, undefined) {
	
	'use strict';
	
			 
	var RebalanceStrategy = function (options) {
        this.title = "EMA Rebalance portfolio";
        this.id = "emarebalanceportfolio";

        this.distance = 0.5;
        this.mintrade = 0.1;
	};

    RebalanceStrategy.prototype.handle = function (candleArray, portfolio) {

        var that = this;

        var instruments = MathUtil.getInstrumentArray(candleArray, 'close');
        var EMA10 = MathUtil.EMA(instruments, 10);
        var fiat_have = portfolio.fiat;
        var asset_have = portfolio.asset;

        var price = instruments[0];

        var diffObject = getDiff(price, asset_have, fiat_have);
        var perc_diff = diffObject.perc_diff;
        var must_buy = diffObject.must_buy;

        if (perc_diff > this.distance) {
            if (must_buy > this.mintrade && price < EMA10[0]) {
                portfolio.getPossiblePrice(must_buy, 'buy', function(ppo){
                    //check if ppo is still within buy limits
                    var actualPrice = ppo.price;
                    var diffObject = getDiff(actualPrice, asset_have, fiat_have);
                    var perc_diff = diffObject.perc_diff;
                    var must_buy = diffObject.must_buy;
                     if (perc_diff > that.distance) {
                        if (must_buy > that.mintrade && actualPrice < EMA10[0]) {
                            console.log('buying', must_buy, actualPrice, ppo);
                            portfolio.buy({amount:must_buy, rate:actualPrice});
                        }
                    }
                });
            } else  if (must_buy < -that.mintrade && price > EMA10[0]) {
                portfolio.getPossiblePrice(must_buy, 'sell', function(ppo){
                    //check if ppo is still within sell limits
                    var actualPrice = ppo.price;
                    var diffObject = getDiff(actualPrice, asset_have, fiat_have);
                    var perc_diff = diffObject.perc_diff;
                    var must_buy = diffObject.must_buy;
                    if (perc_diff > that.distance && must_buy < -that.mintrade) {
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