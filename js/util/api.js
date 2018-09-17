const getMultiple = urls => {
  return new Promise((resolve, reject) => {
    axios.all([
      axios.get(urls[0]),
      axios.get(urls[1])
    ])
    .then(axios.spread((firstResponse, secondResponse) => resolve(secondResponse)))
    .catch(err => reject(err));
  });
}

const get = url => {
  return new Promise((resolve, reject) => {
    axios.get(url[0])
    .then(response => resolve(response))
    .catch(err => reject(err));
  });
}
