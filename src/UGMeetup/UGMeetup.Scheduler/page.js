$(function(){

	var EventViewModel = function()
	{
		var self = this;

		self.title = ko.observable();
		self.description = ko.observable();
		self.startTime = ko.observable();
		self.endTime = ko.observable();
		self.location = ko.observable();
		self.twitterHashTag = ko.observable();
		self.sessions = ko.observableArray();
	};

	var SessionViewModel = function()
	{
		var self = this;

		self.title = ko.observable();
		self.description = ko.observable();
		self.startTime = ko.observable();
		self.endTime = ko.observable();
		self.speakers = ko.observableArray();
		self.schedule = ko.computed(function(){
			return moment(self.startTime()).format('MMMM Do YYYY, h:mm a') + " - " + moment(self.endTime()).format('MMMM Do YYYY, h:mm a');
		}, this);

	};

	var SpeakerViewModel = function()
	{
		var self = this;

		self.name = ko.observable();
		self.email = ko.observable();
		self.company = ko.observable();
		self.img = ko.computed(function(){
			var hash = CryptoJS.MD5(self.email());
			var url = "http://www.gravatar.com/avatar/";
			return 'url('+ url + hash + ')';
		});
		self.bio = ko.observable();
		self.twitter = ko.observable();
		self.twitterUrl = ko.computed(function(){
			return 'http://twitter.com/' + self.twitter();
		});
	};

	var PageViewModel = function()
	{

		var self = this;
		self.isLoggedIn = ko.observable(false);
		self.enableAddSession = ko.observable(false);
		self.newEvent = ko.observable(new EventViewModel());
		self.sessions = ko.observableArray();
		self.newSession = ko.observable(new SessionViewModel());

		self.assignedSpeakers = ko.observableArray();
		self.newSpeaker = ko.observable(new SpeakerViewModel());

		self.enableNoSpeakerInfo = ko.observable(true);
		self.enableNoSessionInfo = ko.observable(true);
		self.addSession = function(){ 
			self.enableAddSession(true);

		}
		self.saveSession = function(){
			self.sessions.push(self.newSession());
			self.newSession(new SessionViewModel());
			self.assignedSpeakers = ko.observableArray();
			self.enableAddSession(false);
			self.enableNoSessionInfo(false);
		}

		self.removeSession = function(){
			self.sessions.remove(this);
			if(self.sessions().length == 0){
				self.enableNoSessionInfo(true);
			}
		}
		self.saveNewSpeaker = function(){
			self.assignedSpeakers.push(self.newSpeaker());
			self.newSpeaker(new SpeakerViewModel());
			self.enableNoSpeakerInfo(false);
		}

		self.removeSpeaker = function(){
			self.assignedSpeakers.remove(this);
			if(self.assignedSpeakers().length==0)
				self.enableNoSpeakerInfo(true);
		}
	};

	var pvm = new PageViewModel();
	function handleError(error) {
		var text = error + (error.request ? ' - ' + error.request.status : '');
		$('#errorlog').append($('<li>').text(text));
	}

	function logIn() {

		Parse.FacebookUtils.logIn('email', {
			success: function(user) {
				if (!user.existed()) {
					console.log("User signed up and logged in through Facebook!");
				} else {
					console.log("User logged in through Facebook!");

				}
				FB.api('/me', function(response) {
					// var username = response.name;
					// $("#login-name").text(username);
					Parse.User.current().save({
						username: response.name,
						email: response.email
					},
              		{
              			success: function(gameTurnAgain) {
                    	// update ui
                	},
                		error: function(gameTurnAgain, error) {
                    	console.log(error);
                	}});
				});
		
				refreshAuthDisplay();

			},
			error: function(user, error) {
				alert("User cancelled the Facebook login or did not fully authorize.");
			}
		});

	}

	function logOut() {
		Parse.User.logOut();
		refreshAuthDisplay();
		$('#summary').html('<strong>You must login to access data.</strong>');
	}

	function refreshAuthDisplay() {
		var currentUser = Parse.User.current();
	if (currentUser) {
				
			$("#login-name").text(Parse.User.current().get("username"));

			pvm.isLoggedIn(true);
			$('#summary').html('');
		}
		else { 
			pvm.isLoggedIn(false);
		}
		
		$("#logged-in").toggle(pvm.isLoggedIn());
		$("#logged-out").toggle(!pvm.isLoggedIn());
	}

	refreshAuthDisplay();
	$('#summary').html('<strong>You must login to access data.</strong>');          
	$("#logged-out button").click(logIn);
	$("#logged-in button").click(logOut);

	ko.applyBindings(pvm);

});