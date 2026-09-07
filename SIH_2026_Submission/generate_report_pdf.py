"""
Generate the final clean SIH 2026 Report PDF using pdfkit (wkhtmltopdf) or Chrome headless.
This script removes Chrome's default header/footer by using the CDP protocol.
"""
import subprocess, os, json, sys

html_path = r'c:\Users\Alok\Desktop\SIH 2026\SIH_2026_Submission\SIH_Report_26034.html'
pdf_path  = r'c:\Users\Alok\Desktop\SIH 2026\SIH_2026_Submission\Label_Lens_AI_SIH2026_Report.pdf'
chrome    = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

# Use Chrome headless with explicit no-header flag
cmd = [
    chrome,
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--run-all-compositor-stages-before-draw',
    '--print-to-pdf=' + pdf_path,
    '--print-to-pdf-no-header',
    'file:///' + html_path.replace('\\', '/').replace(' ', '%20'),
]

print("Running Chrome headless...")
result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
print(f"Exit code: {result.returncode}")
if result.stdout: print(f"stdout: {result.stdout}")
if result.stderr: print(f"stderr: {result.stderr}")

fsize = os.path.getsize(pdf_path)
print(f"\nPDF generated: {pdf_path}")
print(f"File size: {fsize:,} bytes ({fsize/1024/1024:.2f} MB)")

# Generate preview pages
try:
    import pymupdf
    doc = pymupdf.open(pdf_path)
    print(f"Pages: {len(doc)}")
    outdir = os.path.join(os.path.dirname(pdf_path), 'report_preview')
    os.makedirs(outdir, exist_ok=True)
    for i in range(len(doc)):
        pix = doc[i].get_pixmap(dpi=150)
        pix.save(os.path.join(outdir, f'p{i+1}.png'))
    print(f"Preview PNGs saved to {outdir}")
except Exception as e:
    print(f"Preview generation skipped: {e}")
