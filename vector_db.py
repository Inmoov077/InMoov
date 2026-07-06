import os
import pickle
import re
import subprocess
import sys

# Try to import scikit-learn and numpy, install them if missing
try:
    import numpy as np
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
except ImportError:
    print("Warning: scikit-learn and numpy are required. Attempting to install them...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "scikit-learn", "numpy"])
        import numpy as np
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
    except Exception as e:
        print(f"Error installing dependencies: {e}")
        sys.exit(1)

DB_FILE = os.path.join(os.path.dirname(__file__), "vector_db.pkl")

def extract_text_from_pdf(pdf_path):
    """Dynamically attempts to import pypdf and extract text from PDF."""
    try:
        import pypdf
    except ImportError:
        print("pypdf library not found. Attempting to install it...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
            import pypdf
        except Exception as e:
            raise ImportError("Failed to auto-install pypdf. Please run 'pip install pypdf' manually.") from e

    text_content = []
    with open(pdf_path, 'rb') as f:
        reader = pypdf.PdfReader(f)
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text:
                text_content.append(page_text)
    return "\n".join(text_content)

def chunk_text(text, chunk_size=150, overlap=30):
    """Chunks text into overlapping words-based windows."""
    # Normalize line breaks and spaces
    text = re.sub(r'\s+', ' ', text).strip()
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if len(chunk.strip()) > 15:
            chunks.append(chunk)
    return chunks

def build_db(source_path):
    """Reads source text file or PDF, builds vector DB, and saves to vector_db.pkl."""
    if not os.path.exists(source_path):
        # Check relative to script dir if not absolute
        alt_path = os.path.join(os.path.dirname(__file__), source_path)
        if os.path.exists(alt_path):
            source_path = alt_path
        else:
            return {"ok": False, "error": f"Source file '{source_path}' does not exist."}
    
    ext = os.path.splitext(source_path)[1].lower()
    try:
        if ext == ".pdf":
            print(f"Extracting text from PDF: {source_path}...")
            text = extract_text_from_pdf(source_path)
        else:
            print(f"Reading text from file: {source_path}...")
            with open(source_path, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
    except Exception as e:
        return {"ok": False, "error": f"Failed to read file: {e}"}

    chunks = chunk_text(text)
    if not chunks:
        return {"ok": False, "error": "No text content found to index."}
    
    print(f"Generated {len(chunks)} chunks. Vectorizing...")
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(chunks)
    
    db_data = {
        "chunks": chunks,
        "vectorizer": vectorizer,
        "tfidf_matrix": tfidf_matrix
    }
    
    with open(DB_FILE, 'wb') as f:
        pickle.dump(db_data, f)
        
    print(f"Successfully saved Vector DB with {len(chunks)} vectors to '{DB_FILE}'")
    return {"ok": True, "num_chunks": len(chunks)}

def search_db(query, top_k=1):
    """Searches the vector DB and returns matching chunks with similarity scores."""
    if not os.path.exists(DB_FILE):
        return {"ok": False, "error": "Vector database has not been built yet. Please index some text first."}
        
    with open(DB_FILE, 'rb') as f:
        db_data = pickle.load(f)
        
    chunks = db_data["chunks"]
    vectorizer = db_data["vectorizer"]
    tfidf_matrix = db_data["tfidf_matrix"]
    
    query_vec = vectorizer.transform([query])
    similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
    
    # Get top K indices
    top_indices = np.argsort(similarities)[::-1][:top_k]
    
    results = []
    for idx in top_indices:
        score = float(similarities[idx])
        results.append({
            "chunk": chunks[idx],
            "score": score
        })
        
    return {"ok": True, "results": results}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python vector_db.py index <path_to_text_or_pdf>")
        print("  python vector_db.py search <your_query>")
        sys.exit(1)
        
    cmd = sys.argv[1].lower()
    if cmd == "index" and len(sys.argv) > 2:
        res = build_db(sys.argv[2])
        print(res)
    elif cmd == "search" and len(sys.argv) > 2:
        query = " ".join(sys.argv[2:])
        res = search_db(query, top_k=2)
        if res["ok"]:
            for i, r in enumerate(res["results"]):
                print(f"\nMatch #{i+1} (Score: {r['score']:.4f}):")
                print("-" * 40)
                print(r["chunk"])
                print("-" * 40)
        else:
            print(res["error"])
