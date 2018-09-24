const calcFreq = (freq, count) => (freq / count).toFixed(1);

const calcAvg = (total, count) => (total / count).toFixed(1);

const formatCourseName = course => {
  const format = course.split(': ').pop();
  return format.charAt(0).toUpperCase() + format.slice(1).toLowerCase();
}

const modifyDOMCourse = (dom, fn) => {
  document.body.style.width = '300px';
  dom.getElementsByTagName('table')[0].setAttribute('id', 'infos');

  const infoDOM = dom.getElementById('infos').rows[0].cells[0].innerText;

  authUser(infoDOM, res => {
    if (res.isNotLogged) {
      fn(false);
    } else {
      if (res.isAuth) {
        dom.getElementsByTagName('table')[2].setAttribute('id', 'notas');

        let course = infoDOM;
        let total = 0;
        let totalApproved = 0;
        let totalDisapproved = 0;
        let freq = 0;
        let count = 0;
        let level = '';
        let items = [];
        let courseName = findId('course-name');
        let content = findId('content');

        content.innerHTML = '';

        const rows = formatNodeListToArray(dom.getElementById('notas').rows);
        const tableLength = rows.length;
        const lastLevel = rows[tableLength - 1].cells[0].innerText;

        rows.forEach(row => {
          let cells = row.cells;

          if (!Number.isNaN(parseFloat(cells[2].innerText))) {
            level = cells[1].children[0].innerText === '' && cells[0].innerText !== lastLevel
              ? parseInt(cells[0].innerText, 10) + 1
              : cells[0].innerText;
            total += parseFloat(cells[2].innerText);
            totalDisapproved += (parseFloat(cells[2].innerText) < 6) && 1;
            totalApproved += (parseFloat(cells[2].innerText) > 6) && 1;
            freq += parseFloat(cells[4].innerText);
            count++;
          }
        });

        items = [{
          name: 'Fase atual do curso:',
          value: level
        }, {
          name: 'Total de matérias cursadas:',
          value: `${count} / ${tableLength - 1}`
        }, {
          name: 'Total de matérias reprovadas:',
          value: totalDisapproved,
          color: totalDisapproved === 0
            ? colorPositive
            : colorNegative
        }, {
          name: 'Total de matérias aprovadas:',
          value: totalApproved,
          color: colorPositive
        }, {
          name: 'Média total das matérias cursadas:',
          value: calcAvg(total, count),
          color: calcAvg(total, count) > 6
            ? colorPositive
            : colorNegative
        }, {
          name: 'Frequência:',
          value: calcFreq(freq, count),
          color: calcFreq(freq, count) > 70
            ? colorPositive
            : colorNegative
        }];

        courseName.innerText = formatCourseName(course);

        let ul = createElement('ul');
        ul.classList.add('info-course');
        content.appendChild(ul);

        items.forEach((item, index) => {
          let li = createElement('li');
          li.setAttribute('id', index);

          ul.appendChild(li).innerHTML = `${item.name} <span>${item.value}</span>`;

          if (item.color) {
            findId(index).style.color = item.color;
          }
        });

        fn(true);
      } else {
        actionTabCourse(urlCourse);
      }
    }
  });
}
