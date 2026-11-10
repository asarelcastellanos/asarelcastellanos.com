// Builds the howlate.la cover image: the share of LA Metro arrivals more than 5 minutes late,
// by hour of the week. It pools every line and direction from the pipeline's site files, weighted
// by measured arrivals, and draws a red heatmap at 1600x900.
//
// Do not commit the output before howlate.la launches. The chart publishes findings early, so the
// image stays out of the repo (and out of static/) until the site is live.
//
// By default the script downloads the latest site files with gcloud, which needs access to the
// howlate-la project. Pass --site <dir> to use a folder you already downloaded instead.
//
// Example:
//   npm run cover:howlate -- --out ~/Desktop/howlate-cover.png
import { Resvg } from '@resvg/resvg-js';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const fontDir = resolve(root, 'scripts/fonts');

const BUCKET = 'gs://howlate-derived';
const USAGE = 'Usage: node scripts/generate-howlate-cover.mjs --out <path.png> [--site <dir>]';

const { values: args } = parseArgs({ options: { out: { type: 'string' }, site: { type: 'string' } } });
if (!args.out) {
	console.error(USAGE);
	process.exit(1);
}
const pngPath = resolve(args.out);
const svgPath = pngPath.replace(/\.png$/i, '') + '.svg';

/** Downloads the latest published site files into a fresh temp folder and returns its path and run prefix. */
function downloadSite() {
	try {
		const current = JSON.parse(execFileSync('gcloud', ['storage', 'cat', `${BUCKET}/site/current.json`], { encoding: 'utf8' }));
		const dir = mkdtempSync(join(tmpdir(), 'howlate-site-'));
		// Delete the download when the script ends, including on an error. Only this folder, never --site.
		process.on('exit', () => rmSync(dir, { recursive: true, force: true }));
		// The prefix ends in a slash, so the wildcard copies the run's files and folders.
		execFileSync('gcloud', ['storage', 'cp', '-r', `${BUCKET}/${current.prefix}*`, dir], { stdio: ['ignore', 'ignore', 'pipe'] });
		return { site: dir, run: current.prefix };
	} catch (error) {
		console.error(`Could not download the site files from gcloud (${error.message.split('\n')[0]}). Run "gcloud auth login" or pass --site <dir>.`);
		process.exit(1);
	}
}

const { site, run } = args.site ? { site: resolve(args.site), run: `local folder ${resolve(args.site)}` } : downloadSite();
console.log(`run ${run}`);

// Cells with fewer measured arrivals than this are drawn empty rather than as a shaky number.
const MIN_N = 3000;
const cells = new Map(); // hour of week (0 = Monday 00:00) -> { n, late }
for (const name of readdirSync(resolve(site, 'lines'))) {
	const line = JSON.parse(readFileSync(resolve(site, 'lines', name), 'utf8'));
	for (const direction of line.directions) {
		for (const p of direction.profile) {
			const cell = cells.get(p.h) ?? { n: 0, late: 0 };
			cell.n += p.n;
			cell.late += (p.n * p.pct5) / 100;
			cells.set(p.h, cell);
		}
	}
}
const status = JSON.parse(readFileSync(resolve(site, 'status.json'), 'utf8'));

// --- Color: one hue, light to dark, binned so each step is readable. ---------------------------
function oklchToHex(L, C, h) {
	const a = C * Math.cos((h * Math.PI) / 180);
	const b = C * Math.sin((h * Math.PI) / 180);
	const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
	const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
	const s_ = L - 0.0894841775 * a - 1.291485548 * b;
	const [l, m, s] = [l_ ** 3, m_ ** 3, s_ ** 3];
	const lin = [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
	];
	const gamma = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
	return (
		'#' +
		lin
			.map((x) => Math.round(Math.min(1, Math.max(0, gamma(x))) * 255).toString(16).padStart(2, '0'))
			.join('')
	);
}

// Red, because the scale measures lateness. One hue, lighter to darker, so more late reads as darker.
const HUE = 27;
const STEPS = [
	{ L: 0.92, C: 0.035 },
	{ L: 0.84, C: 0.07 },
	{ L: 0.76, C: 0.11 },
	{ L: 0.67, C: 0.15 },
	{ L: 0.58, C: 0.17 },
	{ L: 0.48, C: 0.155 },
	{ L: 0.38, C: 0.125 }
].map((s) => oklchToHex(s.L, s.C, HUE));
const EDGES = [10, 15, 20, 25, 30, 35]; // percent; bin i covers [EDGES[i-1], EDGES[i])
const LEGEND = ['&lt;10%', '10-15', '15-20', '20-25', '25-30', '30-35', '35%+'];
const bin = (pct) => EDGES.filter((edge) => pct >= edge).length;

// --- Layout ------------------------------------------------------------------------------------
const W = 1600;
const H = 900;
const BG = '#EFF0EC';
const INK = '#26252F';
const MUTED = '#55545F';
const EMPTY = '#E3E4DF';
const PAD_X = 96;
const LABEL_W = 70;
const TOP = 230;
const GAP = 2;
const gridW = W - PAD_X * 2 - LABEL_W;
const cellW = (gridW - GAP * 23) / 24;
const cellH = 62;
const gridLeft = PAD_X + LABEL_W;
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hourLabel = (h) => (h === 0 ? '12am' : h === 12 ? 'noon' : h < 12 ? `${h}am` : `${h - 12}pm`);
const fmtDate = (iso) =>
	new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

const parts = [];
parts.push(`<rect width="${W}" height="${H}" fill="${BG}"/>`);
parts.push(
	`<text x="${PAD_X}" y="110" font-family="Geist" font-weight="600" font-size="46" fill="${INK}" letter-spacing="-1">Share of LA Metro arrivals more than 5 minutes late</text>`
);
parts.push(
	`<text x="${PAD_X}" y="158" font-family="Geist" font-size="26" fill="${MUTED}">By hour of the week. Every bus and rail line, ${fmtDate(status.first_day)} to ${fmtDate(status.last_day)} 2026, ${status.days} days.</text>`
);

for (let d = 0; d < 7; d++) {
	const y = TOP + d * (cellH + GAP);
	parts.push(
		`<text x="${PAD_X}" y="${y + cellH / 2 + 9}" font-family="Geist" font-size="24" fill="${MUTED}">${DAYS[d]}</text>`
	);
	for (let h = 0; h < 24; h++) {
		const x = gridLeft + h * (cellW + GAP);
		const cell = cells.get(d * 24 + h);
		const fill = cell && cell.n >= MIN_N ? STEPS[bin((100 * cell.late) / cell.n)] : EMPTY;
		parts.push(`<rect x="${x.toFixed(2)}" y="${y}" width="${cellW.toFixed(2)}" height="${cellH}" fill="${fill}"/>`);
	}
}

const axisY = TOP + 7 * (cellH + GAP) + 34;
for (let h = 0; h < 24; h += 3) {
	const x = gridLeft + h * (cellW + GAP);
	parts.push(`<text x="${x.toFixed(2)}" y="${axisY}" font-family="Geist" font-size="22" fill="${MUTED}">${hourLabel(h)}</text>`);
}

// Legend: one swatch per bin, labels in ink, never in the series color.
const legendY = axisY + 52;
const swatchW = 92;
let lx = gridLeft;
parts.push(`<text x="${PAD_X}" y="${legendY + 22}" font-family="Geist" font-size="22" fill="${MUTED}">Late</text>`);
STEPS.forEach((color, i) => {
	parts.push(`<rect x="${lx}" y="${legendY}" width="${swatchW}" height="28" fill="${color}"/>`);
	parts.push(`<text x="${lx}" y="${legendY + 58}" font-family="Geist" font-size="20" fill="${MUTED}">${LEGEND[i]}</text>`);
	lx += swatchW + GAP;
});
// Only explain empty cells when the chart has one.
if ([...Array(168).keys()].some((h) => !(cells.get(h)?.n >= MIN_N))) {
	parts.push(`<rect x="${lx + 40}" y="${legendY}" width="28" height="28" fill="${EMPTY}"/>`);
	parts.push(`<text x="${lx + 80}" y="${legendY + 22}" font-family="Geist" font-size="20" fill="${MUTED}">Too few arrivals</text>`);
}
parts.push(
	`<text x="${W - PAD_X}" y="${legendY + 22}" font-family="Geist" font-size="22" fill="${MUTED}" text-anchor="end">howlate.la</text>`
);


const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join('')}</svg>`;
mkdirSync(dirname(pngPath), { recursive: true });
writeFileSync(svgPath, svg);
const fonts = ['Regular', 'Medium', 'SemiBold'].map((w) => `${fontDir}/Geist-${w}.ttf`);
const png = new Resvg(svg, { font: { fontFiles: fonts, loadSystemFonts: false, defaultFontFamily: 'Geist' } })
	.render()
	.asPng();
writeFileSync(pngPath, png);

console.log('ramp', STEPS.join(' '));
const empty = [...Array(168).keys()].filter((h) => !(cells.get(h)?.n >= MIN_N));
console.log('empty cells', empty.map((h) => `${DAYS[Math.floor(h / 24)]} ${hourLabel(h % 24)}`).join(', ') || 'none');
console.log(`wrote ${pngPath} (${png.length} bytes)`);
console.log(`wrote ${svgPath}`);
