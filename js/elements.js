export default function initializeElements() {
  const MAX_CHAR_COMMENT = 100;
  const bodyEl = document.body;
  const h1El = document.querySelector('h1');
  const modeBtnEl = document.querySelector('#mode-btn');
  const votesContainerEl = document.querySelector('#votes-container');
  const votesContainerThumbsEl = votesContainerEl.querySelectorAll('.thumbs');
  const upvoteBtnEl = document.querySelector('#upvoteBtn');
  const downvoteBtnEl = document.querySelector('#downvoteBtn');
  const popScoreEl = document.querySelector('#pop-score');
  const popScoreLabelEl = document.querySelector('#pop>span');
  const upvotesEl = document.querySelector('#upvotes');
  const downvotesEl = document.querySelector('#downvotes');
  const submitCommentEl = document.querySelector('#comment-input>button');
  const commentInputEl = document.querySelector('#comment-input>input');
  const commentInputLabelEl = document.querySelector('#comment-input>label');
  const commentsEl = document.querySelector('#comments');
  const galleryEl = document.querySelector('#gallery');
  const newCatEl = document.querySelector('#new-cat');
  const pinCatEl = document.querySelector('#pin-cat');
  const unpinCatEl = document.querySelector('#unpin-cat');
  const postEl = document.querySelector('#post');
  const modalEl = document.querySelector('#modal');
  const modalImageEl = document.querySelector('#modal-image');
  const modalCommentsEl = document.querySelector('#modal-comments');
  const modalBtnEl = document.querySelector('#modal-btn');
  const imageButtonsEl = document.querySelector('#image-buttons');
  const imageContainerEl = document.querySelector('#img-container');
  const catsContainerEl = document.querySelector('#cats-container');
  const catCursorEl = document.querySelector('#cat-cursor');
  let headerImgEl = document.querySelector('img');

  const nextThumbColor = {
    '👍🏾': '👍🏻',
    '👍🏻': '👍🏾',
    '👎🏾': '👎🏻',
    '👎🏻': '👎🏾'
  };

  const modeAffectElements = [
    bodyEl,
    h1El,
    newCatEl,
    pinCatEl,
    unpinCatEl,
    upvoteBtnEl,
    downvoteBtnEl,
    submitCommentEl,
    commentInputEl,
    postEl,
    commentsEl,
    modalEl
  ];

  const blurAffectedElements = [
    postEl,
    popScoreEl,
    popScoreLabelEl,
    imageButtonsEl,
    imageContainerEl,
    votesContainerEl,
    commentInputEl,
    commentInputLabelEl,
    submitCommentEl
  ];

  return {
    MAX_CHAR_COMMENT,
    bodyEl,
    modeBtnEl,
    votesContainerEl,
    votesContainerThumbsEl,
    popScoreEl,
    upvotesEl,
    downvotesEl,
    submitCommentEl,
    commentInputEl,
    commentsEl,
    galleryEl,
    newCatEl,
    pinCatEl,
    unpinCatEl,
    modalEl,
    modalImageEl,
    modalCommentsEl,
    modalBtnEl,
    catsContainerEl,
    headerImgEl,
    nextThumbColor,
    modeAffectElements,
    blurAffectedElements,
    catCursorEl
  };
}
