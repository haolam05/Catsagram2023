import initializeEvents from './events.js';

async function initializeCatsagram() {
  createHeader();
  await createCatContainer();
  createPopularityScore();
  createVotes();
  createCommentInput();
  createUserPosts();
  initializeEvents();
}

function createHeader() {
  const h1 = document.createElement('h1');
  h1.innerText = 'Catsagram';
  document.body.appendChild(h1);
}

async function createCatContainer() {
  const div = document.createElement('div');
  div.setAttribute('id', 'img-container');
  const { id, url } = await fetchCat(300);
  div.innerHTML = `<img src='${url}' id='${id}'>`
  document.body.appendChild(div);
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
  div.innerHTML = `Popularity score: <span id="pop-score">0</span>`
  document.body.appendChild(div);
}

function createVotes() {
  const buttons = document.createElement('div');
  buttons.setAttribute('id', 'votes');
  buttons.innerHTML = `
    <div id="votes-container">
      <span id="upvotes">0</span>
      <span>👍🏾</span>
      <button id="upvoteBtn" class="voteButton">Upvote</button>
      <button id="downvoteBtn" class="voteButton">Downvote</button>
      <span id="downvotes">0</span>
      <span>👎🏾</span>
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

window.onload = initializeCatsagram;
