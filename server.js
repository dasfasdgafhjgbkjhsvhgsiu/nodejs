const fs = require("fs");
const path = require("path");

function novipl(imeNoveMape, callback) {
  // Pot do mape "playlist"
  const potDoMape = path.join(__dirname,"public", "pesmi", imeNoveMape);

  // Ustvarjanje mape
  fs.mkdir(potDoMape, { recursive: true }, (err) => {
    if (err) {
      callback("Napaka pri ustvarjanju mape: " + err);
      return;
    }
    callback(1,"Mapa uspešno ustvarjena!");
  });
}

module.exports = novipl;
