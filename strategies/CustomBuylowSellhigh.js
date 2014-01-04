(function (window, undefined) {
	
	'use strict';
	
	var $ = window.jQuery;


	var CustomStrategy = function (options) {
        this.title = "Custom buy low / sell high";
        this.id = "custombuylowsellhigh";

        this.minpercincrease = 0.5;
        this.mintrade = 0.2;

        this.keepfiat = 33;

        this.minactiondistance = 0.025;

        this.buys = [];
        this.lastaction = 0;

        this.template = 'partials/custombuylowsellhigh.html';
	};

    CustomStrategy.prototype.isPositive = function (entry, fee, currentprice) {
        return currentprice > entry.rate * (1 + (Number(fee) * 2 / 100));
    };

    CustomStrategy.prototype.handle = function (candleArray, portfolio) {
        var that = this;

        //Convert config vars to number in case they have been changed by user input
        var confminpercincrease = Number(that.minpercincrease);
        var confmintrade = Number(that.mintrade);
        var confkeepfiat = Number(that.keepfiat);
        var confminactiondistance = Number(that.minactiondistance);


        var percincrease = 1 + (confminpercincrease / 100);
        var instruments = MathUtil.getInstrumentArray(candleArray, 'close');
        
        //var a = that.mintrade + (that.mintrade * (portfolio.tradefee / 100));
        var fee = portfolio.tradefee / 100;
        var add = Math.round(Math.pow(10,6) * confmintrade * (fee / (1 - fee))) / Math.pow(10,6);
        var a = confmintrade + add;
        var EMA21 = MathUtil.EMA(instruments, 21);
        var EMA10 = MathUtil.EMA(instruments, 10);

        var minactiondist = confminactiondistance;
        if (EMA21[0] > EMA10[0]) {
            // if we are on the way down, we increase the minaction distance to 2 x min action distance
            minactiondist = minactiondist * 2;
        }
        
        var curPrice = instruments[0];        

        //Check if we are in a buy phase
        var buy = curPrice < EMA21[0];
        //Check if we have funds to spend
        var x = ((portfolio.total * confkeepfiat)/ 100);
        var tospend = portfolio.fiat - x;

        //debug
        //if (that.buys.length == 0 && Math.floor((portfolio.asset / that.mintrade)) > that.buys.length) {
        //    console.log("missing buy " + portfolio.asset + " > " + that.buys.length, that.buys);
        //}

        if (buy) {
            //we always spend only mintrade per tick
            if (tospend > (confmintrade * curPrice) && Math.abs(that.lastaction - curPrice) > minactiondist) {
                portfolio.getPossiblePrice(a, 'buy', function(ppo){
                    var actualPrice = ppo.price;
                    if (actualPrice < EMA21[0] && tospend > (actualPrice * a) && Math.abs(that.lastaction - actualPrice) > minactiondist) {
                        var opts = {amount:a, rate:actualPrice};
                        console.log('buying @ ' + actualPrice + ", lastaction = " + that.lastaction + ", minsellprice = " + (actualPrice * percincrease), opts);
                        that.lastaction = actualPrice;
                        portfolio.buy({amount:opts.amount, rate:opts.rate, callback:function(){
                            console.log('bought', opts);
                            portfolio.log("Will sell this portion @ price > " + (actualPrice * percincrease),"info");
                            that.buys.push(opts);
                        }});
                    }
                });
            }
        } else  {
            //check for items to delete
            var z = that.buys.length;
            while (z--) {
                if (that.buys[z].deleted) {
                    that.buys.splice(z, 1);
                }
            }

            //check if current price is higher than one of the bought items
            for (var i = 0; i < that.buys.length; i++) {
                var item = that.buys[i];
                var perc = curPrice / item.rate;
                var amount = item.amount * (1 - fee);
                if (perc > percincrease && !that.buys[i].busy && !that.buys[i].deleted) {
                    that.buys[i].busy = true;
                    portfolio.getPossiblePrice(amount, 'sell', function(ppo){
                        var actualPrice = ppo.price;
                        var actualPercInc = actualPrice / item.rate;
                        if (actualPercInc > percincrease) {
                            var opts = {amount:amount, rate:actualPrice};
                            console.log('selling ' +item.rate + " -> " + actualPrice + ". inc: " + actualPercInc, opts);
                            portfolio.sell({amount:opts.amount, rate:opts.rate, callback:function(){
                                console.log('sold', opts, that.buys);
                                //that.buys.push(opts);
                                //that.buys.splice(i, 1);
                                that.buys[i].deleted = true;
                                that.lastaction = opts.rate;
                                console.log('removed', opts, that.buys, i);
                            }, error:function(){
                                console.log('error while trying to sell');
                                that.buys[i].busy = false;
                            }});
                        } else {
                            that.buys[i].busy = false;
                        }
                    });
                    break;
                }
            }
        }

    };

    var strat = new CustomStrategy();

    strategyHolder.register(strat.id, strat);
	
})(window);