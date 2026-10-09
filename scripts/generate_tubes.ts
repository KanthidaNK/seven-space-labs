import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

// 1. Cyan Erlenmeyer Flask SVG
const cyanFlaskSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="glassGrad" x1="120" y1="50" x2="400" y2="480" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#C084FC" stop-opacity="0.9"/>
      <stop offset="35%" stop-color="#A855F7" stop-opacity="0.4"/>
      <stop offset="65%" stop-color="#06B6D4" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#22D3EE" stop-opacity="0.8"/>
    </linearGradient>
    <linearGradient id="cyanLiquid" x1="256" y1="240" x2="256" y2="460" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#06B6D4" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#0891B2" stop-opacity="1"/>
    </linearGradient>
    <radialGradient id="cyanGlow" cx="50%" cy="65%" r="45%">
      <stop offset="0%" stop-color="#67E8F9" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="#06B6D4" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="purpleNeck" x1="210" y1="60" x2="300" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#D946EF" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#A855F7" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.3"/>
    </linearGradient>
    <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Glow effect behind -->
  <path d="M216 60 H296 V160 L410 420 C420 445 400 465 375 465 H137 C112 465 92 445 102 420 L216 160 Z" fill="url(#cyanGlow)" />

  <!-- Liquid Body -->
  <path d="M165 270 Q256 250 347 270 L400 420 C410 445 395 460 375 460 H137 C117 460 102 445 112 420 Z" fill="url(#cyanLiquid)" filter="url(#glowFilter)" />
  
  <!-- Liquid Wave highlight -->
  <path d="M165 270 Q210 255 256 270 Q305 285 347 270 Q305 260 256 262 Q210 264 165 270 Z" fill="#E0F2FE" opacity="0.8" />

  <!-- Bubbles inside liquid -->
  <circle cx="220" cy="380" r="14" fill="#E0F2FE" opacity="0.85" />
  <circle cx="220" cy="380" r="10" stroke="#0891B2" stroke-width="2" fill="none" opacity="0.9" />
  <circle cx="280" cy="350" r="18" fill="#E0F2FE" opacity="0.8" />
  <circle cx="310" cy="400" r="12" fill="#E0F2FE" opacity="0.75" />
  <circle cx="180" cy="410" r="16" fill="#E0F2FE" opacity="0.8" />
  <circle cx="250" cy="310" r="10" fill="#E0F2FE" opacity="0.9" />
  <circle cx="270" cy="415" r="8" fill="#E0F2FE" opacity="0.85" />
  <circle cx="200" cy="330" r="9" fill="#E0F2FE" opacity="0.8" />
  <circle cx="330" cy="330" r="11" fill="#E0F2FE" opacity="0.7" />

  <!-- Upper neck purple liquid mist -->
  <path d="M216 65 H296 V160 L347 270 Q256 250 165 270 L216 160 Z" fill="url(#purpleNeck)" opacity="0.85" />

  <!-- Glass Flask Outline & Reflections -->
  <path d="M216 60 H296 V160 L410 420 C420 445 400 465 375 465 H137 C112 465 92 445 102 420 L216 160 Z" 
        stroke="url(#glassGrad)" stroke-width="12" fill="none" stroke-linejoin="round" />
  
  <!-- Rim on top -->
  <ellipse cx="256" cy="60" rx="46" ry="10" stroke="#E879F9" stroke-width="8" fill="#0C0A1D" />
  <ellipse cx="256" cy="60" rx="38" ry="7" fill="#3B0764" opacity="0.7" />

  <!-- Glass Light Reflection Streaks -->
  <path d="M228 170 L140 390" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.75" />
  <path d="M236 170 L160 360" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.5" />
  <path d="M284 170 L370 390" stroke="#67E8F9" stroke-width="6" stroke-linecap="round" opacity="0.6" />
</svg>
`;

// 2. Green Beaker SVG
const greenBeakerSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="greenLiquid" x1="256" y1="180" x2="256" y2="450" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#4ADE80" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#22C55E" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#15803D" stop-opacity="1"/>
    </linearGradient>
    <radialGradient id="greenGlow" cx="50%" cy="60%" r="50%">
      <stop offset="0%" stop-color="#86EFAC" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="#22C55E" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="beakerGlass" x1="130" y1="80" x2="380" y2="460" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E879F9" stop-opacity="0.9"/>
      <stop offset="30%" stop-color="#A855F7" stop-opacity="0.5"/>
      <stop offset="70%" stop-color="#22C55E" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#4ADE80" stop-opacity="0.8"/>
    </linearGradient>
    <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Glow behind -->
  <rect x="140" y="90" width="232" height="360" rx="30" fill="url(#greenGlow)" />

  <!-- Liquid in Beaker -->
  <path d="M148 200 Q256 180 364 200 V420 C364 438 350 450 332 450 H180 C162 450 148 438 148 420 Z" fill="url(#greenLiquid)" filter="url(#glowGreen)" />

  <!-- Foam & Bubbles top wave -->
  <path d="M148 200 Q180 185 210 195 Q240 205 270 190 Q300 178 330 195 Q350 205 364 200 Q330 188 280 198 Q230 208 190 192 Z" fill="#DCFCE7" opacity="0.9" />

  <!-- Beaker Bubbles -->
  <circle cx="230" cy="340" r="16" fill="#DCFCE7" opacity="0.9" />
  <circle cx="290" cy="300" r="20" fill="#DCFCE7" opacity="0.85" />
  <circle cx="190" cy="390" r="14" fill="#DCFCE7" opacity="0.8" />
  <circle cx="320" cy="370" r="18" fill="#DCFCE7" opacity="0.75" />
  <circle cx="260" cy="400" r="12" fill="#DCFCE7" opacity="0.85" />
  <circle cx="210" cy="270" r="14" fill="#DCFCE7" opacity="0.9" />
  <circle cx="300" cy="240" r="12" fill="#DCFCE7" opacity="0.85" />
  <circle cx="250" cy="240" r="10" fill="#DCFCE7" opacity="0.9" />

  <!-- Purple upper gas/glow in beaker -->
  <rect x="148" y="96" width="216" height="104" fill="#D946EF" opacity="0.35" />

  <!-- Glass Beaker Body -->
  <path d="M136 84 H364 L378 72 H390 V96 L364 96 V420 C364 442 346 460 324 460 H188 C166 460 148 442 148 420 V84 Z" 
        stroke="url(#beakerGlass)" stroke-width="12" fill="none" stroke-linejoin="round" />

  <!-- Rim highlight -->
  <line x1="130" y1="84" x2="380" y2="84" stroke="#F472B6" stroke-width="10" stroke-linecap="round" />
  <path d="M364 84 L388 72" stroke="#F472B6" stroke-width="10" stroke-linecap="round" />

  <!-- Measurement markings -->
  <line x1="330" y1="180" x2="354" y2="180" stroke="#FFFFFF" stroke-width="4" opacity="0.7" />
  <line x1="338" y1="230" x2="354" y2="230" stroke="#FFFFFF" stroke-width="3" opacity="0.7" />
  <line x1="330" y1="280" x2="354" y2="280" stroke="#FFFFFF" stroke-width="4" opacity="0.7" />
  <line x1="338" y1="330" x2="354" y2="330" stroke="#FFFFFF" stroke-width="3" opacity="0.7" />
  <line x1="330" y1="380" x2="354" y2="380" stroke="#FFFFFF" stroke-width="4" opacity="0.7" />

  <!-- Reflection -->
  <path d="M165 120 V410" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.7" />
  <path d="M180 140 V380" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.4" />
</svg>
`;

// 3. Pink Round Bottom Flask SVG
const pinkRoundFlaskSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pinkLiquid" x1="256" y1="270" x2="256" y2="460" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F472B6" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#EC4899" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#BE185D" stop-opacity="1"/>
    </linearGradient>
    <radialGradient id="pinkGlow" cx="50%" cy="65%" r="45%">
      <stop offset="0%" stop-color="#F472B6" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="#DB2777" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="pinkGlass" x1="140" y1="60" x2="380" y2="460" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.9"/>
      <stop offset="35%" stop-color="#A855F7" stop-opacity="0.5"/>
      <stop offset="70%" stop-color="#F43F5E" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#EC4899" stop-opacity="0.9"/>
    </linearGradient>
    <filter id="glowPink" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Glow -->
  <circle cx="256" cy="335" r="140" fill="url(#pinkGlow)" />

  <!-- Liquid inside sphere -->
  <path d="M140 310 C140 395 190 455 256 455 C322 455 372 395 372 310 Q256 280 140 310 Z" fill="url(#pinkLiquid)" filter="url(#glowPink)" />

  <!-- Liquid surface -->
  <path d="M140 310 Q198 290 256 305 Q314 320 372 310 Q314 295 256 295 Q198 295 140 310 Z" fill="#FCE7F3" opacity="0.9" />

  <!-- Bubbles -->
  <circle cx="220" cy="380" r="16" fill="#FCE7F3" opacity="0.9" />
  <circle cx="280" cy="360" r="20" fill="#FCE7F3" opacity="0.85" />
  <circle cx="310" cy="400" r="14" fill="#FCE7F3" opacity="0.8" />
  <circle cx="180" cy="370" r="15" fill="#FCE7F3" opacity="0.75" />
  <circle cx="250" cy="420" r="12" fill="#FCE7F3" opacity="0.85" />
  <circle cx="240" cy="330" r="10" fill="#FCE7F3" opacity="0.9" />
  <circle cx="290" cy="320" r="12" fill="#FCE7F3" opacity="0.85" />

  <!-- Purple upper mist in neck -->
  <path d="M226 60 H286 V225 Q256 240 226 225 Z" fill="#A855F7" opacity="0.6" />

  <!-- Glass Round Flask Body -->
  <path d="M226 60 H286 V220 C345 245 376 295 376 335 C376 405 322 460 256 460 C190 460 136 405 136 335 C136 295 167 245 226 220 V60 Z" 
        stroke="url(#pinkGlass)" stroke-width="12" fill="none" stroke-linejoin="round" />

  <!-- Cyan Top Rim -->
  <ellipse cx="256" cy="60" rx="36" ry="9" stroke="#22D3EE" stroke-width="8" fill="#0C0A1D" />

  <!-- Glass Light Reflections -->
  <path d="M234 90 V210" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.7" />
  <path d="M165 290 C150 325 152 370 175 410" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.75" />
  <path d="M347 290 C362 325 360 370 337 410" stroke="#22D3EE" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.6" />
</svg>
`;

// 4. Purple Test Tube SVG
const purpleTestTubeSvg = `
<svg width="512" height="1024" viewBox="0 0 512 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="purpleLiquid" x1="256" y1="260" x2="256" y2="920" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#C084FC" stop-opacity="0.95"/>
      <stop offset="40%" stop-color="#9333EA" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#581C87" stop-opacity="1"/>
    </linearGradient>
    <radialGradient id="purpleGlow" cx="50%" cy="60%" r="50%">
      <stop offset="0%" stop-color="#D8B4FE" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="#9333EA" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="tubeGlass" x1="160" y1="90" x2="350" y2="920" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F472B6" stop-opacity="0.9"/>
      <stop offset="30%" stop-color="#C084FC" stop-opacity="0.6"/>
      <stop offset="70%" stop-color="#818CF8" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#A855F7" stop-opacity="0.9"/>
    </linearGradient>
    <filter id="glowPurple" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Glow -->
  <rect x="180" y="240" width="152" height="680" rx="76" fill="url(#purpleGlow)" />

  <!-- Liquid inside tube -->
  <path d="M190 270 Q256 250 322 270 V844 C322 886 292 920 256 920 C220 920 190 886 190 844 Z" fill="url(#purpleLiquid)" filter="url(#glowPurple)" />

  <!-- Liquid Foam surface -->
  <path d="M190 270 Q225 255 256 268 Q288 280 322 270 Q288 258 256 260 Q225 262 190 270 Z" fill="#F3E8FF" opacity="0.9" />

  <!-- Rising Bubbles in Tube -->
  <circle cx="240" cy="800" r="18" fill="#F3E8FF" opacity="0.9" />
  <circle cx="280" cy="740" r="22" fill="#F3E8FF" opacity="0.85" />
  <circle cx="225" cy="670" r="16" fill="#F3E8FF" opacity="0.8" />
  <circle cx="270" cy="600" r="20" fill="#F3E8FF" opacity="0.9" />
  <circle cx="235" cy="520" r="18" fill="#F3E8FF" opacity="0.85" />
  <circle cx="280" cy="450" r="15" fill="#F3E8FF" opacity="0.8" />
  <circle cx="230" cy="390" r="22" fill="#F3E8FF" opacity="0.9" />
  <circle cx="275" cy="330" r="18" fill="#F3E8FF" opacity="0.85" />
  <circle cx="240" cy="285" r="14" fill="#F3E8FF" opacity="0.9" />

  <!-- Glass Tube Body -->
  <path d="M182 90 H330 V844 C330 890 297 930 256 930 C215 930 182 890 182 844 Z" 
        stroke="url(#tubeGlass)" stroke-width="14" fill="none" stroke-linejoin="round" />

  <!-- Top Lip Rim -->
  <ellipse cx="256" cy="90" rx="84" ry="16" stroke="#EC4899" stroke-width="10" fill="#0C0A1D" />

  <!-- Highlights -->
  <path d="M200 130 V830" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.75" />
  <path d="M214 150 V790" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.4" />
  <path d="M312 130 V830" stroke="#E879F9" stroke-width="6" stroke-linecap="round" opacity="0.6" />
</svg>
`;

async function generateImages() {
  const images = [
    { name: 'tube_cyan_final', svg: cyanFlaskSvg },
    { name: 'tube_green_final', svg: greenBeakerSvg },
    { name: 'tube_pink_final', svg: pinkRoundFlaskSvg },
    { name: 'tube_purple_clean', svg: purpleTestTubeSvg },
  ];

  for (const img of images) {
    const svgBuffer = Buffer.from(img.svg);
    
    // PNG (Transparent)
    await sharp(svgBuffer)
      .png()
      .toFile(path.join(publicDir, `${img.name}.png`));

    // JPG (Black background for mix-blend-mode: screen)
    await sharp(svgBuffer)
      .flatten({ background: '#000000' })
      .jpeg({ quality: 95 })
      .toFile(path.join(publicDir, `${img.name}.jpg`));

    console.log(`Generated ${img.name}.png & ${img.name}.jpg`);
  }
}

generateImages().catch(console.error);
