/*
    Source released under BSD license, copyright (c) 2010 Constructive Coding Ltd.
    See license.txt for license.
*/

function questions(apiSettings){
    this.settings = apiSettings; 
    this.questions = new Array(0);
    this.page = 0;
    this.pagesize = 10;
    this.totalQuestionCount = 0;
}

questions.prototype.loadForUser = function (userID, refreshScreen) {
    $(document.getElementById("outsetScrollArea")).empty();
    this.currentUserID = userID;
    this.refreshScreen = refreshScreen;
    this.questions.length = 0;
    this.page = 0;
    this.loadPage(++this.page);
}

questions.prototype.loadPage = function(page) {
    var _self = this;
    
    if (this.totalQuestionCount > this.questions.length) {
        $.ajax({
            url : this.settings.getAPIPath() + "/users/" + _self.currentUserID + "/questions",
            data: {'key' : this.settings.apiKey, 'page' : page, 'pagesize' : this.pagesize },
            dataType:"json",
            beforeSend:function(){$(".loader").show(); },
            complete: function(){$(".loader").hide();},
            success:function(data){
                _self.createQuestions(data, _self);
                    _self.refreshScreen();
                    $("#outsetScrollArea").unbind("scroll").bind("scroll", _self.scrolling);
            }
        });
    }
}

questions.prototype.createQuestions = function(data, instance) {
    var questionCount = instance.questions.length;
    $(data.questions).each(function(){
        instance.questions.length++;
        instance.questions[questionCount] = new question(this, "#outsetScrollArea");
        questionCount++;
    });
    
    instance.displayQuestions();
}

questions.prototype.displayQuestions = function() {
    for (var index = 0; index < this.questions.length; index++) {
        this.questions[index].display();
        this.questions[index].bindClick();
    }
}

questions.prototype.scrolling = function() {
    if (questionsController.questions[questionsController.questions.length - 1].isVisible()) {
        questionsController.stopScrollChecking();
        questionsController.loadPage(++questionsController.page);
    }
}

questions.prototype.stopScrollChecking = function() {
    $("#outsetScrollArea").unbind("scroll");
}