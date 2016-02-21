// Resizes the text area to be the same height as the text that's within it.
// When you dynamically change the height of a text area, the browser scrolls
// back to the top of the page, so we need to maintain it's scroll position
// after the resize.

export default function autoresizeTextarea(textarea) {
  let scrollLeft = window.pageXOffset ||
    (document.documentElement || document.body.parentNode || document.body).scrollLeft;

  let scrollTop  = window.pageYOffset ||
    (document.documentElement || document.body.parentNode || document.body).scrollTop;

  let offsetHeight = textarea.offsetHeight;

  // Reset the style back to 0 so we can correctly calculate it's
  // scrollHeight (which will be the height of the text inside it)
  textarea.style.height = 0;

  let scrollHeight = textarea.scrollHeight;

  // If the new height will be more than it's previous height, expand it,
  // otherwise, just go back to the original one. There's a case where if the
  // user has manually adjusted the height of the text area, then it should
  // stay at the larger height.
  if(scrollHeight > offsetHeight) {
    textarea.style.height = scrollHeight + 'px';
  } else {
    textarea.style.height = offsetHeight + 'px';
  }

  window.scrollTo(scrollLeft, scrollTop);
}
