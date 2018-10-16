const formatSubjectName = sugject => sugject.charAt(0).toUpperCase() + sugject.slice(1).toLowerCase();

const formatGrades = value => value = value ? parseFloat(value.replace(/,/g, '.')) : 0;

const formatAvgPartial = values => {
  const arr = [formatGrades(values['1 - Nota 1']), formatGrades(values['2 - Nota 2']), formatGrades(values['3 - Nota 3'])];
  const total = arr.reduce((count, score) => (count + score)) / arr.length;
  return total.toFixed(1);
}

const formatGradesColor = value => value > 6 ? colorPositive : colorNegative;

const modifyDOMGrades = (grades, fn) => {
  document.body.style.width = '300px';

  let ul = createElement('ul');
  ul.classList.add('list-default', 'list-grades');

  content.innerHTML = '';
  content.appendChild(ul);

  grades.forEach(item => {
    let li = createElement('li');
    let subject = createElement('li');
    let infos = createElement('div');
    let infosFinal = createElement('div');

    subject.classList.add('month-calendar');
    subject.style.textTransform = 'inherit';
    subject.style.paddingBottom = '0px';

    infos.classList.add('subject-infos');
    infosFinal.classList.add('subject-infos', 'subject-infos-final');

    const grade1 = formatGrades(item['1 - Nota 1']);
    const grade2 = formatGrades(item['2 - Nota 2']);
    const grade3 = formatGrades(item['3 - Nota 3']);
    const gradeSubs = formatGrades(item['4 - Nota Substitutiva']);
    const gradeFinal = formatGrades(item['4 - Média Final']);
    const gradeAvg = formatAvgPartial(item);

    ul.appendChild(subject).innerHTML = formatSubjectName(item.DISCIPLINA);
    li.appendChild(infos).innerHTML =
    `<div style="min-width: 20%;">
      <p style="margin: 0 0 7px;">Nota 1</p>
      <p style="margin: 0; color: ${formatGradesColor(grade1)}">${grade1}</p>
    </div>
    <div style="min-width: 20%;">
      <p style="margin: 0 0 7px;">Nota 2</p>
      <p style="margin: 0; color: ${formatGradesColor(grade2)}">${grade2}</p>
    </div>
    <div style="min-width: 20%;">
      <p style="margin: 0 0 7px;">Nota 3</p>
      <p style="margin: 0; color: ${formatGradesColor(grade3)}">${grade3}</p>
    </div>
    <div style="min-width: 40%; text-align: right">
      <p style="margin: 0 0 7px;">Média parcial</p>
      <p style="margin: 0; font-weight: bold; color: ${formatGradesColor(gradeAvg)}">${gradeAvg}</p>
    </div>`;
    li.appendChild(infosFinal).innerHTML =
    `<div>
      <p style="margin: 0 0 7px;">Nota Substitutiva</p>
      <p style="margin: 0; color: ${formatGradesColor(gradeSubs)}">${gradeSubs}</p>
    </div>
    <div style="text-align: right;">
      <p style="margin: 0 0 7px;">Média Final</p>
      <p style="margin: 0; font-weight: bold; color: ${formatGradesColor(gradeFinal)}">${gradeFinal}</p>
    </div>`;
    ul.appendChild(li);
  });

  fn(true);
}
