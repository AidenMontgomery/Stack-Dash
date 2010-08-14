/*
    Source released under BSD license, copyright (c) 2010 Constructive Coding Ltd.
    See license.txt for license.
*/

function badges(apiSettings){
    this.settings = apiSettings;    
    this.badges = new Array(0);
}

badges.prototype.loadForUser = function (userID, refreshScreen) {
    $(document.getElementById("outsetScrollArea")).empty();
    
    var _self = this;
    $.ajax({
        url : this.settings.getAPIPath() + "/users/" + userID + "/badges",
        data: {'key' : this.settings.apiKey}, 
        dataType:"json",
        beforeSend:function(){$(".loader").show(); },
        complete: function(){$(".loader").hide();},
        success:function(data){
            _self.createBadges(data, _self);
            refreshScreen();
        }
    });
}

badges.prototype.createBadges = function(data, instance) {
    instance.badges.length = 0;
    var badgeCount = 0;
    $(data.badges).each(function(){
        instance.badges.length++;
        instance.badges[badgeCount] = new badge(this, "#outsetScrollArea");
        badgeCount++;
    });
    
    instance.displayBadges();
}

badges.prototype.displayBadges = function() {
    this.badges.sort(this.compareBadges);
    for (var index = 0; index < this.badges.length; index++) {
        this.badges[index].display();
    }
}

badges.prototype.compareBadges = function(a, b) {
    if (a && b) {
        if (a.badgeColor.toLowerCase() == b.badgeColor.toLowerCase()) {
            return compareByName(a,b);
        } else if (a.badgeColor.toLowerCase() == 'goldbadge') {
            return -1;
        } else if (a.badgeColor.toLowerCase() == 'silverbadge') {
            if (b.badgeColor.toLowerCase() == 'goldbadge') {
                return 1;
            } else {
                return -1
            }
        } else {
            return 1;
        }
    } else {
        return 1;
    }
}

function compareByName(a, b) {
    if (a.badgeText.toLowerCase() == b.badgeText.toLowerCase()) {
        return 0;
    } else if (a.badgeText.toLowerCase() > b.badgeText.toLowerCase()) {
        return 1;
    } else {
        return -1;
    }
}