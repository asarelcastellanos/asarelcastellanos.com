/**
 * Frontmatter parser and validator for project files.
 *
 * This module imports nothing and uses only syntax that Node can strip, so the Vite build, the
 * site, and scripts/generate-og.mjs all read project files through the same rules.
 *
 * Supported frontmatter syntax, which is a small subset of YAML:
 *   key: value            a string (bare, "double quoted", or 'single quoted'), a number, or true/false
 *   key: [a, "b c", d]    an inline list on one line
 *   key:                  a block of two-space-indented `name: value` lines, for links and cover
 * Comments, multi-line strings, and anchors are not supported and fail with a clear message.
 */

export const PROJECT_STATUSES = ['Collecting data', 'In development', 'Shipped'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** A calendar month written as YYYY-MM. */
export type YearMonth = string & { readonly __brand: 'YearMonth' };

export type ProjectLinks = {
	site: string | null;
	source: string | null;
};

export type ProjectCover = {
	src: string;
	alt: string;
};

export type ProjectMeta = {
	title: string;
	summary: string;
	status: ProjectStatus;
	role: string;
	start: YearMonth;
	/** Null means the project is ongoing. */
	end: YearMonth | null;
	stack: string[];
	links: ProjectLinks;
	cover: ProjectCover | null;
	order: number;
	draft: boolean;
};

export function isProjectStatus(value: unknown): value is ProjectStatus {
	return PROJECT_STATUSES.some((status) => status === value);
}

export function isYearMonth(value: unknown): value is YearMonth {
	return typeof value === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

/** Returns the slug for a path such as /src/content/projects/howlate-la.md. */
export function slugFromPath(path: string): string {
	const name = path.split('/').pop() ?? path;
	const slug = name.replace(/\.md$/, '');
	if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
		throw new Error(`${path}: file name must be lowercase words joined by hyphens, then .md`);
	}
	return slug;
}

// ---------------------------------------------------------------------------------------------
// Raw parsing: text to a tree of strings, numbers, booleans, lists, and maps.

type Raw = string | number | boolean | Raw[] | Map<string, Raw>;

function describe(value: Raw): string {
	if (typeof value === 'string') return 'a string';
	if (typeof value === 'number') return 'a number';
	if (typeof value === 'boolean') return 'a boolean';
	if (Array.isArray(value)) return 'a list';
	return 'a block';
}

/** Reads a quoted string that starts at text[start]. Returns the value and the index after the closing quote. */
function readQuoted(text: string, start: number, where: string): { value: string; end: number } {
	const quote = text[start];
	let value = '';
	let i = start + 1;
	while (i < text.length) {
		const char = text[i];
		if (quote === '"' && char === '\\') {
			const next = text[i + 1];
			if (next === '"' || next === '\\') {
				value += next;
				i += 2;
				continue;
			}
			throw new Error(`${where}: only \\" and \\\\ are supported escapes`);
		}
		if (quote === "'" && char === "'" && text[i + 1] === "'") {
			value += "'";
			i += 2;
			continue;
		}
		if (char === quote) return { value, end: i + 1 };
		value += char;
		i += 1;
	}
	throw new Error(`${where}: missing closing ${quote} quote`);
}

function readInlineList(text: string, where: string): Raw[] {
	const items: Raw[] = [];
	let i = 1;
	for (;;) {
		while (text[i] === ' ') i += 1;
		if (i >= text.length) throw new Error(`${where}: list is missing a closing ]`);
		if (text[i] === ']') {
			i += 1;
			break;
		}
		if (text[i] === '"' || text[i] === "'") {
			const quoted = readQuoted(text, i, where);
			items.push(quoted.value);
			i = quoted.end;
		} else {
			let end = i;
			while (end < text.length && text[end] !== ',' && text[end] !== ']') end += 1;
			const bare = text.slice(i, end).trim();
			if (bare === '') throw new Error(`${where}: list has an empty item`);
			items.push(bare);
			i = end;
		}
		while (text[i] === ' ') i += 1;
		if (text[i] === ',') i += 1;
		else if (text[i] !== ']') throw new Error(`${where}: expected , or ] in the list`);
	}
	if (text.slice(i).trim() !== '') throw new Error(`${where}: unexpected text after the list`);
	return items;
}

function readValue(text: string, where: string): Raw {
	const trimmed = text.trim();
	if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
		const quoted = readQuoted(trimmed, 0, where);
		if (trimmed.slice(quoted.end).trim() !== '') {
			throw new Error(`${where}: unexpected text after the closing quote`);
		}
		return quoted.value;
	}
	if (trimmed.startsWith('[')) return readInlineList(trimmed, where);
	if (trimmed === 'true') return true;
	if (trimmed === 'false') return false;
	if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
	return trimmed;
}

const KEY_LINE = /^([A-Za-z][A-Za-z0-9]*):(?: +(.*))?$/;
const NESTED_LINE = /^ {2}([A-Za-z][A-Za-z0-9]*):(?: +(.*))?$/;

function parseBlock(lines: string[], file: string): Map<string, Raw> {
	const result = new Map<string, Raw>();
	let i = 0;
	while (i < lines.length) {
		const line = lines[i] ?? '';
		const lineNumber = i + 2; // Line 1 is the opening fence.
		i += 1;
		if (line.trim() === '') continue;

		const match = KEY_LINE.exec(line);
		if (match === null) {
			throw new Error(`${file}: line ${lineNumber} is not "key: value" (${JSON.stringify(line)})`);
		}
		const key = match[1] ?? '';
		const rest = (match[2] ?? '').trim();
		if (result.has(key)) throw new Error(`${file}: "${key}" appears twice`);

		if (rest !== '') {
			result.set(key, readValue(rest, `${file}: "${key}"`));
			continue;
		}

		// An empty value starts a block of indented lines.
		const nested = new Map<string, Raw>();
		while (i < lines.length && (lines[i] ?? '').startsWith(' ')) {
			const nestedLine = lines[i] ?? '';
			const nestedMatch = NESTED_LINE.exec(nestedLine);
			if (nestedMatch === null) {
				throw new Error(
					`${file}: line ${i + 2} must be two spaces, then "name: value" (${JSON.stringify(nestedLine)})`
				);
			}
			const nestedKey = nestedMatch[1] ?? '';
			const nestedRest = (nestedMatch[2] ?? '').trim();
			if (nested.has(nestedKey)) throw new Error(`${file}: "${key}.${nestedKey}" appears twice`);
			if (nestedRest === '') throw new Error(`${file}: "${key}.${nestedKey}" has no value`);
			nested.set(nestedKey, readValue(nestedRest, `${file}: "${key}.${nestedKey}"`));
			i += 1;
		}
		if (nested.size === 0) throw new Error(`${file}: "${key}" has no value`);
		result.set(key, nested);
	}
	return result;
}

/** Splits a file into its frontmatter lines. The file must start with a --- fence. */
function frontmatterLines(source: string, file: string): string[] {
	const lines = source.replace(/\r\n/g, '\n').split('\n');
	if (lines[0] !== '---') throw new Error(`${file}: the file must start with a --- line`);
	const close = lines.indexOf('---', 1);
	if (close === -1) throw new Error(`${file}: frontmatter is missing its closing --- line`);
	return lines.slice(1, close);
}

// ---------------------------------------------------------------------------------------------
// Validation: the tree to a ProjectMeta.

function field(map: Map<string, Raw>, key: string, file: string, prefix = ''): Raw {
	const value = map.get(key);
	if (value === undefined) throw new Error(`${file}: "${prefix}${key}" is missing`);
	return value;
}

function text(value: Raw, key: string, file: string): string {
	if (typeof value !== 'string') throw new Error(`${file}: "${key}" must be a string, got ${describe(value)}`);
	if (value.trim() === '') throw new Error(`${file}: "${key}" is empty`);
	// House style: no em or en dashes in copy.
	if (/[–—]/.test(value)) throw new Error(`${file}: "${key}" contains an em or en dash`);
	return value;
}

function url(value: Raw, key: string, file: string): string {
	const raw = text(value, key, file);
	let parsed: URL;
	try {
		parsed = new URL(raw);
	} catch {
		throw new Error(`${file}: "${key}" is not a valid URL (${JSON.stringify(raw)})`);
	}
	if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
		throw new Error(`${file}: "${key}" must start with http:// or https://`);
	}
	return raw;
}

function yearMonth(value: Raw, key: string, file: string): YearMonth {
	if (!isYearMonth(value)) {
		throw new Error(`${file}: "${key}" must look like 2026-08 (YYYY-MM), got ${JSON.stringify(value)}`);
	}
	return value;
}

function block(value: Raw, key: string, file: string): Map<string, Raw> {
	if (!(value instanceof Map)) throw new Error(`${file}: "${key}" must be a block of indented lines, got ${describe(value)}`);
	return value;
}

function rejectUnknownKeys(map: Map<string, Raw>, allowed: readonly string[], prefix: string, file: string): void {
	for (const key of map.keys()) {
		if (!allowed.includes(key)) {
			throw new Error(`${file}: unknown field "${prefix}${key}". Allowed: ${allowed.join(', ')}`);
		}
	}
}

const TOP_LEVEL_KEYS = [
	'title',
	'summary',
	'status',
	'role',
	'start',
	'end',
	'stack',
	'links',
	'cover',
	'order',
	'draft'
] as const;

/**
 * Parses and validates a project file. Throws an Error that names the file and the field on
 * anything missing, unknown, or malformed. `file` is only used in messages.
 */
export function parseProjectMeta(source: string, file: string): ProjectMeta {
	const map = parseBlock(frontmatterLines(source, file), file);
	rejectUnknownKeys(map, TOP_LEVEL_KEYS, '', file);

	const title = text(field(map, 'title', file), 'title', file);
	const summary = text(field(map, 'summary', file), 'summary', file);
	if (/[\n]/.test(summary)) throw new Error(`${file}: "summary" must be one line`);

	const status = field(map, 'status', file);
	if (!isProjectStatus(status)) {
		throw new Error(
			`${file}: "status" must be one of ${PROJECT_STATUSES.map((s) => JSON.stringify(s)).join(', ')}, got ${JSON.stringify(status)}`
		);
	}

	const role = text(field(map, 'role', file), 'role', file);
	const start = yearMonth(field(map, 'start', file), 'start', file);

	const endRaw = map.get('end');
	const end = endRaw === undefined ? null : yearMonth(endRaw, 'end', file);
	if (end !== null && end < start) throw new Error(`${file}: "end" (${end}) is before "start" (${start})`);

	const stackRaw = field(map, 'stack', file);
	if (!Array.isArray(stackRaw)) throw new Error(`${file}: "stack" must be a list like [Python, DuckDB], got ${describe(stackRaw)}`);
	if (stackRaw.length === 0) throw new Error(`${file}: "stack" is empty`);
	const stack = stackRaw.map((item, index) => text(item, `stack[${index}]`, file));

	const links: ProjectLinks = { site: null, source: null };
	const linksRaw = map.get('links');
	if (linksRaw !== undefined) {
		const linkMap = block(linksRaw, 'links', file);
		rejectUnknownKeys(linkMap, ['site', 'source'], 'links.', file);
		const site = linkMap.get('site');
		const source = linkMap.get('source');
		if (site !== undefined) links.site = url(site, 'links.site', file);
		if (source !== undefined) links.source = url(source, 'links.source', file);
	}

	let cover: ProjectCover | null = null;
	const coverRaw = map.get('cover');
	if (coverRaw !== undefined) {
		const coverMap = block(coverRaw, 'cover', file);
		rejectUnknownKeys(coverMap, ['src', 'alt'], 'cover.', file);
		const src = text(field(coverMap, 'src', file, 'cover.'), 'cover.src', file);
		if (!src.startsWith('/')) throw new Error(`${file}: "cover.src" must be a path under static/, starting with /`);
		// A cover without alt text is not allowed, so a screen reader always has something to read.
		const alt = text(field(coverMap, 'alt', file, 'cover.'), 'cover.alt', file);
		cover = { src, alt };
	}

	const orderRaw = field(map, 'order', file);
	if (typeof orderRaw !== 'number' || !Number.isInteger(orderRaw)) {
		throw new Error(`${file}: "order" must be a whole number, got ${JSON.stringify(orderRaw)}`);
	}

	const draft = field(map, 'draft', file);
	if (typeof draft !== 'boolean') {
		throw new Error(`${file}: "draft" must be true or false, got ${JSON.stringify(draft)}`);
	}

	return { title, summary, status, role, start, end, stack, links, cover, order: orderRaw, draft };
}
