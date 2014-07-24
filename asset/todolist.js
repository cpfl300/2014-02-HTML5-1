var ENTER_KEYCODE = 13;

function addTODO(e){
	if(e.keyCode == ENTER_KEYCODE){
		//만들어서 추가 함
		var data = {
			todo: document.querySelector("#new-todo").value
		};

		var template = 
		"<li class=\"appending\">" +
			"<div class=\"view\">" +
				"<input class=\"toggle\" type=\"checkbox\">" +
				"<label>{{todo}}</label>" +
				"<button class=\"destroy\"></button>"+
			"</div>" +
		"</li>";

		var result = Mustache.to_html(template, data);
		document.querySelector("#todo-list").insertAdjacentHTML('afterBegin', result);
		//prepend 구현

		var appended = document.querySelector("#todo-list").firstElementChild;
		appended.offsetHeight;
		appended.className = "";
		//추가 시 opacity조정
		/*
		appended.style.opacity = 0;
		var i = 0;
		var key = setInterval(function(){
			if(i===50){
				clearInterval(key);
			}else{
				appended.style.opacity = i * 0.02;	
			}
			i++;
		}, 16);
		*/
		document.querySelector("#new-todo").value = "";	
	}
}

// 체크박스 
function completedTODO(e){
	// input[type=checkbox]의 엘리먼트에서 checked라는 속성 확인!
	var input = e.target;
	var li = input.parentNode.parentNode;
	if(input.checked){
		//li ele에 completed 클래스를 추가
		li.className = "completed";
	}else{
		li.className = "";
	}
	// e.target은 이벤트를 실제로 발생시킨 ele, e.currentTarget은 이벤트를 바인딩한 ele

	e.target
}

// 삭제버튼
function removeTODO(e){
	var li = e.target.parentNode.parentNode;
	li.className = "deleting";

	li.addEventListener("transitionend", function(){
		li.parentNode.removeChild(li);
	})
}

function liClicked(e){
	if(e.target.tagName === "INPUT"){
		completedTODO(e);
	} else if (e.target.tagName === "BUTTON"){
		removeTODO(e)
	}
}

// #keydown (enter) 이벤트에 li를 추가하는 함수를 등록
document.addEventListener("DOMContentLoaded", function(){
	document.querySelector("#new-todo").addEventListener("keydown", addTODO);
	document.querySelector('ul').addEventListener("click", liClicked);
});