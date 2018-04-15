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
    cardDiv.className = option + " " + color + " " + iCard.id + " card taki-card";


    var innerDiv = document.createElement('div');
    innerDiv.className = 'cardOption';
    innerDiv.innerText = option;

    cardDiv.appendChild(innerDiv);

    return cardDiv;
}

utility.onReSize = function () {
    console.log("resized!");

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