var ENTER_KEYCODE = 13;

function makeTODO(todo){
	//template library로 개선하기
	var li = document.createElement("li");
	var div = document.createElement("div");
	div.className = "view";
	var input = document.createElement("input");
	input.className = "toggle";
	input.setAttribute("type", "checkbox");
	var label = document.createElement("label");
	label.innerText = todo;
	var button = document.createElement("button");
	button.className = "destroy";

	div.appendChild(input);
	div.appendChild(label);
	div.appendChild(button);

	li.appendChild(div);

	return li;
}

function addTODO(e){
	if(e.keyCode == ENTER_KEYCODE){
		//만들어서 추가 함

		var input ={
			inputData: document.querySelector("#new-todo").value
		};

		var template = 
		"<li class=\"{}\">" +
			"<div class=\"view\">" +
				"<input class=\"toggle\" type=\"checkbox\" {}>" +
				"<label>{{inputData}}</label>" +
				"<button class=\"destroy\"></button>"+
			"</div>" +
		"</li>";

		var result = Mustache.to_html(template, input);
		document.querySelector("#todo-list").insertAdjacentHTML('afterBegin', result);

		document.querySelector("#new-todo").value = "";	
	}
}

// #keydown (enter) 이벤트에 li를 추가하는 함수를 등록
document.addEventListener("DOMContentLoaded", function(){
	document.querySelector("#new-todo").addEventListener("keydown", addTODO);
});