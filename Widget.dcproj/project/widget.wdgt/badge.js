/*
    Source released under BSD license, copyright (c) 2010 Constructive Coding Ltd.
    See license.txt for license.
*/

function badge(badgeData, badgeListContainer) {
    this.badgeSymbol = "&#9679;";
    this.badgeText = badgeData.name;
    this.badgeColor = badgeData.rank + "Badge";
    this.badgeID = badgeData.badge_id;
    this.badgeDescription = badgeData.description;
    this.badgeCount = badgeData.award_count;
    this.badgeListContainer = badgeListContainer;
}

badge.prototype.display = function() {
    this.badgecontainer = document.createElement("div");
    this.badgecontainer.setAttribute("class", "badgecontainer");
    this.badgecontainer.setAttribute("title", this.badgeDescription);
    this.badgecontents = document.createElement("div");
	this.badgecontents.setAttribute("class", "badge");
    this.badgecontents.setAttribute("id", "badge" + this.badgeID);
    this.badgecontainer.appendChild(this.badgecontents);
    
    $(this.badgeListContainer).append(this.badgecontainer);
    var badgeContents = "<span class='" + this.badgeColor + "'>" + this.badgeSymbol + "</span>";
    badgeContents += "<span>" + this.badgeText + "</span>";
    $("#badge" + this.badgeID).html(badgeContents);
    
    var votes = document.createElement("div");
    
    if (this.badgeCount > 1) {
        var badgeCount = "<span>x " + this.badgeCount + "</span>";
        $(this.badgecontainer).append(badgeCount);
    }
}