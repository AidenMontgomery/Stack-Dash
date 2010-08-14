/*
    Source released under BSD license, copyright (c) 2010 Constructive Coding Ltd.
    See license.txt for license.
*/

function getDateFromEpoch(epoch) {
    var date = new Date( epoch *1000);
    
    var month = padNumber(date.getMonth() + 1);
    var day = padNumber(date.getDate());
    var year = date.getFullYear();
    
    var hours = padNumber(date.getHours());
    var minutes = padNumber(date.getMinutes());

    return year + "/" + month + "/" + day + " " + hours + ":" + minutes;
}

function padNumber(input) {
    if (input < 10) {
        return "0" + input;
    } else {
        return input;
    }
}

function convertLargeNumber(input) {
    if (input > 1000) {
        return "<span title='" + input + "'>" + Math.round((input / 1000) * 10) / 10 + "K</span>";
    }
    return input;
}

function openSafari(url) {
    if (window.widget) {
        widget.openURL(url);
    }
}