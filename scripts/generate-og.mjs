import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const fontDir = resolve(root, 'node_modules/geist/dist/fonts/geist-sans');
const out = resolve(root, 'static/og.png');

const W = 1200;
const H = 630;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0B0B0C"/>
  <text
    x="${W / 2}"
    y="${H / 2 + 16}"
    font-family="Geist"
    font-weight="600"
    font-size="340"
    letter-spacing="-27"
    fill="#F2EDE4"
    text-anchor="middle"
    dominant-baseline="middle"
  >ac</text>
  <text
    x="60"
    y="${H - 56}"
    font-family="Geist"
    font-weight="400"
    font-size="24"
    fill="#8A8A93"
    letter-spacing="0.5"
  >asarelcastellanos.com</text>
  <text
    x="${W - 60}"
    y="${H - 56}"
    font-family="Geist"
    font-weight="400"
    font-size="24"
    fill="#8A8A93"
    text-anchor="end"
    letter-spacing="0.5"
  >Los Angeles</text>
</svg>
`;

const resvg = new Resvg(svg, {
	fitTo: { mode: 'width', value: W },
	font: {
		fontFiles: [
			`${fontDir}/Geist-Regular.ttf`,
			`${fontDir}/Geist-Medium.ttf`,
			`${fontDir}/Geist-SemiBold.ttf`,
			`${fontDir}/Geist-Bold.ttf`
		],
		loadSystemFonts: false,
		defaultFontFamily: 'Geist'
	}
});

const png = resvg.render().asPng();
writeFileSync(out, png);
console.log(`wrote ${out} (${png.length} bytes)`);
