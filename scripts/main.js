const $studentsSectionLeft = document.querySelector('.body__content__left');
const $studentsSectionRight = document.querySelector('.body__content__right');

const $studentsTemplate = document.querySelector('#studentsTemplate').content;

function renderObject(studentsSection, item){
	let $studentElement = $studentsTemplate.cloneNode(true);
	let $studentImage = $studentElement.querySelector(".body__student__avatar");
	$studentElement.querySelector('#name').textContent = item.name;
	$studentElement.querySelector('#university').textContent = item.university;
	$studentElement.querySelector('#sity').textContent = item.sity; 
	$studentImage.src = item.avatar_url;

	studentsSection.appendChild($studentElement);
}

// Получаем данные 
const renderList = (data) =>{
	data.forEach((item) => {
		if (item.id <= 7) {
			renderObject($studentsSectionLeft, item)	
		}
		else if (item.id <= 14){
			renderObject($studentsSectionRight, item)	
		}
		else{
			(item.id % 2 == 0) ? renderObject($studentsSectionLeft, item) : renderObject($studentsSectionRight, item)	
		}
	});
}
/* Получаем данные с сервера*/
fetch('http://localhost:3000/students', {
	method: 'GET',
	headers: {
		'Content-Type': 'application/json'
	}
}).then((res) =>{
	if (res.ok){
		return res.json();
	}
	alert('Ошибка при получении данных');
	return Promise.reject();
}).then((data) => {
		document.addEventListener("DOMContentLoaded", renderList(data));
});