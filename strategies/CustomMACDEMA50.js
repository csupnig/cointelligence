(function (window, undefined) {
	
	'use strict';
	
	var $ = window.jQuery;
    
		 
	var CustomStrategy = function (options) {
        this.title = "Custom MACD / EMA 50% FIAT";
        this.id = "custommacdema50";

        this.buythreshold = 0.25;
        this.sellthreashold = 0.25;
        this.mintrade = 0.1;
	};

    CustomStrategy.prototype.handle = function (candleArray, portfolio) {
        var instruments = MathUtil.getInstrumentArray(candleArray, 'close');
        

        var MACD = MathUtil.MACD(instruments, 12,26,9);

        
        var hist0 = MACD.histogram[0];
        var hist1 = MACD.histogram[1];

        

        var isCross = false;
        var buy = false;

        if (hist0 < 0 && hist1 > 0) {
            isCross = true;
        } else if (hist0 > 0 && hist1 < 0) {
            isCross = true;
        }

        if (isCross) {
            if (hist0 > 0) {

                var x = (portfolio.total / 2);
                var tospend = portfolio.fiat - x;

                if (tospend > 0) {
                    var amount = tospend / instruments[0];
                    if (amount > this.mintrade) {
                        portfolio.getPossiblePrice(amount, 'buy', function(ppo){
                            var actualPrice = ppo.price;
                            console.log('buying', amount, actualPrice, ppo);
                            portfolio.buy({amount:amount, rate:actualPrice});
                        });
                    }
                }
            } else {
                var toSell = portfolio.asset;
                if (toSell > this.mintrade) {
                    portfolio.getPossiblePrice(toSell, 'sell', function(ppo){
                        var actualPrice = ppo.price;
                        console.log('selling', toSell, actualPrice, ppo);
                        portfolio.sell({amount:toSell, rate:actualPrice});
                    });
                }
            }
        }


    };

    var strat = new CustomStrategy();

    strategyHolder.register(strat.id, strat);
	
})(window);