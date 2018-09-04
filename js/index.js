let loading;
let contentAll;

const colorPositive = '#4ca64c';
const colorNegative = '#ff6666';

document.addEventListener('DOMContentLoaded', function() {
  try {
    let btnLogin = findId('login');
    let btnLoginMoodle = findId('login-moodle');
    let btnClose = findId('close');
    let btnCourse = findId('tab-course');
    let btnPayments = findId('tab-payments');
    let btnExercises = findId('tab-exercises');
    let btnCalendar = findId('tab-calendar');

    loading = findId('load');
    contentAll = findId('content-all');

    btnLogin.onclick = actionNewTab;
    btnLoginMoodle.onclick = actionNewTab;
    btnClose.onclick = actionClose;
    btnCourse.onclick = actionTabCourse;
    btnPayments.onclick = actionTabPayments;
    btnExercises.onclick = actionTabExercises;
    btnCalendar.onclick = actionTabCalendar;

    actionTabCourse(urlCourse);
  } catch(err) {
    actionClose();
  }
});

function findId(query, context = document) {
  return context.getElementById(query);
}

function createElement(query, context = document) {
  return context.createElement(query);
}

function authUser(dom, fn) {
  const domReplaced = dom.split(': ').pop().replace(/\s/g, '');
  const isNotLogged = (domReplaced === 'Históricoacadêmico');
  const isAuth = (domReplaced !== '');
  fn({isNotLogged: isNotLogged, isAuth: isAuth});
}

function authMoodleUser() {
  contentAll.style.display = 'none';
  loading.style.display = 'none';
  let contentMoodleNotLogged = findId('content-moodle-not-logged');
  contentMoodleNotLogged.style.display = 'block';
}

function actionNewTab() {
  chrome.tabs.create({active: true, url: this.dataset.url});
}

function actionClose() {
  window.close();
}

function actionTabCourse() {
  request(urlCourse, 'multiple', (parser, response) => {
    const { data } = response;
    modifyDOMCourse(parser.parseFromString(data, 'text/html'), res => {
      requestDone(res);
    });
  });
}

function actionTabPayments() {
  request(urlPayments, 'individual', (parser, response) => {
    const { data } = response;
    modifyDOMPayments(parser.parseFromString(data, 'text/html'), res => {
      requestDone(res);
    });
  });
}

function actionTabExercises() {
  request(urlExercises, 'individual', (parser, response) => {
    const { error, html } = response.data;
    if(error) {
      authMoodleUser();
      return;
    }
    modifyDOMExercises(parser.parseFromString(html, 'text/html'), res => {
      requestDone(res);
    });
  });
}

function actionTabCalendar(e, index = 0) {
  request([urlCalendar[index]], 'individual', (parser, response) => {
    const { data } = response;
    modifyDOMCalendar(parser.parseFromString(data, 'text/html'), res => {
      requestDone(res);
    });
  });
}

function request(url, type, fn) {
  loading.style.display = 'block';
  contentAll.style.display = 'none';

  const getType = type === 'multiple'
    ? getMultiple(url)
    : get(url);

  getType
    .then(response => {
      const parser = new DOMParser();
      fn(parser, response);
    })
    .catch(err => {
      actionClose();
    });
}

function requestDone(res) {
  loading.style.display = 'none';

  if(res) {
    contentAll.style.display = 'block';
  } else {
    let contentNotLogged = findId('content-not-logged');
    contentNotLogged.style.display = 'block';
  }
}
