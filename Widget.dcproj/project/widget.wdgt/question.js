/*
    Source released under BSD license, copyright (c) 2010 Constructive Coding Ltd.
    See license.txt for license.
*/

function question(questionData, questionListContainer) {
    this.data = questionData;
    this.questionListContainer = questionListContainer;
}

question.prototype.display = function() {
    this.container = document.createElement("div");
    this.container.setAttribute("class", "questionContainer");
    this.contents = document.createElement("div");
	this.contents.setAttribute("class", "question");
    this.contents.setAttribute("id", "question" + this.data.question_id);
    this.container.appendChild(this.contents);
    $(this.questionListContainer).append(this.container);
    
    var questionContents = "<div class='item_header'>";
    
    questionContents += "<div class='item_favorite'><img src='common/images/vote-favorite-on.png' width='15' height='15' />" + convertLargeNumber(this.data.favorite_count) + "</div>";
    
    questionContents += "<div class='item_views'>" + convertLargeNumber(this.data.view_count) + " Views</div>";    
    questionContents += "<div class='item_up_votes'><img alt='Up Votes' width='20' height='13' src='" + currentSettings.apiLocation + "/images/vote-arrow-up-on.png'>" + convertLargeNumber(this.data.up_vote_count) + "</div>";
    
    questionContents += "<div class='item_down_votes'><img alt='Down Votes' width='20' height='13' src='" + currentSettings.apiLocation + "/images/vote-arrow-down-on.png'>" + convertLargeNumber(this.data.down_vote_count) + "</div>";
    
    questionContents += "<div class='item_answers'>" + convertLargeNumber(this.data.answer_count) + " Answers</div>";

    
    questionContents += "</div>";
    
    questionContents += "<div class='item_title'>Q. " + this.data.title + "</div>";
    
    $("#question" + this.data.question_id).html(questionContents);
}

question.prototype.bindClick = function() {
    var _self = this;
    $(this.contents).bind('click', function() {
        var url = "http://" + currentSettings.apiLocation + ".com/questions/" + _self.data.question_id;
        openSafari(url);
    });
}

question.prototype.isVisible = function(){
    if ($("#outsetScrollArea").attr('scrollTop') + $("#frontContent").height() >= $("#question" + this.data.question_id).attr('offsetTop')) {
        return true;
    } else {
        return false;
    }
}