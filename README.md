# miniplot.js

`miniplot.js` is a **very simple** package that produces **very simple** plots using JavaScript.
It's mostly designed for debugging numeric JavaScript.


## Example

```js
var intercept = 1,
    slope = .5;
var X = _.range(50).map( () => _.random(-10, 10, true)); // 50 Random values
var line = X.map( x => intercept + slope * x);           // True regression line
var Y = line.map( y => y + _.random(-1, 1, true) )       // Add noise


var plot = new Plot([-12, 12],  // x-axis limits
                         [-12, 12]); // y-axis limits
plot.add_points(X, Y, 'red')
plot.add_line(X, line, 'blue');
plot.render_in_element('plot-container')
```

<img style="width: 600px;" alt="" src="https://raw.githubusercontent.com/EoinTravers/miniplot.js/master/examples/imgs/eg1.svg"/>


Or, if running on node

```js
var plot = new miniplot.Plot([-12, 12],  // x-axis limits
                             [-12, 12]); // y-axis limits
plot.add_points(X, Y, 'red')
plot.add_line(X, line, 'blue');
plot.render_jupyter()
```


## Another Example

```r
function random_normal(mu=0, sigma=1) {
    // Standard Normal variate using Box-Muller transform.
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return mu + sigma*Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}
function cumsum(r, a) {
    // https://stackoverflow.com/a/20477330/1717077
    if (r.length > 0)
        a += r[r.length - 1];
    r.push(a);
    return r;
}

var n = 100,
    drift = .25,
    noise = 1;
var times = _.range(n),
    dx = times.map( t => random_normal(drift, noise) ),
    X = dx.reduce(cumsum, []),
    trend = times.map( t => t * drift),
    ylim = _.max(X.map(Math.abs));

var plot = new miniplot.Plot([0, 100],       // x-axis limits
                         [-ylim, ylim]); // y-axis limits
plot.add_line(times, trend, 'black');
plot.add_line(times, X, 'red');
plot.render_in_element('plot-container')
```

<img style="width: 600px;" alt="" src="https://raw.githubusercontent.com/EoinTravers/miniplot.js/master/examples/imgs/eg2.svg"/>
