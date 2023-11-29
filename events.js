export default function initializeEvents() {
  const votesContainerEl = document.querySelector('#votes-container');
  const popScoreEl = document.querySelector('#pop-score');
  const upvotesEl = document.getElementById('upvotes');
  const downvotesEl = document.getElementById('downvotes');

  votesContainerEl.addEventListener('click', updateScore);

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
}
