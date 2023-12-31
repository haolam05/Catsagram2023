import addCatToContainer from "./index.js";
import initializeElements from './elements.js';

export default function initializeEvents() {
  initialize(initializeElements());
}

function initialize() {
  let pinsOrder = [];
  let pins = {};
  let comments = {};
  if (confirm('Do you want to keep your changes?')) {
    if (_localStorageHasData()) _restoreData();
  } else {
    clearStorage();
  }
  let {
    MAX_CHAR_COMMENT, bodyEl, modeBtnEl, votesContainerEl, votesContainerThumbsEl, popScoreEl, upvotesEl, downvotesEl, submitCommentEl, commentInputEl, commentsEl, galleryEl, newCatEl, pinCatEl, unpinCatEl, modalEl, modalImageEl, modalCommentsEl, modalBtnEl, catsContainerEl, headerImgEl, nextThumbColor, modeAffectElements, blurAffectedElements, modeBtnTextEl
  } = initializeElements();
  addEventListeners();

  function addEventListeners() {
    // Affect local storage status
    modeBtnEl.addEventListener('click', switchMode);
    votesContainerEl.addEventListener('click', updateScore);
    submitCommentEl.addEventListener('click', updateComments);
    newCatEl.addEventListener('click', updateHeaderImg);
    pinCatEl.addEventListener('click', pinCat);
    unpinCatEl.addEventListener('click', unpinCat);
    galleryEl.addEventListener('click', showCat);
    galleryEl.addEventListener('click', showModal);
    modalBtnEl.addEventListener('click', closeModal);
    galleryEl.addEventListener('drop', dropHandlerForSwitchingCatPosition);

    // Does not affect local storage status
    headerImgEl.addEventListener('dragstart', _dragStartHanlder);
    galleryEl.addEventListener('dragover', _dragoverHandler);
    galleryEl.addEventListener('drop', _dropHandlerForPinCat);
    galleryEl.addEventListener('dragstart', _dragStartHanlder);
  }

  function clearStorage() {
    ['body', 'mode', 'pins', 'pinsOrder', 'comments'].forEach(key => localStorage.removeItem(key));
  }

  function switchMode(e) {
    const toDarkMode = e.target.classList.contains('light');
    _toggleMode(toDarkMode);
    toDarkMode ? _addDarkModeToElements() : _removeDarkmModeForElements();
    _switchThumbsColor();
    _saveDataToLocalStorage();
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
      _saveDataToLocalStorage();
    }
  }

  function updateComments() {
    if (commentInputEl.value) {
      const div = document.createElement('div');
      div.classList.add('comment');
      div.innerText = commentInputEl.value.slice(0, MAX_CHAR_COMMENT).toLowerCase();
      commentsEl.appendChild(div);
      commentInputEl.value = '';
      if (headerImgEl.id in comments) _saveToComments();
      _saveDataToLocalStorage();
    }
  }

  async function updateHeaderImg() {
    headerImgEl.remove();
    await addCatToContainer();
    headerImgEl = document.querySelector('#img-container>img');
    headerImgEl.addEventListener('dragstart', _dragStartHanlder);
    upvotesEl.innerText = 0;
    downvotesEl.innerText = 0;
    popScoreEl.innerText = 0;
    commentsEl.innerText = '';
    _saveDataToLocalStorage();
  }

  function pinCat() {
    saveToGallery();
    _saveToComments();
    _saveDataToLocalStorage();
  }

  function unpinCat() {
    if (headerImgEl.id in pins) {
      delete pins[headerImgEl.id];
      delete comments[headerImgEl.id];
      pinsOrder.splice(pinsOrder.indexOf(headerImgEl.id), 1);
      _updateGallery();
      _saveDataToLocalStorage();
    }
  }

  function showCat(e) {
    if (e.target.id in pins) {
      _replaceHeaderImg(e.target);
      _replaceScores(e.target.parentElement.querySelectorAll('.pin-vote'));
      _replaceComments(e.target.id);
      _saveDataToLocalStorage();
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
      _saveDataToLocalStorage();
    }
  }

  function closeModal() {
    _unblurElements();
    catsContainerEl.classList.remove('hidden');
    modalEl.classList.add('hidden');
    _saveDataToLocalStorage();
  }

  function dropHandlerForSwitchingCatPosition(e) {
    e.preventDefault();
    _swapGalleryImage(e);
    _updateGallery();
    _saveDataToLocalStorage();
  }

  /****************************************************************************************/
  /*********************************** HELPER FUNCTIONS ***********************************/
  /****************************************************************************************/
  function _localStorageHasData() {
    return localStorage.getItem('body') != null;
  }

  function _restoreData() {
    document.body.innerHTML = localStorage.getItem('body');
    document.body.classList = localStorage.getItem('mode');
    pinsOrder = JSON.parse(localStorage.getItem('pinsOrder'));
    pins = JSON.parse(localStorage.getItem('pins'));
    comments = JSON.parse(localStorage.getItem('comments'));
  }

  function _saveDataToLocalStorage() {
    localStorage.setItem('body', bodyEl.innerHTML);
    localStorage.setItem('mode', bodyEl.classList);
    localStorage.setItem('pinsOrder', JSON.stringify(pinsOrder));
    localStorage.setItem('pins', JSON.stringify(pins));
    localStorage.setItem('comments', JSON.stringify(comments));
  }

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
      modeBtnTextEl.innerText = 'LightMode';
    } else {
      modeBtnEl.classList.remove('dark');
      modeBtnEl.classList.add('light');
      modeBtnTextEl.innerText = 'DarkMode';
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
    galleryImages.forEach(img => (img.id in pins) && (pins[img.id] = pins[img.id].replace(prevThumbUp, currThumbUp).replace(prevThumbDown, currThumbDown)));
    _updateGallery();
  }

  function _updateModal() {
    if (!modalImageEl.parentElement.classList.contains('hidden')) {
      const id = modalImageEl.querySelector('.gallery-image>img').id;
      modalImageEl.innerHTML = pins[id];
    }
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
    if (!pinsOrder.includes(headerImgEl.id)) pinsOrder.push(headerImgEl.id);
  }

  function _updateGallery() {
    galleryEl.innerHTML = pinsOrder.map(id => pins[id]).join('');

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

  function _dragStartHanlder(e) {
    console.log(e.target.id);
    e.dataTransfer.setData("text/plain", e.target.id);
  }

  function _dragoverHandler(e) {
    e.preventDefault();
  }

  function _dropHandlerForPinCat(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text");
    if (id == headerImgEl.id) pinCat();
  }

  function _swapGalleryImage(e) {
    const id = e.dataTransfer.getData("text");
    if (id != e.target.id && e.target.classList.contains('gallery-img')) {
      const idx1 = pinsOrder.indexOf(id);
      const idx2 = pinsOrder.indexOf(e.target.id);
      [pinsOrder[idx1], pinsOrder[idx2]] = [pinsOrder[idx2], pinsOrder[idx1]];
    }
  }
}
