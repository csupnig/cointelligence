(function (window, undefined) {
	
	'use strict';
	
			 
	var MACDStrategy = function (options) {
        this.title = "MACD 12/26/9";
        this.id = "macd12269";

        this.buythreshold = 0.25;
        this.sellthreashold = 0.25;
	};

    MACDStrategy.prototype.handle = function (candleArray, portfolio) {
        var instruments = MathUtil.getInstrumentArray(candleArray, 'close');
        

        var MACD = MathUtil.MACD(instruments, 12,26,9);

        
        var diff = getDiff(MACD.macd[0], MACD.signal[0]);
        var diff1 = getDiff(MACD.macd[1], MACD.signal[1]);

        

        var isCross = false;
        var buy = false;
        if (diff < 0 && diff1 > 0) {
            isCross = true;
        } else if (diff > 0 && diff1 < 0) {
            isCross = true;
        }

        if (isCross) {

            console.log( 'B', diff > this.buythreshold, 'S', diff < -this.sellthreashold, 'B', MACD.macd[0] > MACD.signal[0], isCross);
            if (MACD.macd[0] > MACD.signal[0]) {
                portfolio.buy();
            } else {
                portfolio.sell();
            }
        }

        /*if (isCross && diff > this.buythreshold) {
            portfolio.buy();
        } else if (isCross && diff < -this.sellthreashold) {
            portfolio.sell();
        }*/


    };

    function getDiff(s, l) {
        return 100 * (s - l) / ((s + l) / 2);
    }

    var strat = new MACDStrategy();

    strategyHolder.register(strat.id, strat);
	
})(window);