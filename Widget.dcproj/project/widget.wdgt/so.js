/*
    Source released under BSD license, copyright (c) 2010 Constructive Coding Ltd.
    See license.txt for license.
*/

var gDoneButton;
var gInfoButton;
var gSearchButton;
var gMyScrollbar;
var badgesController, questionsController, answersController;
var foundUsers;
var bottomPanelVisible = false;
var bottomPanelShownBy;

this.SuperUserLocation = "superuser";
this.StackOverflowLocation = "stackoverflow";
this.ServerFaultLocation = "serverfault";
this.StackAppsLocation = "stackapps";

var currentSettings;

function settings() {
    this.apiVersion = "1.0";
    this.apiLocation = "stackoverflow";
    this.apiKey = "JwoZS5a5ukiHChP8-pkmcQ";
    this.userNames = [];
    this.userIDs = [];
}

settings.prototype.getAPIPath = function(){ return "http://api." + this.apiLocation + ".com/" + this.apiVersion; }

function initialise() {
    currentSettings = new settings();
	if (window.widget) {
		currentSettings.userNames[this.StackOverflowLocation] = widget.preferenceForKey("soUserName");
		currentSettings.userNames[this.SuperUserLocation] = widget.preferenceForKey("suUserName");
		currentSettings.userNames[this.ServerFaultLocation] = widget.preferenceForKey("sfUserName");
        currentSettings.userNames[this.StackAppsLocation] = widget.preferenceForKey("saUserName");
        
		currentSettings.userIDs[this.StackOverflowLocation] = widget.preferenceForKey("soUserID");
		currentSettings.userIDs[this.SuperUserLocation] = widget.preferenceForKey("suUserID");
		currentSettings.userIDs[this.ServerFaultLocation] = widget.preferenceForKey("sfUserID");
        currentSettings.userIDs[this.StackAppsLocation] = widget.preferenceForKey("saUserID");
        currentSettings.apiKey = widget.preferenceForKey("apiKey");
	}
	$('#outset').slideUp();
    this.bottomPanelVisible = false;
    gDoneButton = new AppleGlassButton(document.getElementById("doneButton"), "Done", hidePrefs);
    gInfoButton = new AppleInfoButton(document.getElementById("infoButton"), document.getElementById("front"), "black", "black", showPrefs);
    gSearchButton = new AppleGlassButton(document.getElementById("searchButton"), "Search", listUsers);
    
    if (currentSettings.userIDs[currentSettings.apiLocation] && currentSettings.userIDs[currentSettings.apiLocation] != "") {
        refreshDisplay();
    }
    
    badgesController = new badges(currentSettings);
    questionsController = new questions(currentSettings);
    answersController = new answers(currentSettings);
    
    gMyScrollbar = new AppleVerticalScrollbar(
        document.getElementById("outsetScrollbar")
    );
 
    gMyScrollArea = new AppleScrollArea(
        document.getElementById("outsetScrollArea")
    );
 
    gMyScrollArea.addScrollbar(gMyScrollbar);
    
    $("#upvote>img").attr("src", currentSettings.apiLocation + "/images/vote-arrow-up-on.png");
    $("#downvote>img").attr("src", currentSettings.apiLocation + "/images/vote-arrow-down-on.png");
    $('#openCategory').attr("src", currentSettings.apiLocation + "/images/vote-arrow-down-on.png");
}

function showPrefs() {
    hideBottomPanel();
    bottomPanelVisible = false;
    var front = document.getElementById("front");
    var back = document.getElementById("back");
 
    if (window.widget)
        widget.prepareForTransition("ToBack");
 
	loadPrefs();
	
    front.style.display="none";
    back.style.display="block";
 
    if (window.widget)
        setTimeout ('widget.performTransition();', 0);
}

function hidePrefs() {
	var front = document.getElementById("front");
	var back = document.getElementById("back");
	
    savePrefs();
    
	if (window.widget)
		widget.prepareForTransition("ToFront");
	chooseSite(currentSettings.apiLocation);
    refreshDisplay();
	
	back.style.display="none";
	front.style.display="block";
    
	if (window.widget)
		setTimeout ('widget.performTransition();', 0);
}

function savePrefs() {
	if (window.widget) {
		widget.setPreferenceForKey(currentSettings.userNames[this.StackOverflowLocation],"soUserName");
		widget.setPreferenceForKey(currentSettings.userNames[this.SuperUserLocation],"suUserName");
		widget.setPreferenceForKey(currentSettings.userNames[this.ServerFaultLocation],"sfUserName");
        widget.setPreferenceForKey(currentSettings.userNames[this.StackAppsLocation],"saUserName");
        widget.setPreferenceForKey(currentSettings.userIDs[this.StackOverflowLocation],"soUserID");
        widget.setPreferenceForKey(currentSettings.userIDs[this.SuperUserLocation],"suUserID");
        widget.setPreferenceForKey(currentSettings.userIDs[this.ServerFaultLocation],"sfUserID");
        widget.setPreferenceForKey(currentSettings.userIDs[this.StackAppsLocation],"saUserID");
	}
}

function loadPrefs() {
	$("#userName").val(currentSettings.userNames[currentSettings.apiLocation]);
}

function refreshDisplay() {
    $.ajax({
        url : currentSettings.getAPIPath() + "/users/" + currentSettings.userIDs[currentSettings.apiLocation],
        dataType : 'json',
        data : { key : currentSettings.apiKey },
        beforeSend : function(){$('.loader').show();},
        complete: function(){$('.loader').hide();},
        error: function(XMLHttpRequest, textStatus, errorThrown){alert('There was a problem retrieving data');},
        success : function(data){
            var user = data.users[0];
            $("#gravatar").attr("src", "http://www.gravatar.com/avatar/" + user.email_hash);
            $("#displayUserName").html(user.display_name);
            $("#displayLocation").html(user.location);
            $("#displayWebsite").html(user.website_url);
            $("#displayQuestionCount").html(convertLargeNumber(user.question_count));
            $("#displayAnswerCount").html(convertLargeNumber(user.answer_count));
            $("#displayViewCount").html(convertLargeNumber(user.view_count) + " Views");
            $("#displayUpVoteCount").html(convertLargeNumber(user.up_vote_count));
            $("#displayDownVoteCount").html(convertLargeNumber(user.down_vote_count));
            $("#displayAcceptRate").html(user.accept_rate);
            $("#displayReputation").html(convertLargeNumber(user.reputation));
            answersController.totalAnswerCount = user.answer_count;
            questionsController.totalQuestionCount = user.question_count;
            loadBadgeCount();
            $("#upvote>img").attr("src", currentSettings.apiLocation + "/images/vote-arrow-up-on.png");
            $("#downvote>img").attr("src", currentSettings.apiLocation + "/images/vote-arrow-down-on.png");
            $('#openCategory').attr("src", currentSettings.apiLocation + "/images/vote-arrow-down-on.png");
        }
    });
}

function loadBadgeCount() {
    $.ajax({
        url: currentSettings.getAPIPath() + "/users/" + currentSettings.userIDs[currentSettings.apiLocation] + "/badges/",
        data: { key : currentSettings.apiKey },
        dataType: 'json',
        beforeSend : function(){$('.loader').show();},
        complete: function(){$('.loader').hide();},
        success : function(data){
            var badgeCount = 0;
            for ( i = 0; i < data.badges.length; i++){
                badgeCount += data.badges[i].award_count;
            }
            $("#displayBadgeCount").html(convertLargeNumber(badgeCount));
        }
    });
}

function listUsers() {
    if ($("#userName").val() != "") {
        currentSettings.apiLocation = $("#siteToSearch :selected").val();
        $.ajax({
            dataType : "json",
            data : { filter: $("#userName").val(), key : currentSettings.apiKey },
            url : currentSettings.getAPIPath() + "/users",
            beforeSend : function() { $('#searchResults').hide();$('.loader').show(); },
            complete: function(){$('.loader').hide();},
            error: function(xhr, message, status){
                var test = 1;
            },
            success : displayUserList
        });
    }
}

function displayUserList(data) {
    foundUsers = data.users;
    var dropDownList = $("#userList").change(function() {
            displaySelectedUserDetails(this.selectedIndex - 1);
        }).empty()[0];
        dropDownList.add(new Option("Select a user...", 0), null);
        $.each(data.users, function(index, user) {
            var newOption = new Option(user.display_name, user.user_id);
            dropDownList.add(newOption, null);
        });
    $('#searchResults').show();
}

function displaySelectedUserDetails(index){
    if (index >= 0) {
        var user = foundUsers[index];
        displayUserDetails(user);
    }
}

function displayUserDetails(user) {
    $("#userDetails").show();
    $("#location").val(user.location);
    $("#website_url").val(user.website_url);
    $("#searchGravatar").attr("src", "http://www.gravatar.com/avatar/" + user.email_hash)
}

function useSelectedUser() {
    var selectedUser = foundUsers[$("#userList").attr("selectedIndex") - 1];
    currentSettings.userNames[currentSettings.apiLocaiton] = selectedUser.display_name;
    currentSettings.userIDs[currentSettings.apiLocation] = selectedUser.user_id;
    $("#userName").val(currentSettings.userNames[currentSettings.apiLocaiton]);
    $("#userDetails").hide();
    $("#location").val("");
    $("#website_url").val("");
    $('#searchResults').hide();
}

function openSite() {
    if (window.widget) {
        widget.openURL($("#displayWebsite").html());
    }
}

function goToWebSite(address) {
    if (window.widget) {
        widget.openURL("http://" + address);
    }
}

function showBottomPanel() {
    if (!this.bottomPanelVisible) {
        window.resizeBy(0, 200);
        $('#outset').height('200px').slideDown('slow');
        $('#openCategory').show();
       this.bottomPanelVisible = true;
    }
}

function hideBottomPanel() {
    if (this.bottomPanelVisible) {
        this.bottomPanelVisible = false;
        $('#outset').slideUp('slow', function(){window.resizeBy(0, -200);});
        $('#openCategory').hide();
    }
}

function placeOpenCategory(controlName) {
    var leftOffset = 75;
    var padding = 25;
    if (controlName == 'questions'){
        leftOffset = padding;
    } else if (controlName == 'answers') {
        leftOffset = leftOffset + padding;
    } else if (controlName == 'badges') {
        leftOffset = (leftOffset * 2) + padding;
    }
    
    $('#openCategory').animate({left: leftOffset}, 500);
}

function toggleBottomPanel(controlName, loadData) {
    if (bottomPanelVisible) {
        if (bottomPanelShownBy && bottomPanelShownBy == controlName) {
            hideBottomPanel();
            bottomPanelVisible = false;
        } else {
            loadData();
            bottomPanelShownBy = controlName;
            placeOpenCategory(controlName);
        }
    } else {
        bottomPanelShownBy = controlName;
        showBottomPanel();
        loadData();
        bottomPanelVisible = true;
        placeOpenCategory(controlName);
    }
}

function loadQuestions() {
    questionsController.loadForUser(currentSettings.userIDs[currentSettings.apiLocation], refreshScrollArea);
}

function loadAnswers() {
    answersController.loadForUser(currentSettings.userIDs[currentSettings.apiLocation], refreshScrollArea);
}

function loadBadges() {
    badgesController.loadForUser(currentSettings.userIDs[currentSettings.apiLocation], refreshScrollArea);
}

function refreshScrollArea() {
    gMyScrollArea.refresh();
}

function chooseSite(siteChosen) {
    if (currentSettings.userIDs[siteChosen]) {
        currentSettings.apiLocation = siteChosen;
        $(".selectedOption").removeClass("selectedOption");
        if(siteChosen == this.StackOverflowLocation){
            $("#chooseSO").addClass("selectedOption");
        } else if (siteChosen == this.ServerFaultLocation) {
            $("#chooseSF").addClass("selectedOption");
        } else if (siteChosen == this.SuperUserLocation) {
            $("#chooseSU").addClass("selectedOption");
        } else if (siteChosen == this.StackAppsLocation) {
            $("#chooseSA").addClass("selectedOption");
        }
        hideBottomPanel();
        refreshDisplay();
    }
}