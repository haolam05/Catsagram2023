import addCatToContainer from "./index.js";

export default function initializeEvents() {
  const pins = {};
  const comments = {};
  const votesContainerEl = document.querySelector('#votes-container');
  const popScoreEl = document.querySelector('#pop-score');
  const upvotesEl = document.querySelector('#upvotes');
  const downvotesEl = document.querySelector('#downvotes');
  const submitCommentBtn = document.querySelector('#comment-input>button');
  const commentInputEl = document.querySelector('#comment-input>input');
  const commentsEl = document.querySelector('#comments');
  const gallaryEl = document.querySelector('#gallery');
  const newCatEl = document.querySelector('#new-cat');
  const pinCatEl = document.querySelector('#pin-cat');
  const unpinCatEl = document.querySelector('#unpin-cat');
  let headerImgEl = document.querySelector('img');

  votesContainerEl.addEventListener('click', updateScore);
  submitCommentBtn.addEventListener('click', updateComments);
  newCatEl.addEventListener('click', updateHeaderImg);
  pinCatEl.addEventListener('click', pinCat);
  unpinCatEl.addEventListener('click', unpinCat);
  gallaryEl.addEventListener('click', showCat);

  function updateScore(e) {
    if (['upvoteBtn', 'downvoteBtn'].includes(e.target.id)) {
      const updatedEl = e.target.id == 'upvoteBtn' ? upvotesEl : downvotesEl;
      const currScore = updatedEl.innerText;
      const nextScore = Number(currScore) + 1;
      updatedEl.innerText = nextScore;
      const upvotes = Number(upvotesEl.innerText);
      const downvotes = Number(downvotesEl.innerText);
      popScoreEl.innerText = upvotes - downvotes;
    }
  }

  function updateComments() {
    const div = document.createElement('div');
    div.classList.add('comment');
    div.innerText = commentInputEl.value.slice(0, 40);
    commentsEl.appendChild(div);
    commentInputEl.value = '';
    if (headerImgEl.id in comments) comments[headerImgEl.id] = commentsEl.innerHTML;
  }

  async function updateHeaderImg() {
    headerImgEl.remove();
    await addCatToContainer();
    headerImgEl = document.querySelector('img');
    upvotesEl.innerText = 0;
    downvotesEl.innerText = 0;
    popScoreEl.innerText = 0;
    commentsEl.innerText = '';
  }

  function unpinCat() {
    if (headerImgEl.id in pins) {
      delete pins[headerImgEl.id];
      delete comments[headerImgEl.id];
      gallaryEl.innerHTML = Object.values(pins).join('');
    }
  }

  function pinCat() {
    saveToGallary();
    saveToComments();
  }

  function saveToGallary() {
    pins[headerImgEl.id] = `
      <div class='gallery-image'>
        <img src = ${headerImgEl.src} id=${headerImgEl.id}>
        <p>
          <span class='pin-vote' id='pin-upvote'>${Number(upvotesEl.innerText)}</span>
          <span>👍🏾</span>
          <span class='pin-vote' id='pin-downvote'>${Number(downvotesEl.innerText)}</span>
          <span>👎🏾</span>
        </p>
      </div>
    `;
    gallaryEl.innerHTML = Object.values(pins).join('');
  }

  function saveToComments() {
    comments[headerImgEl.id] = commentsEl.innerHTML;
  }

  function showCat(e) {
    if (e.target.id in pins) {
      replaceHeaderImg(e.target);
      replaceScores(e.target.parentElement.querySelectorAll('.pin-vote'));
      replaceComments(e.target.id);
    }
  }

  function replaceHeaderImg(img) {
    headerImgEl.src = img.src;
    headerImgEl.id = img.id;
  }

  function replaceScores(pins) {
    const [upvotes, downvotes] = [Number(pins[0].textContent), Number(pins[1].textContent)];
    upvotesEl.innerText = upvotes;
    downvotesEl.innerText = downvotes;
    popScoreEl.innerText = upvotes - downvotes;
  }

  function replaceComments(id) {
    commentsEl.innerHTML = comments[id];
  }
}
