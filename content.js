let sentences = [];
let currentIndex = -1;

function initPDFNavigator() {
  const rawText = document.body.innerText || "";
  if (rawText.trim().length > 0) {
    sentences = (rawText.match(/[^.!?\n]+[.!?\n]+/g) || [rawText])
      .map(s => s.trim())
      .filter(s => s.length > 5);
    console.log(`Local PDF.js Parser: ჩაიტვირთა ${sentences.length} წინადადება.`);
  }
}

function highlightSentence(index) {
  if (index < 0 || index >= sentences.length) return;
  const targetText = sentences[index];

  window.getSelection().removeAllRanges();
  const found = window.find(targetText, false, false, true, false, true, false);
  
  if (found) {
    currentIndex = index;
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + rect.top - window.innerHeight / 2,
        behavior: 'smooth'
      });
    }
  }
}


window.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    event.stopPropagation();

    if (sentences.length === 0) initPDFNavigator();
    if (sentences.length === 0) return;

    if (event.shiftKey) {
      if (currentIndex > 0) currentIndex--;
      else currentIndex = sentences.length - 1;
    } else {
      if (currentIndex < sentences.length - 1) currentIndex++;
      else currentIndex = 0;
    }

    highlightSentence(currentIndex);
  }
}, true);

window.addEventListener("load", () => {
  setTimeout(initPDFNavigator, 1500);
});