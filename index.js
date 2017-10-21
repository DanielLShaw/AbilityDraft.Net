var express = require("express");
var request = require("request");
var exphbs = require('express-handlebars');
var path = require("path");
var app = express();

var hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

var publicPath = path.join(__dirname, 'views');
app.use('/', express.static(publicPath));

app.set('port', (process.env.PORT || 5000));

var apiKey = "758D99DAA60FFCA9D8BF39EF6AD51D41";

app.get('/test', function (req, res, next) {
  var context = {};
  var url = 'https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v0001/?key=' + apiKey;
  request(url, function (err, response, body) {
    if (!err && response.statusCode < 400) {
      var heroes = [];
      var parsedResponse = JSON.parse(body);
      for (var i = 0; i < parsedResponse.result.heroes.length; i++) {
        var imgNameStr = parsedResponse.result.heroes[i].name.replace('npc_dota_hero_', '');
        var name = imgNameStr.replace("_", " ").capitalize();
        var hero = {
          name: name,
          image: 'http://cdn.dota2.com/apps/dota2/images/heroes/' + imgNameStr + '_sb.png'
        }
        heroes.push(hero);
      }

      context.heroes = heroes.sort(alphaSort);

      res.render('test', context);
    } else {
      if (response) {
        console.log(response.statusCode);
      }
      next(err);
    }
  });
});


app.listen(app.get("port"), function () {
  console.log('AbilityDraft.net is listening on port' + app.get("port"));
})


String.prototype.capitalize = function () {
  return this.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
};

function alphaSort(a, b) {
  if (a.name > b.name) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }
  return 0
}