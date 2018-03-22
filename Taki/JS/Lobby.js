var lobby = {};

lobby.load = function () {
    var file = "../HTML/Lobby.html";
    if (lobby.html) {
        utility.setToMainView(lobby.html);
    }
    else {
        utility.getHTMLData(file, lobby.setToView);
    }
}


lobby.setToView = function (content) {
    lobby.html = content;
    utility.setToMainView(content);

    var startBtn = document.getElementById("startGameBtn");
    if (startBtn) {
        startBtn.onclick = boardLogic.loadUI;
    }
    else {
        alert("Error Parsing lobby html!");
    }
}
