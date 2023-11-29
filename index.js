async function initializeCatsagram() {
  createHeader();
  await fetchCat();
  createPopularityScore();
  createVotes();
  createCommentInput();
  createUserPosts();
}

function createHeader() {
  const h1 = document.createElement('h1');
  h1.innerText = 'Catsagram';
  document.body.appendChild(h1);
}

async function fetchCat() {
  const div = document.createElement('div');
  const res = await fetch('https://api.thecatapi.com/v1/images/search');
  const data = await res.json();
  const { id, url } = data[0];
  div.innerHTML = `<img src='${url}' id='${id}'>`
  document.body.appendChild(div);
}

function createPopularityScore() {
  const div = document.createElement('div');
  div.setAttribute('id', 'pop');
  div.innerHTML = `Popularity score <span id="pop-score">0</span>`
  document.body.appendChild(div);
}

function createVotes() {
  const buttons = document.createElement('div');
  buttons.setAttribute('id', 'votes');
  buttons.innerHTML = `
    <button id="upvoteBtn" class="voteButton">Upvote</button>
    <button id="downVoteBtn" class="voteButton">Downvote</button>
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
