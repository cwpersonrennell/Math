# rag.py
import os, json, sys
import faiss, fitz  # pymupdf
from sentence_transformers import SentenceTransformer
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from textwrap import dedent

DATA_DIR = "data"
INDEX_PATH = "rag_index.faiss"
META_PATH = "rag_meta.json"
EMB_MODEL = "sentence-transformers/all-MiniLM-L6-v2"     # small, fast
LLM_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"          # small local chat model

def chunk_text(text, max_len=700, overlap=120):
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i+max_len])
        chunks.append(chunk)
        i += max_len - overlap
    return [c for c in chunks if c.strip()]

def extract_pdf_chunks(path):
    doc = fitz.open(path)
    all_chunks = []
    for pno in range(len(doc)):
        text = doc[pno].get_text("text")
        for c in chunk_text(text):
            all_chunks.append({"source": os.path.basename(path), "page": pno+1, "text": c})
    return all_chunks

def build_corpus():
    corpus = []
    for fn in os.listdir(DATA_DIR):
        if fn.lower().endswith(".pdf"):
            corpus.extend(extract_pdf_chunks(os.path.join(DATA_DIR, fn)))
    return corpus

def ensure_index():
    if os.path.exists(INDEX_PATH) and os.path.exists(META_PATH):
        return
    model = SentenceTransformer(EMB_MODEL)
    corpus = build_corpus()
    if not corpus:
        print("Put PDFs in ./data and rerun."); sys.exit(1)
    vecs = model.encode([c["text"] for c in corpus], normalize_embeddings=True, show_progress_bar=True)
    index = faiss.IndexFlatIP(vecs.shape[1])
    index.add(vecs.astype("float32"))
    faiss.write_index(index, INDEX_PATH)
    with open(META_PATH, "w") as f:
        json.dump(corpus, f)
    print(f"Indexed {len(corpus)} chunks from {len(set(c['source'] for c in corpus))} files.")

def retrieve(query, k=5):
    model = SentenceTransformer(EMB_MODEL)
    qvec = model.encode([query], normalize_embeddings=True)
    index = faiss.read_index(INDEX_PATH)
    D, I = index.search(qvec.astype("float32"), k)
    with open(META_PATH) as f:
        meta = json.load(f)
    hits = [meta[i] for i in I[0]]
    return hits

def load_llm():
    tok = AutoTokenizer.from_pretrained(LLM_NAME)
    lm  = AutoModelForCausalLM.from_pretrained(LLM_NAME, torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32)
    if torch.cuda.is_available(): lm = lm.to("cuda")
    return tok, lm

def answer(query):
    ctxs = retrieve(query, k=5)
    context = "\n\n".join([f"[{i+1}] {c['source']} p.{c['page']}: {c['text']}" for i,c in enumerate(ctxs)])
    prompt = dedent(f"""
    You are a helpful classroom assistant. Use the CONTEXT to answer the QUESTION concisely.
    Cite sources as [1], [2], etc. If unsure, say so.

    CONTEXT:
    {context}

    QUESTION: {query}
    ANSWER:
    """).strip()
    tok, lm = load_llm()
    ids = tok(prompt, return_tensors="pt").to(lm.device)
    out = lm.generate(**ids, max_new_tokens=256, do_sample=False)
    print(tok.decode(out[0], skip_special_tokens=True).split("ANSWER:")[-1].strip())

if __name__ == "__main__":
    if not (os.path.exists(INDEX_PATH) and os.path.exists(META_PATH)):
        ensure_index()
    if len(sys.argv) < 2:
        print("Usage: python rag.py \"Your question here\""); sys.exit(0)
    answer(" ".join(sys.argv[1:]))
