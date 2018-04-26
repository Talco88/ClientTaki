var boardUI = {};

// UI manipulation section
boardUI.loadUI = function () {
    lobby.removeFromView();
    boardUI.divInDOM = document.querySelector(".board");
    boardUI.divInDOM.style.display = utility.displayActive;

    boardLogic.init();
    playerLogic.init();
    aiPlayer.init();


    utility.displayStats();

    var endTakiBtn = document.querySelector(".end-taki-button");
    endTakiBtn.onclick = boardLogic.closeTaki;

    var colrBtns = document.querySelectorAll(".color-button");
    if (colrBtns && colrBtns.length > 0) {
        for (var i = 0; i < colrBtns.length; i++) {
            colrBtns[i].onclick = boardUI.onSelectedColorclick;
        }
    }
}

boardUI.removeFromView = function () {
    boardUI.divInDOM.style.display = utility.displayHidden;
}

boardUI.openUISelection = function () {
    if (aiPlayer && aiPlayer.playerId === boardLogic.currentPlayer) {
        // AI no need to show the UI extentions
        return;
    }
    if (boardLogic.currentCard.number === 12) {
        // CC
        var colorSelection = document.querySelector(".color-selection");
        colorSelection.style.display = utility.displayActive;
    }
    else if (boardLogic.currentCard.number === 10) {
        // TAKI
        var closeTaki = document.querySelector(".close-taki");
        closeTaki.style.display = utility.displayActive;
    }
}

boardUI.removechangeColor = function () {
    var colorSelection = document.getElementById("currentCard");
    colorSelection.style.color = null;
}

boardUI.onSelectedColorclick = function (iElement) {
    var color = iElement.currentTarget.classList[1];
    var colorNumber = 4;
    for (var i = 0; i < Object.keys(boardLogic.cardColors).length; i++) {
        if (boardLogic.cardColors[i].toUpperCase() == color.toUpperCase()) {
            colorNumber = i;
        }
    }

    boardUI.setSelectedChangeColor(colorNumber);
    boardLogic.makeAiMove();
}

boardUI.setSelectedChangeColor = function (iColorNumber) {
    if (iColorNumber < 4 && iColorNumber > -1) {
        boardLogic.changColorSelection = iColorNumber;
    }

    var colorSelection = document.querySelector(".color-selection");
    colorSelection.style.display = utility.displayHidden;

    var colorSelection = document.getElementById("currentCard");
    colorSelection.style.color = boardLogic.cardColors[iColorNumber];
}

boardUI.printPlayerCadsToUser = function (iCards) {
    var playersCards = document.getElementById("playersCards");
    playersCards.innerHTML = "";
    for (var i = 0; i < iCards.length; i++) {
        var card = iCards[i];
        playersCards.appendChild(utility.getCardHtml(card, playerLogic.onclickedCard));
    }
    utility.manageCardsmargin(".player-cards .taki-card");
}

boardUI.initDecUIData = function (iFunc) {
    document.getElementById("deckCards").onclick = iFunc;
}