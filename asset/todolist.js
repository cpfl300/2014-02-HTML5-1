var TODOSync = {
	init: function(){
		window.addEventListener("online", this.onofflineListener);
		window.addEventListener("offline", this.onofflineListener);
	},
	onofflineListener : function(){
		document.querySelector("#header").classList[navigator.onLine? "remove": "add"]("offline");
		if(navigator.onLine){
			// 서버로 싱크 맞추기
		}
	},
	url: "http://ui.nhnnext.org:3333/cpfl300/",
	xhrBuilder: function(map){
		var xhr = new XMLHttpRequest();
		xhr.open(map.method, map.url, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e){
			map.callback(JSON.parse(xhr.responseText));
		});
		xhr.send(map.send);

	},
	get: function(callback){
		this.xhrBuilder({
			method: "GET", 
			url: this.url, 
			callback: callback, 
			send: null});
	}, 
	add: function(todo, callback){
		if(navigator.onLine){
			this.xhrBuilder({
				method:"PUT", 
				url: this.url, 
				callback: callback, 
				send: "todo="+todo});
		} else {
			// data 클라이언트에 저장 ->  localStorage, indexedDB, websql
		}
	},
	completed: function(param, callback){
		this.xhrBuilder({
			method:"POST", 
			url: this.url+param.key, 
			callback: callback, 
			send: "completed=" + param.completed});
	},
	remove: function(param, callback){
		this.xhrBuilder({
			method:"DELETE", 
			url: this.url+param.key, 
			callback: callback, 
			send: null});
	}
}

var TODO = {
	ENTER_KEYCODE: 13,
	selectedIndex : 0,
	template :"<li class=\"{{className}}\" data-key=\"{{key}}\">" +
					"<div class=\"view\">" +
						"<input class=\"toggle\" type=\"checkbox\" {{isChecked}}>" +
						"<label>{{todo}}</label>" +
						"<button class=\"destroy\"></button>"+
					"</div>" +
				"</li>",
	init: function(){
		TODOSync.get(function(json){
			var result;
			data = {className: ""};
			for(var i = json.length-1 ; i >= 0; i--){
				data.todo = json[i].todo;
				data.key = json[i].id;
				data.className = json[i].completed === 0 ? "" : "completed";
				data.isChecked = data.className === "completed" ? "checked" : "";

				result = Mustache.to_html(TODO.template, data);
				document.querySelector("#todo-list").insertAdjacentHTML('afterBegin', result);				
			}

		});
		document.addEventListener("DOMContentLoaded", function(){
			document.querySelector("#new-todo").addEventListener("keydown", this.addTODO.bind(this));
			document.querySelector('#todo-list').addEventListener("click", this.liClicked.bind(this));
			document.querySelector('#filters').addEventListener("click", this.changeStateFilter.bind(this));
			window.addEventListener("popstate", this.changeURLFilter.bind(this));
		}.bind(this));
	},
	changeURLFilter : function(e){
		if(e.state){
			var method = e.state.method;
			this[method+"View"]();
		} else {
			this.allView();
		}
	},
	changeStateFilter : function(e){
		e.preventDefault();

		var target = e.target;
		var tagName = target.tagName.toLowerCase();
		if(tagName == "a"){
			var href = target.getAttribute("href");
			if(href === "index.html"){
				this.allView();
				history.pushState({"method":"all"}, null, "index.html");
			} else if(href === "active"){
				this.activeView();
				history.pushState({"method":"active"}, null, "active");
			} else if(href === "completed"){
				this.completedView();
				history.pushState({"method":"completed"}, null, "completed");
			}
		}
	},
	allView : function(){
		document.querySelector("#todo-list").className = "";
		this.selectNavigator(0);
	},
	activeView : function(){
		document.querySelector("#todo-list").className = "all-active";
		this.selectNavigator(1);
	},
	completedView : function(){
		document.querySelector("#todo-list").className = "all-completed";
		this.selectNavigator(2);
	},
	selectNavigator : function(index){
		var navigatorList = document.querySelectorAll("#filters a");
		navigatorList[this.selectedIndex].classList.remove("selected");
		navigatorList[index].classList.add("selected");
		this.selectedIndex = index;
	},
	addTODO: function (e){
		if(e.keyCode == this.ENTER_KEYCODE){

			var data = {
				todo: document.querySelector("#new-todo").value,
				className: "appending",
				isChecked: ""
			};

			TODOSync.add(data.todo, function(json){
				data.key = json.insertId;

				var result = Mustache.to_html(TODO.template, data);
				document.querySelector("#todo-list").insertAdjacentHTML('afterBegin', result);
				//prepend 구현

				var appended = document.querySelector("#todo-list").firstElementChild;
				appended.offsetHeight;
				appended.className = "";
				
				document.querySelector("#new-todo").value = "";
			});


				
		}
	},
	completed: function (e){
		// e.target은 이벤트를 실제로 발생시킨 ele, e.currentTarget은 이벤트를 바인딩한 ele
		var input = e.target;
		var li = input.parentNode.parentNode;
		var completed = input.checked? "1" : "0";
		
		TODOSync.completed({
			"key" : li.dataset.key,
			"completed" : completed

		}, function(){
			// input[type=checkbox]의 엘리먼트에서 checked라는 속성 확인!
			if(completed ==="1"){
				//li ele에 completed 클래스를 추가
				li.className = "completed";
			}else{
				li.className = "";
			}
		});
		

	},
	remove: function (e){
		var li = e.target.parentNode.parentNode;

		TODOSync.remove({
			"key" : li.dataset.key
		}, function(){
			li.className = "deleting";

			li.addEventListener("transitionend", function(e){
				var li = e.target;
				if(li.parentNode &&li.tagName.toUpperCase()=='LI'){
					li.parentNode.removeChild(li);	
				}
			}, false);
		});
	}, 
	liClicked: function (e){
		if(e.target.tagName.toUpperCase() === "INPUT"){
			this.completed(e);
		} else if (e.target.tagName.toUpperCase() === "BUTTON"){
			this.remove(e)
		}
	}
};

TODO.init();
TODOSync.init();