(function (window, undefined) {
	
	'use strict';
	
	  
		 
	var SimpleStrategy = function (options) {
        this.title = "Debug and logging strategy";
        this.id = "loggingstrategy";
	};

    var first = true;

    SimpleStrategy.prototype.handle = function (candleArray, portfolio) {
        if (first) {
            console.log(portfolio);
            first = false;
        }

    };

    var strat = new SimpleStrategy();

    strategyHolder.register(strat.id, strat);

})(window);