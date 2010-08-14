/*
    Source released under BSD license, copyright (c) 2010 Constructive Coding Ltd.
    See license.txt for license.
*/

function answers(apiSettings){
    this.settings = apiSettings;
    this.answers = new Array(0);
    this.page = 0;
    this.pagesize = 30;
    this.totalAnswerCount = 0;
}

answers.prototype.loadForUser = function (userID, refreshScreen) {
    $(document.getElementById("outsetScrollArea")).empty();
    this.currentUserID = userID;
    this.refreshScreen = refreshScreen;
    this.answers.length = 0;
    this.page = 0;
    this.loadPage(++this.page);
}

answers.prototype.loadPage = function (page) {
    var _self = this;
    if (this.totalAnswerCount > this.answers.length) {
        $.ajax({
            url : this.settings.getAPIPath() + "/users/" + _self.currentUserID + "/answers",
            data: {'key' : this.settings.apiKey, 'page' : page}, 
            dataType:"json",
            beforeSend:function(){$(".loader").show(); },
            complete: function(){$(".loader").hide();},
            success:function(data){
                _self.createAnswers(data, _self);
                _self.refreshScreen();
                $("#outsetScrollArea").unbind("scroll").bind("scroll", _self.scrolling);
            }
        });
    }
}

answers.prototype.createAnswers = function(data, instance) {
    var index = instance.answers.length;
    $(data.answers).each(function(){
        instance.answers.length++;
        instance.answers[index] = new answer(this, "#outsetScrollArea");
        index++;
    });
    
    instance.displayAnswers();
}

answers.prototype.displayAnswers = function() {
    for (var index = 0; index < this.answers.length; index++) {
        this.answers[index].display();
        this.answers[index].bindClick();
    }
}

answers.prototype.scrolling = function() {
    if (answersController.answers[answersController.answers.length - 1].isVisible()) {
        answersController.stopScrollChecking();
        answersController.loadPage(++answersController.page);
    }
}

answers.prototype.stopScrollChecking = function() {
    $("#outsetScrollArea").unbind("scroll");
}