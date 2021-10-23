const asrRightside = document.querySelector('.asr_content__item.rightside');
const asrContent = document.querySelector('[data-type="content"]');
const ttsContent = document.querySelector('.tts_content__item');

if (asrContent && asrRightside) {
  asrContent.addEventListener("DOMNodeInserted", () => {
    if (scrollbarVisible(asrContent)) {
      !asrRightside.classList.contains('scroll') && asrRightside.classList.add('scroll');
    } else {
      asrRightside.classList.contains('scroll') && asrRightside.classList.remove('scroll');
    }
   }, false);  
}

if (ttsContent) {
  ttsContent.addEventListener("DOMNodeInserted", () => {
    if (scrollbarVisible(ttsContent)) {
      !ttsContent.classList.contains('scroll') && ttsContent.classList.add('scroll');
    } else {
      ttsContent.classList.contains('scroll') && ttsContent.classList.remove('scroll');
    }
   }, false);  
}

function scrollbarVisible(element) {
  return element.scrollHeight > element.clientHeight;
}
