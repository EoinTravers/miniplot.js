function Plot(xlim, ylim){
    let that = this;
    this.xmin = xlim[0];
    this.xmax = xlim[1];
    this.ymin = ylim[0];
    this.ymax = ylim[1];
    this.adjust_X = X => X.map( x => (x - that.xmin) / (that.xmax- that.xmin) );
    this.adjust_Y = Y => Y.map( y => (y - that.ymin) / (that.ymax- that.ymin) );
    this.contents = '';
    // Plot-building functions
    this._add_dot = function(xadj, yadj, fill='black', r=1){
        return `<circle cx="${xadj*100}" cy="${(1-yadj)*100}" r="${r}" fill="${fill}"/>`;
    };

    this.add_points = function(X, Y, fill='black', r=1){
        let circles = _.zipWith(that.adjust_X(X), that.adjust_Y(Y),
                                (x, y) => that._add_dot(x, y, fill, r));
        that.contents += _.sum(circles);
    };
    this.add_line = function(X, Y, stroke='black', width=1){
        let coords = _.zipWith(that.adjust_X(X), that.adjust_Y(Y),
                               (x, y) => (x*100)+','+((1-y)*100));
        that.contents += `<polyline points="${coords}" fill="none" stroke=${stroke} stroke-width="${width}"/>`;
    };

    // Output functions
    this.render_svg = function(){
        // Generate a html string
        return `<svg width="100%" height = 100% viewBox="0 0 100, 100" version="1.1" xmlns="http://www.w3.org/2000/svg">${that.contents}</svg>`;
    };

    this.render_html = function(){
        // Generate a html string
        let svg = that.render_svg();
        return `<div id="plot-div" style="width:600px; height:600px; border: solid black;">${svg}</div>`;
    };

    this.render_in_element = function(element_id, click_to_close=true){
        // Show the plot in part of the page
        let contents = that.render_html();
        document.getElementById(element_id).innerHTML = contents;
        if(click_to_close){
            document.getElementById('plot-div').onclick = function(el){this.remove();};
        }
    };
    this.render_jupyter = function(){
        // Show the plot if running on the iJavaScript kernel for jupyter
        // https://github.com/n-riesco/ijavascript
        return $$.html(that.render_html());
    };

    this.download = function(){
        // See https://stackoverflow.com/q/23218174/1717077
        // Render the image first
        let hidden_div = document.createElement('div');
        hidden_div.style.display = 'none';
        hidden_div.id = 'hidden_div';
        document.body.appendChild(hidden_div);
        that.render_in_element('hidden_div');
        //
        let serializer = new XMLSerializer();
        let svg = hidden_div.getElementsByTagName('svg')[0];
        let source = serializer.serializeToString(svg);
        //add name spaces.
        if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        let url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

        let downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "plot.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };
}

let module = {};
module.exports = {
    Plot: Plot
};
