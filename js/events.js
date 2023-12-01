import addCatToContainer from "./index.js";

export default function initializeEvents(
  {
    MAX_CHAR_COMMENT, modeBtnEl, votesContainerEl, votesContainerThumbsEl, popScoreEl, upvotesEl, downvotesEl, submitCommentEl, commentInputEl, commentsEl, galleryEl, newCatEl, pinCatEl, unpinCatEl, modalEl, modalImageEl, modalCommentsEl, modalBtnEl, catsContainerEl, headerImgEl, nextThumbColor, modeAffectElements, blurAffectedElements, pins, comments
  }
) {
  addEventListeners();

  function addEventListeners() {
    modeBtnEl.addEventListener('click', switchMode);
    votesContainerEl.addEventListener('click', updateScore);
    submitCommentEl.addEventListener('click', updateComments);
    newCatEl.addEventListener('click', updateHeaderImg);
    pinCatEl.addEventListener('click', pinCat);
    unpinCatEl.addEventListener('click', unpinCat);
    galleryEl.addEventListener('click', showCat);
    galleryEl.addEventListener('click', showModal);
    modalBtnEl.addEventListener('click', closeModal);
  }

  function switchMode(e) {
    const toDarkMode = e.target.classList.contains('light');
    _toggleMode(toDarkMode);
    toDarkMode ? _addDarkModeToElements() : _removeDarkmModeForElements();
    _switchThumbsColor();
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
    div.innerText = commentInputEl.value.slice(0, MAX_CHAR_COMMENT).toLowerCase();
    commentsEl.appendChild(div);
    commentInputEl.value = '';
    if (headerImgEl.id in comments) _saveToComments();
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

  function pinCat() {
    saveToGallery();
    _saveToComments();
  }

  function unpinCat() {
    if (headerImgEl.id in pins) {
      delete pins[headerImgEl.id];
      delete comments[headerImgEl.id];
      galleryEl.innerHTML = Object.values(pins).join('');
    }
  }

  function showCat(e) {
    if (e.target.id in pins) {
      _replaceHeaderImg(e.target);
      _replaceScores(e.target.parentElement.querySelectorAll('.pin-vote'));
      _replaceComments(e.target.id);
    }
  }

  function showModal(e) {
    if (e.target.classList.contains('gallery-img')) {
      _blurElements();
      catsContainerEl.classList.add('hidden');
      modalEl.classList.remove('hidden');
      modalImageEl.innerHTML = pins[e.target.id];
      modalCommentsEl.innerHTML = comments[e.target.id];
      modeBtnEl.classList.contains('dark') ? modalEl.classList.add('dark-mode') : modalEl.classList.remove('dark-mode');
    }
  }

  function closeModal() {
    _unblurElements();
    catsContainerEl.classList.remove('hidden');
    modalEl.classList.add('hidden');
  }


  /****************************************************************************************/
  /*********************************** HELPER FUNCTIONS ***********************************/
  /****************************************************************************************/
  function _addDarkModeToElements() {
    modeAffectElements.forEach(el => el.classList.add('dark-mode'))
  }

  function _removeDarkmModeForElements() {
    modeAffectElements.forEach(el => el.classList.remove('dark-mode'))
  }

  function _toggleMode(toDarkMode) {
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

  function _switchThumbsColor() {
    votesContainerThumbsEl.forEach(el => el.innerText = nextThumbColor[el.innerText]);
    _updatePins();
    _updateModal();
  }

  function _updatePins() {
    const [currThumbUp, currThumbDown] = _getCurrentThumbs();
    const [prevThumbUp, prevThumbDown] = [nextThumbColor[currThumbUp], nextThumbColor[currThumbDown]];
    const galleryImages = document.querySelectorAll('.gallery-image>img');
    galleryImages.forEach(img => pins[img.id] = pins[img.id].replace(prevThumbUp, currThumbUp).replace(prevThumbDown, currThumbDown));
    _updateGallery();
  }

  function _updateModal() {
    const id = modalImageEl.querySelector('.gallery-image>img').id;
    modalImageEl.innerHTML = pins[id];
  }

  function _getCurrentThumbs() {
    return modeBtnEl.classList.contains('light') ? ['👍🏾', '👎🏾'] : ['👍🏻', '👎🏻'];
  }

  function _saveToPins() {
    const [thumbUp, thumbDown] = _getCurrentThumbs();
    pins[headerImgEl.id] = `
      <div class='gallery-image'>
        <img class='gallery-img' src = ${headerImgEl.src} id=${headerImgEl.id}>
        <p>
          <span class='pin-vote' id='pin-upvote'>${Number(upvotesEl.innerText)}</span>
          <span class='thumbs'>${thumbUp}</span>
          <span class='pin-vote' id='pin-downvote'>${Number(downvotesEl.innerText)}</span>
          <span class='thumbs'>${thumbDown}</span>
        </p>
      </div>
    `;
  }

  function _updateGallery() {
    galleryEl.innerHTML = Object.values(pins).join('');
  }

  function saveToGallery() {
    _saveToPins();
    _updateGallery();
  }

  function _saveToComments() {
    comments[headerImgEl.id] = commentsEl.innerHTML;
  }

  function _replaceHeaderImg(img) {
    headerImgEl.src = img.src;
    headerImgEl.id = img.id;
  }

  function _replaceScores(pins) {
    const [upvotes, downvotes] = [Number(pins[0].textContent), Number(pins[1].textContent)];
    upvotesEl.innerText = upvotes;
    downvotesEl.innerText = downvotes;
    popScoreEl.innerText = upvotes - downvotes;
  }

  function _replaceComments(id) {
    commentsEl.innerHTML = comments[id];
  }

  function _blurElements() {
    blurAffectedElements.forEach(el => el.classList.add('blur'));
  }

  function _unblurElements() {
    blurAffectedElements.forEach(el => el.classList.remove('blur'));
  }
}
