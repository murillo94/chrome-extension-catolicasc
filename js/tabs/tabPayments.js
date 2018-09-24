const formatPaymentInfo = value => value.trim() || '';

const modifyDOMPayments = (dom, fn) => {
  document.body.style.width = '530px';
  dom.getElementsByTagName('table')[0].setAttribute('id', 'contas');

  let rows = formatNodeListToArray(dom.getElementById('contas').rows);
  let items = [];
  let countPaymentLate = 0;
  let content = findId('content');

  content.innerHTML = '';

  rows.shift();

  rows.forEach(row => {
    let cells = row.cells;

    items.push({
      due: formatPaymentInfo(cells[0].innerText),
      originalValue: formatPaymentInfo(cells[1].innerText),
      exchange: formatPaymentInfo(cells[2].innerText),
      discount: formatPaymentInfo(cells[3].innerText),
      paidDate: formatPaymentInfo(cells[4].innerText),
      paidValue: formatPaymentInfo(cells[5].innerText)
    });
  });

  //aberto -> countPaymentLate++;

  let paymentLate = createElement('div');
  paymentLate.setAttribute('id', 'paymentLate');
  paymentLate.classList.add('payment-status');

  content.appendChild(paymentLate);

  const tableLength = rows.length > 11
    ? 12
    : rows.length;
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

  if (!!countPaymentLate) {
    let paymentLink = createElement('a');

    paymentLink.setAttribute('data-url', 'https://app.catolicasc.org.br/BoletoNovo/?origem=academico');
    paymentLink.setAttribute('title', 'https://app.catolicasc.org.br/BoletoNovo/?origem=academico');
    paymentLink.classList.add('payment-link');
    paymentLink.innerHTML = '(Imprimir)';
    findId('paymentLate').appendChild(paymentLink);
    paymentLink.onclick = actionNewTab;
  }

  fn(true);
}
