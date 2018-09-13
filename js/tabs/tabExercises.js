const modifyDOMExercises = (dom, fn) => {
  document.body.style.width = '300px';

  let content = findId('content');

  content.innerHTML = '';
  content.innerHTML = dom.body.innerHTML;

  let links = content.getElementsByTagName('a');

  for (let x = 0; x < links.length; x++) {
    let href = links[x].getAttribute('href');
    links[x].setAttribute('data-url', href);
    links[x].setAttribute('title', href);
    links[x].onclick = actionNewTab;
  }

  fn(true);
}
