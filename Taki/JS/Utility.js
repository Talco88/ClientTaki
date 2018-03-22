var utility = {};

utility.getHTMLData = function (file, iRetFunction) {
    if (file) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200)
                {
                    iRetFunction(this.responseText);
                }
                else if (this.status == 404)
                {
                    iRetFunction("Page not found.");
                }
            }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        return;
    }
}

utility.setToMainView = function (content) {
    var mainWindow = document.getElementById("mainWindow");
    mainWindow.innerHTML = content;
}