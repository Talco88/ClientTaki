var boardUI = {};
boardUI.uiUpdateInterval = 0;

// UI manipulation section
boardUI.loadUI = function () {
    lobby.removeFromView();
    boardUI.divInDOM = document.querySelector(".board");
    boardUI.divInDOM.style.display = utility.displayActive;

    boardLogic.init();
    playerLogic.init();
    aiPlayer.init();

    utility.createStatisticInterval();

    var endTakiBtn = document.querySelector(".end-taki-button");
    endTakiBtn.onclick = boardLogic.closeTaki;

    var popUpCloseButton = document.querySelector(".close-button");
    popUpCloseButton.onclick = utility.removePopUp;

    var endGameBtm = document.querySelector(".end-game-btn");
    endGameBtm.onclick = playerLogic.onclickEndGame;

    var colrBtns = document.querySelectorAll(".color-button");
    if (colrBtns && colrBtns.length > 0) {
        for (var i = 0; i < colrBtns.length; i++) {
            colrBtns[i].onclick = boardUI.onSelectedColorclick;
        }
    }

    boardUI.uiUpdateInterval = setInterval(utility.updateBoardLayout, 2500);
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

    boardUI.setSelectedChangeColor(colorNumber, playerLogic.playerId);
    boardLogic.makeAiMove();
}

boardUI.setSelectedChangeColor = function (iColorNumber, iPlayerId) {
    if (boardLogic.setChangeColor(iColorNumber, iPlayerId)) {

        var colorSelection = document.querySelector(".color-selection");
        colorSelection.style.display = utility.displayHidden;

        var colorSelection = document.getElementById("currentCard");
        colorSelection.style.color = boardLogic.cardColors[iColorNumber];
    }
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

boardUI.printCurrentCard = function (iCard) {
    var currentCard = document.getElementById("currentCard");
    currentCard.innerHTML = "";
    currentCard.appendChild(utility.getCardHtml(iCard));
}

boardUI.initDecUIData = function (iFunc) {
    document.getElementById("deckCards").onclick = iFunc;
}

boardUI.closeTaki = function () {
    var closeTaki = document.querySelector(".close-taki");
    closeTaki.style.display = utility.displayHidden;
}