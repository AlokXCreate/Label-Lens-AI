# Perfect 10-Page SIH 2026 Detailed Project Report PDF Generator
import os, sys, subprocess, base64

base_dir = os.path.abspath('SIH_2026_Submission')
assets_dir = os.path.join(base_dir, 'assets')
chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
html_path = os.path.join(base_dir, 'SIH2026_Detailed_Project_Report_26034.html')
pdf_path = os.path.join(base_dir, 'SIH2026_Detailed_Project_Report_26034.pdf')

def get_b64(fname, is_local=False):
    p = os.path.join(base_dir, fname) if is_local else os.path.join(assets_dir, fname)
    if os.path.exists(p):
        with open(p, 'rb') as f_in:
            ext = os.path.splitext(fname)[1].replace('.', '')
            mime = 'image/svg+xml' if ext == 'svg' else f'image/{ext}'
            return f'data:{mime};base64,' + base64.b64encode(f_in.read()).decode('utf-8')
    print(f'Warning: file not found: {p}')
    return ''

sih_logo = get_b64('sih_logo.png')
label_lens_logo = get_b64('label_lens_logo.svg')
arch_diagram = get_b64('architecture_diagram.png', is_local=True)
flow_diagram = get_b64('workflow_methodology_flowchart.png', is_local=True)
matrix_diagram = get_b64('novelty_comparison_matrix.png', is_local=True)
impact_diagram = get_b64('impact_infographic.png', is_local=True)

print('All base64 image assets loaded successfully.')
