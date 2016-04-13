/**
 * Send a request to the server to get the next departures
 * specified by config and current time.
 */

/**
 * Values in config have to be strings.
 */
var config = {
    // you have to find this one yourself
    // Frankfurt HBF = 003000010
    // Darmstadt Landskronstraße = 003024403
    rmvStationId: '003024403',
    // it seems like the limit is not arbitrary
    // (0,1,3,5,9,10,11,... work, 
    // other numbers get rounded to the next bigger limit?)
    limit: '5',
    // default update time 2 min
    updateMillis: 120000
};

/**
 * Function to display the connections on the website
 */
function showInfo (connections) {
    var string = "";

    connections.forEach(function(e, i, array) {
        string += "<tr>";
        string += "<td>"+e.depTime+"</td><td>"+e.trainType+"</td><td>"+e.direction+"</td>";
        string += "</tr>";
    });

    document.getElementById("connections").innerHTML = string;
};

var xhr = new XMLHttpRequest();
/**
 * Show the departure information if the request was successfull
 */
xhr.onload = function() {
    showInfo(JSON.parse(xhr.responseText));
};
/**
 * Print an error message when getting the request failed
 */
xhr.onerror = function (){
    console.log("Error, please file an issue at https://github.com/studnitz/egocentric");
};
/**
 * Function encapsulating the request
 */
function requestConnections(){
    xhr.open("POST", "rmv", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("settings=" + JSON.stringify({
        rmvStationId:   config.rmvStationId,
        limit:          config.limit, 
        timestring:     new Date()
    }))
};

// request new info once in the beginning...
requestConnections();
// ... and then each updateMillis milliseconds
setInterval(function() {
    requestConnections();
}, config.updateMillis);

