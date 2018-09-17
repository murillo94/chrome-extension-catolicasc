const getMonthName = value => {
  value = value || '';
  return value.replace(/\d+/g, '').trim();
}

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

      today = formatDay(today);

      content.innerHTML = '';
      items.name = getMonthName(dom.getElementsByClassName('current')[0].innerText);
      items.exercices = [];

      for (let x = 0; x < tableLength; x++) {
        let cells = rows[x].cells;
        let cellslength = cells.length;

        for (let y = 0; y < cellslength; y++) {
          if (cells[y].className !== 'dayblank' && cells[y].children[0].childElementCount) {
            let item = cells[y].children[0].children[1].children[0].children[0].children[0];
            items.exercices.push({
              title: item.title,
              date: formatDay(cells[y].children[0].children[0].innerText),
              link: item.href
              ? item.href
              : 'http://cscj.mrooms.net/calendar/view.php?view=month'
            })
          }
        }
      }

      items.exercices.sort((a, b) => {
        return a.date - b.date;
      });

      let ul = createElement('ul');

      content.appendChild(ul);

      let month = createElement('li');
      let itemsLength = items.exercices.length;

      month.classList.add('month-calendar');

      ul.appendChild(month).innerHTML = items.name;

      for (let i = 0; i < itemsLength; i++) {
        let li = createElement('li');
        let date = createElement('div');
        let title = createElement('a');

        title.setAttribute('data-url', items.exercices[i].link);
        title.setAttribute('title', items.exercices[i].title);
        title.onclick = actionNewTab;

        li.classList.add('item-calendar');
        date.classList.add('date-calendar', today === items.exercices[i].date && 'date-calendar-today');

        li.appendChild(date).innerHTML = `${items.exercices[i].date}`;
        li.appendChild(title).innerHTML = `${items.exercices[i].title}`;
        ul.appendChild(li);
      }

      fn(true);
    }
  });
}
