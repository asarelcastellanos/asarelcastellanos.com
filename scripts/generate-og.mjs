import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// The same parser the site and the build use, so a project file means the same thing everywhere.
// Node strips the types when it loads this TypeScript file.
import { parseProjectMeta, slugFromPath } from '../src/lib/content/frontmatter.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const fontDir = resolve(root, 'scripts/fonts');
const out = resolve(root, 'static/og.png');
const projectsDir = resolve(root, 'src/content/projects');
const projectOutDir = resolve(root, 'static/og');

const W = 1200;
const H = 630;

const homeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#090B0A"/>
  <text
    x="${W / 2}"
    y="${H / 2 + 16}"
    font-family="Geist"
    font-weight="600"
    font-size="340"
    letter-spacing="-27"
    fill="#E9EEEA"
    text-anchor="middle"
    dominant-baseline="middle"
  >ac</text>
  <text
    x="60"
    y="${H - 56}"
    font-family="Geist"
    font-weight="400"
    font-size="24"
    fill="#879189"
    letter-spacing="0.5"
  >asarelcastellanos.com</text>
  <text
    x="${W - 60}"
    y="${H - 56}"
    font-family="Geist"
    font-weight="400"
    font-size="24"
    fill="#879189"
    text-anchor="end"
    letter-spacing="0.5"
  >Los Angeles</text>
</svg>
`;

const fontOptions = {
	fontFiles: [
		`${fontDir}/Geist-Regular.ttf`,
		`${fontDir}/Geist-Medium.ttf`,
		`${fontDir}/Geist-SemiBold.ttf`,
		`${fontDir}/Geist-Bold.ttf`
	],
	loadSystemFonts: false,
	defaultFontFamily: 'Geist'
};

function render(svg) {
	return new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: fontOptions }).render().asPng();
}

function escapeXml(text) {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Splits text into lines of at most maxChars characters. resvg does not wrap text on its own. */
function wrap(text, maxChars) {
	const lines = [];
	let line = '';
	for (const word of text.split(/\s+/)) {
		if (line !== '' && `${line} ${word}`.length > maxChars) {
			lines.push(line);
			line = word;
		} else {
			line = line === '' ? word : `${line} ${word}`;
		}
	}
	if (line !== '') lines.push(line);
	return lines;
}

function tspans(lines, x, firstY, lineHeight) {
	return lines
		.map((line, i) => `<tspan x="${x}" y="${firstY + i * lineHeight}">${escapeXml(line)}</tspan>`)
		.join('');
}

const PAD = 80;
const TITLE_SIZE = 76;
const SUMMARY_SIZE = 32;

function projectSvg(meta) {
	// Geist averages about 0.56 em per character. These limits leave room on the right edge.
	const titleLines = wrap(meta.title, 24);
	const summaryLines = wrap(meta.summary, 56);
	if (titleLines.length > 2) throw new Error(`"${meta.title}" is too long for the OG image`);
	if (summaryLines.length > 4) throw new Error(`The summary of "${meta.title}" is too long for the OG image`);

	const titleY = 150;
	const summaryY = titleY + (titleLines.length - 1) * (TITLE_SIZE + 8) + 80;
	return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#090B0A"/>
  <text font-family="Geist" font-weight="600" font-size="${TITLE_SIZE}" letter-spacing="-2" fill="#E9EEEA">${tspans(titleLines, PAD, titleY, TITLE_SIZE + 8)}</text>
  <text font-family="Geist" font-weight="400" font-size="${SUMMARY_SIZE}" fill="#879189">${tspans(summaryLines, PAD, summaryY, SUMMARY_SIZE + 14)}</text>
  <text x="${PAD}" y="${H - 56}" font-family="Geist" font-weight="400" font-size="24" fill="#879189" letter-spacing="0.5">asarelcastellanos.com</text>
  <text x="${W - PAD}" y="${H - 56}" font-family="Geist" font-weight="500" font-size="24" fill="#9CC59A" text-anchor="end">${escapeXml(meta.status)}</text>
</svg>
`;
}

const homePng = render(homeSvg);
writeFileSync(out, homePng);
console.log(`wrote ${out} (${homePng.length} bytes)`);

// One image per non-draft project, at static/og/<slug>.png.
mkdirSync(projectOutDir, { recursive: true });
for (const name of readdirSync(projectsDir).filter((entry) => entry.endsWith('.md')).sort()) {
	const meta = parseProjectMeta(readFileSync(resolve(projectsDir, name), 'utf8'), `src/content/projects/${name}`);
	if (meta.draft) continue;
	const file = resolve(projectOutDir, `${slugFromPath(name)}.png`);
	const png = render(projectSvg(meta));
	writeFileSync(file, png);
	console.log(`wrote ${file} (${png.length} bytes)`);
}
