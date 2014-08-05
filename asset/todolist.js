// Ajax

var TODOSync = {
	get: function(callback){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://ui.nhnnext.org:3333/cpfl300", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e){
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send(null);
	}, 
	add: function(todo, callback){
		var xhr = new XMLHttpRequest();
		xhr.open("PUT", "http://ui.nhnnext.org:3333/cpfl300", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e){
			callback(JSON.parse(xhr.responseText));
			//DOM추가
		});
		xhr.send("todo=" + todo);
	},
	completed: function(param, callback){
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://ui.nhnnext.org:3333/cpfl300/"+param.key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e){
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send("completed=" + param.completed);
	},
	remove: function(param, callback){
		var xhr = new XMLHttpRequest();
		xhr.open("DELETE", "http://ui.nhnnext.org:3333/cpfl300/"+param.key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e){
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send("completed=" + param.completed);
	}
}

var TODO = {
	ENTER_KEYCODE: 13,
	template :"<li class=\"{{className}}\" data-key=\"{{key}}\">" +
					"<div class=\"view\">" +
						"<input class=\"toggle\" type=\"checkbox\">" +
						"<label>{{todo}}</label>" +
						"<button class=\"destroy\"></button>"+
					"</div>" +
				"</li>",
	init: function(){
		TODOSync.get(function(json){
			var result;
			data = {className: ""};
			for(var i = 0 ; i < json.length; i++){
				data.todo = json[i].todo;
				data.key = json[i].id;
				result = Mustache.to_html(TODO.template, data);
				document.querySelector("#todo-list").insertAdjacentHTML('afterBegin', result);
			}

		});
		document.addEventListener("DOMContentLoaded", function(){
			document.querySelector("#new-todo").addEventListener("keydown", this.addTODO.bind(this));
			document.querySelector('ul').addEventListener("click", this.liClicked.bind(this));
		}.bind(this));
	},
	addTODO: function (e){
		if(e.keyCode == this.ENTER_KEYCODE){

			var data = {
				todo: document.querySelector("#new-todo").value,
				className: "appending"
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