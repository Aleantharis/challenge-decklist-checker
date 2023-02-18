import bl2 from '../data/2022/banlist.json' assert { type: "json" };
import sl2 from '../data/2022/setlist.json' assert { type: "json" };
import bl3 from '../data/2023/banlist.json' assert { type: "json" };
import sl3 from '../data/2023/setlist.json' assert { type: "json" };
import db from '../data/card-db-essential.json' assert { type: "json" };
import slf from '../data/sets-fullname.json' assert { type: "json" };
import iDb from '../data/card-db-img.json' assert { type: "json" };

$(function () {
  const cardDb = db;
  const bans = {
    2022: bl2,
    2023: bl3
  };
  const setList = {
    2022: sl2,
    2023: sl3
  };
  const setListFull = slf;
  const imgDb = iDb;
  const regExp = /^(SB\: *)?\d* *(\[\w*\:\d+\])? *([\w ,'-û]*)/;

  var banListVer = 2023;

  $("#in").attr("placeholder", "Please paste deck here (in MTG online's deck format (*.dek))...\n\nExample:\n1 Library of Congress\n1 Cryptic Gateway\n1 Azami, Lady of Scrolls")

  function validateCard(cardName) {
    // -1: Invalid card
    // 0: Card not legal (not printed in a legal set)
    // >0: Card is legal

    if (cardDb[cardName] == undefined) {
      // Card does not exist in db
      return -1;
    }


    if (Array.isArray(cardDb[cardName])) {
      // > 0 -> Is legal
      return (cardDb[cardName].filter(value => setList[banListVer].includes(value))).length;
    }
    else {
      return setList[banListVer].includes(cardDb[cardName]) ? 1 : 0;
    }
  }

  function validateDeck() {
    var deck = $("#in").val().split('\n');

    deck.forEach((element, index) => {
      var san = element;
      const match = san.match(regExp);
      deck[index] = match[3].trim();
    });

    // Filter out "empty" entries
    deck = deck.filter(c => c !== '');

    var bannedCards = [];
    var unavailCards = [];
    var nonexistCards = [];
    var allCards = [];
    deck.forEach(function (value) {
      var idx = bans[banListVer].indexOf(value);
      if (idx >= 0) {
        bannedCards.push(value);
        allCards.push(value);
      }

      switch (validateCard(value)) {
        case -1:
          nonexistCards.push(value);
          allCards.push(value);
          break;
        case 0:
          unavailCards.push(value);
          allCards.push(value);
          break;
      }
    });

    let allList = [...new Set(allCards)];
    var allText = "";
    if (allList.length > 0) {
      allList.forEach(function (value) {
        var classes = "";

        if (bannedCards.includes(value)) {
          classes += " banned ";
        }
        if (unavailCards.includes(value)) {
          classes += " unavailable ";
        }
        if (nonexistCards.includes(value)) {
          classes += " unknown ";
        }

        allText += ("<li class='" + classes + "'>" + value + "</li>");
      });
    }


    $("#banListDisplay").html(allText);

    /*
        let banList = [...new Set(bannedCards)];
        var banTxt = "";
        if (banList.length > 0) {
          banList.forEach(function (value) {
            banTxt += "<li>" + value + "</li>";
          });
        }
    
        let errList = [...new Set(unavailCards)];
        var errTxt = "";
        if (errList.length > 0) {
          errList.forEach(function (value) {
            errTxt += "<li>" + value + "</li>";
          });
        }
    
    $("#banListDisplay").html(banTxt);
    $("#errListDisplay").html(errTxt);
    */
  }

  $("#in").on('change keyup', validateDeck);
  $("#in").bind('paste', function () { setTimeout(validateDeck); });
  $("#selBanList").on('change', function () {
    banListVer = $("#selBanList").val();
    validateDeck();
  });

  $("#btnShowDiag").on('click', () => { document.getElementById("dlgSet").showModal(); });
  $("#inSet").on('change keyup', () => {
    var val = $("#inSet").val();
    var x = Object.keys(setListFull).indexOf(val);
    var y = Object.values(setListFull).indexOf(val);

    $("#outSet").val((x >= 0 || y >= 0) ? "Not Allowed" : "Allowed");
  });

  var tmpx = "";
  Object.keys(setListFull).forEach((item) => {
    tmpx += "<li>" + setListFull[item] + " (" + item + ")</li>";
  });
  $("#diagSetList").html(tmpx);


  // TODO: fix urls for banlist popup, add available packages maybe also add classes/colors for unavailable/banned cards
  // maybe add word distance search (display top 5 similar cards as suggestions for typos).


  $("#banListDisplay").on('click', (e) => {
    if (e.target.nodeName === 'LI') {
      console.log(e.target.textContent);
      $("#h4Card").html(e.target.textContent);
      $("#cardImg").attr("src", imgDb[e.target.textContent] !== undefined ? imgDb[e.target.textContent] : 'img/empty.png');
      $("#cardLinks").html("<li>placeholder</li>");
      document.getElementById("dlgCard").showModal();
    }
  });

  // File Drag & Drop
  var holder = document.getRootNode();

  if (typeof window.FileReader === 'undefined') {
    console.log("File reader unavailable!")
  }

  holder.ondragover = function () {
    this.className = 'hover';
    return false;
  };
  holder.ondragend = function () {
    this.className = '';
    return false;
  };
  holder.ondrop = function (e) {
    this.className = '';
    e.preventDefault();

    var file = e.dataTransfer.files[0],
      reader = new FileReader();
    reader.onload = function (event) {
      var cleanedString = event.target.result.slice(0, event.target.result.indexOf("LAYOUT MAIN"));

      $("#in").val(cleanedString);
      validateDeck();
    };
    reader.readAsText(file);

    return false;
  };

  $("#dlgSet .diagHead h4").html($("#dlgSet .diagHead h4").html() + `<a target="_blank" rel="noopener noreferrer" href="http://scryfall.com/search?q=${encodeURIComponent("legal:commander and (set:" + setList[banListVer].join(" or set:") + ")")}">↗</a>`);
});
