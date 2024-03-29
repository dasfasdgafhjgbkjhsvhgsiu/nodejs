const express = require("express");
const fetch = require("node-fetch");
const cors = require('cors'); 
const novipl = require('./server');

require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { error } = require("console");

 app = express();

// server port number
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "views")));

// Po potrebi dodajte dodatne usmerjevalnike

// Zahtevajte datoteko "index.html" za osnovno pot
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// potrebuje parse html data
app.use(cors()); // Dodali
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//playlisti
// app.js

// Dodajte novo pot, ki bo služila za pridobitev seznama pesmi v izbranem playlistu
app.get("/pesmi/:playlist", (req, res) => {
    const playlist = req.params.playlist; // Pridobite ime playlista iz URL-ja

    // Pot do mape s pesmimi za izbrani playlist
    const playlistPath = path.join(__dirname, "views", "pesmi", playlist); // Spremenjena pot

    // Preberi vse datoteke v mapi playlista
    fs.readdir(playlistPath, (err, files) => {
        if (err) {
            console.error("Napaka pri branju pesmi:", err);
            res.status(500).send("Napaka pri branju pesmi v playlistu.");
            return;
        }

        // Izberi samo ime pesmi (brez končnice)
        const pesmi = files.map(file => path.parse(file).name);

        // Pošlji seznam pesmi kot odgovor na zahtevo
        res.json(pesmi);

        fs.writeFile(path.join(__dirname, "views", "imena.txt"), "", err => {
            if (err) {
                console.error("Napaka pri brisanju vsebine datoteke imena.txt:", err);
            } else {
                console.log("Vsebina datoteke imena.txt uspešno izbrisana.");
            }
        });

        fs.writeFile(path.join(__dirname, "views", "imena.txt"), pesmi.join("\n"), err => {
            if (err) {
                console.error("Napaka pri shranjevanju imen pesmi:", err);
            } else {
                console.log("Imena pesmi uspešno shranjena v imena.txt.");
            }
        });
    });
});



app.post("/novipl", (req, res) =>{
    const imeNoveMape=req.body.imeNoveMape;

    novipl(imeNoveMape, (err, sporocilo) =>{
        console.log(err);
        console.log(sporocilo);
        if (err) {
            res.status(500).send("Napaka: " + err);
          } else {
            res.status(200).send(sporocilo);
          }
    });


});



    app.get("/vse-mape", (req, res) => {
        const pesmiPot = path.join(__dirname, "views", "pesmi"); // Spremenjena pot
    
        // Preberi vse imenike v mapi /pesmi
        fs.readdir(pesmiPot, (err, datoteke) => {
            if (err) {
                console.error("Napaka pri branju map:", err);
                res.status(500).send("Napaka pri branju map.");
                return;
            }
    
            // Izberi samo imenike
            const imenike = datoteke.filter(datoteka => fs.statSync(path.join(pesmiPot, datoteka)).isDirectory());
    
            // Pošlji imena vseh map kot odgovor na zahtevo
            res.json(imenike);
        });
    });

    app.post("/submit", async (req, res) => {
        console.log("dobil sem id videja");
        
        const buttonName = req.body.buttonName;
        const imemape=req.body.imemape;
    console.log(`Prejeto ime gumba: ${buttonName}`);
    if (typeof buttonName === 'string') {
        console.log(`Ime gumba: ${buttonName}`);
        console.log(imemape);
    } else {
        console.log('Napačen format imena gumba.');
    }
    res.redirect('search.html');
        
    //TO DO nareji da dobi ime mape kamor bo shrano video in ustvarjanje mape

        var id = buttonName; // No need for a loop if you already have the value from the form
        console.log(id);
        if(id.length!=11){
            console.log("dolžina id je: "+id.length);
        }else{
            console.log(id.length);
        }
    
        // Nadaljujte s kodo glede na potrebe vaše aplikacije
    
        const videoID = id;
    if (videoID === undefined || videoID === "" || videoID === null) {
        return res.render("index", { success: false, message: "Please enter a video ID" });
    } else {

        
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": process.env.API_HOST
            }
        });

        const fetchResponse = await fetchAPI.json();
        console.log(fetchResponse);

        if (fetchResponse.status === "ok") {
            // Prenos in shranjevanje videa v strežniško mapo
            const videoResponse = await fetch(fetchResponse.link);
            const fileName = `${fetchResponse.title.replace(/[^\w\s]/gi, '')}.mp3`; // Odstranitev vseh znakov, ki niso črke, številke, podčrtaji ali presledki
            const filePath = path.join(__dirname, "views", "pesmi", imemape, fileName); // Spremenjena pot za shranjevanje datoteke
        
            const fileStream = fs.createWriteStream(filePath);
            videoResponse.body.pipe(fileStream);
        
            fileStream.on("finish", () => {
                console.log(`Video ${fileName} je bil uspešno prenesen in shranjen.`);
                //res.redirect("search.html");
                //return false; // Prepreči nadaljnje izvajanje kode
            });
            
        } else {
            res.send("Napaka: " + fetchResponse.msg);
            return; // Prepreči nadaljnje izvajanje kode
        }
    }
});

app.listen(PORT, () => {
    console.log(`Zagnan server na portu ${PORT}`);
});
