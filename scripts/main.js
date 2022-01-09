const $studentsSectionLeft = document.querySelector('.body__content__left');
const $studentsSectionRight = document.querySelector('.body__content__right');

const $studentsTemplate = document.querySelector('#studentsTemplate').content;

const deleteItem = (id) => {
	return fetch(`http://localhost:3000/students/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((res) =>{
		if (res.ok){
			return res.json();
		}
		alert('Ошибка при удалении данных ');
		return Promise.reject();
	});
}

// Получаем данные 
const renderList = (data) =>{

	$studentsSectionLeft.innerHTML = `<a href="#" style="text-decoration: none;">
				<div class = "body__container__add">
					<img src = './img/plus.png' alt = "Add Image" class = "body__image__add">
					<div class = "body__text__add">
						<p> Add a student</p>
					</div>
				</div>
			</a>`;
	$studentsSectionRight.innerHTML = '';

	data.forEach((item) => {
		if (item.id <= 7) {
			renderObject($studentsSectionLeft, item)	
		}
		else if (item.id <= 14){
			renderObject($studentsSectionRight, item)	
		}
		else{
			(item.id % 2 != 0) ? renderObject($studentsSectionLeft, item) : renderObject($studentsSectionRight, item)	
		}
	});
}

const getItems = () => {
/* Получаем данные с сервера*/
	return fetch('http://localhost:3000/students', {
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
	});
}

const renderObject = (studentsSection, item) =>{
	const $studentElement = $studentsTemplate.cloneNode(true);
	const $studentImage = $studentElement.querySelector(".body__student__avatar");
	const $buttonDelete = $studentElement.querySelector(".body__delete")

	$studentElement.querySelector('#name').textContent = item.name;
	$studentElement.querySelector('#university').textContent = item.university;
	$studentElement.querySelector('#sity').textContent = item.sity; 
	$studentImage.src = item.avatar_url;

	studentsSection.appendChild($studentElement);

	$buttonDelete.addEventListener('click', (event) => {
		event.preventDefault();
		console.log(item.id)
		deleteItem(item.id).then(() =>{
			getItems().then((data) => renderList(data));
		})
	})
}


getItems().then((data) => renderList(data));