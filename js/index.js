import initializeEvents from './events.js';

async function initializeCatsagram() {
  createCats();
  createDarkModeBtn();
  createHeader();
  createImgButtons();
  createCatContainer();
  await addCatToContainer();
  createPopularityScore();
  createVotes();
  createCommentInput();
  createUserPosts();
  createPostDetail();
  createCatCursor();
  initializeEvents();
}

function createCats() {
  const directions = ['fs', 'fn', 'fe', 'fw', 'fne', 'fnw', 'fse', 'fsw'];
  const catsContainer = document.createElement('div');
  catsContainer.setAttribute('id', 'cats-container');
  for (let i = 0; i < 100; i++) {
    const direction = directions[Math.round(Math.random() * (directions.length - 1))];
    const cat = document.createElement('div');
    cat.classList.add('cat');
    cat.classList.add(direction);
    cat.innerText = '🐈';
    catsContainer.appendChild(cat);
  }
  document.body.appendChild(catsContainer);
}

function createDarkModeBtn() {
  const btn = document.createElement('button');
  btn.setAttribute('id', 'mode-btn');
  btn.classList.add('light');
  btn.classList.add('mode-btn');
  btn.innerText = 'DarkMode';
  document.body.appendChild(btn);
}

function createHeader() {
  const h1 = document.createElement('h1');
  h1.innerText = 'Catsagram';
  document.body.appendChild(h1);
}

function createImgButtons() {
  const div = document.createElement('div');
  div.setAttribute('id', 'image-buttons');
  div.innerHTML = `
    <button id="new-cat">New</button>
    <button id="pin-cat">Pin</button>
    <button id="unpin-cat">UnPin</button>
  `;
  document.body.appendChild(div);
}

function createCatContainer() {
  const div = document.createElement('div');
  div.setAttribute('id', 'img-container');
  document.body.appendChild(div);
}

export default async function addCatToContainer() {
  try {
    const imgContainer = document.querySelector('#img-container');
    const { id, url } = await fetchCat(300);
    imgContainer.innerHTML = `<img src='${url}' id='${id}'>`
  } catch {
    await addCatToContainer();
  }
}

async function fetchCat(maxHeight) {
  let data;
  let heightOk = false;
  while (!heightOk) {
    const res = await fetch('https://api.thecatapi.com/v1/images/search');
    data = await res.json();
    if (data[0]['height'] <= maxHeight) heightOk = true;
  }
  return data[0];
}

function createPopularityScore() {
  const div = document.createElement('div');
  div.setAttribute('id', 'pop');
  div.innerHTML = `<span>Popularity score: </span><span id="pop-score">0</span>`
  document.body.appendChild(div);
}

function createVotes() {
  const buttons = document.createElement('div');
  buttons.setAttribute('id', 'votes');
  buttons.innerHTML = `
    <div id="votes-container">
      <span id="upvotes">0</span>
      <span class="thumbs">👍🏾</span>
      <button id="upvoteBtn" class="voteButton">Upvote</button>
      <button id="downvoteBtn" class="voteButton">Downvote</button>
      <span id="downvotes">0</span>
      <span class="thumbs">👎🏾</span>
    </div>
  `;
  document.body.appendChild(buttons);
}
function createCommentInput() {
  const div = document.createElement('div');
  div.setAttribute('id', 'comment-input');
  div.innerHTML = `
    <label>Comment: </label>
    <input placeholder="Add a comment...">
    <button>Submit</button>
  `;
  document.body.appendChild(div);
}

function createUserPosts() {
  const div = document.createElement('div');
  div.setAttribute('id', 'post');
  div.innerHTML = `
    <div id='gallery'></div>
    <div id='comments'></div>
  `
  document.body.appendChild(div);
}

function createPostDetail() {
  const div = document.createElement('div');
  div.setAttribute('id', 'modal');
  div.classList.add('hidden');
  div.innerHTML = `
    <div id='modal-image'>img</div>
    <div id='modal-comments'>comments</div>
    <button id='modal-btn'><img src='./images/brown-X.png'></button>
  `;
  document.body.appendChild(div);
}

function createCatCursor() {
  const div = document.createElement('div');
  div.setAttribute('id', 'cat-cursor');
  div.innerText = '🐈‍⬛';
  document.body.appendChild(div);
}

window.onload = initializeCatsagram;
