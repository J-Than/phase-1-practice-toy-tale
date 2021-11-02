let addToy = false;
let numberOfToys;

document.addEventListener("DOMContentLoaded", () => {
  fetch('http://localhost:3000/toys')
  .then(resp => resp.json())
  .then(json => collectionBuilder(json));

  function collectionBuilder(array) {
    numberOfToys = array.length;
    array.forEach(entry => buildCard(entry))
  }

  function buildCard(entry) {
    let newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'card');

    let newName = document.createElement('h2');
    newName.textContent = entry.name;

    let newImage = document.createElement('img');
    newImage.src = entry.image;
    newImage.setAttribute('class', 'toy-avatar');

    let newLikes = document.createElement('p');
    newLikes.textContent = `${entry.likes} Likes`;

    let newButton = document.createElement('button');
    newButton.id = entry.id;
    newButton.setAttribute('class', 'like-btn');
    newButton.textContent = 'Like';
    newButton.addEventListener('click', e => incrementLikes(e));

    newDiv.appendChild(newName);
    newDiv.appendChild(newImage);
    newDiv.appendChild(newLikes);
    newDiv.appendChild(newButton);
    document.getElementById('toy-collection').appendChild(newDiv);
  }
  
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const form = document.querySelector('form');
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? 'block' : 'none';
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const submitName = e.target.nameInput.value;
    const submitUrl = e.target.urlInput.value;
    numberOfToys ++;
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: submitName,
        image: submitUrl,
        likes: 0,
      }),
    })
    .then(resp => resp.json())
    .then(json => buildCard(json));
    form.reset();
  })

  function incrementLikes(e) {
    e.preventDefault();
    const toyID = e.target.id;
    const toyLikes = parseInt(e.target.parentElement.querySelector('p').textContent, 10) + 1;
    fetch(`http://localhost:3000/toys/${toyID}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        likes: toyLikes,
      }),
    })
    .then(resp => resp.json())
    .then(json => updateLikes(json));
  }

  function updateLikes(serverObj) {
    const cardLikes = document.getElementById(serverObj.id).parentElement.querySelector('p');
    cardLikes.textContent = `${serverObj.likes} Likes`;
  }
});
