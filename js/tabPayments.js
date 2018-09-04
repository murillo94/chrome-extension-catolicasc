function modifyDOMPayments(dom, fn) {
  document.body.style.width = '530px';
  dom.getElementsByTagName('table')[0].setAttribute('id', 'contas');

  let rows = dom.getElementById('contas').rows;
  let header = rows[0].cells;
  let countPaymentLate = 0;
  let content = findId('content');

  content.innerHTML = '';

  const tableLength = rows.length > 11
    ? 12
    : rows.length;
  const headerLength = rows[0].cells.length;

  let paymentLate = createElement('div');
  paymentLate.setAttribute('id', 'paymentLate');
  paymentLate.classList.add('payment-status');

  let table = createElement('table');
  let tr = createElement('tr');

  content.appendChild(paymentLate);
  content.appendChild(table);
  table.appendChild(tr);

  for(let x = 0; x < headerLength; x++) {
    let td = createElement('td');
    td.setAttribute('id', x);
    td.setAttribute('size', 2);
    td.setAttribute('align', 'left');
    tr.appendChild(td).innerHTML = header[x].innerText;
  }

  for(let y = 1; y <= tableLength; y++) {
    let trNew = createElement('tr');
    for(let i = 0; i < rows[y].cells.length; i++) {
      let tdNew = createElement('td');
      tdNew.setAttribute('id', y+i);
      tdNew.setAttribute('size', 2);
      tdNew.setAttribute('align', 'left');
      tdNew.style.paddingLeft = '5px';
      if(i === 0 && rows[y].cells[4].innerText === 'aberto') {
        trNew.classList.add('payment-row-open');
        countPaymentLate++;
      }
      trNew.appendChild(tdNew).innerHTML = rows[y].cells[i].innerText;
      table.appendChild(trNew);
    }
  }

  const pendingText = countPaymentLate === 1
    ? 'pendência'
    : 'pendências';
  const pendingMonthText = tableLength === 1
    ? 'no último mês'
    : `nos últimos ${tableLength} meses`;
  const pendingColor = !!countPaymentLate
    ? colorNegative
    : colorPositive;

  findId('paymentLate').innerHTML = `Você tem <span style="color: ${pendingColor};">${countPaymentLate} ${pendingText}</span> ${pendingMonthText}</span>`;

  if(!!countPaymentLate) {
    let paymentLink = createElement('a');

    paymentLink.setAttribute('data-url', 'https://app.catolicasc.org.br/BoletoNovo/?origem=academico');
    paymentLink.classList.add('payment-link');
    paymentLink.innerHTML = '(Imprimir)';
    findId('paymentLate').appendChild(paymentLink);
    paymentLink.onclick = actionNewTab;
  }

  fn(true);
}
