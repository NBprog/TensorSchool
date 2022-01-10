class Api{
	constructor(url, headers){
		this._url = url;
		this._headers = headers;
	}

	getItems(){
		/* Получаем данные с сервера*/
		return fetch(this._url, {
			method: 'GET',
			headers: this._headers
		}).then((res) =>{
			return this._processResult(res, 'Ошибка при получении данных');
		});
	}

	deleteItem(id){
		return fetch(`${this._url}/${id}`, {
			method: 'DELETE',
			headers: this._headers
		}).then((res) =>{
			return this._processResult(res, 'Ошибка при удалении данных ');
		});
	}

	_processResult(res, errorText){
		if (res.ok){
			return res.json();
		}
		alert(errorText);
		return Promise.reject(errorText);
	}

	createItem(data){
		return fetch(`${this._url}/`, {
			method: 'POST',
			headers: this._headers,
			body: JSON.stringify(data)
		}).then((res) =>{
			return this._processResult(res, 'Ошибка при добавлении записи ');
		});
	}
	
	updateItem(id, data){
		return fetch(`${this._url}/${id}`, {
			method: 'PUT',
			headers: this._headers,
			body: JSON.stringify(data)
		}).then((res) =>{
			return this._processResult(res, 'Ошибка при изменении записи');
		});
	}
}

class Form {
   constructor(element) {
      this._element = element;
   }

   init(submitHandler, values) {
      this.closeForm();
      this._submitHandler = submitHandler;
      this._element.addEventListener('submit', this._submitHandler);

      if (values) {
         Object.keys(values).forEach((name) => {
            this._element.querySelector(`[name=${name}]`).value = values[name];
         });
      }
   }

   closeForm() {
      this._element.reset();
      this._element.removeEventListener('submit', this._submitHandler);
      this._submitHandler = null;
   }
}


const $studentsSectionLeft = document.querySelector('.body__content__left');
const $studentsSectionRight = document.querySelector('.body__content__right');
const $studentsTemplate = document.querySelector('#studentsTemplate').content;
const $buttonAdd = document.querySelector('.body__container__add');
const $buttonCancel = document.querySelector('#button_cancel');
const $buttonOK = document.querySelector('#button_OK');
const $windowTitle = document.querySelector('.body__window__title');
const $popup = document.querySelector('#form_student');
const studentsApi = new Api('http://localhost:3000/students', { 'Content-Type': 'application/json'});
const studentForm = new Form($popup);

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
			(item.id % 2 != 0) ? renderObject($studentsSectionLeft, item) : renderObject($studentsSectionRight, item)	
		}
	});
}



const renderObject = (studentsSection, item) =>{
	const $studentElement = $studentsTemplate.cloneNode(true);
	const $studentImage = $studentElement.querySelector(".body__student__avatar");
	const $buttonDelete = $studentElement.querySelector(".body__delete");

	$studentElement.querySelector('#name').textContent = item.name;
	$studentElement.querySelector('#university').textContent = item.university;
	$studentElement.querySelector('#sity').textContent = item.sity; 
	$studentImage.src = item.avatar_url;

	studentsSection.appendChild($studentElement);

	$buttonDelete.addEventListener('click', (event) => {
		event.preventDefault();
		studentsApi.deleteItem(item.id).then(() =>{
			event.target.closest('.body__item__frame')?.remove?.();
		})
	})

	$studentImage.addEventListener('click', (event)=>{
		
		array_name = item.name.split(' ');
		$windowTitle.textContent = "Редактирование информации о студенте";
		
		showPopUp();
		studentForm.init((event) => {
			event.preventDefault();
			const data = {
				name: $popup.elements[0].value + ' ' + $popup.elements[1].value,
				university: $popup.elements[2].value,
				sity: $popup.elements[3].value,
				url: $popup.elements[4].value
		};

		studentsApi.updateItem(item.id, data).then(() => {
			studentsApi.getItems().then((data) => renderList(data));
			hidePopUp();
		});
	}, {
			name: array_name[0],
			surname: array_name[1],
			university: item.university,
			sity: item.sity,
			url: item.avatar_url
		});

	});
}


studentsApi.getItems().then((data) => renderList(data));


const clear = () =>{
	document.getElementById("input_name").value = "";
	document.getElementById("input_surname").value = "";
	document.getElementById("input_university").value = "";
	document.getElementById("input_sity").value = "";
	document.getElementById("input_img").value = "";
} 

const showPopUp = () =>{
	$popup.classList.remove('popup__hidden');
}

const hidePopUp = () =>{
	$popup.classList.add('popup__hidden');
	studentForm.closeForm();
}

$buttonAdd.addEventListener('click', () =>{
	$windowTitle.textContent = "Добавление информации о студенте";
	showPopUp();
	studentForm.init(() =>{
		const data = {
			name: $popup.elements[0].value + ' ' + $popup.elements[1].value,
			university: $popup.elements[2].value,
			sity: $popup.elements[3].value,
			avatar_url: $popup.elements[4].value
		}
		studentsApi.createItem(data).then((studentData) => {
			if (studentData.id <= 7) {
				renderObject($studentsSectionLeft, studentData)	
			}
			else if (studentData.id <= 14){
				renderObject($studentsSectionRight, studentData)	
			}
			else{
				(studentData.id % 2 != 0) ? renderObject($studentsSectionLeft, studentData) : renderObject($studentsSectionRight, studentData)	
			}
			clear();
			hidePopUp();
		});
	});

});



