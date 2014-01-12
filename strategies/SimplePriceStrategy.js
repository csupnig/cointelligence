(function (window, undefined) {
	
	'use strict';
	
	  
		 
	var SimpleStrategy = function (options) {
        this.title = "Simple Price Stragety";
        this.id = "simpleprice";
	};

    SimpleStrategy.prototype.handle = function (candleArray, portfolio) {
        var instruments = MathUtil.getInstrumentArray(candleArray, 'close');
        if (instruments.length > 1) {
        	var now = instruments[0];
        	var oneago = instruments[1];
        	if (now > oneago) {
        		portfolio.buy();
        	} else if (now < oneago) {
        		portfolio.sell();
        	}
        }
    };

    var strat = new SimpleStrategy();

    strategyHolder.register(strat.id, strat);

})(window);