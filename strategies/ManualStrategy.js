(function (window, undefined) {
	
	'use strict';
	
			 
	var ManualStrategy = function (options) {
        this.title = "Manual Strategy";
        this.id = "manualstrategy";

        this.updateprice = true;
        this.confirmpossible = true;
        this.price = 0;
        this.amount = 0.1;
        this.enabled = false;
        this.portfolio = {};
        this.template = 'partials/manualstrategy.html';
	};

    ManualStrategy.prototype.handle = function (candleArray, portfolio) {

        var that = this;

        //Initialize on first update
        if (!this.enabled) {
            this.portfolio = portfolio;
            this.enabled = true;
        }

        //Update price
        if (this.updateprice) {
            var instruments = MathUtil.getInstrumentArray(candleArray, 'close');
            this.price = instruments[0];
        }
        //DO NOTHING ELSE HERE
        
    };

    ManualStrategy.prototype.buy = function() {
        //buy amount @ price
        var that = this;
        var price = Number(this.price);
        var amount = Number(this.amount);
        this.portfolio.getPossiblePrice(amount, 'buy', function(ppo){
            var actualPrice = ppo.price;
            if (that.confirmpossible) {
                if (confirm("Buy at " + actualPrice + " possible!")) {
                    that.portfolio.buy({amount:amount, rate:actualPrice});
                }
            } else {
                that.portfolio.buy({amount:amount, rate:actualPrice});
            }
        });
    };

    ManualStrategy.prototype.sell = function() {
        //buy amount @ price
        var that = this;
        var price = Number(this.price);
        var amount = Number(this.amount);
        this.portfolio.getPossiblePrice(amount, 'sell', function(ppo){
            var actualPrice = ppo.price;
            if (that.confirmpossible) {
                if (confirm("Sell at " + actualPrice + " possible!")) {
                    that.portfolio.sell({amount:amount, rate:actualPrice});
                }
            } else {
                that.portfolio.sell({amount:amount, rate:actualPrice});
            }
        });
    }; 

    ManualStrategy.prototype.update = function() {
        //buy amount @ price
        var that = this;
        if (typeof this.portfolio.loadPortfolioInfo == "function") {
            that.portfolio.loadPortfolioInfo();
        } else {
            alert("Update is only supported in live trade mode.");
        }
    };    

    var strat = new ManualStrategy();

    strategyHolder.register(strat.id, strat);
	
})(window);