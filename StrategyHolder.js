(function (window, undefined) {
	
	'use strict';
	
	    
    var strategies = {};

    var strategyKeys = [];
		 
	var StrategyHolder = function (options) {
	};

    StrategyHolder.prototype.register = function (name, instance) {
        if (!strategies[name]) {
        	strategies[name] = instance;
            strategyKeys.push(name);
        } else {
            strategies[name] = instance;
        }
    };

	StrategyHolder.prototype.getRegisteredStrategies = function () {
        var strats = [];
        for (var i=0; i<strategyKeys.length; i++) {
        	strats.push(strategies[strategyKeys[i]]);
        }
        return strats;
    };

    StrategyHolder.prototype.getStrategy = function (name) {
        return strategies[name];
    };

	window.strategyHolder = new StrategyHolder();
	
})(window);