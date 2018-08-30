let loading,
    contentAll;

const colorPositive = "#4ca64c",
      colorNegative = "#ff6666";

document.addEventListener('DOMContentLoaded', function() {
  try {
    let btnLogin = findId("login"),
        btnClose = findId("close"),
        btnCourse = findId('tab-course'),
        btnPayments = findId('tab-payments');

    loading = findId('load');
    contentAll = findId('content-all');

    btnLogin.onclick = actionNewTab;
    btnClose.onclick = actionClose;
    btnCourse.onclick = actionTabCourse;
    btnPayments.onclick = actionTabPayments;

    requestTabCourse(urlCourse);
  } catch(err) {
    actionClose();
  }
});

function findId(query, context = document) {
  return context.getElementById(query);
}

function authUser(dom, fn) {
  const isLogged = (dom.split(': ').pop().replace(/\s/g, '') === 'Históricoacadêmico');
  const isAuth = (dom.split(': ').pop().replace(/\s/g, '') !== '');

  fn({isLogged: isLogged, isAuth: isAuth});
}

function actionNewTab() {
  chrome.tabs.create({active: true, url: this.dataset.url});
}

function actionClose() {
  window.close();
}

function actionTabCourse() {
  this.parentNode.dataset.selectedTab = '1';
  requestTabCourse();
}

function actionTabPayments() {
  this.parentNode.dataset.selectedTab = '2';
  requestTabPayments();
}

function requestTabCourse() {
  request(urlCourse, 'multiple', (parser, response) => {
    modifyDOMCourse(parser.parseFromString(response.data, "text/html"), res => {
      requestDone(res);
    });
  });
}

function requestTabPayments() {
  request(urlPayments, 'individual', (parser, response) => {
    modifyDOMPayments(parser.parseFromString(response.data, "text/html"), res => {
      requestDone(res);
    });
  });
}

function request(url, type, fn) {
  loading.style.display = "block";
  contentAll.style.display = "none";

  const getType = type === 'multiple' ? getMultiple(url) : get(url);

  getType
    .then(response => {
      const parser = new DOMParser();
      fn(parser, response);
    })
    .catch(errorMessage => {
      actionClose();
    });
}

function requestDone(res) {
  loading.style.display = "none";

  if(res) {
    contentAll.style.display = "block";
  } else {
    let contentNotLogged = findId('content-not-logged');
    contentNotLogged.style.display = "block";
  }
}

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

function modifyDOMPayments(dom, fn) {
  document.body.style.width = '530px';
  dom.getElementsByTagName("table")[0].setAttribute("id", "contas");

  let rows = dom.getElementById("contas").rows,
      header = rows[0].cells,
      countPaymentLate = 0,
      content = findId('content');

  content.innerHTML = '';

  const tableLength = rows.length > 11 ? 12 : rows.length;
  const headerLength = rows[0].cells.length;

  let paymentLate = document.createElement('div');
  paymentLate.setAttribute('id', 'paymentLate');

  let table = document.createElement('table');
  let tr = document.createElement('tr');

  content.appendChild(paymentLate);
  content.appendChild(table);
  table.appendChild(tr);

  for(let x = 0; x < headerLength; x++) {
    let td = document.createElement('td');
    td.setAttribute('id', x);
    td.setAttribute('size', 2);
    td.setAttribute('align', 'left');
    tr.appendChild(td).innerHTML = header[x].innerText;
  }

  for(let y = 1; y <= tableLength; y++) {
    let trNew = document.createElement('tr');
    for(let i = 0; i < rows[y].cells.length; i++) {
      let tdNew = document.createElement('td');
      tdNew.setAttribute('id', y+i);
      tdNew.setAttribute('size', 2);
      tdNew.setAttribute('align', 'left');
      tdNew.style.paddingLeft = '5px';
      if(i === 0 && rows[y].cells[4].innerText === 'aberto') {
        trNew.style.background = 'rgba(255, 102, 102, 0.8)';
        trNew.style.color = '#ffffff';
        countPaymentLate++;
      }
      trNew.appendChild(tdNew).innerHTML = rows[y].cells[i].innerText;
      table.appendChild(trNew);
    }
  }

  const pendingText = countPaymentLate === 1 ? 'pendência' : 'pendências';
  const pendingMonthText = tableLength === 1 ? 'no último mês' : `nos últimos ${tableLength} meses`;
  const pendingColor = countPaymentLate > 0 ? colorNegative : colorPositive;

  findId('paymentLate').innerHTML = `Você tem <span style="color:${pendingColor};">${countPaymentLate} ${pendingText}</span> ${pendingMonthText}</span>`;

  if(countPaymentLate > 0) {
    let paymentLink = document.createElement('a');

    paymentLink.setAttribute('data-url', 'https://app.catolicasc.org.br/BoletoNovo/?origem=academico');
    paymentLink.style.cssText = 'margin-left: 5px; cursor: pointer; text-decoration: underline;'
    paymentLink.innerHTML = '(Imprimir)';
    findId('paymentLate').appendChild(paymentLink);
    paymentLink.onclick = actionNewTab;
  }

  fn(true);
}
