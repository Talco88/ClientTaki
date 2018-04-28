var utility = {};

utility.displayHidden = 'none';
utility.displayActive = 'flex';
utility.debug = true;
utility.statisticInterval = 0;


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

    var innerUpperDiv = document.createElement('div');
    innerUpperDiv.className = 'card-small-option card-upper-option';
    innerUpperDiv.innerText = option;

    cardDiv.appendChild(innerUpperDiv);


    var innerDiv = document.createElement('div');
    
    if (iCard.color === 4) {
        innerDiv.className = "card-option " + option + "-inner";
    }
    else {
        innerDiv.className = "card-option";
        innerDiv.innerText = option;
    }

    cardDiv.appendChild(innerDiv);

    var innerLowerDiv = document.createElement('div');
    innerLowerDiv.className = 'card-small-option card-lower-option';
    innerLowerDiv.innerText = option;
    cardDiv.appendChild(innerLowerDiv);

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
        var calculatedMargin = utility.calculateMargininCards(cards.length, 140);
        for (var i = 0; i < cards.length; i++) {
            cards[i].style.marginRight = calculatedMargin + "px";
            cards[i].style.width = "140px"; // in some cases the width adjust to teh size before the update, forcing the card sizes
        }
    }
}

utility.calculateMargininCards = function (numberOfCards, cardWidth) {
    var calculatedMargin = ((((document.body.clientWidth - 50) / numberOfCards) - cardWidth) / 1) - 4;
    if (calculatedMargin > -10) {
        calculatedMargin = -10;
    }
    return calculatedMargin;
}

utility.createStatisticInterval = function () {
    utility.timer = 0;
    utility.statisticInterval = setInterval(utility.displayStats, 1000);
}

utility.displayStats =  function () {
    utility.timer++;

    var display = document.querySelector('#time');
    display.textContent = utility.parsTimeToMinAndSec(utility.timer);
        
    var displayNumberOfTurns = document.querySelector('#numberOfTurns');
    displayNumberOfTurns.textContent = boardLogic.totalNumberOfPlay;

    var avrageTime;
    if (boardLogic.totalNumberOfPlay === 0) {
        avrageTime = utility.timer;
    }
    else {
        avrageTime = utility.timer / boardLogic.totalNumberOfPlay
    }
    var displayPerTurn = document.querySelector('#timePerTrun');
    displayPerTurn.textContent = utility.parsTimeToMinAndSec((avrageTime));


    var displayActivePlayer = document.querySelector('#playerName');
    displayActivePlayer.textContent = utility.displayPlayer();

}

utility.displayPlayer = function () {
    if (boardLogic.isGameFinish) {
        return "Game Finished";
    }
    else {
        return (boardLogic.currentPlayer && boardLogic.currentPlayer === aiPlayer.playerId) ? "AI" : "You";
    }
}

utility.parsTimeToMinAndSec = function (iTime) {
    minutes = parseInt(iTime / 60, 10)
    seconds = parseInt(iTime % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}



utility.finishGame = function (iFinishText) {
    if (boardLogic.isGameFinish) {
        clearInterval(utility.statisticInterval);
        utility.displayStats();
        var text = "";
        var winner = "";
        if (playerLogic.isAborted || playerLogic.Hand.length > 0) {
            winner = "AI";
        }
        else {
            winner = "You";
        };

        var text = "Game Finish " + winner + " Won!";

        if (iFinishText) {
            text += "\n" + iFinishText;
        }
        else {
            text += "\nPlay again!"
        }

        utility.displayPopUp(text);
    }
}

utility.displayPopUp = function (iData) {
    var modal = document.querySelector(".popup");
    modal.classList.add("show-popup");

    var popupText = document.querySelector(".popup-text");
    popupText.innerText = "";

    var text = document.createElement('H1');
    text.innerText = iData;

    popupText.appendChild(text);
}

utility.removePopUp = function () {
    var modal = document.querySelector(".popup");
    modal.classList.remove("show-popup");

    if (boardLogic.isGameFinish) {
        lobby.load();
    }
}
