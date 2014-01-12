(function (window, undefined) {
	
	'use strict';
	
	   
		 
	var EMAStrategy = function (options) {
        this.title = "EMA 10/21";
        this.id = "ema10/21";

        this.buythreshold = 0.25;
        this.sellthreashold = 0.25;
	};

    EMAStrategy.prototype.handle = function (candleArray, portfolio) {
        var instruments = MathUtil.getInstrumentArray(candleArray, 'close');
        var EMA10 = MathUtil.EMA(instruments, 10);
        var EMA21 = MathUtil.EMA(instruments, 21);

        var l = EMA21[0];
        var s = EMA10[0];

        var diff = 100 * (s - l) / ((s + l) / 2);

        if (diff > this.buythreshold) {
            portfolio.buy();
        } else if (diff < -this.sellthreashold) {
            portfolio.sell();
        }

    };

    var strat = new EMAStrategy();

    strategyHolder.register(strat.id, strat);
	
})(window);