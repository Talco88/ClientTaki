var lobby = {};

lobby.load = function () {
    var boardDiv = document.querySelector(".board");
    boardDiv.style.display = utility.displayHidden;

    lobby.divInDOM = document.getElementById("lobby");
    lobby.divInDOM.style.display = utility.displayActive;

    var startBtn = document.getElementById("startGameBtn");
    if (startBtn) {
        startBtn.onclick = boardUI.loadUI;
    }
    else {
        alert("Error Parsing lobby html!");
    }
}


lobby.removeFromView = function () {
    lobby.divInDOM.style.display = utility.displayHidden;
}
