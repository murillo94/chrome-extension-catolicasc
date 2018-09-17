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

const findId = (query, context = document) => context.getElementById(query);

const createElement = (query, context = document) => context.createElement(query);

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

const actionNewTab = e => chrome.tabs.create({active: true, url: e.target.dataset.url});

const actionClose = () => window.close();

const actionTabCourse = () => {
  request(urlCourse, 'multiple', (parser, response) => {
    const { data } = response;
    modifyDOMCourse(parser.parseFromString(data, 'text/html'), res => {
      requestDone(res, 'content-not-logged');
    });
  });
}

const actionTabPayments = () => {
  request(urlPayments, 'individual', (parser, response) => {
    const { data } = response;
    modifyDOMPayments(parser.parseFromString(data, 'text/html'), res => {
      requestDone(res, 'content-not-logged');
    });
  });
}

const actionTabExercises = () => {
  request(urlExercises, 'individual', (parser, response) => {
    const { data } = response;
    modifyDOMExercises(parser.parseFromString(data, 'text/html'), res => {
      requestDone(res, 'content-moodle-not-logged');
    });
  });
}

const actionTabCalendar = (e, index = 0) => {
  request([urlCalendar[index]], 'individual', (parser, response) => {
    const { data } = response;
    modifyDOMCalendar(parser.parseFromString(data, 'text/html'), res => {
      requestDone(res, 'content-not-logged');
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

const requestDone = (res, id) => {
  loading.style.display = 'none';

  if (res) {
    contentAll.style.display = 'block';
  } else {
    let contentNotLogged = findId(id);
    contentNotLogged.style.display = 'block';
  }
}
