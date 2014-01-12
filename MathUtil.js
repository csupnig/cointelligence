(function (window, undefined) {
	
	'use strict';
	
	var $ = window.jQuery;
    
		 
	var MathUtil = function () {
	};

    MathUtil.prototype.arrayMax = function (array) {
        return Math.max.apply(Math, array.filter(function(n) { return !isNaN(n); }));
    };

    MathUtil.prototype.arrayMin = function (array) {
        return Math.min.apply(Math, array.filter(function(n) { return !isNaN(n); }));
    };

    MathUtil.prototype.getInstrumentArray = function (candleArray, instrument) {
    	var arr = [];
    	for (var i = 0; i < candleArray.length; i++) {
    		arr.push(candleArray[i][instrument]);
    	}
    	return arr;
    };

    MathUtil.prototype.EMA = function(originalArray, emaLength) {
        var array = originalArray.slice().reverse();
        // trim initial NaN values
        var iPos = 0;
        for (iPos = 0; iPos < array.length && isNaN(array[iPos]); iPos++) {}
        array = array.slice(iPos); // trim initial NaN values from array
        var ema = new Array();
        var k = 2 / (emaLength + 1);
        for (var i = 0; i < emaLength - 1; i++) {
            ema[i] = NaN;
        }
        ema[emaLength - 1] = array.slice(0, emaLength).reduce(function(a, b) {
            return a + b
        }) / emaLength;
        for (var i = emaLength; i < array.length; i++) {
            ema[i] = array[i] * k + ema[i - 1] * (1 - k);
        }
        ema.reverse(); // reverse back for main consumption
        for (var i = 0; i < iPos; i++) {
            ema.push(NaN);
        }
        return ema;
    };

    MathUtil.prototype.MACD = function(array, i12, i26, i9) {

        var ema12 = this.EMA(array, i12);
        var ema26 = this.EMA(array, i26);
        var macd = [];
        for (var i = 0; i < ema12.length; i++) {
            macd.push(ema12[i] - ema26[i]);
        }
        var signal = this.EMA(macd, i9);
        var histogram = [];
        for (var i = 0; i < macd.length; i++) {
            histogram.push(macd[i] - signal[i]);
        }
        return {
            macd: macd,
            signal: signal,
            histogram: histogram
        };
    };
	
	window.MathUtil = new MathUtil();
	
})(window);