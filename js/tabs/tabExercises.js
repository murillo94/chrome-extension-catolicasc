const getMonthName = value => value.replace(/\d+/g, '').trim() || '';

const modifyDOMExercises = (dom, fn) => {
  document.body.style.width = '300px';

  const infoDOM = dom.getElementsByTagName('table')[0];

  authMoodleUser(infoDOM, res => {
    if (!res) {
      fn(false);
    } else {
      let items = {};
      let content = findId('content');

      const rows = formatNodeListToArray(infoDOM.children[1].rows);
      const date = new Date();

      let today = date.getDate();
      today = formatDay(today);

      content.innerHTML = '';

      items.name = getMonthName(dom.getElementsByClassName('current')[0].innerText);
      items.exercises = [];

      rows.forEach(row => {
        let cells = formatNodeListToArray(row.cells);

        cells.forEach(cell => {
          if (cell.className !== 'dayblank' && cell.children[0].childElementCount) {
            let item = cell.children[0].children[1].children[0].children[0].children[0];
            items.exercises.push({
              title: item.title,
              date: formatDay(cell.children[0].children[0].innerText),
              link: item.href
              ? item.href
              : 'http://cscj.mrooms.net/calendar/view.php?view=month'
            })
          }
        });
      });

      items.exercises.sort((a, b) => {
        return a.date - b.date;
      });

      let ul = createElement('ul');
      content.appendChild(ul);

      let month = createElement('li');
      month.classList.add('month-calendar');

      ul.appendChild(month).innerHTML = items.name;

      items.exercises.forEach(item => {
        let li = createElement('li');
        let date = createElement('div');
        let title = createElement('a');

        title.setAttribute('data-url', item.link);
        title.setAttribute('title', item.title);
        title.onclick = actionNewTab;

        li.classList.add('item-calendar');
        date.classList.add('date-calendar', today === item.date && 'date-calendar-today');

        li.appendChild(date).innerHTML = `${item.date}`;
        li.appendChild(title).innerHTML = `${item.title}`;
        ul.appendChild(li);
      });

      fn(true);
    }
  });
}
