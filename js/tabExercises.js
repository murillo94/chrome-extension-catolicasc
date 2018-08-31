function modifyDOMExercises(dom, fn) {
  document.body.style.width = '300px';

  let content = findId('content');

  content.innerHTML = '';
  content.innerHTML = dom.body.innerHTML;

  let links = content.getElementsByTagName('a');

  for (var i = 0; i < links.length; i++) {
    let href = links[i].getAttribute('href');
    links[i].setAttribute('data-url', href);
    links[i].onclick = actionNewTab;
  }

  fn(true);
}
