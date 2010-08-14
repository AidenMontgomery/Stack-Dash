/*
    Source released under BSD license, copyright (c) 2010 Constructive Coding Ltd.
    See license.txt for license.
*/

function answer(data, listContainer) {
    this.data = data;
    this.listContainer = listContainer;
}

answer.prototype.display = function() {
    this.container = document.createElement("div");
    this.container.setAttribute("class", "answerContainer");
    this.contents = document.createElement("div");
	this.contents.setAttribute("class", "answer");
    this.contents.setAttribute("id", "answer" + this.data.answer_id);
    this.container.appendChild(this.contents);
    $(this.listContainer).append(this.container);
    
    var answerContents = "<div class='item_header'>";
    
    if (this.data.favorite_count) {
        answerContents += "<div class='item_favorite'><img src='common/images/vote-favorite-on.png' width='15' height='15' />" + 
        convertLargeNumber(this.data.favorite_count) + "</div>";
    }
    answerContents += "<div class='item_views'>" + 
    convertLargeNumber(this.data.view_count) + " Views</div>";
    var dateEntry;
    if (this.data.last_edit_date) {
        dateEntry = getDateFromEpoch(this.data.last_edit_date);
    } else {
        dateEntry = getDateFromEpoch(this.data.creation_date);
    }
    
    answerContents += "<div class='item_activity_date'>Last Activity: " + dateEntry + "</div>";
    
    answerContents += "<div class='item_up_votes'><img alt='Up Votes' width='20' height='13' src='" + currentSettings.apiLocation + "/images/vote-arrow-up-on.png'>" + convertLargeNumber(this.data.up_vote_count) + "</div>";
    
    answerContents += "<div class='item_down_votes'><img alt='Down Votes' width='20' height='13' src='" + currentSettings.apiLocation + "/images/vote-arrow-down-on.png'>" + convertLargeNumber(this.data.down_vote_count) + "</div>";
    
    answerContents += "<div class='item_score'>Score " + convertLargeNumber(this.data.score) + "</div>";

    answerContents += "</div>";
    
    answerContents += "<div class='item_title'>Q. " + this.data.title + "</div>";
    
    $("#answer" + this.data.answer_id).html(answerContents);
}

answer.prototype.bindClick = function() {
    var _self = this;
    $(this.contents).bind('click', function() {
        var url = "http://" + currentSettings.apiLocation + ".com/questions/" + _self.data.question_id + "/" + _self.data.answer_id + "#" + _self.data.answer_id;
        openSafari(url);
    });
}

answer.prototype.isVisible = function(){
    if ($("#outsetScrollArea").attr('scrollTop') + $("#frontContent").height() >= $("#answer" + this.data.answer_id).attr('offsetTop')) {
        return true;
    } else {
        return false;
    }
}