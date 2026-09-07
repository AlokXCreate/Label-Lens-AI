import pymupdf
import os

pdf_path = r'c:\Users\Alok\Desktop\SIH 2026\SIH_2026_Submission\Label_Lens_AI_SIH2026_Report.pdf'
outdir = r'c:\Users\Alok\Desktop\SIH 2026\SIH_2026_Submission\report_preview'
os.makedirs(outdir, exist_ok=True)

doc = pymupdf.open(pdf_path)
print(f"Pages: {len(doc)}")
fsize = os.path.getsize(pdf_path)
print(f"File size: {fsize:,} bytes ({fsize/1024/1024:.2f} MB)")

for i in range(len(doc)):
    pix = doc[i].get_pixmap(dpi=150)
    pix.save(os.path.join(outdir, f'p{i+1}.png'))
    print(f"  Saved p{i+1}.png")

print("Done.")
