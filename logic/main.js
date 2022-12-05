import bl from '../data/banlist.json' assert { type: "json" };
import sl from '../data/setlist.json' assert { type: "json" };
import db from '../data/card-db-essential.json' assert { type: "json" };


$(function () {
  const cardDb = db;
  const bans = bl;
  const setList = sl;

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
      return (cardDb[cardName].filter(value => setList.includes(value))).length;
    }
    else {
      return setList.includes(cardDb[cardName]) ? 1 : 0;
    }
  }

  function validateDeck() {
    const deck = $("#in").val().split('\n');

    deck.forEach((element, index) => {
      var san = element;
      san = (san.replace(/^\d ()?/, "")).trim();
      deck[index] = san;
    });

    var bannedCards = [];
    var unavailCards = [];
    var nonexistCards = [];
    var allCards = [];
    deck.forEach(function (value) {
      var idx = bans.indexOf(value);
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
        allText += "<li class='" + bannedCards.includes(value) ? " banned " : "" + unavailCards.includes(value) ? " unavailable " : "" + nonexistCards.includes(value) ? " unknown " : "" + "'>" + value + "</li>";
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
});
