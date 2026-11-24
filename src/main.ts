import './style.css';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { initCurtainScene } from './curtainScene';
import { renderTimelineIcon } from './artwork';
import { initScroll3DOrnaments, playHero3DReveal } from './animations3d';

// 0. Baca nama tamu dari URL (?to=, ?untuk=, ?guest=, ?nama=)
const params = new URLSearchParams(window.location.search);
const rawGuest =
	params.get('to') || params.get('untuk') || params.get('guest') || params.get('nama') || '';
const guestName = rawGuest.trim().slice(0, 60);

if (guestName) {
	const guestBox = document.getElementById('cover-guest-box');
	const guestNameEl = document.getElementById('cover-guest-name');
	const rsvpNameInput = document.getElementById('rsvp-name') as HTMLInputElement | null;
	if (guestNameEl && guestBox) {
		guestNameEl.textContent = guestName;
		guestBox.hidden = false;
	}
	if (rsvpNameInput && !rsvpNameInput.value) {
		rsvpNameInput.value = guestName;
	}
}

// 1. Mount SVG timeline icons where PNG icon isn't present
const timelineRows = document.querySelectorAll<HTMLElement>('.timeline-icon');
const fallbackKinds = ['chapel', 'rings', 'cocktail'];
timelineRows.forEach((el, idx) => {
	if (idx < fallbackKinds.length && el.querySelector('img')) {
		const img = el.querySelector('img')!;
		if (!img.getAttribute('src')?.includes('discoball')) {
			el.innerHTML = renderTimelineIcon(fallbackKinds[idx]);
		}
	}
});

// 2. Three.js 3D Petals + Curtain Reveal
const canvas = document.getElementById('curtain-canvas') as HTMLCanvasElement | null;
const heroSection = document.getElementById('hero');
const shell = document.getElementById('invitation-shell');
const openBtn = document.getElementById('open-curtain-btn');

const curtain = canvas ? initCurtainScene(canvas) : null;

let audioCtx: AudioContext | null = null;
let musicPlaying = false;
let musicTimer: number | null = null;
const musicBtn = document.getElementById('music-toggle');

const playNote = (freq: number, delay: number, duration: number) => {
	if (!audioCtx) return;
	const osc = audioCtx.createOscillator();
	const gain = audioCtx.createGain();
	osc.type = 'sine';
	osc.frequency.value = freq;
	const start = audioCtx.currentTime + delay;
	gain.gain.setValueAtTime(0.0001, start);
	gain.gain.exponentialRampToValueAtTime(0.035, start + 0.08);
	gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
	osc.connect(gain);
	gain.connect(audioCtx.destination);
	osc.start(start);
	osc.stop(start + duration + 0.05);
};

const startMusic = () => {
	if (musicPlaying) return;
	const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
	if (!AudioCtx) return;
	if (!audioCtx) audioCtx = new AudioCtx();
	if (audioCtx.state === 'suspended') {
		void audioCtx.resume();
	}
	musicPlaying = true;
	musicBtn?.classList.add('is-playing');

	const arpeggio = [261.63, 329.63, 392.0, 493.88, 523.25, 493.88, 392.0, 329.63];
	const playPhrase = () => {
		if (!musicPlaying) return;
		arpeggio.forEach((f, idx) => playNote(f, idx * 0.45, 1.4));
	};
	playPhrase();
	musicTimer = window.setInterval(playPhrase, 3800);
};

const stopMusic = () => {
	musicPlaying = false;
	musicBtn?.classList.remove('is-playing');
	if (musicTimer !== null) {
		clearInterval(musicTimer);
		musicTimer = null;
	}
};

musicBtn?.addEventListener('click', () => {
	if (musicPlaying) stopMusic();
	else startMusic();
});

const openInvitation = () => {
	if (!heroSection || heroSection.classList.contains('is-open')) return;
	heroSection.classList.add('is-open');
	shell?.classList.remove('is-locked');
	curtain?.open();
	playHero3DReveal();
	initScroll3DOrnaments();
	startMusic();
};

openBtn?.addEventListener('click', openInvitation);

// 3. Hitung Mundur menuju 6 Desember 2026 pukul 09:00 WIB
const targetDate = new Date('2026-12-06T09:00:00+07:00').getTime();
const cdDays = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMinutes = document.getElementById('cd-minutes');

const updateCountdown = () => {
	const diff = Math.max(0, targetDate - Date.now());
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((diff / (1000 * 60)) % 60);
	if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
	if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
	if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
};
updateCountdown();
window.setInterval(updateCountdown, 15000);

// 4. Tambah ke Kalender (.ics)
const downloadIcs = (filename: string, title: string, start: string, end: string, location: string) => {
	const ics = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Undangan Pernikahan Dian & Ajeng//ID',
		'BEGIN:VEVENT',
		`DTSTART:${start}`,
		`DTEND:${end}`,
		`SUMMARY:${title}`,
		`LOCATION:${location}`,
		'DESCRIPTION:Kami mengundang Anda untuk menghadiri pernikahan Dian Hidayat & Ajeng Fauziah.',
		'END:VEVENT',
		'END:VCALENDAR',
	].join('\r\n');

	const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
};

document.getElementById('add-ceremony-cal')?.addEventListener('click', () => {
	downloadIcs(
		'pernikahan-dian-ajeng.ics',
		'Akad & Resepsi Pernikahan Dian & Ajeng',
		'20261206T010000Z',
		'20261206T070000Z',
		'Alun-alun Desa Pajajar, Kec. Rajagaluh, Kab. Majalengka, Jawa Barat',
	);
});

// Lightbox Galeri Foto
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement | null;
const closeLightboxBtn = document.getElementById('close-lightbox-modal');

const closeLightbox = () => {
	if (lightboxModal) lightboxModal.hidden = true;
};

document.querySelectorAll<HTMLButtonElement>('[data-lightbox]').forEach((btn) => {
	btn.addEventListener('click', () => {
		const src = btn.dataset.lightbox;
		if (!src || !lightboxImg || !lightboxModal) return;
		lightboxImg.src = src;
		lightboxModal.hidden = false;
	});
});
closeLightboxBtn?.addEventListener('click', closeLightbox);
lightboxModal?.addEventListener('click', (e) => {
	if (e.target === lightboxModal) closeLightbox();
});
window.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && lightboxModal && !lightboxModal.hidden) {
		closeLightbox();
	}
});

// 5. Modal Tanda Kasih
const giftsModal = document.getElementById('gifts-modal');
const openGiftsBtn = document.getElementById('open-gifts-modal');
const closeGiftsBtn = document.getElementById('close-gifts-modal');

const closeGifts = () => {
	if (giftsModal) giftsModal.hidden = true;
};

openGiftsBtn?.addEventListener('click', () => {
	if (giftsModal) giftsModal.hidden = false;
});
closeGiftsBtn?.addEventListener('click', closeGifts);
giftsModal?.addEventListener('click', (e) => {
	if (e.target === giftsModal) closeGifts();
});
window.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && giftsModal && !giftsModal.hidden) {
		closeGifts();
	}
});

document.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach((btn) => {
	btn.addEventListener('click', async () => {
		const text = btn.dataset.copy ?? '';
		try {
			await navigator.clipboard.writeText(text);
			const orig = btn.textContent;
			btn.textContent = 'Tersalin!';
			setTimeout(() => {
				btn.textContent = orig;
			}, 1800);
		} catch {
			btn.textContent = text;
		}
	});
});

// 6. Fitur Ucapan & Doa (Sinkron Supabase 'wishes' seperti E:\website\dianajeng + fallback localStorage)
type AttendanceCode = 'yes' | 'maybe' | 'no';

interface WishItem {
	id: string;
	name: string;
	message: string;
	attendance?: string;
	site?: string;
	created_at: string;
	likes: number;
}

const SITE = 'id';
const WISHES_KEY = 'dianajeng-wishes-v1';
const LIKED_KEY = 'dianajeng-liked-wishes';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabase: SupabaseClient | null =
	supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const readLocalWishes = (): WishItem[] => {
	try {
		const raw = localStorage.getItem(WISHES_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as WishItem[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const readLiked = (): string[] => {
	try {
		return JSON.parse(localStorage.getItem(LIKED_KEY) || '[]') as string[];
	} catch {
		return [];
	}
};

let wishes: WishItem[] = readLocalWishes();
let likedIds: string[] = readLiked();
let selectedAttendance: AttendanceCode = 'yes';

const rsvpForm = document.getElementById('rsvp-form') as HTMLFormElement | null;
const rsvpFeedback = document.getElementById('rsvp-feedback');
const wishMessageInput = document.getElementById('rsvp-message') as HTMLTextAreaElement | null;
const wishCharCount = document.getElementById('wish-char-count');
const wishesListEl = document.getElementById('wishes-list');
const wishesTotalEl = document.getElementById('wishes-total');

document.querySelectorAll<HTMLButtonElement>('.pill-btn').forEach((btn) => {
	btn.addEventListener('click', () => {
		const val = (btn.dataset.attendance as AttendanceCode) || 'yes';
		selectedAttendance = val;
		document.querySelectorAll<HTMLButtonElement>('.pill-btn').forEach((b) => {
			const active = b === btn;
			b.classList.toggle('is-active', active);
			b.setAttribute('aria-checked', String(active));
		});
	});
});

wishMessageInput?.addEventListener('input', () => {
	if (wishCharCount) {
		wishCharCount.textContent = `${wishMessageInput.value.length}/300`;
	}
});

const escapeHtml = (str: string) =>
	str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');

const getInitials = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase() || '')
		.join('') || '•';

const formatTimeId = (iso: string) => {
	try {
		const diffMs = Date.now() - new Date(iso).getTime();
		const mins = Math.floor(diffMs / 60000);
		const hours = Math.floor(diffMs / 3600000);
		const days = Math.floor(diffMs / 86400000);
		if (mins < 1) return 'Baru saja';
		if (mins < 60) return `${mins}m lalu`;
		if (hours < 24) return `${hours}j lalu`;
		if (days < 7) return `${days}h lalu`;
		return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
	} catch {
		return 'Baru saja';
	}
};

const normalizeAttendance = (a?: string): AttendanceCode => {
	if (!a || ['yes', 'Attending', 'Hadir'].includes(a)) return 'yes';
	if (['maybe', 'Tentative', 'Mungkin', 'Masih ragu'].includes(a)) return 'maybe';
	return 'no';
};

const attendanceLabelId: Record<AttendanceCode, string> = {
	yes: 'Hadir',
	maybe: 'Mungkin',
	no: 'Berhalangan',
};

const renderWishes = () => {
	if (wishesTotalEl) {
		wishesTotalEl.textContent = `${wishes.length} ucapan`;
	}
	if (!wishesListEl) return;

	if (wishes.length === 0) {
		wishesListEl.innerHTML =
			'<p style="text-align:center;font-style:italic;color:var(--ink-muted);padding:12px 0;">Belum ada ucapan. Jadilah yang pertama mendoakan Dian &amp; Ajeng.</p>';
		return;
	}

	wishesListEl.innerHTML = wishes
		.map((w) => {
			const liked = likedIds.includes(w.id);
			const tone = normalizeAttendance(w.attendance);
			const badgeLabel = attendanceLabelId[tone];
			return `
				<article class="wish-card">
					<div class="wish-card-top">
						<div class="wish-avatar">${escapeHtml(getInitials(w.name))}</div>
						<div class="wish-meta">
							<div class="wish-name-row">
								<span class="wish-author">${escapeHtml(w.name)}</span>
								<span class="wish-badge is-${tone}">${badgeLabel}</span>
							</div>
							<div class="wish-time">${formatTimeId(w.created_at)}</div>
						</div>
					</div>
					<p class="wish-message">${escapeHtml(w.message)}</p>
					<button
						type="button"
						class="wish-like-btn ${liked ? 'is-liked' : ''}"
						data-like-id="${escapeHtml(w.id)}"
					>
						<svg class="theme-icon" viewBox="0 0 24 24" fill="${liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M12 20s-7-4.5-9-8.8C1.5 8 3.6 4.8 6.8 4.5c2-.2 3.8.9 5.2 2.7 1.4-1.8 3.2-2.9 5.2-2.7 3.2.3 5.3 3.5 3.8 6.7C19 15.5 12 20 12 20Z" />
						</svg>
						<span>${w.likes || 0}</span>
					</button>
				</article>
			`;
		})
		.join('');

	wishesListEl.querySelectorAll<HTMLButtonElement>('.wish-like-btn').forEach((btn) => {
		btn.addEventListener('click', async () => {
			const id = btn.dataset.likeId;
			if (!id || likedIds.includes(id) || id.startsWith('opt-')) return;
			const target = wishes.find((item) => item.id === id);
			if (!target) return;
			target.likes = (target.likes || 0) + 1;
			likedIds = [...likedIds, id];
			try {
				localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
				localStorage.setItem(LIKED_KEY, JSON.stringify(likedIds));
			} catch {}
			renderWishes();

			if (supabase) {
				await supabase.from('wishes').update({ likes: target.likes }).eq('id', id);
			}
		});
	});
};

const fetchWishes = async () => {
	renderWishes();
	if (!supabase) return;
	try {
		const { data, error } = await supabase
			.from('wishes')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(200);
		if (error) throw error;
		if (data) {
			wishes = data as WishItem[];
			try {
				localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
			} catch {}
			renderWishes();
		}
	} catch (err) {
		console.error('Error fetching wishes:', err);
	}
};

void fetchWishes();

if (supabase) {
	supabase
		.channel('realtime-wishes')
		.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wishes' }, (payload) => {
			const incoming = payload.new as WishItem;
			if (!wishes.some((w) => w.id === incoming.id)) {
				wishes = [incoming, ...wishes];
				renderWishes();
			}
		})
		.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'wishes' }, (payload) => {
			const updated = payload.new as WishItem;
			const target = wishes.find((w) => w.id === updated.id);
			if (target) {
				target.likes = Math.max(target.likes || 0, updated.likes || 0);
				renderWishes();
			}
		})
		.subscribe();
}

rsvpForm?.addEventListener('submit', async (e) => {
	e.preventDefault();
	const data = new FormData(rsvpForm);
	const name = String(data.get('name') ?? '').trim().slice(0, 40);
	const message = String(data.get('message') ?? '').trim().slice(0, 300);

	if (!name || !message) {
		if (rsvpFeedback) {
			rsvpFeedback.style.color = '#9c4c50';
			rsvpFeedback.textContent = 'Mohon isi nama lengkap dan ucapan Anda terlebih dahulu.';
		}
		return;
	}

	const optimistic: WishItem = {
		id: `opt-${Date.now()}`,
		name,
		message,
		attendance: selectedAttendance,
		site: SITE,
		created_at: new Date().toISOString(),
		likes: 0,
	};

	wishes = [optimistic, ...wishes];
	renderWishes();

	try {
		if (supabase) {
			const { data: inserted, error } = await supabase
				.from('wishes')
				.insert([{ name, message, attendance: selectedAttendance, site: SITE }])
				.select()
				.single();
			if (error) throw error;
			if (inserted) {
				const real = inserted as WishItem;
				wishes = [real, ...wishes.filter((w) => w.id !== optimistic.id && w.id !== real.id)];
			}
		} else {
			optimistic.id = `wish-${Date.now()}`;
		}
		try {
			localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
		} catch {}
		renderWishes();

		if (rsvpFeedback) {
			rsvpFeedback.style.color = '#5d7056';
			rsvpFeedback.textContent = `Terima kasih, ${name}. Ucapan & doa Anda telah terkirim!`;
		}
		rsvpForm.reset();
		if (wishCharCount) wishCharCount.textContent = '0/300';
	} catch (err) {
		wishes = wishes.filter((w) => w.id !== optimistic.id);
		renderWishes();
		if (rsvpFeedback) {
			rsvpFeedback.style.color = '#9c4c50';
			rsvpFeedback.textContent = 'Gagal mengirim ucapan. Silakan coba lagi.';
		}
		console.error('Error sending wish:', err);
	}
});
