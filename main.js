$(function() {
  const bans = ["Renegade Krasis", "Elusive Krasis", "Giant Adephage", "Brand of Ill Omen", "Mystic Remora", "Lavinya", "Trostani, Selesna's Voice", "Kaysa", "Isperia, Supreme Judge", "Sphere of Safety", "Grave Betrayal", "Rhystic Study", "Chromatic Lantern", "Hanna, Ship's Navigator", "Aura Shards", "Rith, The Awakener", "Consuming Aberration", "Sylvan Library", "Vigor", "Dragon Mage", "Time Sieve", "Rakdos, Lord of Riots", "Geth, Lord of the Vault", "Bitterblossom", "Toshiro Umezawa", "Sheoldred, Whispering One", "Hokori, the Dust drinker", "Vorinclex", "Karn Liberated", "Captain Sisay", "Contagion Engine", "Grand Arbiter Augustin IV", "Phyrexian Hydra", "Phyrexian Swarmlord", "Wort, Boggart Auntie", "Vanquishers Banner", "Kambal, Consul of Allocation", "Inorexable Tide", "Mycosynth Lattice", "Dynavolt Tower", "Mikaeus, the Unhallowed", "Maze of Ith", "Klothys, God of Destiny", "Mind Crank", "Thaumatic Compass", "Glissa, The Traitor", "Praetor's Counsel", "Circu, Dimir Lobotomist", "Dragon Broodmother"];
  
 $("#in").attr("placeholder", "Please paste deck here (in MTG online's deck format (*.dek))...\n\nExample:\n1 Library of Congress\n1 Cryptic Gateway\n1 Azami, Lady of Scrolls")

function validateDeck() {
    const deck = $("#in").val().split('\n');

    deck.forEach((element, index) => {
    	var san = element;
      san = (san.replace(/^\d ()?/, "")).trim();
      deck[index] = san;
    });

    var errs = [];
    deck.forEach(function(value) {
      var idx = bans.indexOf(value);
      if (idx >= 0) {
        errs.push(value);
      }
    });

    let errList = [...new Set(errs)];
    var errTxt = "";
    if (errList.length > 0) {
      errList.forEach(function(value) {
        errTxt += "<li>" + value + "</li>";
      });
    }

    $("#errListDisplay").html(errTxt);
  }

  $("#in").on('change keyup', validateDeck);
  $("#in").bind('paste',function() {setTimeout(validateDeck);});
});
