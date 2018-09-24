let selected = 0;

const addListenerChangeRegion = () => {
  findId('select-calendar').addEventListener('change', function() {
    selected = this.value;
    actionTabCalendar('', this.value);
  });
}

const createSelectOptions = content => {
  let containerOptions = createElement('div');
  let textOptions = createElement('p');
  let selectOptions = createElement('select');
  let choose1 = createElement('option');
  let choose2 = createElement('option');

  selectOptions.setAttribute('id', 'select-calendar');

  containerOptions.classList.add('container-options-calendar');
  textOptions.classList.add('text-options-calendar');

  containerOptions.appendChild(textOptions).innerHTML = 'Escolha sua região:';
  choose1.value = 0;
  choose1.text = 'Joinville';
  selectOptions.appendChild(choose1);
  choose2.value = 1;
  choose2.text = 'Jaraguá do Sul';
  selectOptions.appendChild(choose2);
  containerOptions.appendChild(selectOptions);
  content.appendChild(containerOptions);

  findId('select-calendar').value = selected;
  return;
}

const formatMonthName = month => {
  const months = {
    Jan: 'Janeiro',
    Feb: 'Fevereiro',
    Mar: 'Março',
    Apr: 'Abril',
    May: 'Maio',
    Jun: 'Junho',
    Jul: 'Julho',
    Aug: 'Agosto',
    Sep: 'Setembro',
    Oct: 'Outubro',
    Nov: 'Novembro',
    Dec: 'Dezembro'
  };
  return months[month] || '';
}

const modifyDOMCalendar = (dom, fn) => {
  document.body.style.width = '300px';

  let calendar = dom.getElementsByClassName('grid-calendar')[0];
  let dates = formatNodeListToArray(calendar.getElementsByTagName('article'));
  let content = findId('content');
  let items = {};

  const date = new Date();

  let today = date.getDate();
  today = formatDay(today);

  content.innerHTML = '';

  createSelectOptions(content);

  dates.forEach((item, index) => {
    let monthName = dates[index].children[0].children[0].innerText;

    items[monthName] = items[monthName] || [];

    items[monthName].push({
      title: dates[index].children[1].children[0].innerText,
      date: dates[index].children[0].childNodes[0].data.replace(/^\s+|\s+$/g, ''),
      month: monthName,
      link: dates[index].children[1].children[1].children[1]
        ? dates[index].children[1].children[1].children[1].href
        : ''
    });
  });

  for (let key in items) {
    items[key].sort((a, b) => {
      return a.date - b.date;
    });
  }

  let ul = createElement('ul');

  content.appendChild(ul);

  for (let key in items) {
    let month = createElement('li');
    month.classList.add('month-calendar');

    ul.appendChild(month).innerHTML = `${formatMonthName(key)}`;

    items[key].forEach(item => {
      let li = createElement('li');
      let date = createElement('div');
      let title = item.link !== ''
        ? createElement('a')
        : createElement('div');

      if (item.link) {
        title.setAttribute('data-url', item.link);
        title.setAttribute('title', item.title);
        title.onclick = actionNewTab;
      }

      li.classList.add('item-calendar');
      date.classList.add('date-calendar', today === item.date && 'date-calendar-today');

      li.appendChild(date).innerHTML = `${item.date}`;
      li.appendChild(title).innerHTML = `${item.title}`;
      ul.appendChild(li);
    });
  }

  addListenerChangeRegion();

  fn(true);
}
