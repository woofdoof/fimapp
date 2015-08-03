var myApp = angular.module('myApp', ['ionic', 'firebase']);
var ref = null; 
var auth = null;

myApp.run(function($ionicPlatform, $rootScope, $firebaseAuth, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    ref = new Firebase("https://fimapp.firebaseio.com/");
    auth = $firebaseAuth(ref);

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState){

    	if(toState.name === "login"){

    		window.location.assign(toState);
      		window.location.reload(true);
    	} 

    	var requireLogin = toState.data.requireLogin;
    	var notAuth = !auth.$getAuth();

    	if(requireLogin && notAuth){
    		
    		event.preventDefault();
    		$state.go("login");
    		console.log("inside requireLogin if-clause, et all");
    	}
    });

  });
});

myApp.factory("dragImage", function(){

	return {
		move: function(event, container){

			var pageX = event.gesture.center.pageX;
			var pageY = event.gesture.center.pageY;
			var rect = container.getBoundingClientRect();

			var el = event.srcElement;
			var midPointX = el.width/2;
			var midPointY = el.height/2;	

			if(pageX < rect.right && pageX > rect.left 
				&& pageY < rect.bottom && pageY > rect.top){

				if(el.id != "topview") {
					el.style.left = (pageX - rect.left - midPointX) + "px";
				}
				el.style.top = (pageY - rect.top - midPointY) + "px";
			}
		}	
	};

});

myApp.factory("defaultPosition", function(){

	return {

		move: function(arr){

			angular.forEach(arr, function(a){
				var tempEl = document.getElementById(a.name);
				tempEl.style.top = (a.defaultTop) + "px";
				tempEl.style.left = (a.defaultLeft) + "px";
			});
		}
	};
});

myApp.factory("checkLoginErrors", function(){

	return {

		err: function(showErrorsBoolean, errorsMessage){

			var err = {};
			err.val = showErrorsBoolean;
			err.message = errorsMessage;
			return err;
		}
	}
});

myApp.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
	.state("login", {
		url: "/login",
		templateUrl: "templates/login.html",
		controller: "LoginController",
		data: {
			requireLogin: false
		}
	})
	.state("app", {
		url: "/app",
		abstract: true,
		templateUrl: "templates/sidemenu.html",
		controller: "AppController",
		data: {
			requireLogin: true
		}
	})	
	.state("app.home", {
		url: "/home",
		views: {
			"menuContent": {
				templateUrl: "templates/home.html",
				controller: "HomeController"
			}
		}
	})	
	.state("app.todos", {
		url: "/todos",
		views: {
			"menuContent": {
				templateUrl: "templates/todo.html",
				controller: "TodoController"
			}
		}
	})	
	.state("app.standards", {
		url: "/standards",
		views: {
			"menuContent": {
				templateUrl: "templates/standards.html",
				controller: "StandardsController"
			}
		}
	})	
	.state("app.reports", {
		url: "/reports",
		views: {
			"menuContent": {
				templateUrl: "templates/reports.html"
			}
		}
	})	
	.state("app.settings", {
		url: "/settings",
		views: {
			"menuContent": {
				templateUrl: "templates/settings.html",
				controller: "SettingsController"
			}
		}
	})	
	.state("app.settings.drive", {
		url: "/drive",
		views: {
			"tab-drive": {
				templateUrl: "templates/settingsDrive.html",
				controller: "DriveController"
			}
		}
	})	
	.state("app.settings.cut", {
		url: "/cut",
		views: {
			"tab-cut": {
				templateUrl: "templates/settingsCut.html",
				controller: "CutController"
			}
		}
	})	
	.state("app.settings.adjust", {
		url: "/adjust",
		views: {
			"tab-adjust": {
				templateUrl: "templates/adjust.html",
				controller: "AdjustController"
			}
		}
	})	
	.state("app.settings.trash", {
		url: "/trash",
		views: {
			"tab-trash": {
				templateUrl: "templates/trash.html",
				controller: "TrashController"
			}
		}
	})	
	.state("app.communication", {
		url: "/communication",
		views: {
			"menuContent": {
				templateUrl: "templates/communication.html",
				controller: "CommunicationController"
			}
		}
	})
	.state("app.exit", {
		url: "/exit",
		views: {
			"menuContent": {
				templateUrl: "templates/exit.html",
				controller: "ExitController"
			}
		}
	})	

	$urlRouterProvider.otherwise("login");
});


