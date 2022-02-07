//definisco variabili globali
let clrR2 = "#b22423";
let clrR1 = "#d61f1d";
//let clrR1 = "#db2727";

let myFontDot;
let myFontMain;

//definisco righe di insulti singoli top10
let top1;
let top2;
let top3;
let top4;
let top5;
let top6;
let top7;
let top8;
let top9;
let top0;
//definisco punteggi top10
let top1P;
let top2P;
let top3P;
let top4P;
let top5P;
let top6P;
let top7P;
let top8P;
let top9P;
let top0P;
//definisco volume top10
let top1V;
let top2V;
let top3V;
let top4V;
let top5V;
let top6V;
let top7V;
let top8V;
let top9V;
let top0V;
//aggiungo immagine sfondo classifica
let imgTop10;
//aggiungo variabili di distanziamento
let distanza_titolo = -20;
//loop insulti
let xOff = 0;

let x900 = 0;
let x800 = 0;
let x700 = 0;
let x600 = 0;
let x500 = 0;
let x400 = 0;
let x300 = 0;
let x200 = 0;
let x100 = 0;
let x0 = 0;
let theText;
let lunghezza1;
let barriera;
let barriera9;
let barriera8;
let barriera7;
let barriera6;
let barriera5;
let barriera4;
let barriera3;
let barriera2;
let barriera1;
let barriera0;

let myArrayOff = [];
let strOff;
let str_nocommaOff = [];

let myArray900 = [];
let str900;
let str_nocomma900 = [];
let myArray800 = [];
let str800;
let str_nocomma800;
let myArray700 = [];
let str700;
let str_nocomma700;
let myArray600 = [];
let str600;
let str_nocomma600;
let myArray500 = [];
let str500;
let str_nocomma500;
let myArray400 = [];
let str400;
let str_nocomma400;
let myArray300 = [];
let str300;
let str_nocomma300;
let myArray200 = [];
let str200;
let str_nocomma200;
let myArray100 = [];
let str100;
let str_nocomma100;
let myArray0 = [];
let str0;
let str_nocomma0;
let diminuzione = 26;
let volume_aumento = 1;
let mic;
let voice;
let recording; //it stores what i m saying
let data;
let insulti;
let insulti_nocensura;
let punteggio_personale = 14360;
let punteggio_oggi = 0;
let posizione = 7;
let myArray = [];
// initialize socket variable on client
const socket = io();
// ascolta il saluto del server
socket.on("greetings", (message) => {
  // stampa il messaggio in console
  console.log(message);
});

function preload() {
  //carico in preload il file json che contiene gli insulti e il loro peso
  data = loadJSON("./assets/punteggio_insulti.json");
  data_nocensura = loadJSON("./assets/punteggio_insulti_noCensura.json");
  myFontDot = loadFont("assets/dot.ttf");
  myFontMain = loadFont("assets2/font/DrukText-Medium.otf");
}

function setup() {
  let c = createCanvas(380, 330);
  c.parent("canvas"); //questo canvas che ho creato verrà mostrato dentro il div con l'id canvas specificato nel css
  //carico in voice la libreria che riconosce
  voice = new p5.Speech();
  recording = new p5.SpeechRec("it-IT"); //faccio in modo di dare la possibilità di recrodare ciò che dico

  insulti = data.insulti;
  console.log("lunghezza insulti", insulti.length);
  insulti_nocensura = data_nocensura.insulti;

  //chiamo funzione che mi ordina gli insulti con i punteggi
  //riordino_interno();
  riordino();
}

function keyPressed(R) {
  recording.onResult = showResult;
  recording.start(); // true è importante se si vuole dire allo speech recognition di continuare sempre ad ascoltare
}

function showResult() {
  //background("black");
  let result = recording.resultString;
  console.log(result);
  //console.log(insulti.lenght);
  //accedo a tutto l'array di insulti
  for (let i = 0; i < insulti.length; i++) {
    const insulto = insulti[i].insulto;
    const insulto_nocensura = insulti_nocensura[i].insulto;
    //console.log(insulto);
    const punteggio = insulti_nocensura[i].punteggio;
    //verifico se ciò che dico contiene un insulto nella lista se si aumento il punteggio
    if (result.includes(insulto)) {
      console.log("sono dentro");
      //ordino con il nuovo punteggio aggiornato
      append(myArray, insulto_nocensura);
      //mando myArray aggiornato ad arduino
      socket.emit("myArrayChange", `${myArray.join(" ")}`); // ` interpolazione
      console.log(myArray);
      punteggio_personale = punteggio_personale + punteggio;
      punteggio_oggi = punteggio_oggi + punteggio;

      insulti[i].punteggio = insulti[i].punteggio - diminuzione;
      insulti_nocensura[i].punteggio =
        insulti_nocensura[i].punteggio - diminuzione;
      insulti[i].volume = insulti[i].volume + volume_aumento;
      insulti_nocensura[i].volume =
        insulti_nocensura[i].volume + volume_aumento;
      console.log("volume", insulti_nocensura[i].volume);
      /*faccio arrivare il punteggio al minimo 0*/
      if (insulti[i].punteggio < 0) {
        insulti[i].punteggio = 0;
      }
      if (insulti_nocensura[i].punteggio < 0) {
        insulti_nocensura[i].punteggio = 0;
      }
    }
  }
  //ordino array in modo crescente
  insulti.sort(ordinaInsulti);
  insulti_nocensura.sort(ordinaInsulti);
  //creo stringhe di insulti
  riordino();
  console.log(punteggio_personale); //vedo cosa contiene data
}

function ordinaInsulti(a, b) {
  if (a.punteggio > b.punteggio) {
    // a is greater than b by some ordering criterion
    return -1;
  }
  if (a.punteggio < b.punteggio) {
    // a is less than b by the ordering criterion
    return 1;
  }
  // a must be equal to b
  return 0;
}

//fuznione che crea le stringhe ordinate di punteggi
function riordino() {
  //riazzero le stringhe
  myArray900 = [];
  myArray800 = [];
  myArray700 = [];
  myArray600 = [];
  myArray500 = [];
  myArray400 = [];
  myArray300 = [];
  myArray200 = [];
  myArray100 = [];
  myArray0 = [];

  for (let i = 0; i < insulti_nocensura.length; i++) {
    //GENERO RIGHE
    const insulto_nocensura = insulti_nocensura[i].insulto;
    //console.log(insulto);
    const punteggio = insulti_nocensura[i].punteggio;
    //creo stringhe di insulti
    if (punteggio > 900) {
      append(myArray900, insulto_nocensura);
      let punteggio_uMisura = punteggio + " HT - ";
      append(myArray900, punteggio_uMisura);
      str900 = myArray900.toString();
      str_nocomma900 = str900.replace(/,/g, "");
    } else if (punteggio > 800) {
      append(myArray800, insulto_nocensura);
      let punteggio_uMisura = punteggio + " HT - ";
      append(myArray800, punteggio_uMisura);
      str800 = myArray800.toString();
      str_nocomma800 = str800.replace(/,/g, "");
    } else if (punteggio > 700) {
      append(myArray700, insulto_nocensura);
      let punteggio_uMisura = punteggio + " HT - ";
      append(myArray700, punteggio_uMisura);
      str700 = myArray700.toString();
      str_nocomma700 = str700.replace(/,/g, "");
    } else if (punteggio > 600) {
      append(myArray600, insulto_nocensura);
      let punteggio_uMisura = punteggio + " HT - ";
      append(myArray600, punteggio_uMisura);
      str600 = myArray600.toString();
      str_nocomma600 = str600.replace(/,/g, "");
    } else if (punteggio > 500) {
      append(myArray500, insulto_nocensura);
      let punteggio_uMisura = punteggio + " HT - ";
      append(myArray500, punteggio_uMisura);
      str500 = myArray500.toString();
      str_nocomma500 = str500.replace(/,/g, "");
    } else if (punteggio > 400) {
      append(myArray400, insulto_nocensura);
      let punteggio_uMisura = punteggio + " HT - ";
      append(myArray400, punteggio_uMisura);
      str400 = myArray400.toString();
      str_nocomma400 = str400.replace(/,/g, "");
    } else if (punteggio > 300) {
      append(myArray300, insulto_nocensura);
      let punteggio_uMisura = punteggio + " HT - ";
      append(myArray300, punteggio_uMisura);
      str300 = myArray300.toString();
      str_nocomma300 = str300.replace(/,/g, "");
    } else if (punteggio > 200) {
      append(myArray200, insulto_nocensura);
      let punteggio_uMisura = punteggio + " HT - ";
      append(myArray200, punteggio_uMisura);
      str200 = myArray200.toString();
      str_nocomma200 = str200.replace(/,/g, "");
    } else if (punteggio > 100) {
      append(myArray100, insulto_nocensura);
      let punteggio_uMisura = punteggio + " HT - ";
      append(myArray100, punteggio_uMisura);
      str100 = myArray100.toString();
      str_nocomma100 = str100.replace(/,/g, "");
    } else if (punteggio > 0) {
      append(myArray0, insulto_nocensura);
      let punteggio_uMisura = punteggio + " HT - ";
      append(myArray0, punteggio_uMisura);
      str0 = myArray0.toString();
      str_nocomma0 = str0.replace(/,/g, "");
    } /* else if (punteggio <= 0) {
      //questo lo faccio solo se nell'array non c'è l'insulto
      append(myArrayOff, insulto_nocensura);
      let punteggio_uMisura = punteggio + " HT - ";
      append(myArrayOff, punteggio_uMisura);
      strOff = myArrayOff.toString();
      str_nocommaOff = strOff.replace(/,/g, "");
      console.log(str_nocommaOff);
    } */
  }
  console.log("stampo insulti no censura: ", insulti_nocensura);

  //creo classifica top10
  top0 = insulti_nocensura[0].insulto;
  top1 = insulti_nocensura[1].insulto;
  top2 = insulti_nocensura[2].insulto;
  top3 = insulti_nocensura[3].insulto;
  top4 = insulti_nocensura[4].insulto;
  top5 = insulti_nocensura[5].insulto;
  top6 = insulti_nocensura[6].insulto;
  top7 = insulti_nocensura[7].insulto;
  top8 = insulti_nocensura[8].insulto;
  top9 = insulti_nocensura[9].insulto;
  //creo classifica insulti top10
  top0P = insulti_nocensura[0].punteggio;
  top1P = insulti_nocensura[1].punteggio;
  top2P = insulti_nocensura[2].punteggio;
  top3P = insulti_nocensura[3].punteggio;
  top4P = insulti_nocensura[4].punteggio;
  top5P = insulti_nocensura[5].punteggio;
  top6P = insulti_nocensura[6].punteggio;
  top7P = insulti_nocensura[7].punteggio;
  top8P = insulti_nocensura[8].punteggio;
  top9P = insulti_nocensura[9].punteggio;
  //creo volume
  //creo classifica top10
  top0V = insulti_nocensura[0].volume;
  top1V = insulti_nocensura[1].volume;
  top2V = insulti_nocensura[2].volume;
  top3V = insulti_nocensura[3].volume;
  top4V = insulti_nocensura[4].volume;
  top5V = insulti_nocensura[5].volume;
  top6V = insulti_nocensura[6].volume;
  top7V = insulti_nocensura[7].volume;
  top8V = insulti_nocensura[8].volume;
  top9V = insulti_nocensura[9].volume;
}

function draw() {
  textAlign(CENTER);
  //Aggiungo titolo top10
  background("black");
  fill("white");
  textSize(30);
  textFont(myFontMain);
  let titolo_top10 = "THE HEAVIEST 10";
  let titolo_weight = "WEIGHT";
  let titolo_volume = "VOLUME";
  /*   text(titolo_top10, width / 2, 25);
   */ //console.log("draw in action "); //creo funzione che ti mette in loop le parole
  textSize(15);
  text(titolo_weight, 270, 40 + distanza_titolo);
  text(titolo_volume, 355, 40 + distanza_titolo);

  textAlign(LEFT);
  fill(clrR2);
  textSize(20);
  textFont(myFontDot);

  //disegno rettangoli
  noStroke();
  fill(20, 20, 20);
  rect(0, 54 + distanza_titolo, 400, 20);
  rect(0, 54 + distanza_titolo + 30, 400, 20);
  rect(0, 54 + distanza_titolo + 60, 400, 20);
  rect(0, 54 + distanza_titolo + 90, 400, 20);
  rect(0, 54 + distanza_titolo + 120, 400, 20);
  rect(0, 54 + distanza_titolo + 150, 400, 20);
  rect(0, 54 + distanza_titolo + 180, 400, 20);
  rect(0, 54 + distanza_titolo + 210, 400, 20);
  rect(0, 54 + distanza_titolo + 240, 400, 20);
  rect(0, 54 + distanza_titolo + 270, 400, 20);

  //disegno classifica
  strokeWeight(0.3);
  stroke(clrR1);
  fill(clrR1);
  text("1.  " + top0, 0, 70 + distanza_titolo);
  text("2.  " + top1, 0, 100 + distanza_titolo);
  text("3.  " + top2, 0, 130 + distanza_titolo);
  text("4.  " + top3, 0, 160 + distanza_titolo);
  text("5.  " + top4, 0, 190 + distanza_titolo);
  text("6.  " + top5, 0, 220 + distanza_titolo);
  text("7.  " + top6, 0, 250 + distanza_titolo);
  text("8.  " + top7, 0, 280 + distanza_titolo);
  text("9.  " + top8, 0, 310 + distanza_titolo);
  text("10. " + top9, 0, 340 + distanza_titolo);
  //disegno punteggi
  strokeWeight(0);
  fill("white");
  text(top0P, 0 + 250, 70 + distanza_titolo);
  text(top1P, 0 + 250, 100 + distanza_titolo);
  text(top2P, 0 + 250, 130 + distanza_titolo);
  text(top3P, 0 + 250, 160 + distanza_titolo);
  text(top4P, 0 + 250, 190 + distanza_titolo);
  text(top5P, 0 + 250, 220 + distanza_titolo);
  text(top6P, 0 + 250, 250 + distanza_titolo);
  text(top7P, 0 + 250, 280 + distanza_titolo);
  text(top8P, 0 + 250, 310 + distanza_titolo);
  text(top9P, 0 + 250, 340 + distanza_titolo);
  //disegno VOLUMI
  text(top0V, 0 + 340, 70 + distanza_titolo);
  text(top1V, 0 + 340, 100 + distanza_titolo);
  text(top2V, 0 + 340, 130 + distanza_titolo);
  text(top3V, 0 + 340, 160 + distanza_titolo);
  text(top4V, 0 + 340, 190 + distanza_titolo);
  text(top5V, 0 + 340, 220 + distanza_titolo);
  text(top6V, 0 + 340, 250 + distanza_titolo);
  text(top7V, 0 + 340, 280 + distanza_titolo);
  text(top8V, 0 + 340, 310 + distanza_titolo);
  text(top9V, 0 + 340, 340 + distanza_titolo);
}

//creo nuovo sketch con parole in loop
var sketch = function (p1) {
  //var globali
  //funzione setup
  p1.setup = function () {
    p1.createCanvas(windowWidth, 410);
  };
  //funzione draw
  p1.draw = function () {
    p1.background("black");
    p1.strokeWeight(0.3);
    p1.stroke(clrR1);
    p1.textFont(myFontDot);
    p1.textSize(33);
    p1.fill(clrR2);

    //Creazione testi
    let OffWidth = p1.textWidth(myArrayOff);

    //let bWidth = textWidth(bString);
    let font_d = 1.2;
    let pos_y = 40;

    p1.textSize(33);
    p1.text(str_nocomma900, x900, pos_y);
    let aWidth = p1.textWidth(myArray900);
    p1.textSize(33 - font_d);
    p1.text(str_nocomma800, x800, pos_y * 2);
    let bWidth = p1.textWidth(myArray800);
    p1.textSize(33 - font_d * 2);
    p1.text(str_nocomma700, x700, pos_y * 3);
    let cWidth = p1.textWidth(myArray700);
    p1.textSize(33 - font_d * 3);
    p1.text(str_nocomma600, x600, pos_y * 4);
    let dWidth = p1.textWidth(myArray600);
    p1.textSize(33 - font_d * 4);
    p1.text(str_nocomma500, x500, pos_y * 5);
    let eWidth = p1.textWidth(myArray500);
    p1.textSize(33 - font_d * 5);
    p1.text(str_nocomma400, x400, pos_y * 6);
    let fWidth = p1.textWidth(myArray400);
    p1.textSize(33 - font_d * 6);
    p1.text(str_nocomma300, x300, pos_y * 7);
    let gWidth = p1.textWidth(myArray300);
    p1.textSize(33 - font_d * 7);
    p1.text(str_nocomma200, x200, pos_y * 8);
    let hWidth = p1.textWidth(myArray200);
    p1.textSize(33 - font_d * 8);
    p1.text(str_nocomma100, x100, pos_y * 9);
    let iWidth = p1.textWidth(myArray100);
    p1.textSize(33 - font_d * 9);
    p1.text(str_nocomma0, x0, pos_y * 10);
    let lWidth = p1.textWidth(myArray0);

    p1.text(str_nocommaOff, xOff, pos_y * 12);
    p1.textSize(33 - font_d * 10);

    //animazione testo
    let velocità_testo = 1.3;
    let incremento_testo = 0.3;
    x900 += 1;
    barriera9 = -aWidth;
    /*     console.log("questo è -aWidth", barriera9);
     */ if (x900 > p1.windowWidth) {
      x900 = barriera9;
    }
    x800 -= velocità_testo;
    barriera8 = -bWidth;
    if (x800 < barriera8) {
      x800 = p1.windowWidth;
    }
    x700 += velocità_testo * (velocità_testo + incremento_testo);
    barriera7 = -cWidth;
    if (x700 > p1.windowWidth) {
      x700 = barriera7;
    }
    x600 -= velocità_testo * (velocità_testo + incremento_testo * 2);
    barriera6 = -dWidth;
    if (x600 < barriera6) {
      x600 = p1.windowWidth;
    }
    x500 += velocità_testo * (velocità_testo + incremento_testo * 3);
    barriera5 = -eWidth;
    if (x500 > p1.windowWidth) {
      x500 = barriera5;
    }
    x400 -= velocità_testo * (velocità_testo + incremento_testo * 3.5);
    barriera4 = -fWidth;
    if (x400 < barriera4) {
      x400 = p1.windowWidth;
    }
    x300 += velocità_testo * (velocità_testo + incremento_testo * 4);
    barriera3 = -gWidth;
    if (x300 > p1.windowWidth) {
      x300 = barriera3;
    }
    x200 -= velocità_testo * (velocità_testo + incremento_testo * 4.5);
    barriera2 = -hWidth;
    if (x200 < barriera2) {
      x200 = p1.windowWidth;
    }
    x100 += velocità_testo * (velocità_testo + incremento_testo * 5);
    barriera1 = -iWidth;
    if (x100 > p1.windowWidth) {
      x100 = barriera1;
    }
    x0 -= velocità_testo * (velocità_testo + incremento_testo * 5.3);
    barriera0 = -lWidth;
    if (x0 < barriera0) {
      x0 = p1.windowWidth;
    }
  };
  //funzione di resize
  p1.windowResized = function () {
    p1.resizeCanvas(p1.windowWidth, p1.windowHeight);
  };
};

var myS1 = new p5(sketch, "canvas1");

//creo TOTAL HATE sketch
var sketch2 = function (p2) {
  //funzione setup
  p2.setup = function () {
    p2.createCanvas(250, 28);
  };
  //funzione draw
  p2.draw = function () {
    p2.background(clrR2);
    p2.textFont(myFontMain);
    p2.textSize(30);
    p2.fill("BLACK");
    p2.text("TOTAL HATE: ", 4, 25);
    p2.text(punteggio_personale, 140, 25);
  };
};
var myS2 = new p5(sketch2, "canvas2");

//creo TODAY'S HATE sketch
var sketch3 = function (p3) {
  //funzione setup
  p3.setup = function () {
    p3.createCanvas(250, 28);
  };
  //funzione draw
  p3.draw = function () {
    p3.background(clrR2);
    p3.textFont(myFontMain);
    p3.textSize(25);
    p3.fill("black");
    p3.text("TODAY'S HATE: ", 4, 23);
    p3.text(punteggio_oggi, 135, 23);
  };
};
var myS3 = new p5(sketch3, "canvas3");

//creo BASKET sketch
var sketch4 = function (p4) {
  //funzione setup
  p4.setup = function () {
    p4.createCanvas(380, 200);
  };
  //funzione draw
  p4.draw = function () {
    /*DISEGNO RETTANGOLI */
    p4.textAlign(LEFT);

    p4.background("black");
    p4.noStroke();
    p4.fill(20, 20, 20);
    p4.rect(0, 54, 400, 20);
    p4.rect(0, 54 + 30, 400, 20);
    p4.rect(0, 54 + 60, 400, 20);
    p4.rect(0, 54 + 90, 400, 20);
    /*FACCIO SCRITTE */
    p4.strokeWeight(0.3);
    p4.stroke(clrR1);
    p4.textFont(myFontDot);
    p4.textSize(20);
    p4.fill("red");
    p4.text("1X VERBERO", 0, 70);
    p4.text("1X SMILE 1E BALACLAVA", 0, 70 + 30);
    p4.strokeWeight(0);
    p4.fill("white");
    p4.text("TOTAL:", 250, 70 + 30 + +30 + 30);

    p4.text("€205", 330, 70 + 30 + +30 + 30);
    p4.text("€150", 330, 70);
    p4.text("€55", 342, 70 + 30);

    p4.textFont(myFontMain);
    p4.textSize(15);
    p4.text("PRICE", 340, 40);
  };
};
var myS4 = new p5(sketch4, "canvas4");
