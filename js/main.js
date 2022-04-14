//Example fetch using pokemonapi.co
document.querySelector('form').addEventListener('submit', getFetch)

function getFetch(e){
  e.preventDefault();

  const choice = document.querySelector('input').value
  const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'+choice

  choice
    ? fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          console.log(data);

          clearDefinitions();

          if (data.title) {
            displayWord(`${data.title}.<br>${data.message}`)
          } else {
            const {audio} = getAudio(data);
            addAudio(audio);
            data.forEach((w, i) => {
              displayWord(w.word, i + 1);
              createDefinitionList(`${w.word}${i + 1}`);
              w.meanings.forEach(m =>
                m.definitions.forEach(d =>
                  addDefinitionToList(m.partOfSpeech, d.definition, `${w.word}${i + 1}`)
                )
              );
            })
          }
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
    : handleEmptyQuery();
}

function getAudio(data) {
  return data[0].phonetics.find(ph => ph.audio) || {audio: null};
}

function addAudio(audioURL) {
  if (audioURL) {
    const audio = document.createElement('audio');
    audio.src = audioURL;
    audio.setAttribute('controls', '');
    document.body.appendChild(audio);
  }
}

function displayWord(word, index) {
  const h2 = document.createElement('h2');
  h2.innerHTML = `${word} <sup>${index || ''}</sup>`;
  document.body.appendChild(h2);
}

function createDefinitionList(id) {
  const ul = document.createElement('ul');
  ul.setAttribute('id', id);
  document.body.appendChild(ul);
}

function addDefinitionToList(partOfSpeech, d, id) {
  const li = document.createElement('li');
  li.innerText = `(${partOfSpeech}) ${d}`;
  document.querySelector(`#${id}`).appendChild(li);
}

function clearDefinitions() {
  document.querySelector('audio')?.remove();
  document.querySelectorAll('h2')?.forEach(h2 => h2.remove());
  document.querySelectorAll('ul')?.forEach(ul => ul.remove());
}

function handleEmptyQuery() {
  clearDefinitions();
  displayWord('Please enter a valid word to search.');
}