myApp.controller("LoginController", function($scope, $state, checkLoginErrors){

	$scope.username = "dude@fimapp.com";
	$scope.password = "pass";
	$scope.inProgress = false;


	$scope.login = function(username, password){

		$scope.errors = checkLoginErrors.err(false, "");
		var target = document.getElementById("spinner");
		var spinner = new Spinner().spin(target);

		$scope.message = "Please wait...";
		$scope.inProgress = true;

		auth.$onAuth(function(){
			console.log("auth change");
		});

		auth.$authWithPassword({
			email: username,
			password: password
		})
		.then(function(authData){
			$state.go("app.home");
		})
		.catch(function(error){
			$scope.inProgress = false;
			$scope.errors = checkLoginErrors.err(true, error.message);
		});
	};

	$scope.register = function(username, password){

		auth.$createUser({email: username, password: password})
		.then(function(){
			$scope.login(username, password);
		})
		.catch(function(error){
			$scope.inProgress = false;
			$scope.errors = checkLoginErrors.err(true, error.message);
		});
	};
});

myApp.controller("AppController", function($scope, $state, $ionicPopup, $http){

	var pages = [];
	pages.push({name: "home", ref: "home"});
	pages.push({name: "todos", ref: "todos"});
	pages.push({name: "standards", ref: "standards"});
	pages.push({name: "reports", ref: "reports"});
	pages.push({name: "settings", ref: "settings"});
	pages.push({name: "exit", ref: "exit"});
	//pages.push({name: "communication", ref: "communication"});

	$scope.pages = pages;
	$scope.authName = auth.$getAuth().password.email.split("@")[0];

	$scope.errorModal = function(){

		var alertPopup = $ionicPopup.show({
		title: "Errors",
		templateUrl: "templates/errors.html",
		buttons:[{text: "close"}]
       });
	};

	//temperature
	if(navigator.geolocation){

		navigator.geolocation.getCurrentPosition(

			function(pos){

				$scope.$apply(function(){
					var lat = pos.coords.latitude;
					var lng = pos.coords.longitude;
					var url = "https://api.forecast.io/forecast/" + "cb8db7ab1a1bb2979c4a45885737cdf9" + "/";
					$http.jsonp(url + lat + "," + lng + "?callback=JSON_CALLBACK'" + "&units=si").
					success(function (data, status, headers, config) {
						console.log(data);
						var temperature = Math.round(data.currently.temperature);
						$scope.temperature = temperature;
					});

				});
			}, posError
			);
	}

	function posError(err){
		console.log(err.message);
		if(err.code === err.PERMISSION_DENIED){
			console.log("err code permission denied");
		}
	}
});

myApp.controller("HomeController", function($scope){

	$scope.collection = ["nolock", "locktop", "lockmiddle", "lockbottom"];

	$scope.selectedIndex = 0;

	$scope.itemClicked = function($index){
		$scope.selectedIndex = $index;
	};
});

myApp.controller("TodoController", function($scope,
	$firebase){

	var todo = {};
	$scope.todo = todo;

	$scope.initTodos= function(){
		var userAuth = auth.$getAuth();
		if(userAuth){
			var userSync = $firebase(ref.child("users").child(userAuth.uid));
			var profileObj = userSync.$asObject();
			profileObj.$bindTo($scope, "data");
		}
	};

	$scope.completeTodo = function(index){
		$scope.data.todos[index].completed = !$scope.data.todos[index].completed;
	};

	$scope.removeTodo = function(index){
		$scope.data.todos.splice(index, 1);
	};

	$scope.createTodo = function(){

		var t = {title: $scope.todo.new, completed: false};
		if(!$scope.data.hasOwnProperty("todos")){
			$scope.data.todos = [];
		}
		$scope.data.todos.splice(0, 0, t);
		$scope.todo.new = null;
	};
});

myApp.controller("StandardsController", function($scope, $firebase){

	var standard = {};
	$scope.standard = standard;
	var companies = [];

	var obj = $firebase(ref.child("standards")).$asObject();

	obj.$loaded().then(function(){

		angular.forEach(obj, function(value, key){
			companies.push(key);
		});
		$scope.companies = companies;
	});

	$scope.search = function(){

		var searched = $scope.standard.searched;
		if(searched.length > 0){
			searched = searched.toLowerCase();
			var sync = $firebase(ref.child("standards").child(searched));
			var obj = sync.$asArray();
			$scope.stans = obj;
			$scope.searched = searched;
		}
		$scope.standard.searched = null;
	};

	$scope.range = function(num){
		var arr = [];
		for(var i = 0; i < num; ++i){
			arr.push(i);
		}
		return arr;
	};

	$scope.color = function(num){
		if(num === 3) return "green";
		if(num === 2) return "yellow";
		if(num === 1) return "red";
	};
});

myApp.controller("SettingsController", function(){
});


myApp.controller("DriveController", function($scope, dragImage, defaultPosition){

	var driveIms = [
		{name: "topview", defaultTop: 0, defaultLeft: 0},
		{name: "map", defaultTop: 500/2, defaultLeft: 500/5}
	];

	defaultPosition.move(driveIms);

	$scope.onIonicDrag2 = function(e){
		var el = document.getElementById("imageContainer2");
		dragImage.move(e, el);
	};
});

myApp.controller("CutController", function($scope, dragImage, defaultPosition){

	var cutIms = [
		{name: "topview", defaultTop: 0, defaultLeft: 0},
		{name: "closeup", defaultTop: 500/2, defaultLeft: 500/3},
		{name:"diameter", defaultTop: 500/2, defaultLeft: 500/1.3},
		{name: "length", defaultTop: 500/2, defaultLeft: 500/8}
	];

	defaultPosition.move(cutIms);

	$scope.onIonicDrag1 = function(e){
		var el = document.getElementById("imageContainer1");
		dragImage.move(e, el);
	};
});


myApp.controller("CommunicationController", function(){
});

myApp.controller("ExitController", function($scope, $state){

	$scope.exit = function(){
		auth.$unauth();
		$state.go("login");
	};
});

myApp.controller("TrashController", function(){
});

myApp.controller("AdjustController", function(){
});
