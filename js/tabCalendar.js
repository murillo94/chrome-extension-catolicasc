function formatMonthName(month) {
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

function modifyDOMCalendar(dom, fn) {
  document.body.style.width = '300px';

  let calendar = dom.getElementsByClassName('grid-calendar')[0];
  let dates = calendar.getElementsByTagName('article');
  let content = findId('content');
  let items = {};

  const datesLength = dates.length;

  content.innerHTML = '';

  for (let x = 0; x < datesLength; x++) {
    if (items[dates[x].children[0].children[0].innerText] === undefined) {
      items[dates[x].children[0].children[0].innerText] = [];
    }

    items[dates[x].children[0].children[0].innerText].push({
      title: dates[x].children[1].children[0].innerText,
      date: dates[x].children[0].childNodes[0].data.replace(/^\s+|\s+$/g, ''),
      month: dates[x].children[0].children[0].innerText,
      link: dates[x].children[1].children[1].children[1]
        ? dates[x].children[1].children[1].children[1].href
        : ''
    });
  }

  let ul = createElement('ul');

  content.appendChild(ul);

  for (let key in items) {
    let month = createElement('li');
    let itemLength = items[key].length;

    month.classList.add('month-calendar');

    ul.appendChild(month).innerHTML = `${formatMonthName(key)}`;

    for (let i = 0; i < itemLength; i++) {
      let li = createElement('li');
      let date = createElement('div');
      let title = items[key][i].link !== ''
        ? createElement('a')
        : createElement('div');

      if (items[key][i].link !== '') {
        title.setAttribute('data-url', items[key][i].link);
        title.setAttribute('title', items[key][i].title);
        title.onclick = actionNewTab;
      }

      li.classList.add('item-calendar');
      date.classList.add('date-calendar');
      title.classList.add('title-calendar');

      li.appendChild(date).innerHTML = `${items[key][i].date}`;
      li.appendChild(title).innerHTML = `${items[key][i].title}`;
      ul.appendChild(li);
    }
  }

  fn(true);
}