function odpri(o) {
    window.location.href = o+'.html';
}

var pesmi;
var map;
function shrani(songs, mapa){
    console.log("poklicana");
    pesmi=songs; // shrani vse pesmi v array
    map=mapa; // shrani ime mape
    console.log(pesmi);
    console.log(map);
}


//TO-DO nareji predvajalnik pesmi

var audioElement = new Audio();

var st = 0;
var max;

var ostanek;

function igraj() {
    max = pesmi.length; // Dodelitev dolžine pesmi ob začetku predvajanja
    var pot ="pesmi/"+map+"/"+pesmi[st]+".mp3"; // Uporabite relativno pot za premikanje v sosednjo mapo
    console.log(pot);
    audioElement.src = pot;
    console.log(audioElement.src);

    if (ostanek && parseFloat(ostanek) !== 0) {
        audioElement.currentTime = parseFloat(ostanek);
    }

    audioElement.play();
    nastavitev(audioElement.duration);
}

audioElement.addEventListener('ended', function() {
    naslednja();
});


function naslednja() {
    st++;
    if (st >= max) {
        st = 0;
    }
    tim=0;
    ostanek=0;
    clearInterval(interval);
    igraj();
}

function stop() {
    audioElement.pause();
    ostanek=audioElement.currentTime.toString();
    clearInterval(interval);
}
var zas = false;
function odl(){
    if(zas){
        stop();
        zas=!zas;
    }else{
        igraj();
        zas=!zas;
        console.log("igra");
    }
}

function back() {
    tim=0;
    ostanek=0;
    st--;
    if (st < 0) {
        st = max - 1;
    }
    clearInterval(interval);
    igraj();
}

var tim=0;

function nastavitev(cajt) {
    var pika = document.getElementById("pika");
    pika.setAttribute("max", cajt);
    
    interval=setInterval(function(){
        pika.setAttribute("value",tim);
        tim++;
    },1000);
    
}