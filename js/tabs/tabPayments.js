const formatPaymentInfo = value => value.trim() || '';

const modifyDOMPayments = (dom, fn) => {
  document.body.style.width = '400px';
  dom.getElementsByTagName('table')[0].setAttribute('id', 'contas');

  let rows = formatNodeListToArray(dom.getElementById('contas').rows);
  let items = [];
  let countPaymentLate = 0;
  let content = findId('content');
  let paymentLate = createElement('div');
  paymentLate.setAttribute('id', 'paymentLate');
  paymentLate.classList.add('payment-status');

  content.innerHTML = '';
  content.appendChild(paymentLate);

  rows = rows.length < 13 ? rows.shift() : rows.slice(1, 13);

  rows.forEach(row => {
    let cells = row.cells;

    items.push({
      due: formatPaymentInfo(cells[0].innerText),
      originalValue: formatPaymentInfo(cells[1].innerText),
      discount: Number(formatPaymentInfo(cells[2].innerText)) + Number(formatPaymentInfo(cells[3].innerText)),
      paidDate: formatPaymentInfo(cells[4].innerText),
      paidValue: formatPaymentInfo(cells[5].innerText)
    });
  });

  let ul = createElement('ul');
  ul.classList.add('payments');
  content.appendChild(ul);

  items.forEach(item => {
    let li = createElement('li');
    let stage = createElement('div');
    let infos = createElement('div');

    stage.classList.add('payment-stage');
    infos.classList.add('payment-infos');

    countPaymentLate += (item.paidDate === 'aberto') && 1;

    li.appendChild(stage).innerHTML = item.paidDate === 'aberto'
      ? `<div style="color: ${colorNegative}; font-weight: 600;">Em aberto</div>`
      : `<div style="color: ${colorPositive}; font-weight: 600;">Pago em ${item.paidDate}</div>`;
    li.appendChild(infos).innerHTML =
    `<div style="min-width: 50%;">
      <p style="margin: 0 0 7px;">Vencimento: ${item.due}</p>
      <p style="margin: 0;">Valor original: ${item.originalValue}</p>
    </div>
    <div style="min-width: 50%; padding-left: 20px;">
      <p style="margin: 0 0 7px;">Descontos: ${item.discount}</p>
      <p style="margin: 0";>Valor baixado: ${item.paidValue}</p>
    </div>`;
    ul.appendChild(li);
  });

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

  findId('paymentLate').innerHTML = `Você tem <span style="color: ${pendingColor}; font-weight: 600;">${countPaymentLate} ${pendingText}</span> ${pendingMonthText}</span>`;

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
