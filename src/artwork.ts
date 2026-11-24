function roseCluster(cx: number, cy: number, scale = 1, palette: 'pink' | 'cream' | 'deep' = 'pink'): string {
	const colors =
		palette === 'pink'
			? { outer: '#d69194', mid: '#e7b4b6', inner: '#b36166' }
			: palette === 'cream'
				? { outer: '#ecd6ce', mid: '#f6e9e4', inner: '#cfa59d' }
				: { outer: '#b96b70', mid: '#d1888c', inner: '#8b4348' };

	return `
		<g transform="translate(${cx},${cy}) scale(${scale})">
			<path d="M-16,4 C-24,-6 -18,-18 -6,-14 C-10,-4 -8,4 -16,4 Z" fill="#5e7255" stroke="#42533b" stroke-width="0.8"/>
			<path d="M16,4 C24,-6 18,-18 6,-14 C10,-4 8,4 16,4 Z" fill="#6f8465" stroke="#42533b" stroke-width="0.8"/>
			<circle cx="0" cy="0" r="13" fill="${colors.outer}" stroke="#7e4a4e" stroke-width="0.9"/>
			<path d="M-9,-3 C-5,-11 6,-11 9,-2 C10,6 2,10 -5,8 C-10,6 -11,1 -9,-3 Z" fill="${colors.mid}" stroke="#8c5458" stroke-width="0.7"/>
			<path d="M-5,-1 C-3,-6 4,-6 5,-1 C6,3 1,6 -3,4 C-6,3 -6,0 -5,-1 Z" fill="${colors.inner}"/>
			<path d="M-2,0 C0,-2 2,-1 2,1" fill="none" stroke="#f8ece8" stroke-width="0.9" stroke-linecap="round"/>
		</g>
	`;
}

function wisteriaBranch(x: number, y: number, len = 110, scale = 1): string {
	const puffs: string[] = [];
	const steps = Math.max(4, Math.floor(len / 18));
	for (let i = 0; i < steps; i++) {
		const py = y + i * 16 * scale;
		const spread = (1 - i / steps) * 14 * scale + 4;
		const r = (9 - (i / steps) * 4.5) * scale;
		const c1 = i % 2 === 0 ? '#9c7aa0' : '#b493b7';
		const c2 = i % 2 === 0 ? '#7e5d82' : '#9c7aa0';
		puffs.push(`<circle cx="${x - spread * 0.45}" cy="${py}" r="${r}" fill="${c1}" stroke="#654869" stroke-width="0.6"/>`);
		puffs.push(`<circle cx="${x + spread * 0.45}" cy="${py + 3 * scale}" r="${r * 0.92}" fill="${c2}" stroke="#654869" stroke-width="0.6"/>`);
	}
	return `
		<g>
			<path d="M${x},${y - 8} Q${x + 3},${y + len * 0.4} ${x},${y + len * 0.85}" stroke="#5b6d52" stroke-width="1.6" fill="none"/>
			${puffs.join('')}
		</g>
	`;
}

export function renderHeroEstate(): string {
	return `
	<svg viewBox="0 0 440 390" xmlns="http://www.w3.org/2000/svg">
		<!-- Sky-warmth backdrop -->
		<defs>
			<linearGradient id="villaWall" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="#f2e4df"/>
				<stop offset="100%" stop-color="#e5d0c9"/>
			</linearGradient>
			<linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="#8b7370"/>
				<stop offset="100%" stop-color="#6b5653"/>
			</linearGradient>
		</defs>

		<!-- Cypress trees left & right -->
		<path d="M46,285 Q34,200 46,120 Q58,200 46,285 Z" fill="#4f6048" stroke="#394733" stroke-width="1"/>
		<path d="M68,285 Q58,215 68,150 Q78,215 68,285 Z" fill="#5e7156" stroke="#394733" stroke-width="1"/>
		<path d="M394,285 Q382,200 394,120 Q406,200 394,285 Z" fill="#4f6048" stroke="#394733" stroke-width="1"/>
		<path d="M372,285 Q362,215 372,150 Q382,215 372,285 Z" fill="#5e7156" stroke="#394733" stroke-width="1"/>

		<!-- Villa Main Structure -->
		<polygon points="82,155 220,122 358,155 348,162 92,162" fill="url(#roofGrad)" stroke="#53413f" stroke-width="1.2"/>
		<rect x="92" y="162" width="256" height="122" fill="url(#villaWall)" stroke="#7a635e" stroke-width="1.2"/>
		<!-- Pediment -->
		<polygon points="168,162 220,136 272,162" fill="#efe0da" stroke="#7a635e" stroke-width="1.1"/>
		<line x1="92" y1="220" x2="348" y2="220" stroke="#997f79" stroke-width="1"/>

		<!-- Upper & Lower Arched Windows -->
		${[112, 146, 184, 240, 278, 312]
			.map(
				(wx) => `
			<path d="M${wx},174 Q${wx + 9},166 ${wx + 18},174 L${wx + 18},206 L${wx},206 Z" fill="#4a3f42" stroke="#8a706b" stroke-width="1"/>
			<line x1="${wx + 9}" y1="170" x2="${wx + 9}" y2="206" stroke="#e9d8d2" stroke-width="0.8"/>
			<line x1="${wx}" y1="188" x2="${wx + 18}" y2="188" stroke="#e9d8d2" stroke-width="0.8"/>
		`,
			)
			.join('')}

		${[112, 146, 278, 312]
			.map(
				(wx) => `
			<path d="M${wx},232 Q${wx + 9},224 ${wx + 18},232 L${wx + 18},272 L${wx},272 Z" fill="#4a3f42" stroke="#8a706b" stroke-width="1"/>
			<line x1="${wx + 9}" y1="228" x2="${wx + 9}" y2="272" stroke="#e9d8d2" stroke-width="0.8"/>
		`,
			)
			.join('')}

		<!-- Grand Center Archway -->
		<path d="M198,284 L198,236 Q220,218 242,236 L242,284 Z" fill="#4a3f42" stroke="#8a706b" stroke-width="1.4"/>
		<line x1="220" y1="226" x2="220" y2="284" stroke="#e9d8d2" stroke-width="1"/>

		<!-- Climbing Wisteria on Villa -->
		${wisteriaBranch(104, 168, 48, 0.55)}
		${wisteriaBranch(174, 166, 44, 0.52)}
		${wisteriaBranch(266, 166, 44, 0.52)}
		${wisteriaBranch(336, 168, 48, 0.55)}

		<!-- Courtyard & Tiered Stone Fountain -->
		<ellipse cx="220" cy="316" rx="145" ry="26" fill="#dfd2cc" stroke="#99827b" stroke-width="1"/>
		<ellipse cx="220" cy="316" rx="74" ry="18" fill="#c7d5d4" stroke="#7d6c67" stroke-width="1.2"/>
		<ellipse cx="220" cy="314" rx="64" ry="13" fill="#a8c0c1"/>
		<rect x="213" y="282" width="14" height="32" fill="#d9cac3" stroke="#7d6c67" stroke-width="1"/>
		<ellipse cx="220" cy="283" rx="28" ry="8" fill="#e6dad4" stroke="#7d6c67" stroke-width="1"/>
		<path d="M220,264 Q205,274 202,284 M220,264 Q235,274 238,284" stroke="#f8f6f5" stroke-width="1.4" fill="none" stroke-dasharray="2 2"/>

		<!-- Lush Embroidered Rose & Foliage Border at Bottom -->
		<path d="M0,348 Q110,326 220,342 Q330,326 440,348 L440,390 L0,390 Z" fill="#52644b"/>
		${roseCluster(26, 355, 1.25, 'pink')}
		${roseCluster(68, 344, 1.05, 'cream')}
		${roseCluster(108, 360, 1.2, 'deep')}
		${roseCluster(148, 348, 0.95, 'pink')}
		${roseCluster(186, 364, 1.15, 'cream')}
		${roseCluster(224, 354, 1.3, 'pink')}
		${roseCluster(266, 364, 1.1, 'deep')}
		${roseCluster(304, 348, 1.0, 'cream')}
		${roseCluster(344, 360, 1.25, 'pink')}
		${roseCluster(386, 346, 1.05, 'deep')}
		${roseCluster(422, 358, 1.2, 'cream')}
	</svg>
	`;
}

export function renderWisteriaTop(): string {
	return `
	<svg viewBox="0 0 440 165" xmlns="http://www.w3.org/2000/svg">
		<path d="M0,12 Q110,28 220,14 Q330,28 440,12" stroke="#5b6d52" stroke-width="2.5" fill="none"/>
		${wisteriaBranch(42, 16, 118, 0.95)}
		${wisteriaBranch(104, 20, 96, 0.85)}
		${wisteriaBranch(172, 16, 72, 0.72)}
		${wisteriaBranch(268, 16, 72, 0.72)}
		${wisteriaBranch(336, 20, 98, 0.85)}
		${wisteriaBranch(398, 16, 120, 0.95)}
		${roseCluster(28, 14, 0.85, 'pink')}
		${roseCluster(140, 18, 0.75, 'cream')}
		${roseCluster(300, 18, 0.75, 'cream')}
		${roseCluster(412, 14, 0.85, 'pink')}
	</svg>
	`;
}

export function renderSwans(): string {
	return `
	<svg viewBox="0 0 440 220" xmlns="http://www.w3.org/2000/svg">
		<!-- Embroidered Pearl & Rose Ribbon Border -->
		<path d="M0,188 Q220,154 440,188 L440,210 Q220,176 0,210 Z" fill="#6d8164" stroke="#4c5c45" stroke-width="1"/>
		<path d="M0,198 Q220,164 440,198" stroke="#e8d6ce" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round" fill="none"/>

		<!-- Roses flanking swans -->
		${roseCluster(92, 148, 1.05, 'pink')}
		${roseCluster(128, 158, 0.85, 'cream')}
		${roseCluster(312, 158, 0.85, 'cream')}
		${roseCluster(348, 148, 1.05, 'pink')}

		<!-- Left Swan -->
		<g stroke="#8e7b76" stroke-width="1.2">
			<path d="M132,144 C122,124 134,104 164,106 C188,108 198,128 196,146 C174,152 146,152 132,144 Z" fill="#fbf6f2"/>
			<path d="M188,120 C196,92 184,54 202,46 C212,42 218,52 216,60 C210,58 205,62 204,70 C200,88 206,110 198,132" fill="#fbf6f2"/>
			<polygon points="216,56 222,60 215,63" fill="#c9856d" stroke="none"/>
		</g>
		<!-- Right Swan -->
		<g stroke="#8e7b76" stroke-width="1.2">
			<path d="M308,144 C318,124 306,104 276,106 C252,108 242,128 244,146 C266,152 294,152 308,144 Z" fill="#fbf6f2"/>
			<path d="M252,120 C244,92 256,54 238,46 C228,42 222,52 224,60 C230,58 235,62 236,70 C240,88 234,110 242,132" fill="#fbf6f2"/>
			<polygon points="224,56 218,60 225,63" fill="#c9856d" stroke="none"/>
		</g>

		<!-- Stitch lines on wings -->
		<path d="M145,124 Q166,118 182,128" stroke="#c8b3ac" stroke-width="1" stroke-dasharray="3 3" fill="none"/>
		<path d="M295,124 Q274,118 258,128" stroke="#c8b3ac" stroke-width="1" stroke-dasharray="3 3" fill="none"/>
		${roseCluster(220, 152, 0.95, 'deep')}
	</svg>
	`;
}

export function renderCountdownGarland(): string {
	return `
	<svg viewBox="0 0 440 90" xmlns="http://www.w3.org/2000/svg">
		<path d="M10,20 Q220,56 430,20" stroke="#5b6d52" stroke-width="2" fill="none"/>
		${wisteriaBranch(68, 28, 52, 0.6)}
		${wisteriaBranch(372, 28, 52, 0.6)}
		${roseCluster(130, 34, 0.78, 'pink')}
		${roseCluster(220, 38, 0.85, 'cream')}
		${roseCluster(310, 34, 0.78, 'pink')}
	</svg>
	`;
}

export function renderFloralCollar(): string {
	return `
	<svg viewBox="0 0 440 120" xmlns="http://www.w3.org/2000/svg">
		<path d="M0,18 Q220,104 440,18 L440,48 Q220,134 0,48 Z" fill="#64775c" stroke="#475741" stroke-width="1"/>
		<path d="M0,33 Q220,119 440,33" stroke="#f3e6e1" stroke-width="4" stroke-dasharray="2 8" stroke-linecap="round" fill="none"/>
		${roseCluster(46, 30, 0.85, 'pink')}
		${roseCluster(132, 58, 0.8, 'deep')}
		${roseCluster(220, 76, 0.95, 'cream')}
		${roseCluster(308, 58, 0.8, 'deep')}
		${roseCluster(394, 30, 0.85, 'pink')}
	</svg>
	`;
}

export function renderVenueCorners(): string {
	return `
	<svg viewBox="0 0 400 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
		${wisteriaBranch(36, 12, 95, 0.75)}
		${wisteriaBranch(364, 12, 95, 0.75)}
		${roseCluster(26, 20, 0.9, 'pink')}
		${roseCluster(374, 20, 0.9, 'pink')}
		${roseCluster(30, 474, 0.85, 'cream')}
		${roseCluster(370, 474, 0.85, 'cream')}
	</svg>
	`;
}

export function renderWisteriaCurtain(): string {
	return `
	<svg viewBox="0 0 440 125" xmlns="http://www.w3.org/2000/svg">
		${[35, 92, 152, 220, 288, 348, 405]
			.map((x, idx) => wisteriaBranch(x, 6, 75 + (idx % 2) * 28, 0.72))
			.join('')}
	</svg>
	`;
}

export function renderDressFigures(): string {
	return `
	<svg viewBox="0 0 440 185" xmlns="http://www.w3.org/2000/svg">
		<!-- 5 Stylish Garden Formal Guests -->
		<!-- Guest 1: Man in classic dark suit -->
		<g transform="translate(56, 20)">
			<circle cx="24" cy="18" r="10" fill="#e8c3b0"/>
			<path d="M14,14 Q24,4 34,14" fill="#3a2e2b"/>
			<path d="M10,32 L38,32 L42,92 L6,92 Z" fill="#2c292b"/>
			<polygon points="20,32 28,32 24,52" fill="#faf6f3"/>
			<rect x="13" y="92" width="9" height="58" fill="#232022"/>
			<rect x="26" y="92" width="9" height="58" fill="#232022"/>
		</g>
		<!-- Guest 2: Woman in dusty rose gown -->
		<g transform="translate(128, 22)">
			<circle cx="24" cy="18" r="9.5" fill="#e8c3b0"/>
			<path d="M14,16 Q24,4 34,16" fill="#5e433a"/>
			<path d="M16,32 L32,32 L44,148 L4,148 Z" fill="#b87074"/>
			<path d="M16,32 Q24,42 32,32" fill="#9c5a5e"/>
		</g>
		<!-- Guest 3: Woman in champagne/blush gown -->
		<g transform="translate(198, 18)">
			<circle cx="24" cy="18" r="9.5" fill="#ecc7b6"/>
			<path d="M14,16 Q24,5 34,16" fill="#3f2d28"/>
			<path d="M15,32 L33,32 L46,152 L2,152 Z" fill="#dfc4ba"/>
		</g>
		<!-- Guest 4: Woman in sage gown -->
		<g transform="translate(268, 22)">
			<circle cx="24" cy="18" r="9.5" fill="#e5bea9"/>
			<path d="M14,16 Q24,4 34,16" fill="#4f3932"/>
			<path d="M16,32 L32,32 L44,148 L4,148 Z" fill="#6b7f64"/>
		</g>
		<!-- Guest 5: Man in charcoal suit -->
		<g transform="translate(338, 20)">
			<circle cx="24" cy="18" r="10" fill="#e2bba6"/>
			<path d="M14,14 Q24,4 34,14" fill="#2c2320"/>
			<path d="M10,32 L38,32 L42,92 L6,92 Z" fill="#443c3c"/>
			<polygon points="20,32 28,32 24,52" fill="#faf6f3"/>
			<rect x="13" y="92" width="9" height="58" fill="#362f2f"/>
			<rect x="26" y="92" width="9" height="58" fill="#362f2f"/>
		</g>
	</svg>
	`;
}

export function renderStoryWreath(): string {
	return `
	<svg viewBox="0 0 400 380" xmlns="http://www.w3.org/2000/svg">
		<ellipse cx="200" cy="190" rx="168" ry="158" fill="none" stroke="#6d8164" stroke-width="2.5" stroke-dasharray="5 3"/>
		${wisteriaBranch(112, 42, 65, 0.58)}
		${wisteriaBranch(200, 26, 58, 0.52)}
		${wisteriaBranch(288, 42, 65, 0.58)}
		${roseCluster(56, 128, 0.9, 'pink')}
		${roseCluster(42, 222, 0.95, 'cream')}
		${roseCluster(78, 304, 1.0, 'deep')}
		${roseCluster(344, 128, 0.9, 'pink')}
		${roseCluster(358, 222, 0.95, 'cream')}
		${roseCluster(322, 304, 1.0, 'deep')}
		${roseCluster(200, 348, 1.05, 'pink')}
	</svg>
	`;
}

export function renderTimelineCorners(): string {
	return `
	<svg viewBox="0 0 440 80" xmlns="http://www.w3.org/2000/svg">
		${roseCluster(32, 26, 0.85, 'pink')}
		${roseCluster(66, 18, 0.65, 'cream')}
		${roseCluster(408, 26, 0.85, 'pink')}
		${roseCluster(374, 18, 0.65, 'cream')}
	</svg>
	`;
}

export function renderTimelineIcon(kind: string): string {
	switch (kind) {
		case 'chapel':
			return `
			<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
				<polygon points="14,32 32,14 50,32" fill="#8b7370" stroke="#4f403e" stroke-width="1.4"/>
				<rect x="18" y="32" width="28" height="22" fill="#efe2dc" stroke="#4f403e" stroke-width="1.4"/>
				<path d="M27,54 L27,40 Q32,35 37,40 L37,54 Z" fill="#5e4b48"/>
				<line x1="32" y1="7" x2="32" y2="14" stroke="#b59766" stroke-width="1.8"/>
			</svg>`;
		case 'rings':
			return `
			<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
				<circle cx="26" cy="34" r="12" fill="none" stroke="#b59766" stroke-width="2.6"/>
				<circle cx="38" cy="34" r="12" fill="none" stroke="#b87074" stroke-width="2.6"/>
				<circle cx="32" cy="20" r="4" fill="#dfadaf" stroke="#8e4a4e" stroke-width="1"/>
			</svg>`;
		case 'cocktail':
			return `
			<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
				<path d="M18,18 L46,18 Q44,34 32,36 Q20,34 18,18 Z" fill="#f3d5d3" stroke="#7d615c" stroke-width="1.4"/>
				<line x1="32" y1="36" x2="32" y2="52" stroke="#7d615c" stroke-width="1.6"/>
				<line x1="22" y1="52" x2="42" y2="52" stroke="#7d615c" stroke-width="1.6"/>
			</svg>`;
		case 'dinner':
			return `
			<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
				<circle cx="32" cy="34" r="16" fill="#fbf6f2" stroke="#8a706b" stroke-width="1.4"/>
				<circle cx="32" cy="34" r="11" fill="none" stroke="#b59766" stroke-width="1" stroke-dasharray="3 2"/>
				<circle cx="32" cy="34" r="4" fill="#d69194"/>
			</svg>`;
		default:
			return `
			<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
				<path d="M16,38 Q26,22 36,34 Q44,24 50,36" fill="none" stroke="#7d615c" stroke-width="1.6"/>
				<circle cx="24" cy="24" r="4" fill="#dfadaf"/>
				<circle cx="40" cy="24" r="4" fill="#b493b7"/>
				<path d="M22,46 Q32,40 42,46" fill="none" stroke="#b59766" stroke-width="1.5"/>
			</svg>`;
	}
}

export function renderVineDivider(): string {
	return `
	<svg viewBox="0 0 440 48" xmlns="http://www.w3.org/2000/svg">
		<line x1="20" y1="24" x2="420" y2="24" stroke="#6f8465" stroke-width="1.6"/>
		${[64, 142, 220, 298, 376].map((x, i) => roseCluster(x, 24, 0.58, i % 2 === 0 ? 'pink' : 'cream')).join('')}
	</svg>
	`;
}

export function renderBistro(): string {
	return `
	<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
		<rect x="44" y="54" width="232" height="76" fill="#efe2dc" stroke="#7d655f" stroke-width="1.2"/>
		<polygon points="34,54 160,22 286,54" fill="#8b7370" stroke="#53413f" stroke-width="1.2"/>
		<path d="M44,72 L276,72" stroke="#b87074" stroke-width="6" stroke-dasharray="14 6"/>
		${[68, 108, 148, 188, 228].map((x) => `<rect x="${x}" y="82" width="24" height="38" rx="12" fill="#5b4a48" stroke="#c8b3ac" stroke-width="1"/>`).join('')}
		${roseCluster(38, 126, 0.8, 'pink')}
		${roseCluster(282, 126, 0.8, 'pink')}
	</svg>
	`;
}

export function renderGiftsFrame(): string {
	return `
	<svg viewBox="0 0 400 380" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
		<polygon points="200,18 378,190 200,362 22,190" fill="#fbf6f2" stroke="#b59766" stroke-width="1.5"/>
		<polygon points="200,28 366,190 200,352 34,190" fill="none" stroke="#8d726c" stroke-width="1" stroke-dasharray="4 4"/>
		<!-- Top Ribbon Bow -->
		<path d="M180,20 Q168,6 184,12 Q196,18 200,22 Q204,18 216,12 Q232,6 220,20 Z" fill="#dfadaf" stroke="#9c5a5e" stroke-width="1"/>
		${roseCluster(112, 104, 0.72, 'pink')}
		${roseCluster(288, 104, 0.72, 'pink')}
		${roseCluster(112, 276, 0.72, 'cream')}
		${roseCluster(288, 276, 0.72, 'cream')}
	</svg>
	`;
}
