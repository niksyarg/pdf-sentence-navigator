
export async function parsePDFSentences(url) {
  try {
    const rawText = document.body.innerText || "";
    const sentences = rawText.match(/[^.!?\n]+[.!?\n]+/g) || [rawText];
    return sentences.map(s => s.trim()).filter(s => s.length > 5);
  } catch (error) {
    console.error("Error inside local pdf.js parser:", error);
    return [];
  }
}