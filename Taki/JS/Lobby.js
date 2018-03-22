var lobby = {};

lobby.load = function () {
    lobby.divInDOM = document.getElementById("lobby");
    lobby.divInDOM.style.display = utility.displayActive;

    var startBtn = document.getElementById("startGameBtn");
    if (startBtn) {
        startBtn.onclick = boardLogic.loadUI;
    }
    else {
        alert("Error Parsing lobby html!");
    }

    //var file = "../HTML/Lobby.html";
    //if (lobby.html) {
    //    utility.setToMainView(lobby.html);
    //}
    //else {
    //    utility.getHTMLData(file, lobby.setToView);
    //}
}


lobby.removeFromView = function () {
    lobby.divInDOM.style.display = utility.displayHidden;
}
