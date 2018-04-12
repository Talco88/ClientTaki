var utility = {};

utility.displayHidden = 'none';
utility.displayActive = 'block';


utility.getCardHtml = function (iCard, iClickFunc) {
    var retVal = "";
    var divOpenTemplate = "<div id='playersHandCard' class='";
    var closeopenTemplate = "'>"
    var divCloseTemlate = "</div>";

    var onclickEvent = "";
    if (iClickFunc && iClickFunc != null) {
        onclickEvent = "' onclick='"+ iClickFunc +"(this)";
    }

    var option = boardLogic.cardOptions[iCard.number];
    var innedDiv = "<div class='cardOption'>" + option + divCloseTemlate;
    var color = boardLogic.cardColors[iCard.color];
    // create card tepmlate with add information
    retVal = divOpenTemplate + option + " " + color + " card' number='" + iCard.number + "' color='" + color + onclickEvent + closeopenTemplate + innedDiv + divCloseTemlate;
    //retVal += "<br>"

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