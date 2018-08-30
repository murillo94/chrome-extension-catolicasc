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
