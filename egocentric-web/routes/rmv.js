var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');


/**
 * Return next RMV departures of specified station.
 * All of these settings had to be reverse engineered,
 * because RMV has no open api.
 * Use at your own risk, may break.
 */

router.post('/', function(req, res) {
  const settings = JSON.parse(req.body.settings);
  const date = new Date(settings.timestring);
  const formattedDate = date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear();
  const time = date.getHours()+':'+date.getMinutes();

  var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
  };

  var keys = {
      sqQueryPageDisplayed: 'yes',
      maxJourneys: settings.limit,
      input: 'youfoundaneasteregg',
      REQ0JourneyStopsSID: 'A=1@L='+settings.rmvStationId+'@B=1',
      Dummydate: '1337-23-42',
      date: formattedDate,
      time: time,
      boardType: 'dep',
      dirInput: '',
      REQ0JourneyStopsZID:'', 
      start: 'yes',
      preview: '240',
      viewMode: 'COMPACT'
  };

  var options = {
      url: 'http://www.rmv.de/auskunft/bin/jp/stboard.exe/3deun?ld=14.52&L=vs_html5&isInternalCall=yes&',
      method: 'POST',
      headers: headers,
      form: keys
  };


  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          var $ = cheerio.load(body);

          var connections = [];

          $('.journeyData').each(function(i, element){
              const depTime   = $(this).find('.time').find('.topSpan').text();
              const trainType = $(this).find('.dir').find('.train').text();
              const direction = $(this).find('.dir').find('.station').text();

              connections.push({
                "depTime":      depTime,
                "trainType":    trainType,
                "direction":    direction
              });
          });

        res.send(JSON.stringify(connections));
      }
  }

  request(options, callback);


});

module.exports = router;
