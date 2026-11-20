import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { MIKU_CHIBI, MIKU_FULL } from './miku-ascii';

const require = createRequire(import.meta.url);
const font = (file: string) => readFileSync(require.resolve(`@fontsource/inter/files/${file}`));

const WIDTH = 1200;
const HEIGHT = 630;
const BG = '#ffffff';
const INK = '#000000';
const MUTED = '#808080';

// Braille dot bit -> [column, row] inside a 2x4 cell.
const DOTS: [number, number, number][] = [
	[0, 0, 0x01], [0, 1, 0x02], [0, 2, 0x04], [1, 0, 0x08],
	[1, 1, 0x10], [1, 2, 0x20], [0, 3, 0x40], [1, 3, 0x80],
];

/** Braille art -> SVG dots, cropped to the drawn pixels and fitted in a box. */
function mikuSvg(art: string, maxW: number, maxH: number) {
	// Collect lit dots as [x, y] in dot units.
	const pts: [number, number][] = [];
	art.split('\n').forEach((line, ly) => {
		[...line].forEach((ch, lx) => {
			const bits = ch.codePointAt(0)! - 0x2800;
			if (bits <= 0 || bits > 0xff) return;
			for (const [dx, dy, mask] of DOTS) if (bits & mask) pts.push([lx * 2 + dx, ly * 4 + dy]);
		});
	});

	const minX = Math.min(...pts.map((p) => p[0]));
	const maxX = Math.max(...pts.map((p) => p[0]));
	const minY = Math.min(...pts.map((p) => p[1]));
	const maxY = Math.max(...pts.map((p) => p[1]));
	const cols = maxX - minX + 1;
	const rows = maxY - minY + 1;
	const step = Math.min(maxW / cols, maxH / rows);
	const w = Math.round(cols * step);
	const h = Math.round(rows * step);
	const r = (step * 0.46).toFixed(2);

	const circles = pts
		.map(([x, y]) => `<circle cx="${((x - minX + 0.5) * step).toFixed(2)}" cy="${((y - minY + 0.5) * step).toFixed(2)}" r="${r}"/>`)
		.join('');
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><g fill="${INK}">${circles}</g></svg>`;
	return { src: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`, w, h };
}

async function toPng(root: object) {
	const svg = await satori(root as any, {
		width: WIDTH,
		height: HEIGHT,
		fonts: [
			{ name: 'Inter', data: font('inter-latin-400-normal.woff'), weight: 400, style: 'normal' },
			{ name: 'Inter', data: font('inter-latin-600-normal.woff'), weight: 600, style: 'normal' },
		],
	});
	return new Response(new Uint8Array(new Resvg(svg).render().asPng()), {
		headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
	});
}

const frame = (children: object[], justifyContent: string) => ({
	type: 'div',
	props: {
		style: {
			width: '100%',
			height: '100%',
			boxSizing: 'border-box',
			display: 'flex',
			alignItems: 'center',
			justifyContent,
			padding: '40px 80px',
			background: BG,
			fontFamily: 'Inter',
		},
		children,
	},
});

const img = ({ src, w, h }: { src: string; w: number; h: number }) => ({
	type: 'img',
	props: { src, width: w, height: h, style: { flexShrink: 0 } },
});

/** Home: Miku alone, centered. */
export function homeOg() {
	return toPng(frame([img(mikuSvg(MIKU_FULL, WIDTH - 80, HEIGHT - 80))], 'center'));
}

/** Blog / project: Miku on the left, title + short description on the right. */
export function pageOg(title: string, description: string) {
	const clamp = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
	const titleSize = title.length > 28 ? 60 : 76;
	return toPng(
		frame(
			[
				img(mikuSvg(MIKU_CHIBI, 360, HEIGHT - 80)),
				{
					type: 'div',
					props: {
						style: { display: 'flex', flexDirection: 'column', gap: 24, marginLeft: 72, flex: 1 },
						children: [
							{
								type: 'div',
								props: {
									style: { fontSize: titleSize, fontWeight: 600, color: INK, letterSpacing: -2, lineHeight: 1.05 },
									children: title.toLowerCase(),
								},
							},
							{
								type: 'div',
								props: {
									style: { fontSize: 32, color: MUTED, lineHeight: 1.35 },
									children: clamp(description, 150),
								},
							},
						],
					},
				},
			],
			'flex-start',
		),
	);
}
