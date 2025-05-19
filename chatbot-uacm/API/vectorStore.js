import { HNSWLib } from 'hnswlib-node'; // O cualquier otra librería
import { embedDocuments } from './gptAPI';

let vectorStore;

export async function initializeVectorStore(documents) {
  vectorStore = new HNSWLib();
  
  // Generar embeddings para los documentos
  const texts = documents.map(doc => doc.content);
  const embeddings = await embedDocuments(texts);
  
  await vectorStore.init({
    dim: embeddings[0].length,
    space: 'cosine'
  });
  
  documents.forEach((doc, idx) => {
    doc.embeddings = embeddings[idx];
    vectorStore.addPoint(embeddings[idx], idx);
  });
  
  return vectorStore;
}

export async function findSimilarDocuments(queryEmbedding, k = 3) {
  return vectorStore.searchKnn(queryEmbedding, k);
}
