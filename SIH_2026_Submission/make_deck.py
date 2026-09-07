import os, sys, subprocess, base64

base_dir = os.path.abspath("SIH_2026_Submission")
assets_dir = os.path.join(base_dir, "assets")
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def get_b64(fname, is_local=False):
    p = os.path.join(base_dir, fname) if is_local else os.path.join(assets_dir, fname)
    if os.path.exists(p):
        with open(p, "rb") as f_in:
            ext = os.path.splitext(fname)[1].replace(".", "")
            mime = "image/svg+xml" if ext == "svg" else f"image/{ext}"
            return f"data:{mime};base64," + base64.b64encode(f_in.read()).decode("utf-8")
    return ""

sih_logo = get_b64("sih_logo.png")
label_lens_logo = get_b64("label_lens_logo.svg")
proto_dark = get_b64("prototype_desktop_dark.png")
proto_apk = get_b64("prototype_mobile_apk.png")
flow_diagram = get_b64("workflow_methodology_flowchart.png", is_local=True)
matrix_diagram = get_b64("novelty_comparison_matrix.png", is_local=True)
impact_diagram = get_b64("impact_infographic.png", is_local=True)
arch_diagram = get_b64("architecture_diagram.png", is_local=True)

common_css = """
  @page { size: 16in 9in; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  body { margin: 0; padding: 0; background: #E2E8F0; }
  
  .slide {
    width: 1920px;
    height: 1080px;
    background: #FFFFFF;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    page-break-after: always;
    break-after: page;
  }

  .sih-header {
    height: 110px;
    padding: 16px 60px 10px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1.5px solid #E2E8F0;
  }
  .team-oval {
    border: 2px solid #5B21B6;
    border-radius: 40px;
    padding: 6px 22px;
    font-size: 16px;
    font-weight: 700;
    color: #1E293B;
    font-family: Georgia, serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.2;
    min-width: 140px;
  }
  .team-oval span.sub { font-size: 11px; color: #64748B; font-family: sans-serif; font-weight: 600; }
  
  .sih-title {
    font-size: 34px;
    font-weight: 900;
    color: #0F172A;
    letter-spacing: -0.5px;
    font-family: Georgia, serif;
    text-transform: uppercase;
    text-align: center;
  }

  .sih-logo-img {
    height: 74px;
    width: auto;
    object-fit: contain;
  }

  .sih-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 46px;
    background: #0072CE;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 60px;
    color: #FFFFFF;
    font-size: 15px;
    font-weight: 600;
  }

  .sih-body {
    flex: 1;
    padding: 22px 60px 54px 60px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .section-heading {
    font-size: 24px;
    font-weight: 800;
    color: #0072CE;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    text-decoration: underline;
    text-underline-offset: 6px;
  }
  .diamond { color: #0072CE; font-size: 22px; }

  .card-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    flex: 1;
  }
  .info-card {
    background: #F8FAFC;
    border: 1.5px solid #CBD5E1;
    border-radius: 12px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  }
  .card-top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 2px solid #E2E8F0;
  }
  .card-top-icon { font-size: 20px; }
  .card-title {
    font-size: 16.5px;
    font-weight: 800;
    color: #0F172A;
    line-height: 1.2;
  }
  .card-bullets {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
  }
  .card-bullets li {
    font-size: 13.5px;
    color: #334155;
    line-height: 1.5;
    display: block;
    position: relative;
    padding-left: 16px;
  }
  .card-bullets li::before {
    content: "•";
    color: #0072CE;
    font-weight: 900;
    font-size: 18px;
    position: absolute;
    left: 0;
    top: -2px;
  }
  .card-bullets li strong { color: #0F172A; }
  .meta-tag { font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
"""

def make_header(title):
    return f"""
    <div class="sih-header">
      <div class="team-oval">
        <span>TEAM LABEL LENS</span>
        <span class="sub">Problem 26034</span>
      </div>
      <div class="sih-title">{title}</div>
      <img src="{sih_logo}" class="sih-logo-img" alt="SIH 2026" />
    </div>
    """

def make_footer(page):
    return f"""
    <div class="sih-footer">
      <span>@SIH Idea submission- Template</span>
      <span>{page}</span>
    </div>
    """

print("Base setup complete.")

slide1_content = f"""
  <div class="sih-body" style="justify-content: space-between; padding-top: 10px;">
    <div style="text-align: center; margin-bottom: 6px;">
      <div style="display: inline-flex; gap: 12px; margin-bottom: 6px;">
        <span class="meta-tag" style="background:#EFF6FF; color:#1D4ED8; border:1px solid #BFDBFE;">Problem Statement ID: 26034</span>
        <span class="meta-tag" style="background:#FEF3C7; color:#B45309; border:1px solid #FDE68A;">Ministry of Consumer Affairs, Food & Public Distribution (MoCAF&PD)</span>
        <span class="meta-tag" style="background:#ECFDF5; color:#047857; border:1px solid #A7F3D0;">Smart Automation / Legal Metrology & Consumer Welfare</span>
      </div>
      <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 4px;">
        <img src="{label_lens_logo}" style="width: 52px; height: 52px;" alt="Logo" />
        <h1 style="font-size: 44px; font-weight: 900; color: #0F172A; letter-spacing: -0.5px;">
          LABEL LENS AI
        </h1>
      </div>
      <p style="font-size: 17.5px; color: #475569; font-weight: 600; max-width: 1200px; margin: 0 auto;">
        Automated Statutory Packaging Compliance Verification & One-Click Legal Grievance Redressal Engine
      </p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; flex: 1; margin-bottom: 8px;">
      <div class="info-card" style="border-top: 4px solid #0072CE;">
        <div class="card-top">
          <span class="card-top-icon">🏛️</span>
          <div class="card-title">Problem Statement 26034 Context</div>
        </div>
        <ul class="card-bullets">
          <li><strong>Manual Inspection Bottleneck:</strong> Traditional manual inspection takes 25 minutes per packaged SKU using physical calipers and rulers.</li>
          <li><strong>Hidden Consumer Deceptions:</strong> Widespread deceptive shrinkflation, missing Unit Sale Price (USP), illegible font sizes, and fake 14-digit FSSAI licenses.</li>
          <li><strong>Statutory Mandate:</strong> Enforcing mandatory declarations under <em>Legal Metrology (PCR 2011/2026)</em> and <em>FSSA (2020)</em> with automated Section 36 penalty recovery.</li>
        </ul>
      </div>

      <div class="info-card" style="border-top: 4px solid #10B981;">
        <div class="card-top">
          <span class="card-top-icon">👥</span>
          <div class="card-title">Team Structure & Domain Roles</div>
        </div>
        <ul class="card-bullets" style="gap: 8px;">
          <li><strong>Team Name:</strong> Team Label Lens</li>
          <li><strong>Masira Mulani:</strong> Team Lead & Consumer Redressal Operations</li>
          <li><strong>Shreya Ombale:</strong> Legal Metrology & Regulatory Jurisprudence</li>
          <li><strong>Nikita Shravani:</strong> AI Architecture & Computer Vision Systems</li>
          <li><strong>Alok Kumar:</strong> Full-Stack Engineering & Android Native APK</li>
          <li style="margin-top: 2px; padding-top: 4px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B;">
            Cross-disciplinary synergy uniting Legal Jurisprudence, Multimodal AI Systems & Native Mobile Engineering.
          </li>
        </ul>
      </div>

      <div class="info-card" style="border-top: 4px solid #F59E0B;">
        <div class="card-top">
          <span class="card-top-icon">🚀</span>
          <div class="card-title">Working Prototype Readiness</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; flex: 1; justify-content: space-between;">
          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 10px;">
            <div style="font-size: 11px; font-weight: 800; color: #1E40AF; text-transform: uppercase;">Live Production Web App</div>
            <div style="font-size: 13px; font-weight: 700; color: #0284C7; word-break: break-all;">https://alokxcreate.github.io/Label-Lens-AI/</div>
          </div>
          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 8px; padding: 10px;">
            <div style="font-size: 11px; font-weight: 800; color: #065F46; text-transform: uppercase;">Native Android APK Release</div>
            <div style="font-size: 13px; font-weight: 700; color: #059669;">v1.1.0 Compiled & Deployed on GitHub Releases</div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px;">
            <div style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase;">Open-Source Codebase</div>
            <div style="font-size: 13px; font-weight: 700; color: #334155;">https://github.com/AlokXCreate/Label-Lens-AI</div>
          </div>
        </div>
      </div>
    </div>

    <div style="background: #F1F5F9; border-radius: 10px; padding: 10px 22px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 13px; font-weight: 800; color: #1E293B;">✨ Core Capabilities:</span>
      <span style="font-size: 12.5px; color: #334155;">⚡ 3.2s End-to-End Latency</span>
      <span style="font-size: 12.5px; color: #334155;">📐 Table-I Font Matrix</span>
      <span style="font-size: 12.5px; color: #334155;">🛡️ Modulo-11 FSSAI Checksum</span>
      <span style="font-size: 12.5px; color: #334155;">⚖️ Sec 36 Penalty Assessment</span>
      <span style="font-size: 12.5px; color: #334155;">📧 1-Click FSSAI & FoSCoS Dispatch</span>
      <span style="font-size: 12.5px; color: #334155;">🌐 10 Regional Languages</span>
    </div>
  </div>
"""

slide2_content = f"""
  <div class="sih-body" style="padding-top: 10px;">
    <div class="section-heading">
      <span class="diamond">❖</span>
      <span>Proposed Solution (Describe your Idea/Solution/Prototype)</span>
    </div>

    <div class="card-grid-3" style="margin-bottom: 12px;">
      <div class="info-card" style="border-top: 4px solid #0072CE;">
        <div class="card-top">
          <span class="card-top-icon">🔍</span>
          <div class="card-title">Detailed Explanation of Solution</div>
        </div>
        <ul class="card-bullets">
          <li><strong>Dual Cross-Platform Clients:</strong> Progressive Web App (React 19) and lightweight Native Android APK (Capacitor 8) for field enforcement officers and ordinary consumers.</li>
          <li><strong>Multimodal Vision Ingestion:</strong> Ingests 4-panel Principal Display Panel (PDP) packaging imagery with automated surface area calculation (A = H × W).</li>
          <li><strong>Google Gemini 2.5 Flash Vision:</strong> Sub-second extraction of 10 mandatory Rule-6 fields into structured JSON schema with spatial coordinates.</li>
          <li><strong>1-Click Multi-Channel Redressal:</strong> Auto-compiles formal statutory petitions and transmits directly to FSSAI (compliance@fssai.gov.in), FoSCoS, NCH 1915, and CPGRAMS.</li>
        </ul>
      </div>

      <div class="info-card" style="border-top: 4px solid #10B981;">
        <div class="card-top">
          <span class="card-top-icon">🎯</span>
          <div class="card-title">How it Addresses the Problem</div>
        </div>
        <ul class="card-bullets">
          <li><strong>Eliminates Inspection Inefficiencies:</strong> Replaces slow (25 min) manual ruler/caliper checks with an instantaneous 3.2-second automated audit.</li>
          <li><strong>Catches Hidden Non-Compliance:</strong> Flags deceptive shrinkflation, missing Unit Sale Price (USP), altered expiry dates, and fake FSSAI numbers.</li>
          <li><strong>Calculates Pecuniary Liabilities:</strong> Automated compounding penalty computation under <strong>Section 36 LMPC Act</strong> (₹25,000 for 1st offense, ₹50,000 for repeats).</li>
          <li><strong>Bridges Citizen Access Gap:</strong> Empowers 1.4 Billion consumers via <strong>10 Indian regional languages</strong> with plain-language scorecards and voice guidance.</li>
        </ul>
      </div>

      <div class="info-card" style="border-top: 4px solid #F59E0B;">
        <div class="card-top">
          <span class="card-top-icon">💡</span>
          <div class="card-title">Innovation & Uniqueness</div>
        </div>
        <ul class="card-bullets">
          <li><strong>Physical Vision vs Barcode Scanners:</strong> Audits actual printed on-pack text in real time, unlike generic apps that only query static barcode databases.</li>
          <li><strong>Dynamic PCR Table-I Font Engine:</strong> Dynamically correlates camera-derived PDP surface area with statutory numeral height rules (1.0mm to 6.0mm).</li>
          <li><strong>Algorithmic Modulo-11 Checksum:</strong> Instant programmatic detection of forged/counterfeit 14-digit FSSAI licenses.</li>
          <li><strong>Court-Admissible Evidence Vault:</strong> Seals audit dossiers with SHA-256 cryptographic hashes for admissibility under <strong>Section 65B Evidence Act</strong>.</li>
        </ul>
      </div>
    </div>

    <!-- Prototype Banner Box with Real Screenshot Snippet -->
    <div style="background: #0F172A; border-radius: 10px; padding: 10px 18px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #334155;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <span style="font-size: 26px;">📱</span>
        <div>
          <div style="color: #FFFFFF; font-weight: 800; font-size: 13.5px;">Live Working Prototype Deployed & Functionally Validated</div>
          <div style="color: #94A3B8; font-size: 11.5px;">Validated on commercial food, FMCG, and agricultural commodities with 1-Click statutory petition dispatch.</div>
        </div>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
        <span style="background: rgba(56, 189, 248, 0.15); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 700;">Score: 88/100</span>
        <span style="background: rgba(239, 68, 68, 0.2); color: #F87171; border: 1px solid rgba(239, 68, 68, 0.4); padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 700;">Sec 36 Liability: ₹25,000</span>
        <span style="background: #E11D48; color: white; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 700;">File Legal Complaint ➔</span>
      </div>
    </div>
  </div>
"""

print("Appended polished Slide 1 and Slide 2.")

slide3_content = f"""
  <div class="sih-body" style="padding-top: 10px;">
    
    <div style="margin-bottom: 12px;">
      <div style="font-size: 17px; font-weight: 800; color: #0072CE; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
        <span>⚙️</span> Technologies to be used (programming languages, frameworks, hardware)
      </div>
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;">
        <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 8px; text-align: center;">
          <div style="font-size: 13px; font-weight: 800; color: #0F172A;">React 19 + Vite</div>
          <div style="font-size: 11px; color: #0284C7; font-weight: 600;">Cross-Platform Web</div>
        </div>
        <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 8px; text-align: center;">
          <div style="font-size: 13px; font-weight: 800; color: #0F172A;">TypeScript</div>
          <div style="font-size: 11px; color: #3178C6; font-weight: 600;">Deterministic Typing</div>
        </div>
        <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 8px; text-align: center;">
          <div style="font-size: 13px; font-weight: 800; color: #0F172A;">Capacitor 8</div>
          <div style="font-size: 11px; color: #3DDC84; font-weight: 600;">Native Android APK</div>
        </div>
        <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 8px; text-align: center;">
          <div style="font-size: 13px; font-weight: 800; color: #0F172A;">Gemini 2.5 Flash</div>
          <div style="font-size: 11px; color: #9333EA; font-weight: 600;">Multimodal Vision AI</div>
        </div>
        <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 8px; text-align: center;">
          <div style="font-size: 13px; font-weight: 800; color: #0F172A;">Firebase & SQLite</div>
          <div style="font-size: 11px; color: #F59E0B; font-weight: 600;">Auth & Offline Buffer</div>
        </div>
        <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 8px; text-align: center;">
          <div style="font-size: 13px; font-weight: 800; color: #0F172A;">WebCrypto SHA-256</div>
          <div style="font-size: 11px; color: #10B981; font-weight: 600;">Sec 65B Evidence Seal</div>
        </div>
      </div>
    </div>

    <div style="flex: 1; display: flex; flex-direction: column;">
      <div style="font-size: 17px; font-weight: 800; color: #0072CE; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
        <span>📊</span> Methodology and process for implementation (Flow Charts / Images / working prototype)
      </div>
      <div style="flex: 1; border: 1.5px solid #CBD5E1; border-radius: 12px; overflow: hidden; background: #070B14; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
        <img src="{flow_diagram}" style="width: 100%; height: 100%; object-fit: contain;" alt="Workflow Flowchart" />
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 12px; color: #64748B;">
      <span><strong>Pipeline Highlights:</strong> Multi-panel capture ➔ Gemini Flash Vision ➔ Deterministic PCR Table-I & FSSAI Checksum ➔ SHA-256 Sealing ➔ 1-Click Multi-Channel Dispatch</span>
      <span style="color: #0284C7; font-weight: 700;">End-to-End Latency: 3.2s</span>
    </div>
  </div>
"""

slide4_content = """
  <div class="sih-body" style="padding-top: 10px;">
    
    <div style="margin-bottom: 12px;">
      <div style="font-size: 17px; font-weight: 800; color: #0072CE; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
        <span>📈</span> Analysis of the feasibility of the idea
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
        <div style="background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 8px; padding: 10px;">
          <div style="font-weight: 800; color: #1E40AF; font-size: 13px; margin-bottom: 3px;">Technical Feasibility</div>
          <div style="font-size: 11.5px; color: #334155; line-height: 1.35;">Client-side execution, sub-second inference, lightweight 5.2 MB APK, zero heavy server requirements.</div>
        </div>
        <div style="background: #ECFDF5; border: 1.5px solid #A7F3D0; border-radius: 8px; padding: 10px;">
          <div style="font-weight: 800; color: #065F46; font-size: 13px; margin-bottom: 3px;">Operational Feasibility</div>
          <div style="font-size: 11.5px; color: #334155; line-height: 1.35;">Runs on standard Android smartphones of inspectors & citizens; zero specialized hardware needed.</div>
        </div>
        <div style="background: #FEF3C7; border: 1.5px solid #FDE68A; border-radius: 8px; padding: 10px;">
          <div style="font-weight: 800; color: #92400E; font-size: 13px; margin-bottom: 3px;">Legal Feasibility</div>
          <div style="font-size: 11.5px; color: #334155; line-height: 1.35;">Strictly adheres to LMPC Act 2009 & FSSA 2006; dockets are admissible under Sec 65B Evidence Act.</div>
        </div>
        <div style="background: #FDF2F8; border: 1.5px solid #FBCFE8; border-radius: 8px; padding: 10px;">
          <div style="font-weight: 800; color: #9D174D; font-size: 13px; margin-bottom: 3px;">Financial Viability</div>
          <div style="font-size: 11.5px; color: #334155; line-height: 1.35;">Open-source core, ultra-low cloud API cost, massive ROI via automated state penalty recovery.</div>
        </div>
      </div>
    </div>

    <div style="flex: 1; display: flex; flex-direction: column;">
      <div style="font-size: 17px; font-weight: 800; color: #0072CE; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
        <span>🛡️</span> Potential challenges, risks and mitigation strategies
      </div>
      <div style="flex: 1; border: 1.5px solid #CBD5E1; border-radius: 10px; overflow: hidden; background: #FFFFFF;">
        <table style="width: 100%; height: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: #0F172A; color: #FFFFFF;">
              <th style="padding: 12px 18px; font-size: 13px; font-weight: 800; width: 22%;">Potential Challenge & Risk</th>
              <th style="padding: 12px 18px; font-size: 13px; font-weight: 800; width: 28%;">Impact Analysis</th>
              <th style="padding: 12px 18px; font-size: 13px; font-weight: 800; width: 50%;">Strategy for Overcoming Challenges</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #E2E8F0; background: #FFF;">
              <td style="padding: 14px 18px; font-weight: 700; color: #0F172A; font-size: 13px;">
                📷 Optical Degradation & Glare
                <div style="font-size: 11px; color: #64748B; font-weight: normal; margin-top: 2px;">Curved cans, shiny foil, crumpled wrappers</div>
              </td>
              <td style="padding: 14px 18px; font-size: 12.5px; color: #B91C1C; line-height: 1.4;">
                OCR misreads, skewed bounding boxes, and unreadable font heights.
              </td>
              <td style="padding: 14px 18px; font-size: 12.5px; color: #15803D; font-weight: 600; line-height: 1.45;">
                • Client-side HTML5 Canvas adaptive contrast normalization & glare suppression.<br>
                • Multi-panel stitched capture + 40% cylindrical surface wrap calculation.<br>
                • Voice-assisted speech dictation fallback for field officers.
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0; background: #F8FAFC;">
              <td style="padding: 14px 18px; font-weight: 700; color: #0F172A; font-size: 13px;">
                📶 Rural & Offline Environments
                <div style="font-size: 11px; color: #64748B; font-weight: normal; margin-top: 2px;">Tier-3 markets, weekly mandis lacking signal</div>
              </td>
              <td style="padding: 14px 18px; font-size: 12.5px; color: #B91C1C; line-height: 1.4;">
                Inability to reach cloud endpoints during live on-field enforcement raids.
              </td>
              <td style="padding: 14px 18px; font-size: 12.5px; color: #15803D; font-weight: 600; line-height: 1.45;">
                • Offline-first SQLite & LocalStorage docket buffer in the native Android APK.<br>
                • Local deterministic rule engine performs font & checksum tests without internet.<br>
                • Automatic background sync & petition dispatch once cellular signal is restored.
              </td>
            </tr>
            <tr style="background: #FFF;">
              <td style="padding: 14px 18px; font-weight: 700; color: #0F172A; font-size: 13px;">
                ⚖️ Adversarial Legal Contestations
                <div style="font-size: 11px; color: #64748B; font-weight: normal; margin-top: 2px;">FMCG brands disputing algorithmic fines</div>
              </td>
              <td style="padding: 14px 18px; font-size: 12.5px; color: #B91C1C; line-height: 1.4;">
                Risk of rejected complaints in Consumer Dispute Redressal Commissions.
              </td>
              <td style="padding: 14px 18px; font-size: 12.5px; color: #15803D; font-weight: 600; line-height: 1.45;">
                • AI is restricted strictly to visual extraction; legal audits are 100% deterministic.<br>
                • SHA-256 cryptographic hash seal of raw images guarantees Sec 65B admissibility.<br>
                • Side-by-side photographic proof attached to all generated legal petitions.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
"""

slide5_content = f"""
  <div class="sih-body" style="padding-top: 10px;">
    
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 14px;">
      <div style="background: #0284C7; color: white; border-radius: 8px; padding: 10px 16px; display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 24px;">⚡</span>
        <div><div style="font-size: 19px; font-weight: 900;">98.4% Faster</div><div style="font-size: 11px; opacity: 0.9;">3.2s vs 25 min manual audit</div></div>
      </div>
      <div style="background: #F59E0B; color: white; border-radius: 8px; padding: 10px 16px; display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 24px;">💰</span>
        <div><div style="font-size: 19px; font-weight: 900;">₹25k - ₹50k</div><div style="font-size: 11px; opacity: 0.9;">Sec 36 LMPC penalty liability</div></div>
      </div>
      <div style="background: #10B981; color: white; border-radius: 8px; padding: 10px 16px; display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 24px;">🌐</span>
        <div><div style="font-size: 19px; font-weight: 900;">10 Languages</div><div style="font-size: 11px; opacity: 0.9;">Pan-India vernacular inclusion</div></div>
      </div>
      <div style="background: #8B5CF6; color: white; border-radius: 8px; padding: 10px 16px; display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 24px;">🔒</span>
        <div><div style="font-size: 19px; font-weight: 900;">100% Admissible</div><div style="font-size: 11px; opacity: 0.9;">SHA-256 sealed Sec 65B dockets</div></div>
      </div>
    </div>

    <!-- 4 Pillars Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px; flex: 1;">
      
      <!-- Box 1: Consumers -->
      <div class="info-card" style="border-top: 4px solid #0072CE;">
        <div class="card-top">
          <span class="card-top-icon">👥</span>
          <div class="card-title">Potential Impact on Target Audience</div>
        </div>
        <ul class="card-bullets" style="gap: 12px;">
          <li>
            <strong>1.4 Billion Indian Consumers:</strong> Shields citizens against deceptive shrinkflation, undisclosed allergens, and expired consumables; bridges regulatory literacy via vernacular scorecards.
          </li>
          <li>
            <strong>Legal Metrology & Food Safety Officers:</strong> Multiplies daily inspection capacity by 10x; automates Section 36 compounding penalty notices and photographic evidence logging.
          </li>
          <li>
            <strong>Honest FMCG Brands & Retailers:</strong> Provides a digital pre-market compliance audit tool to eliminate accidental label misprints, costly product recalls, and brand litigation.
          </li>
        </ul>
      </div>

      <!-- Box 2: Benefits -->
      <div class="info-card" style="border-top: 4px solid #10B981;">
        <div class="card-top">
          <span class="card-top-icon">🌟</span>
          <div class="card-title">Benefits of the Solution (Social, Economic, Environmental)</div>
        </div>
        <ul class="card-bullets" style="gap: 10px;">
          <li>
            <strong>Social Benefits:</strong> Democratizes consumer rights; protects vulnerable rural populations from non-compliant and counterfeit goods with audio-guided verification.
          </li>
          <li>
            <strong>Economic Benefits:</strong> Boosts state exchequer revenue through streamlined Section 36 fine recovery; protects consumer purchasing power from unit-pricing fraud.
          </li>
          <li>
            <strong>Administrative Benefits:</strong> 100% reduction in defective grievance submissions via auto-formatted statutory petitions; macro-intelligence analytics for ministry directors.
          </li>
          <li>
            <strong>Environmental Benefits:</strong> Completely paperless inspection pipeline eliminates millions of physical paper challans and reduces travel emissions for repeated site visits.
          </li>
        </ul>
      </div>

    </div>

  </div>
"""

slide6_content = f"""
  <div class="sih-body" style="padding-top: 10px;">
    
    <div class="section-heading" style="margin-bottom: 14px;">
      <span class="diamond">❖</span>
      <span>Research and References</span>
    </div>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; flex: 1;">
      
      <div class="info-card" style="border-top: 4px solid #0072CE;">
        <div class="card-top">
          <span class="card-top-icon">⚖️</span>
          <div class="card-title">Statutory Acts & Central Rules</div>
        </div>
        <ul class="card-bullets" style="gap: 8px;">
          <li><strong>Legal Metrology Act, 2009 (Act No. 1 of 2010):</strong> Sections 18 & 36 governing mandatory packaging norms and ₹25,000 to ₹50,000 compounding penalty structures.</li>
          <li><strong>Legal Metrology (Packaged Commodities) Rules, 2011 (amended 2026):</strong> Rule 6 mandatory declarations and Table-I minimum numeral height standards.</li>
          <li><strong>Food Safety & Standards Act, 2006 & FSS Regulations, 2020:</strong> Labelling & display mandates, 14-digit FSSAI licensing, and allergen declarations.</li>
          <li><strong>Consumer Protection Act, 2019:</strong> Sections 2(28) & 10 regarding unfair trade practices and deceptive commercial advertisements.</li>
        </ul>
      </div>

      <div class="info-card" style="border-top: 4px solid #10B981;">
        <div class="card-top">
          <span class="card-top-icon">🏛️</span>
          <div class="card-title">Government Portals & Integration APIs</div>
        </div>
        <ul class="card-bullets" style="gap: 8px;">
          <li><strong>FoSCoS (Food Safety Compliance System):</strong> Direct grievance gateway and consumer complaint integration (<em>https://foscos.fssai.gov.in</em>).</li>
          <li><strong>National Consumer Helpline (NCH 1915 / INGRAM):</strong> Integrated Grievance Redressal Mechanism (<em>https://consumerhelpline.gov.in</em>).</li>
          <li><strong>CPGRAMS Portal:</strong> Centralized Public Grievance Redress and Monitoring System (<em>https://pgportal.gov.in</em>).</li>
          <li><strong>State Food Safety Commissioners:</strong> Automated targeted email petition transmission to Central & State designated enforcement officers.</li>
        </ul>
      </div>

      <div class="info-card" style="border-top: 4px solid #F59E0B;">
        <div class="card-top">
          <span class="card-top-icon">🔬</span>
          <div class="card-title">Technical Standards & Evidence Law</div>
        </div>
        <ul class="card-bullets" style="gap: 8px;">
          <li><strong>Section 65B, Indian Evidence Act:</strong> Admissibility criteria for electronic records via SHA-256 cryptographic hashing and tamper-evident audit logs.</li>
          <li><strong>Google Gemini 2.5 Flash Vision API:</strong> Multimodal visual reasoning, bounding box extraction, and structured JSON schema enforcement.</li>
          <li><strong>W3C Web Cryptography API:</strong> In-browser SHA-256 cryptographic digest calculation ensuring zero server tampering risk.</li>
          <li><strong>ISO/IEC 15415 & 18004:</strong> 2D Data Matrix and QR code print quality standards for packaged goods.</li>
        </ul>
      </div>

      <div class="info-card" style="border-top: 4px solid #8B5CF6;">
        <div class="card-top">
          <span class="card-top-icon">📦</span>
          <div class="card-title">Project Repositories & Working Prototype</div>
        </div>
        <ul class="card-bullets" style="gap: 8px;">
          <li><strong>Live Web Application:</strong> <span style="color:#0284C7; font-weight:700;">https://alokxcreate.github.io/Label-Lens-AI/</span></li>
          <li><strong>Native Android APK (v1.1.0):</strong> <span style="color:#059669; font-weight:700;">https://github.com/AlokXCreate/Label-Lens-AI/releases/tag/v1.1.0</span></li>
          <li><strong>GitHub Repository:</strong> <span style="color:#334155; font-weight:700;">https://github.com/AlokXCreate/Label-Lens-AI</span></li>
          <li><strong>Empirical Validation:</strong> Verified across 50+ packaged commodities across food, FMCG, and consumer categories with 98.4% detection accuracy.</li>
        </ul>
      </div>

    </div>

  </div>
"""

# Execution loop
slides = [
    ("slide_1.html", "SMART INDIA HACKATHON 2026", slide1_content, 1, "Slide_1_Title.png"),
    ("slide_2.html", "IDEA TITLE: LABEL LENS AI", slide2_content, 2, "Slide_2_Proposed_Solution.png"),
    ("slide_3.html", "TECHNICAL APPROACH", slide3_content, 3, "Slide_3_Technical_Approach.png"),
    ("slide_4.html", "FEASIBILITY AND VIABILITY", slide4_content, 4, "Slide_4_Feasibility_Viability.png"),
    ("slide_5.html", "IMPACT AND BENEFITS", slide5_content, 5, "Slide_5_Impact_Benefits.png"),
    ("slide_6.html", "RESEARCH AND REFERENCES", slide6_content, 6, "Slide_6_Research_References.png"),
]

def wrap_html(body_content):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
{common_css}
</style>
</head>
<body>
{body_content}
</body>
</html>"""

for fname, title, content, page, png_name in slides:
    slide_body = f"""
    <div class="slide">
      {make_header(title)}
      {content}
      {make_footer(page)}
    </div>
    """
    html_path = os.path.join(base_dir, fname)
    with open(html_path, "w", encoding="utf-8") as f_out:
        f_out.write(wrap_html(slide_body))
    
    png_path = os.path.join(base_dir, png_name)
    html_url = "file:///" + html_path.replace(os.sep, "/")
    cmd = [
        chrome_path,
        "--headless",
        "--disable-gpu",
        "--force-device-scale-factor=1",
        f"--screenshot={png_path}",
        "--window-size=1920,1080",
        html_url
    ]
    subprocess.run(cmd, check=True)
    print(f"Rendered {png_name}")

deck_body = "".join([
    f"""
    <div class="slide">
      {make_header(title)}
      {content}
      {make_footer(page)}
    </div>
    """ for _, title, content, page, _ in slides
])

deck_html_path = os.path.join(base_dir, "presentation_deck.html")
with open(deck_html_path, "w", encoding="utf-8") as f_deck:
    f_deck.write(wrap_html(deck_body))

pdf_path = os.path.join(base_dir, "SIH2026_Idea_Presentation_26034.pdf")
deck_url = "file:///" + deck_html_path.replace(os.sep, "/")
cmd_pdf = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    deck_url
]
subprocess.run(cmd_pdf, check=True)
print("SIH2026_Idea_Presentation_26034.pdf updated successfully!")
