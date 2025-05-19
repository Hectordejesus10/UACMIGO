import { PDFLoader } from 'pdf-parse'; // Necesitarás instalar esto
import mammoth from 'mammoth'; // Para Word docs
import fs from 'fs/promises';

export async function loadDocuments() {
  const docsPath = path.join(__dirname, '../documents');
  const files = await fs.readdir(docsPath);
  
  const documents = [];
  
  for (const file of files) {
    const filePath = path.join(docsPath, file);
    let content;
    
    if (file.endsWith('.pdf')) {
      const data = await fs.readFile(filePath);
      const pdf = await PDFLoader(data);
      content = pdf.text;
    } else if (file.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ path: filePath });
      content = result.value;
    } else if (file.endsWith('.txt')) {
      content = await fs.readFile(filePath, 'utf-8');
    }
    
    if (content) {
      documents.push({
        filename: file,
        content,
        embeddings: null // Lo llenaremos después
      });
    }
  }
  
  return documents;
}
