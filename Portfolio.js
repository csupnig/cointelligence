(function (window, undefined) {
	
	'use strict';
	
	
		 
    var Portfolio = function (scope) {
        this.scope = scope;
        this.fiat = Number(scope.balancefiat);
        this.asset = Number(scope.balanceasset);
        this.tradefee = Number(scope.activeMarket.fee);
        this.total = 0;
    };

    Portfolio.prototype.setCurrentCandle = function(candle) {
        this.currentCandle = candle;
        this.updateTotal();
    };

    Portfolio.prototype.getCurrentCandle = function() {
        return this.currentCandle;
    };

    Portfolio.prototype.updateTotal = function() {
        var price = this.currentCandle.close;
        this.total = (this.fiat + (price * this.asset));
    };

    Portfolio.prototype.log = function(message, cssclass, date) {
        if (!date) {
            date = new Date();
        }
        this.scope.log.unshift({'message':message, 'cssclass':cssclass, 'date':date});
    };

    Portfolio.prototype.buy = function(obj) {
        if (!obj) {
            obj = {};
        }
        var a = obj.amount;
        var callback = obj.callback;
        var price = this.currentCandle.close;
        var possible = (100 * this.fiat) / ((100 + this.tradefee) * price);
        
        if (possible < 0) {
            possible = 0;
            return;
        }

        var amount = a ? a : possible;
        if (amount > possible) {
            amount = possible;
        }

        if (amount <= 0) {
            return;
        }

        var totalprice = (amount * price) + (amount * price * this.tradefee / 100);
        this.fiat -= totalprice;
        this.asset += amount;
        this.currentCandle.bs={op:"B", val:price};
        this.updateTotal();
        this.log("Buy " + amount + " at " + price+ " " + this.scope.activeMarket.fiat + ":"+this.fiat + ", "+this.scope.activeMarket.asset+":" + this.asset, 'buy');
        if (typeof(callback) == "function") {
            callback();
        }
    };

    Portfolio.prototype.sell = function(obj) {
        if (!obj) {
            obj = {};
        }
        var a = obj.amount;
        var callback = obj.callback;
        var price = this.currentCandle.close;
        var amount = a ? a : this.asset;
        if (amount > this.asset) {
            amount = this.asset;
        }
        if (amount <= 0) {
            return;
        }
        var revenue = amount * price - (amount * price * this.tradefee / 100);
        this.fiat += revenue;
        this.asset -= amount;
        this.currentCandle.bs = {op:"S", val:price};
        this.updateTotal();
        this.log("Sell " + amount + " at " + price + " "+this.scope.activeMarket.fiat+":"+this.fiat + ", "+this.scope.activeMarket.asset+":" + this.asset, 'sell');
        if (typeof(callback) == "function") {
            callback();
        }
    };

    Portfolio.prototype.getPossiblePrice = function(amount, bs, callback) {
        if (typeof(callback) == "function") {
            callback({'price':this.currentCandle.close, 'amountFilled':amount});
        }
    };

    Portfolio.prototype.logPortfolio = function() {
        var price = this.currentCandle.close;
        this.log("There are " + this.asset + " (" + (price * this.asset) + ") "+this.scope.activeMarket.asset+" and " + this.fiat + " "+this.scope.activeMarket.fiat+" in your portfolio. Total balance " + (this.fiat + (price * this.asset)) + ".", 'info');
    };

	window.Portfolio = Portfolio;
	
})(window);