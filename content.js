pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';

const pdfContainer = document.getElementById('pdf-container');

let textElements = []; 
let currentIndex = -1;

function loadPDF(pdfSource) {
  if (!pdfContainer) return;

  pdfContainer.innerHTML = '';
  textElements = [];
  currentIndex = -1;

  pdfjsLib.getDocument(pdfSource).promise.then(pdf => {
    console.log(`PDF ჩაიტვირთა. სულ ${pdf.numPages} გვერდი.`);
    
    let renderChain = Promise.resolve();
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      renderChain = renderChain.then(() => renderPage(pdf, pageNum));
    }
  }).catch(error => {
    console.error("შეცდომა PDF-ის დამუშავებისას:", error);
  });
}

function renderPage(pdf, pageNum) {
  return pdf.getPage(pageNum).then(page => {
    const scale = 1.5;
    const viewport = page.getViewport({ scale: scale });

    const pageWrapper = document.createElement('div');
    pageWrapper.style.position = 'relative';
    pageWrapper.style.width = viewport.width + 'px';
    pageWrapper.style.height = viewport.height + 'px';
    pageWrapper.style.marginBottom = '25px'; 

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const textLayer = document.createElement('div');
    textLayer.className = 'textLayer';
    textLayer.style.width = viewport.width + 'px';
    textLayer.style.height = viewport.height + 'px';

    pageWrapper.appendChild(canvas);
    pageWrapper.appendChild(textLayer);
    pdfContainer.appendChild(pageWrapper);

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };

    return page.render(renderContext).promise.then(() => {
      return page.getTextContent();
    }).then(textContent => {
      textContent.items.forEach(item => {
        if (item.str.trim().length > 0) {
          const span = document.createElement('span');
          span.textContent = item.str;

          const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
          const fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));

          span.style.left = tx[4] + 'px';
          span.style.top = (tx[5] - fontHeight) + 'px';
          span.style.fontSize = fontHeight + 'px';
          span.style.fontFamily = item.fontName || 'sans-serif';

          textLayer.appendChild(span);
          textElements.push(span);
        }
      });
    });
  });
}

document.getElementById('pdf-upload')?.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const typedarray = new Uint8Array(e.target.result);
    loadPDF({ data: typedarray });
  };
  fileReader.readAsArrayBuffer(file);
});

document.addEventListener('keydown', (event) => {
  if (textElements.length === 0) return;

  if (event.key === 'Tab') {
    event.preventDefault();

    if (event.shiftKey) {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : textElements.length - 1;
    } else {
      currentIndex = (currentIndex < textElements.length - 1) ? currentIndex + 1 : 0;
    }

    highlightActiveElement();
  }
});

function highlightActiveElement() {
  document.querySelectorAll('.active-sentence').forEach(el => {
    el.classList.remove('active-sentence');
  });

  if (currentIndex >= 0 && currentIndex < textElements.length) {
    const activeSpan = textElements[currentIndex];
    activeSpan.classList.add('active-sentence');
    activeSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const pdfUrl = urlParams.get('url');
  
  if (pdfUrl) {
    console.log("აღმოჩენილია გადამისამართებული ლინკი:", pdfUrl);
    loadPDF(pdfUrl);
  }
}

checkUrlParams();