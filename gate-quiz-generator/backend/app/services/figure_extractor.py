from pathlib import Path
import fitz  # PyMuPDF
from PIL import Image
import uuid

ASSETS_DIR = Path("backend/assets/figures")
ASSETS_DIR.mkdir(parents=True, exist_ok=True)

# Cache to avoid reprocessing
_FIGURE_CACHE: dict[str, dict[int, list[str]]] = {}


def extract_figures(pdf_path: Path) -> dict[int, list[str]]:
    """
    Extract figures by rendering pages using PyMuPDF (NO poppler).
    Fast and Windows-friendly.
    """
    cache_key = str(pdf_path.resolve())
    if cache_key in _FIGURE_CACHE:
        return _FIGURE_CACHE[cache_key]

    doc = fitz.open(pdf_path)
    figures: dict[int, list[str]] = {}

    for page_index in range(len(doc)):
        page = doc[page_index]

        # Heuristic: pages with figures usually have fewer text blocks
        text_blocks = page.get_text("blocks")
        if len(text_blocks) > 20:
            continue  # likely text-only page

        # Render page (vector → raster)
        zoom = 1.5  # ≈ 144 DPI, very fast
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, alpha=False)

        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

        # Save entire page as figure (safe + simple)
        out = ASSETS_DIR / f"fig_{uuid.uuid4().hex}.png"
        img.save(out)

        figures[page_index + 1] = [f"/assets/figures/{out.name}"]

    _FIGURE_CACHE[cache_key] = figures
    return figures
