
/*
 * Fill in your Plotly user credentials: Your username, api_key, and stream_tokens
 * or you can use the provided demo account's credentials.
 * Find your API key and generate stream tokens in your settings: https://plot.ly/settings
 * More info in the Plotly-Node.js docs here: https://github.com/plotly/plotly-nodejs
*/
var plotly_username = 'krishnaprasanth';
var plotly_api_key = 'jvwmrn6d51';
var plotly_stream_tokens = ['7vphb2mqz5', 'n9plz4zszs'];
var plotly = require('plotly')(krishnaprasanth,jvwmrn6d51);


/*
 * Describe and embed stream tokens into a plotly graph
*/

var data = [
  {name: "Pin A0", x:[], y:[], stream:{token: plotly_stream_tokens[0], maxpoints:500}}
];
var layout = {fileopt : "overwrite", filename : "arduino-johnny5-demo"};


/*
 * Initialize Johnny-Five,
 * the communication layer between the Arduino and this node program.
*/

var five = require("johnny-five");
var board = new five.Board();


board.on("ready", function() {


  /*
   * Initialize sensors
  */

  var sensors = {
    "A0": new five.Sensor({
            pin: "A0",
            freq: 50 // send reading every 50ms
          })
    
  };


  /*
   * Initialize a plotly graph
  */

  plotly.plot(data,layout,function (err, res) {

    if (err) console.log(err);
    console.log("View your streaming graph here: ", res.url);


    /*
     * Once the graph is initialized, initialize plotly streams
    */ 

    var plotly_streams = {
      "A0": plotly.stream(plotly_stream_tokens[0], function (err, res) {
              if (err) console.log(err);
              console.log(res);
            })
    };


    /*
     * As each sensor receives data, write 
     * it to the plotly_stream. The plotly_stream
     * will pipe it through plotly's servers and
     * your graph will update with the sensor values
     * in real-time.
    */


    sensors.A0.on("data", function(){
      data = {
        x: getDateString(),
        y: this.value
      };
      plotly_streams.A0.write(JSON.stringify(data)+"\n");
    });

    
  });
});

// helper function to get a nicely formatted date string
function getDateString () {
  var time = new Date();
  // 14400000 is (GMT-4 Montreal)
  // for your timezone just multiply +/-GMT by 3600000
  var datestr = new Date(time - 14400000).toISOString().replace(/T/, ' ').replace(/Z/, '');
  return datestr;
}
