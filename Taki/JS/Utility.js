var utility = {};

utility.displayHidden = 'none';
utility.displayActive = 'block';


utility.getCardHtml = function (iCard) {
    var retVal = "";
    var divOpenTemplate = "<div id='playersHandCard' class='";
    var closeopenTemplate = "'>"
    var divCloseTemlate = "</div>";

    var option = boardLogic.cardOptions[iCard.number];
    var color = boardLogic.cardColors[iCard.color];
    retVal = divOpenTemplate + option + " " + color + closeopenTemplate + "type: " + option + " Color: " + color + divCloseTemlate;
    retVal += "<br>"

    return retVal;
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

//utility.setToMainView = function (content) {
//    var mainWindow = document.getElementById("mainWindow");
//    mainWindow.innerHTML = content;
//}