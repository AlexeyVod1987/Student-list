// // создаём путь к серверу
const SERVER_URL = 'http://localhost:3000'

// функция добавления нового клиента на сервер
async function serverAddClient(obj) {

  // создаём запрос для создания клиента на сервер
  let response = await fetch(SERVER_URL + '/api/clients', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  })
  // получаем результат
  let data = await response.json()
  // возвращаем результат в функцию
  return data
}

// функция получения клиента с сервера
async function serverGetClient() {

  let response = await fetch(SERVER_URL + '/api/clients', {
    method: "GET",
    headers: { 'Content-Type': 'application/json' }
  })

  let data = await response.json()

  return data
}
// функция получения клиента с сервера по id
async function serverGetStudent(id) {

  let response = await fetch(SERVER_URL + '/api/clients/' + id, {
    method: "GET",
    headers: { 'Content-Type': 'application/json' }
  })

  let data = await response.json()

  return data
}

// Функция измения данных на сервере 

async function serverUpdateClients(id, patch) {

  let response = await fetch(SERVER_URL + '/api/clients/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(patch)
  })

  let data = await response.json()
  return data
}


function loader() {
  let loader = document.querySelector('.mask-loader')
  loader.classList.add('hidden')
  setTimeout(() => {
    loader.remove()
  }, 500)
}

// добавляем в наш массив данные с сервера

loader()
let serverData = await serverGetClient()


// функция удаления студента из списка
async function serverDeleteClient(id) {
  let response = await fetch(SERVER_URL + '/api/clients/' + id, {
    method: "DELETE",

  })
  let data = await response.json()
  return data
}

//создаём массив клиентов
let clients = []
// // если сервер существует, то мы добавляем с него данные в наш массив
if (serverData) {
  clients = serverData
}

//============================================================================
// ========================функция форматирования даты в красивом формате=====
//============================================================================
function formatDate(date) {
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  let yy = date.getFullYear();
  if (yy < 10) yy = '0' + yy;

  return dd + '.' + mm + '.' + yy;
}

//============================================================================
// =============================Функция форматирования времени (часы и минуты)
//============================================================================
function formatTime(d) {
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`
}

// let clients = [
//   {
//     id: '123455',
//     createdAt: '2021-03-03T13:07:29.554Z',
//     updatedAt: '2021-01-03T13:07:29.554Z',
//     name: 'Оля',
//     surname: 'Звонова',
//     lastName: 'Петровна',
//     contacts: [
//       {
//         type: 'Телефон',
//         value: '+71234567890'
//       },
//       {
//         type: 'Email',
//         value: 'abc@xyz.com'
//       },
//       {
//         type: 'Facebook',
//         value: 'https://facebook.com/vasiliy-pupkin-the-best'
//       }
//     ]
//   },
//   {
//     id: '123458',
//     createdAt: '2021-04-03T14:07:29.554Z',
//     updatedAt: '2021-02-03T13:07:29.554Z',
//     name: 'Василий',
//     surname: 'Пупкин',
//     lastName: 'Васильевич',
//     contacts: [
//       {
//         type: 'Телефон',
//         value: '+71234567890'
//       },
//       {
//         type: 'Email',
//         value: 'abc@xyz.com'
//       },
//       {
//         type: 'Facebook',
//         value: 'https://facebook.com/vasiliy-pupkin-the-best'
//       }
//     ]
//   },
//   {
//     id: '123452',
//     createdAt: '2021-05-03T15:07:29.554Z',
//     updatedAt: '2021-03-03T13:07:29.554Z',
//     name: 'Алексей',
//     surname: 'Алексеев',
//     lastName: 'Алексеевич',
//     contacts: [
//       {
//         type: 'Телефон',
//         value: '+71234567890'
//       },
//       {
//         type: 'Email',
//         value: 'abc@xyz.com'
//       },
//       {
//         type: 'Facebook',
//         value: 'https://facebook.com/vasiliy-pupkin-the-best'
//       }
//     ]
//   }
// ]



let $allClients = document.getElementById("clients-table"),
  $surnameInp = document.getElementById("surname-inp"),
  $nameInp = document.getElementById("name-inp"),
  $lastnameInp = document.getElementById("lastname-inp"),
  $delBox = document.getElementById("del-client-box");

// переменные для сортировки
let sortColumnFlag = 'id',
  sortDirFlag = true,
  $sortFIOBtn = document.getElementById("sort-fio"),
  $sortIDBtn = document.getElementById("sort-id"),
  $sortTimeBtn = document.getElementById("sort-time"),
  $sortChangeBtn = document.getElementById("sort-change"),
  $sortArrow = document.getElementById("id-arrow"),
  $sortFio = document.getElementById("fio-arrow"),
  $sortDate = document.getElementById("date-arrow"),
  $sortChange = document.getElementById("change-arrow");


// переменная для фильтрации
let $filterInp = document.getElementById("header__filter");
let $delClient = document.getElementById('del-client')

//============================================================================
// ========================================функция создания одного клиента====
//============================================================================
function $getNewClientLi(studObj) {
  // создание li в списке и его элементов
  const $clientItem = document.createElement('li'),
    $clientId = document.createElement('div'),
    $clientFIO = document.createElement('div'),
    $addInfo = document.createElement('div'),
    $dateAdd = document.createElement('div'),
    $timeDateAdd = document.createElement('span'),
    $changeInfo = document.createElement('div'),
    $lastChange = document.createElement('div'),
    $timeLastChange = document.createElement('span'),
    $linkList = document.createElement('ul'),
    $buttons = document.createElement('div'),
    $buttonEdit = document.createElement('button'),
    $buttonDelete = document.createElement('button');

  // добавление классов
  $clientItem.classList.add("info-table-item")
  $clientId.classList.add("info-table-item__id")
  $clientFIO.classList.add("info-table-item__fio")
  $addInfo.classList.add("info-table-item__add-info")
  $changeInfo.classList.add("info-table-change-info")
  $dateAdd.classList.add("info-table-item__add", "time-add")
  $timeDateAdd.classList.add("time-add__clock")
  $lastChange.classList.add("info-table-item__change", "last-change")
  $timeLastChange.classList.add("last-change__clock")
  $linkList.classList.add("link-list", "list-reset")
  $buttons.classList.add("buttons", "btn-reset")
  $buttonEdit.classList.add("info-table-item__edit", "btn-reset")
  $buttonDelete.classList.add("info-table-item__delete", "btn-reset")
  $buttonDelete.id = 'del-btn-id'

  // работа со списком контактов клиентов
  if (studObj.contacts.length == 0) {
    $linkList.innerHTML = `Контактов нет`
  }

  if (studObj.contacts.length !== 0) {

    for (let i = 0; i < studObj.contacts.length; i++) {
      let filename = ``
      let message = ``

      if (studObj.contacts[i].type === 'Телефон' || studObj.contacts[i].type === 'Доп.телефон') {
        filename = 'phone'
        message = studObj.contacts[i].value
      }

      if (studObj.contacts[i].type === 'Email') {
        filename = 'mail'
        message = studObj.contacts[i].value
      }

      if (studObj.contacts[i].type === 'Facebook') {
        filename = 'fb'
        message = studObj.contacts[i].value
      }

      if (studObj.contacts[i].type === 'VK') {
        filename = 'vk'
        message = studObj.contacts[i].value
      }

      let img = `<img src='image/${filename}.svg' alt='${filename}' class="contacts-icon" />`

      $linkList.innerHTML += img

      //добавление надписей к иконкам контактов
      for (let j = 0; j < $linkList.childNodes.length; j++) {
        let contacts = studObj.contacts

        tippy($linkList.childNodes[j], {
          content: `${contacts[j].type}: ${contacts[j].value}`
        })
      }
    }

    if (studObj.contacts.length > 5) {

      for (let i = 0; i < $linkList.childNodes.length - 2; i++) {
        $linkList.childNodes[i].remove()
      }

      let $btnMore = document.createElement('div')
      $btnMore.classList.add('more-btn')

      $btnMore.textContent = `+${studObj.contacts.length - $linkList.childNodes.length}`

      $linkList.append($btnMore)

      $btnMore.addEventListener('click', () => {
        $btnMore.remove()
        $linkList.childNodes.forEach(item => {
          item.remove()
        })

        $linkList.childNodes.forEach(item => {
          item.remove()
        })

        $linkList.childNodes.forEach(item => {
          item.remove()
        })
        for (let i = 0; i < studObj.contacts.length; i++) {
          let filename = ``
          let message = ``

          if (studObj.contacts[i].type === 'Телефон' || studObj.contacts[i].type === 'Доп.телефон') {
            filename = 'phone'
            message = studObj.contacts[i].value
          }

          if (studObj.contacts[i].type === 'Email') {
            filename = 'mail'
            message = studObj.contacts[i].value
          }

          if (studObj.contacts[i].type === 'Facebook') {
            filename = 'fb'
            message = studObj.contacts[i].value
          }

          if (studObj.contacts[i].type === 'VK') {
            filename = 'vk'
            message = studObj.contacts[i].value
          }

          $linkList.innerHTML += `<img src='image/${filename}.svg' alt='${filename}' class='contacts-icon' />`

          for (let j = 0; j < $linkList.childNodes.length; j++) {
            let contacts = studObj.contacts

            tippy($linkList.childNodes[j], {
              content: `${contacts[j].type}: ${contacts[j].value}`
            })
          }

        }
      })
    }
  }

  // Задаем кнопке уникальный индетификатор
  $buttonDelete.setAttribute('data-id', `${studObj.id}`)

  // добавляем контент в поля
  $clientId.textContent = studObj.id
  $clientFIO.textContent = `${studObj.lastName} ${studObj.name}  ${studObj.surname}`
  $dateAdd.textContent = formatDate(new Date(studObj.createdAt))
  $timeDateAdd.textContent = formatTime(new Date(studObj.createdAt))
  $lastChange.textContent = formatDate(new Date(studObj.updatedAt))
  $timeLastChange.textContent = formatTime(new Date(studObj.updatedAt))
  $buttonEdit.setAttribute('data-id', `${studObj.id}`)
  $buttonEdit.textContent = "Изменить"
  $buttonDelete.textContent = "Удалить"

  // добавляем все элементы клиента в ul и в li
  $allClients.append($clientItem)
  $addInfo.append($dateAdd, $timeDateAdd)
  $changeInfo.append($lastChange, $timeLastChange)
  $buttons.append($buttonEdit, $buttonDelete)
  $clientItem.append($clientId, $clientFIO, $addInfo, $changeInfo, $linkList, $buttons)

  //============================================================================
  //==================================модальное окно "ИЗМЕНИТЬ КЛИЕНТА"==========
  //============================================================================

  let $changeBtnSave = document.getElementById('changeBtnSave')



  $changeBtnSave.addEventListener('click', async () => {
    const $clientSurnameModalBox = document.getElementById("client-surname"),
      $clientNameModalBox = document.getElementById("client-name"),
      $clientLastNameModalBox = document.getElementById("client-lastName"),
      $clientId = document.getElementById('change-box-del-btn')
    //console.log($clientSurnameModalBox)
    let patch = {
      lastName: $clientSurnameModalBox.value,
      name: $clientNameModalBox.value,
      surname: $clientLastNameModalBox.value,
      contacts: []
    }
    //console.log(patch)

    let container = document.querySelector('#contacts-item-change')

    if (container.childNodes) {
      let contacts = []

      for (let i = 0; i < container.childNodes.length; i++) {
        
        let selects = document.querySelectorAll('select')
        let $inputs = document.querySelectorAll('.text-field__input')
       
     
        contacts.push(
          {
            type: selects[i].value,
            value: $inputs[i].value ? $inputs[i].value : container.childNodes[i].childNodes[1].childNodes[0].childNodes[1].value
          }
        )
      }


      patch.contacts = contacts
    }

    
  
    await serverUpdateClients(Number($clientId.getAttribute('data-id')), patch)

    let modal = document.getElementById('change-client-box')
    modal.classList.remove('open')

    let users = await serverGetClient()

    render(users)
  })

  // добавляем модальное окно изменения клиента при клине на кнопку 
  $buttonEdit.addEventListener('click', async function (event) {

    document.getElementById("change-client-box").classList.add("open")
    document.body.classList.add("stop-overflow")

    let id = event.target.getAttribute('data-id')

    let deleteUser = document.getElementById('change-box-del-btn')
    deleteUser.setAttribute('data-id', Number(id))

    let user = await serverGetStudent(Number(id))

    let $changeContainer =  document.getElementById('contacts-item-change')
    $changeContainer.classList.remove('dsp-flex')
        $changeContainer.innerHTML = ''

       

    if (user.contacts.length == 0) {
      return
    }

    
    for (let i = 0; i < user.contacts.length; i++) {

      

      

      if (user.contacts[i].type == 'Телефон') {
        $createContact('#contacts-item-change', 1)
        settingsInput()
        let $inputs = document.querySelectorAll('.text-field__input')
        

        $inputs[i].value = user.contacts[i].value
       
       
      }

      if (user.contacts[i].type == 'Email') {
        $createContact('#contacts-item-change', 3)
        settingsInput()
        let $inputs = document.querySelectorAll('.text-field__input')
        

        $inputs[i].value = user.contacts[i].value
      }

      if (user.contacts[i].type == 'Vk') {
        $createContact('#contacts-item-change', 4)
        settingsInput()
        let $inputs = document.querySelectorAll('.text-field__input')
        

        $inputs[i].value = user.contacts[i].value
      }

      if (user.contacts[i].type == 'Facebook') {
        $createContact('#contacts-item-change', 5)
        settingsInput()
        let $inputs = document.querySelectorAll('.text-field__input')
        

        $inputs[i].value = user.contacts[i].value
      }

      if (user.contacts[i].type == 'Доп.телефон') {
        $createContact('#contacts-item-change', 2)
        settingsInput()
        let $inputs = document.querySelectorAll('.text-field__input')
        

        $inputs[i].value = user.contacts[i].value
      }
    }

 

  
  })

  // Закрыть модальное окно
  document.getElementById("close-modal-box").addEventListener('click', function () {
    document.getElementById("change-client-box").classList.remove("open")
    document.body.classList.remove("stop-overflow")
   
  });

  // Закрыть модальное окно при нажатии на Esc
  window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
      document.getElementById("change-client-box").classList.remove("open")
      document.body.classList.remove("stop-overflow")
    }
  });

  // Закрыть модальное окно при клике вне его
  document.querySelector("#change-client-box .change-client-modal").addEventListener('click', event => {
    event._isClickWithInModal = true;
  });
  document.getElementById("change-client-box").addEventListener('click', event => {
    if (event._isClickWithInModal) return;
    event.currentTarget.classList.remove('open');
    document.body.classList.remove("stop-overflow")
  });

  



 


  const $clientIdModalBox = document.getElementById("client-id"),
    $clientSurnameModalBox = document.getElementById("client-surname"),
    $clientNameModalBox = document.getElementById("client-name"),
    $clientLastNameModalBox = document.getElementById("client-lastName")

  //добавление данных в поля input
  $clientIdModalBox.innerHTML = `<b>ID:</b> ${studObj.id}`
  $clientSurnameModalBox.value = studObj.lastName
  $clientNameModalBox.value = studObj.name
  $clientLastNameModalBox.value = studObj.surname


  // Удаление клиента по нажатию на кнопку "удалить клиента"
  let del = document.getElementById("change-box-del-btn")
  del.addEventListener("click", async function () {

    document.getElementById("change-client-box").classList.remove("open")

    let id = del.getAttribute('data-id')

    await serverDeleteClient(Number(id))

    // удаление строчки с клиентом из списка
    let users = await serverGetClient()
    render(users)

  })

  //============================================================================
  //==================================модальное окно "УДАЛИТЬ КЛИЕНТА"==========
  //============================================================================

  // добавляем модальное окно удаления клиента при клине на кнопку 
  $buttonDelete.addEventListener('click', function () {
    $delBox.classList.add("open")

    $delClient.setAttribute('data-id', `${$buttonDelete.getAttribute('data-id')}`)
    document.body.classList.add("stop-overflow")
  })
  //Закрыть модальное окно
  document.getElementById("close-del-modal-box").addEventListener('click', function () {
    document.getElementById("del-client-box").classList.remove("open")
    document.body.classList.remove("stop-overflow")
  });
  document.getElementById("cancel-del-modal-box").addEventListener('click', function () {
    document.getElementById("del-client-box").classList.remove("open")
    document.body.classList.remove("stop-overflow")
  });

  // Закрыть модальное окно при нажатии на Esc
  window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
      document.getElementById("del-client-box").classList.remove("open")
      document.body.classList.remove("stop-overflow")
    }
  });

  // Закрыть модальное окно при клике вне его
  document.querySelector("#del-client-box .del-client-modal").addEventListener('click', event => {
    event._isClickWithInModal = true;
  });
  document.getElementById("del-client-box").addEventListener('click', event => {
    if (event._isClickWithInModal) return;
    event.currentTarget.classList.remove('open');
    document.body.classList.remove("stop-overflow")
  });

  return $clientItem
}

$delClient.addEventListener("click", async function (event) {
  document.getElementById("del-client-box").classList.remove("open")

  let dataId = event.target.getAttribute('data-id')

  clients.forEach(async client => {

    if (client.id == dataId) {
      await serverDeleteClient(Number(dataId));
    }

    let users = await serverGetClient(clients)

    render(users)
  })
  document.body.classList.remove("stop-overflow")

})

//============================================================================
// ===============функция добавления студентов из исходного массива объектов==
//============================================================================
function render(arr) {
  $allClients.innerHTML = '';
  let copyArr = [...arr]

  //объединяем фамилию, имя и отчество одного человека
  for (const oneUser of copyArr) {
    oneUser.fio = ``
  }

  //Сортировка по id по умолчанию по возрастанию
  copyArr = copyArr.sort(function (a, b) {
    let sort = a[sortColumnFlag] < b[sortColumnFlag]
    if (sortDirFlag == false) sort = a[sortColumnFlag] > b[sortColumnFlag]
    if (sort) return -1
  })

  // цикл добавления студента из исходного массива объектов
  for (const studObj of copyArr) {
    const $newClientItem = $getNewClientLi(studObj)
    $allClients.append($newClientItem)
  }

}


// запускаем вывод готовых пользователей
render(clients)


//============================================================================
// ==================================ФИЛЬТРАЦИЯ ПРИ ВВОДЕ В ПОИСКОВИК=========
//============================================================================

$filterInp.addEventListener('input', () => {
  let copyClients = [...clients]

  copyClients = copyClients.filter(client => {
    if (client.name.includes($filterInp.value) || client.surname.includes($filterInp.value) || client.lastName.includes($filterInp.value) || client.id.includes($filterInp.value) || formatDate(new Date(client.createdAt)).includes($filterInp.value) || formatDate(new Date(client.updatedAt)).includes($filterInp.value)) {
      // console.log('Работает');
      return true
    }
  })
  render(copyClients)
})

//============================================================================
// ==================================СОРТИРОВКА по критериям==================
//============================================================================
// сортировка по нажатию на "ID"
$sortIDBtn.addEventListener('click', function () {
  sortColumnFlag = 'id'
  // меняем sortDirFlag на противоположное направление
  sortDirFlag = !sortDirFlag
  $sortArrow.classList.toggle("reverse")
  render(clients)
})

// сортировка по нажатию на "ФИО"
$sortFIOBtn.addEventListener('click', function () {
  sortColumnFlag = 'surname'
  // меняем sortDirFlag на противоположное направление
  sortDirFlag = !sortDirFlag
  $sortFio.classList.toggle("reverse-down")
  render(clients)
})

// сортировка по дате создания.
$sortTimeBtn.addEventListener('click', function () {
  $sortDate.classList.toggle("reverse-down")
  sortColumnFlag = 'createdAt'
  // меняем sortDirFlag на противоположное направление
  sortDirFlag = !sortDirFlag
  render(clients)
})

// сортировка по дате изменения.
$sortChangeBtn.addEventListener('click', function () {
  $sortChange.classList.toggle("reverse")
  sortColumnFlag = 'updatedAt'
  // меняем sortDirFlag на противоположное направление
  sortDirFlag = !sortDirFlag
  render(clients)
})

//============================================================================
//================================модальное окно "ДОБАВИТЬ КЛИЕНТА"===========
//============================================================================

const inpValue = document.getElementById("tel")
const delContact = document.getElementById("del-contact")
const contactItem = document.getElementById("contacts-item")
const addContactItem = document.getElementById("add-contact")
const itemBtn = document.getElementById("add-contact-btn")
let contactEl = document.getElementById("add-contact-el")



// Открыть модальное окно
document.getElementById("add-client").addEventListener('click', function () {
  document.getElementById("add-client-box").classList.add("open")

  contactItem.innerHTML = ``
  contactItem.classList.remove('dsp-flex')
});

// Закрыть модальное окно
document.getElementById("close-add-modal-box").addEventListener('click', function () {
  document.getElementById("add-client-box").classList.remove("open")
  document.body.classList.remove("stop-overflow")
  // очищение полей ввода ФИО клиента
  $surnameInp.value = ""
  $lastnameInp.value = ""
  $nameInp.value = ""
});
document.getElementById("cancel-add-modal-box").addEventListener('click', function () {
  document.getElementById("add-client-box").classList.remove("open")
  // очищение полей ввода ФИО клиента
  $surnameInp.value = ""
  $lastnameInp.value = ""
  $nameInp.value = ""
});

// Закрыть модальное окно при нажатии на Esc
window.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
    document.getElementById("add-client-box").classList.remove("open")
    document.body.classList.remove("stop-overflow")
    // очищение полей ввода ФИО клиента
    $surnameInp.value = ""
    $lastnameInp.value = ""
    $nameInp.value = ""
  }
});

// Закрыть модальное окно при клике вне его
document.querySelector("#add-client-box .add-client-modal").addEventListener('click', event => {
  event._isClickWithInModal = true;
});
document.getElementById("add-client-box").addEventListener('click', event => {
  if (event._isClickWithInModal) return;
  event.currentTarget.classList.remove('open');
  document.body.classList.remove("stop-overflow")
  // очищение полей ввода ФИО клиента
  $surnameInp.value = ""
  $lastnameInp.value = ""
  $nameInp.value = ""
});

// добавление input контакта

function setOption(atrValue, value) {
  const $option = document.createElement('option')
  $option.value = atrValue
  $option.textContent = value

  return $option
}

function setInput(...atrValues) {
  const $input = document.createElement('input')
  $input.classList.add('text-field__input')
  $input['type'] = atrValues[0]
  $input['id'] = atrValues[1]
  $input['name'] = atrValues[1]
  $input['placeholder'] = 'Введите данные контакта'

  return $input
}

// Добавление контактов при добавления пользователя

function $createContact(containerId, checker) {
  const $container = document.querySelector(containerId)

  const $fullInputContainer = document.createElement('div')
  $fullInputContainer.classList.add('full-container')

  const $select = document.createElement('select')
  $select.classList.add('contacts__item_select')

  let $optionEmail = setOption('Email', 'Email')
  let $optionTel = setOption('Телефон', 'Телефон')
  let $optionDopTel = setOption('Доп.телефон', 'Доп.телефон')
  let $optionVK = setOption('VK', 'VK')
  let $optionFB = setOption('Facebook', 'Facebook')

  if (checker == 1) {
    $select.append($optionTel)
    $select.append($optionEmail)
    $select.append($optionDopTel)
    $select.append($optionVK)
    $select.append($optionFB)
  }

  if (checker == 2) {
    $select.append($optionDopTel)
    $select.append($optionTel)
    $select.append($optionEmail)
    $select.append($optionVK)
    $select.append($optionFB)
  }

  if (checker == 3) {

    $select.append($optionEmail)
    $select.append($optionTel)
    $select.append($optionDopTel)
    $select.append($optionVK)
    $select.append($optionFB)

  }

  if (checker == 4) {
    $select.append($optionVK)
    $select.append($optionTel)
    $select.append($optionDopTel)
    $select.append($optionEmail)
    $select.append($optionFB)
  }

  if (checker == 5) {
    $select.append($optionFB)
    $select.append($optionTel)
    $select.append($optionDopTel)
    $select.append($optionEmail)
    $select.append($optionVK)

  }

  //  SELECT ГОТОВ

  const $fieldContainer = document.createElement('div')
  $fieldContainer.classList.add('text-field')
  const $fieldGroup = document.createElement('div')
  $fieldGroup.classList.add('text-field__group')

  const $inputTel = setInput('tel', 'tel')
  const $inputDopTel = setInput('tel', 'dopTel')
  const $inputEmail = setInput('email', 'email')
  const $inputVk = setInput('text', 'VK')
  const $inputFb = setInput('text', 'FB')



  let im = new Inputmask("+7 (999) 999-99-99");
  im.mask($inputTel)


  $fieldContainer.append($fieldGroup)
  if (checker == 1) {
    $fieldGroup.append($inputTel)
  }
  if (checker == 2) {
    $fieldGroup.append($inputDopTel)

    let im = new Inputmask("+7 (999) 999-99-99");
    im.mask($inputDopTel)
  }
  if (checker == 3) {
    $fieldGroup.append($inputEmail)
  }
  if (checker == 4) {
    $fieldGroup.append($inputVk)
  }
  if (checker == 5) {
    $fieldGroup.append($inputFb)
  }

  const $btnDel = document.createElement('button')
  $btnDel.classList.add('text-field__btn')
  $btnDel['type'] = 'button'
  $btnDel.classList.add('del-contact')

  $btnDel.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z"
        fill="#B0B0B0" />
    </svg>`


    

  $fieldGroup.append($btnDel)

  $fullInputContainer.append($select)
  $fullInputContainer.append($fieldContainer)

  $container.append($fullInputContainer)
  $container.classList.add('dsp-flex')

  let $inputs = document.querySelectorAll('.text-field__input')
        
    for (let i = 0; i < $inputs.length; i++) {

      $btnDel.addEventListener('click', () => {
        $fullInputContainer.remove()
        if ($container.childNodes.length == 0) {
          $container.classList.remove('dsp-flex')
        }
      })

      $inputs[i].addEventListener('input', () => {
        $btnDel.style.display = 'none'
      })

      $inputs[i].addEventListener('change', () => {
        $btnDel.style.display = 'block'
      })
    }
}

addContactItem.addEventListener('click', function () {
  $createContact('#contacts-item', 1)

  settingsInput()

  

  if (contactItem.childNodes.length == 10) {
    addContactItem.style.display = 'none'
  }
})


function settingsInput() {
  let selects = document.querySelectorAll('select')

  for (let i = 0; i < selects.length; i++) {
    const choices = new Choices(selects[i], {
      searchEnabled: false,
      itemSelectText: '',
    });

    const $fieldGroups = document.querySelectorAll('.text-field__group')
    const $btnDel = document.querySelectorAll('.del-contact')

    

    const $inputTel = setInput('tel', 'tel')
    const $inputDopTel = setInput('tel', 'dopTel')
    const $inputEmail = setInput('email', 'email')
    const $inputVk = setInput('text', 'VK')
    const $inputFb = setInput('text', 'FB')

    

    selects[i].addEventListener(
      'change',
      function (event) {

        let $delInputBtns = document.querySelectorAll('.text-field__btn')
        let $inputs = document.querySelectorAll('.text-field__input')

        let im = new Inputmask("+7 (999) 999-99-99");
        
        

       
      
        if (selects[i].textContent == 'Телефон') {
          $delInputBtns[i].remove()
          $inputs[i].remove()
          im.mask($inputTel)
          $fieldGroups[i].append($inputTel)
          $fieldGroups[i].append($btnDel[i])
        
         }

       

        if (selects[i].textContent == 'Доп.телефон') {
          $delInputBtns[i].remove()
          $inputs[i].remove()
          im.mask($inputDopTel)
          $fieldGroups[i].append($inputDopTel)
          $fieldGroups[i].append($btnDel[i])


          
          return
        }

        if (selects[i].textContent == 'Email') {
          $delInputBtns[i].remove()
          $inputs[i].remove()
          $fieldGroups[i].append($inputEmail)
          $fieldGroups[i].append($btnDel[i])
          return
        }

        if (selects[i].textContent == 'Facebook') {
          
          $delInputBtns[i].remove()
          $inputs[i].remove()
          $fieldGroups[i].append($inputFb)
          $fieldGroups[i].append($btnDel[i])
          return
        }

        if (selects[i].textContent == 'VK') {
          $delInputBtns[i].remove()
          $inputs[i].remove()
          $fieldGroups[i].append($inputVk)
          $fieldGroups[i].append($btnDel[i])
          return
        }
      },
      false,
    );
  
  }
}





//============================================================================
// =============================добавление нового клиента в список из формы===
//============================================================================

document.getElementById("add-client-btn").addEventListener('click', async function () {

  let newClient = {
    createdAt: new Date(),
    updatedAt: new Date(),
    name: $nameInp.value.trim(),
    surname: $surnameInp.value.trim(),
    lastName: $lastnameInp.value.trim(),
    contacts: []
  }

  let $contacts__div = document.querySelector('.contacts__item')

  if ($contacts__div.textContent.length == 0) {
    newClient.contacts = []
  }

  if ($contacts__div.textContent.length !== 0) {
    const select = document.querySelectorAll('.contacts__item_select')
    let contacts = []
    for (let i = 0; i < select.length; i++) {

      let choices = document.querySelectorAll('.choices')
      let value = choices[i].nextSibling.childNodes[0].childNodes[0].value ? choices[i].nextSibling.childNodes[0].childNodes[0].value : choices[i].nextSibling.childNodes[0].childNodes[1].value

      contacts.push({
        type: select[i].childNodes[0].value,
        value
      })
    }

    newClient.contacts = contacts
  }

  // функция добавления студента на сервер
  let serverDataObj = await serverAddClient(newClient);

  // валидация
  if (document.getElementById("name-inp").value.trim() == "") {
    document.getElementById("name-inp").classList.add('no-valid')
    document.querySelector('#name-inp').addEventListener('focus', () => {
      document.getElementById("name-inp").classList.remove('no-valid')
    })
    return
  }
  if (document.querySelector('#lastname-inp').value.trim() == "") {
    document.querySelector('#lastname-inp').classList.add('no-valid')
    document.querySelector('#lastname-inp').addEventListener('focus', () => {
      document.querySelector('#lastname-inp').classList.remove('no-valid')
    })
    return
  }

  if (document.querySelector('#surname-inp').value.trim() == "") {
    document.querySelector('#surname-inp').classList.add('no-valid')
    document.querySelector('#surname-inp').addEventListener('focus', () => {
      document.querySelector('#surname-inp').classList.remove('no-valid')
    })
    return
  }

 
 


  // добавление нового клиента в исходный список
  clients.push(serverDataObj)
  // очищение полей ввода ФИО клиента
  $surnameInp.value = ""
  $lastnameInp.value = ""
  $nameInp.value = ""

  // закрываем модальное окно добавления нового клиента
  document.getElementById("add-client-box").classList.remove("open")
  // отрисовываем заново список

  render(clients)
})

changeContactBtn.addEventListener('click', () => {

  let newClient = {
    createdAt: new Date(),
    updatedAt: new Date(),
    name: $nameInp.value.trim(),
    surname: $lastnameInp.value.trim(),
    lastName: $surnameInp.value.trim(),
    contacts: []
  }

  let $contactsDiv = document.querySelector('#contacts-item-change')

 



  if ($contactsDiv.childNodes.length < 10) {
    $createContact('#contacts-item-change', 1)
    settingsInput()
  } else {
    changeContactBtn.style.display = 'none'
  }

  if ($contactsDiv.textContent.length == 0) {
    newClient.contacts = []
  }

  if ($contactsDiv.textContent.length !== 0) {
    const select = document.querySelectorAll('.contacts__item_select')
    let contacts = []
    for (let i = 0; i < select.length; i++) {

      let choices = document.querySelectorAll('.choices')
      let value = choices[i].nextSibling.childNodes[0].childNodes[0].value ? choices[i].nextSibling.childNodes[0].childNodes[0].value : choices[i].nextSibling.childNodes[0].childNodes[1].value

      contacts.push({
        type: select[i].childNodes[0].value,
        value
      })

      // $createContact('#contacts-item-change', 1)
      // settingsInput()

    }

    newClient.contacts = contacts
  }

 
})





