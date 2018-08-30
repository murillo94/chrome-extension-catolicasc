function modifyDOMCourse(dom, fn) {
  document.body.style.width = '300px';
  dom.getElementsByTagName("table")[0].setAttribute("id", "infos");

  const infoDOM = dom.getElementById("infos").rows[0].cells[0].innerText;

  authUser(infoDOM, res => {
    if(res.isLogged) {
      fn(false);
    } else {
      if(res.isAuth) {
        dom.getElementsByTagName("table")[2].setAttribute("id", "notas");

        let course = infoDOM,
            rows = dom.getElementById("notas").rows,
            total = 0,
            totalApproved = 0,
            totalDisapproved = 0,
            freq = 0,
            count = 0,
            level = "",
            items = [],
            courseName = findId('course-name'),
            content = findId('content');

        content.innerHTML = '';

        const tableLength = rows.length;
        const lastLevel = rows[tableLength - 1].cells[0].innerText;

        const calcFreq = function() {
          return (freq / count).toFixed(1);
        };

        const calcAvg = function() {
          return total / count;
        };

        const formatCourseName = function() {
          const format = course.split(': ').pop();
          return format.charAt(0).toUpperCase() + format.slice(1).toLowerCase();
        };

        for (let x = 0; x < tableLength; x++) {
          if (!Number.isNaN(parseFloat(rows[x].cells[2].innerText))) {
            level = rows[x].cells[1].children[0].innerText === "" && rows[x].cells[0].innerText !== lastLevel ? parseInt(rows[x].cells[0].innerText) + 1 : rows[x].cells[0].innerText;
            total += parseFloat(rows[x].cells[2].innerText);
            totalDisapproved += parseFloat(rows[x].cells[2].innerText) < 6 ? 1 : 0;
            totalApproved += parseFloat(rows[x].cells[2].innerText) > 6 ? 1 : 0;
            freq += parseFloat(rows[x].cells[4].innerText);
            count++;
          }
        }

        items = [{
          name: 'Fase atual do curso:',
          value: level
        }, {
          name: 'Total de matérias cursadas:',
          value: `${count} / ${tableLength - 1}`
        }, {
          name: 'Total de matérias reprovadas:',
          value: totalDisapproved,
          color: totalDisapproved === 0 ? colorPositive : colorNegative
        }, {
          name: 'Total de matérias aprovadas:',
          value: totalApproved,
          color: colorPositive
        }, {
          name: 'Média total das matérias cursadas:',
          value: calcAvg(),
          color: calcAvg() > 6 ? colorPositive : colorNegative
        }, {
          name: 'Frequência:',
          value: calcFreq(),
          color: calcFreq() > 70 ? colorPositive : colorNegative
        }];

        courseName.innerText = formatCourseName();

        let ul = document.createElement('ul');
        const itemsLength = items.length;

        content.appendChild(ul);

        for(let y = 0; y < itemsLength; y++) {
          let li = document.createElement('li');
          li.setAttribute('id', y);
          ul.appendChild(li).innerHTML = `${items[y].name} <span>${items[y].value}</span>`;
          if(items[y].color) {
            findId(y).style.color = items[y].color;
          }
        }

        fn(true);
      } else {
        requestTabCourse(urlCourse);
      }
    }
  });
}
