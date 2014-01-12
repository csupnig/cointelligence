(function (window, undefined) {
	
	'use strict';

    var Ichimoku = function(tenkan_n, kijun_n, senkou_a_n, senkou_b_n, chikou_n) {
        this.price = 0.0;
        this.tenkan = 0.0;
        this.kijun = 0.0;
        this.senkou_a = [];
        this.senkou_b = [];
        this.chikou = [];
    };

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
        this.price = ins.close[ins.close.length - 1];
        this.tenkan = this.hla(ins, this.tenkan_n);
        this.kijun = this.hla(ins, this.kijun_n);
        this.senkou_a.push((this.tenkan + this.kijun) / 2);
        this.splice(this.senkou_a, this.senkou_a_n);
        this.senkou_b.push(this.hla(ins, this.senkou_b_n * 2));
        this.splice(this.senkou_b, this.senkou_b_n);
        this.chikou.push(ins.close[ins.close.length - 1]);
        this.splice(this.chikou, this.chikou_n);        
    };

    //calc average of price extremes (high-low avg) over specified period
    Ichimoku.prototype.hla = function(ins, n) {
        var hh, ll;
        hh = MathUtil.arrayMax(ins.high.slice(-n));
        ll = MathUtil.arrayMax(ins.low.slice(-n));
        return (hh + ll) / 2; 
    };

    //restrict array length to specified max
    Ichimoku.prototype.splice = function(arr, l) {
        var _results;
        _results = [];
        while (arr.length > l) {
          _results.push(arr.splice(0, 1));
        }
        return _results;    
    };

    var HeikinAshi = function() {
        this.ins = {
            open    : [],
            close   : [],
            high    : [],
            low     : []
        };
    };

    HeikinAshi.prototype.put = function(ins) {

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