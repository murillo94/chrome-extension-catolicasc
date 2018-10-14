let loading;
let contentAll;

const colorPositive = '#4ca64c';
const colorNegative = '#ff6666';

document.addEventListener('DOMContentLoaded', () => {
  try {
    let btnLogin = findId('login');
    let btnLoginMoodle = findId('login-moodle');
    let btnClose = findId('close');
    let btnCourse = findId('tab-course');
    let btnPayments = findId('tab-payments');
    let btnExercises = findId('tab-exercises');
    //let btnGrades = findId('tab-grades');
    let btnCalendar = findId('tab-calendar');

    loading = findId('load');
    contentAll = findId('content-all');

    window.onclick = actionCloseTabExtra;

    btnLogin.onclick = actionNewTab;
    btnLoginMoodle.onclick = actionNewTab;
    btnClose.onclick = actionClose;
    btnCourse.onclick = actionTabCourse;
    btnPayments.onclick = actionTabPayments;
    btnExercises.onclick = actionTabExercises;
    //btnGrades.onclick = actionTabGrades;
    btnCalendar.onclick = actionTabCalendar;

    actionTabCourse();
  } catch (err) {
    actionClose();
  }
});

const findId = (query, context = document) => context.getElementById(query);

const createElement = (query, context = document) => context.createElement(query);

const formatNodeListToArray = list => Array.from(list);

const formatDay = day => day < 10 ? `0${day}` : day;

const authUser = (dom, fn) => {
  const domReplaced = dom.split(': ').pop().replace(/\s/g, '');
  const isNotLogged = (domReplaced === 'Históricoacadêmico');
  const isAuth = (domReplaced !== '');
  fn({isNotLogged: isNotLogged, isAuth: isAuth});
}

const authMoodleUser = (dom, fn) => {
  const isAuth = (dom !== undefined);
  fn(isAuth);
}

const actionCloseTabExtra = event => {
  const tag = event.target.tagName.toLowerCase();

  if (tag !== 'summary' && tag !== 'svg') {
    document.getElementById("tab-details").open = false;
  }
}

const actionNewTab = event => chrome.tabs.create({active: true, url: event.target.dataset.url});

const actionClose = () => window.close();

const actionTabCourse = event => {
  request(urlCourse, 'multiple', (parser, response) => {
    const { data } = response;
    modifyDOMCourse(parser.parseFromString(data, 'text/html'), res => {
      requestDone(res, event, 'content-not-logged');
    });
  });
}

const actionTabPayments = event => {
  request(urlPayments, 'individual', (parser, response) => {
    const { data } = response;
    modifyDOMPayments(parser.parseFromString(data, 'text/html'), res => {
      requestDone(res, event, 'content-not-logged');
    });
  });
}

const actionTabExercises = event => {
  request(urlExercises, 'individual', (parser, response) => {
    const { data } = response;
    modifyDOMExercises(parser.parseFromString(data, 'text/html'), res => {
      requestDone(res, event, 'content-moodle-not-logged');
    });
  });
}

//const actionTabGrades = event => {}

const actionTabCalendar = (event, index = 0) => {
  request([urlCalendar[index]], 'individual', (parser, response) => {
    const { data } = response;
    modifyDOMCalendar(parser.parseFromString(data, 'text/html'), res => {
      requestDone(res, event, 'content-not-logged');
    });
  });
}

const request = (url, type, fn) => {
  loading.style.display = 'block';
  contentAll.style.display = 'none';

  const getType = type === 'multiple'
    ? getMultiple(url)
    : get(url);

  getType
    .then(res => {
      const parser = new DOMParser();
      fn(parser, res);
    })
    .catch(err => {
      actionClose();
    });
}

const requestDone = (res, event, id) => {
  let tab = event && (event.target ? event.target.labels[0].innerText : 'Curso');

  loading.style.display = 'none';

  if (res) {
    contentAll.style.display = 'block';
    findId('tab-name').innerHTML = tab;
  } else {
    let contentNotLogged = findId(id);
    contentNotLogged.style.display = 'block';
  }
}
