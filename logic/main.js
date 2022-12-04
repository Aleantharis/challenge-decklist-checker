import * as bl from './data/banlist.json';
import * as sl from './data/setlist.json';
import * as db from './data/card-db-essential.json';


$(function() {
  const cardDb = db;
  const bans = bl;
  const setList = sl;

 $("#in").attr("placeholder", "Please paste deck here (in MTG online's deck format (*.dek))...\n\nExample:\n1 Library of Congress\n1 Cryptic Gateway\n1 Azami, Lady of Scrolls")

function validateCard(cardName) {
  return (JSON.parse(cardDb)[cardName].filter(value => setList.includes(value))).length > 0;
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
    deck.forEach(function(value) {
      var idx = bans.indexOf(value);
      if (idx >= 0) {
        bannedCards.push(value);
      }

      if(!validateCard(value)) {
        unavailCards.push(value);
      }
    });

    let banList = [...new Set(bannedCards)];
    var banTxt = "";
    if (banList.length > 0) {
      banList.forEach(function(value) {
        banTxt += "<li>" + value + "</li>";
      });
    }

    let errList = [...new Set(unavailCards)];
    var errTxt = "";
    if (errList.length > 0) {
      errList.forEach(function(value) {
        errTxt += "<li>" + value + "</li>";
      });
    }

    $("#banListDisplay").html(banTxt);
    $("#errListDisplay").html(errTxt);
  }

  $("#in").on('change keyup', validateDeck);
  $("#in").bind('paste',function() {setTimeout(validateDeck);});
});
