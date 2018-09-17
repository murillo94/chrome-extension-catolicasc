const modifyDOMExercises = (dom, fn) => {
  document.body.style.width = '300px';

  const infoDOM = dom.getElementsByTagName('table')[0];

  authMoodleUser(infoDOM, res => {
    if (!res) {
      fn(false);
    } else {
      let items = {};
      let content = findId('content');

      const rows = infoDOM.children[1].rows;
      const tableLength = rows.length;
      const date = new Date();

      let today = date.getDate();

      today = today < 10 ? `0${today}` : today;

      content.innerHTML = '';

      fn(true);
    }
  });
}
