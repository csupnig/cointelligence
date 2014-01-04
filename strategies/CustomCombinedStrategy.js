(function (window, undefined) {
	
	'use strict';

    var Ichimoku = function(tenkan_n, kijun_n, senkou_a_n, senkou_b_n, chikou_n) {
        this.price = 0.0;
        this.tenkan = 0.0;
        this.kijun = 0.0;
        this.senkou_a = [];
        this.senkou_b = [];
        this.chikou = [];
    }

    Ichimoku.prototype.current = function() {
        var obj ={
            price : this.price,
            tenkan: this.tenkan,
            kijun : this.kijun,
            senkou_a : this.senkou_a[0];
            senkou_b : this.senkou_b[0];
            chikou : this.chikou[this.chikou.length - 1],
            chikou_span : this.chikou[this.chikou.length - 1] - this.chikou[0];
        };
        return obj;
    };

    Ichimoku.prototype.put = function(ins) {

    };

    //calc average of price extremes (high-low avg) over specified period
    Ichimoku.prototype.hla = function(ins, n) {
        var hh, ll;
        hh = MathUtil.arrayMax(ins.high.slice(-n));
        ll = MathUtil.arrayMax(ins.low.slice(-n));
        return (hh + ll) / 2; 
    };

	var CustomStrategy = function (options) {
        this.title = "Custom combined strategy";
        this.id = "customcombinedstrategy";
	};
    
    CustomStrategy.prototype.handle = function (candleArray, portfolio) {
        var that = this;

    };

    var strat = new CustomStrategy();

    strategyHolder.register(strat.id, strat);
	
})(window);