import addCatToContainer from "./index.js";

export default function initializeEvents() {
  const pins = [];
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
  let headerImgEl = document.querySelector('img');

  votesContainerEl.addEventListener('click', updateScore);
  submitCommentBtn.addEventListener('click', updateComments);
  newCatEl.addEventListener('click', updateHeaderImg);
  pinCatEl.addEventListener('click', updateGallary);

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

  function updateGallary() {
    pins.push(`
      <div class='gallery-image'>
        <img src = ${headerImgEl.src} id=${headerImgEl.id}>
        <p>${Number(upvotesEl.innerText)}👍🏾${Number(downvotesEl.innerText)}👎🏾<p/>
      </div>`);
    console.log(pins);
    gallaryEl.innerHTML = pins.join('');
  }
}
