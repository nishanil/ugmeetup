$(function(){

	var Event = function()
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

	var Session = function()
	{
		var self = this;

		self.title = ko.observable();
		self.description = ko.observable();
		self.startTime = ko.observable();
		self.endTime = ko.observable();
		self.speakers = ko.observableArray();
		self.schedule = ko.computed(function(){
			//console.log(self.startTime() + " - " + self.endTime());
			return moment(self.startTime()).format('MMMM Do YYYY, h:mm a') + " - " + moment(self.endTime()).format('MMMM Do YYYY, h:mm a');
		}, this);

	};

	var Speaker = function()
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
		self.newEvent = ko.observable(new Event());
		self.sessions = ko.observableArray();
		self.newSession = ko.observable(new Session());

		self.assignedSpeakers = ko.observableArray();
		self.newSpeaker = ko.observable(new Speaker());

		self.enableNoSpeakerInfo = ko.observable(true);
		self.enableNoSessionInfo = ko.observable(true);
		self.addSession = function(){ 
			self.enableAddSession(true);

		}

		self.saveSession = function(){
			self.sessions.push(self.newSession());
			self.newSession(new Session());
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
			self.newSpeaker(new Speaker());
			self.enableNoSpeakerInfo(false);
		}

		self.removeSpeaker = function(){
			self.assignedSpeakers.remove(this);
			if(self.assignedSpeakers().length==0)
				self.enableNoSpeakerInfo(true);
		}



	};

	var pvm = new PageViewModel();
	var config = new Config();
	var client = new WindowsAzure.MobileServiceClient(config.url, config.key);

	function handleError(error) {
		var text = error + (error.request ? ' - ' + error.request.status : '');
		$('#errorlog').append($('<li>').text(text));
	}

	function logIn() {
		client.login("facebook").then(refreshAuthDisplay, function(error){
			alert(error);
		});
	}

	function logOut() {
		client.logout();
		refreshAuthDisplay();
		$('#summary').html('<strong>You must login to access data.</strong>');
	}

	function refreshAuthDisplay() {
		var isLoggedIn = client.currentUser !== null;
		$("#logged-in").toggle(isLoggedIn);
		$("#logged-out").toggle(!isLoggedIn);
		if (isLoggedIn) {
			$("#login-name").text(client.currentUser.userId);
			pvm.isLoggedIn(true);
			$('#summary').html('');
		}
		else { 
			pvm.isLoggedIn(false);
		}
	}

	refreshAuthDisplay();
	$('#summary').html('<strong>You must login to access data.</strong>');          
	$("#logged-out button").click(logIn);
	$("#logged-in button").click(logOut);

	ko.applyBindings(pvm);

});