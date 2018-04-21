var utility = {};

utility.displayHidden = 'none';
utility.displayActive = 'flex';
utility.debug = true;


utility.getCardHtml = function (iCard, iClickFunc) {
    var cardDiv = document.createElement('div');
    cardDiv.id = 'playersHandCard';

    if (iClickFunc && iClickFunc != null) {
        // a call is not always needed
        cardDiv.onclick = iClickFunc;
    }
    
    var option = boardLogic.cardOptions[iCard.number];
    var color = boardLogic.cardColors[iCard.color];
    cardDiv.className = option + " " + color + " 0" + iCard.id + " card taki-card";


    var innerDiv = document.createElement('div');
    innerDiv.className = 'cardOption';
    innerDiv.innerText = option;

    cardDiv.appendChild(innerDiv);

    return cardDiv;
}

utility.flipedCard = function () {
    var cardDiv = document.createElement('div');
    cardDiv.id = 'botHandCard';
    cardDiv.className = "card deck-wrapper bot-card-display";
    cardDiv.style.display = utility.displayActive;


    var innerDiv = document.createElement('div');
    innerDiv.className = "cards-deck";

    cardDiv.appendChild(innerDiv);

    return cardDiv;
}

utility.onReSize = function () {
    utility.manageCardsmargin(".player-cards .taki-card");
    utility.manageCardsmargin(".bot-card-display");
}

utility.addEvent = function (object, type, callback) {
    if (object == null || typeof (object) == 'undefined') return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on" + type] = callback;
    }
};

utility.manageCardsmargin = function (iSelector) {
    var cards = document.querySelectorAll(iSelector);
    if (cards && cards.length > 0) {
        var calculatedMargin = utility.calculateMargininCards(cards.length, cards[0].clientWidth);
        for (var i = 0; i < cards.length; i++) {
            cards[i].style.marginRight = calculatedMargin + "px";
        }

        //if (utility.debug) {
        //    console.log(document.body.clientWidth + " /  " + cards.length + "   -  " + cards[0].clientWidth + "   ==  " + calculatedMargin);
        //}
    }
}

utility.calculateMargininCards = function (numberOfCards, cardWidth) {
    return ((((document.body.clientWidth - 50) / numberOfCards) - cardWidth) / 1) - 4;
}



///external server call - not relevent in file system proj

//utility.getHTMLData = function (file, iRetFunction) {
//    if (file) {
//        var xhttp = new XMLHttpRequest();
//        xhttp.onreadystatechange = function () {
//            if (this.readyState == 4) {
//                if (this.status == 200)
//                {
//                    iRetFunction(this.responseText);
//                }
//                else if (this.status == 404)
//                {
//                    iRetFunction("Page not found.");
//                }
//            }
//        }
//        xhttp.open("GET", file, true);
//        xhttp.send();
//        return;
//    }
//}