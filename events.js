import addCatToContainer from "./index.js";

export default function initializeEvents() {
  const bodyEl = document.body;
  const h1El = document.querySelector('h1');
  const modeBtnEl = document.querySelector('#mode-btn');
  const votesContainerEl = document.querySelector('#votes-container');
  const votesContainerThumbsEl = votesContainerEl.querySelectorAll('.thumbs');
  const upvoteBtnEl = document.querySelector('#upvoteBtn');
  const downvoteBtnEl = document.querySelector('#downvoteBtn');
  const popScoreEl = document.querySelector('#pop-score');
  const upvotesEl = document.querySelector('#upvotes');
  const downvotesEl = document.querySelector('#downvotes');
  const submitCommentEl = document.querySelector('#comment-input>button');
  const commentInputEl = document.querySelector('#comment-input>input');
  const commentsEl = document.querySelector('#comments');
  const galleryEl = document.querySelector('#gallery');
  const newCatEl = document.querySelector('#new-cat');
  const pinCatEl = document.querySelector('#pin-cat');
  const unpinCatEl = document.querySelector('#unpin-cat');
  const postEl = document.querySelector('#post');
  let headerImgEl = document.querySelector('img');
  const pins = {};
  const comments = {};
  const nextThumbColor = { '👍🏾': '👍🏻', '👍🏻': '👍🏾', '👎🏾': '👎🏻', '👎🏻': '👎🏾' }
  const modeAffectElements = [bodyEl, h1El, newCatEl, pinCatEl, unpinCatEl, upvoteBtnEl, downvoteBtnEl, submitCommentEl, commentInputEl, postEl, commentsEl];


  modeBtnEl.addEventListener('click', switchMode);
  votesContainerEl.addEventListener('click', updateScore);
  submitCommentEl.addEventListener('click', updateComments);
  newCatEl.addEventListener('click', updateHeaderImg);
  pinCatEl.addEventListener('click', pinCat);
  unpinCatEl.addEventListener('click', unpinCat);
  galleryEl.addEventListener('click', showCat);

  function switchMode(e) {
    const toDarkMode = e.target.classList.contains('light');
    toggleMode(toDarkMode);
    toDarkMode ? addDarkModeToElements() : removeDarkmModeForElements();
    switchThumbsColor();
  }

  function addDarkModeToElements() {
    modeAffectElements.forEach(el => el.classList.add('dark-mode'))
  }

  function removeDarkmModeForElements() {
    modeAffectElements.forEach(el => el.classList.remove('dark-mode'))
  }

  function toggleMode(toDarkMode) {
    if (toDarkMode) {
      modeBtnEl.classList.remove('light');
      modeBtnEl.classList.add('dark');
      modeBtnEl.innerText = 'Lightmode'
    } else {
      modeBtnEl.classList.remove('dark');
      modeBtnEl.classList.add('light');
      modeBtnEl.innerText = 'Darkmode'
    }
  }

  function switchThumbsColor() {
    votesContainerThumbsEl.forEach(el => el.innerText = nextThumbColor[el.innerText]);
    updatePins();
  }

  function updatePins() {
    const [currThumbUp, currThumbDown] = getCurrentThumbs();
    const [prevThumbUp, prevThumbDown] = [nextThumbColor[currThumbUp], nextThumbColor[currThumbDown]];
    const galleryImages = document.querySelectorAll('.gallery-image>img');
    galleryImages.forEach(img => pins[img.id] = pins[img.id].replace(prevThumbUp, currThumbUp).replace(prevThumbDown, currThumbDown));
    updateGallery();
  }

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
    if (headerImgEl.id in comments) saveToComments();
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
      galleryEl.innerHTML = Object.values(pins).join('');
    }
  }

  function pinCat() {
    saveToGallery();
    saveToComments();
  }

  function getCurrentThumbs() {
    return modeBtnEl.classList.contains('light') ? ['👍🏾', '👎🏾'] : ['👍🏻', '👎🏻'];
  }

  function saveToPins() {
    const [thumbUp, thumbDown] = getCurrentThumbs();
    pins[headerImgEl.id] = `
      <div class='gallery-image'>
        <img src = ${headerImgEl.src} id=${headerImgEl.id}>
        <p>
          <span class='pin-vote' id='pin-upvote'>${Number(upvotesEl.innerText)}</span>
          <span class='thumbs'>${thumbUp}</span>
          <span class='pin-vote' id='pin-downvote'>${Number(downvotesEl.innerText)}</span>
          <span class='thumbs'>${thumbDown}</span>
        </p>
      </div>
    `;
  }

  function updateGallery() {
    galleryEl.innerHTML = Object.values(pins).join('');
  }

  function saveToGallery() {
    saveToPins();
    updateGallery();
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
