// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
	link.addEventListener('click', function (e) {
		const targetId = this.getAttribute('href');
		if (targetId.length > 1) {
			e.preventDefault();
			const el = document.querySelector(targetId);
			if (el) {
				el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	});
});

// Active section highlight
(function activateOnScroll() {
	const sections = document.querySelectorAll('main section[id]');
	const navLinks = document.querySelectorAll('.site-nav a');
	const io = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const id = entry.target.getAttribute('id');
				navLinks.forEach((a) => {
					a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
				});
			}
		});
	}, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
	sections.forEach((s) => io.observe(s));
})();

// Contact form validation (client-only demo)
(function contactForm() {
	const form = document.getElementById('contact-form');
	if (!form) return;
	const getRow = (name) => form.querySelector('#' + name).closest('.form-row');
	const setError = (row, message) => {
		row.querySelector('.error').textContent = message || '';
	};
	const validators = {
		name: (val) => val.trim().length >= 2 || '이름은 2자 이상 입력하세요.',
		email: (val) => /^\S+@\S+\.\S+$/.test(val) || '올바른 이메일을 입력하세요.',
		message: (val) => val.trim().length >= 10 || '메시지는 10자 이상 입력하세요.'
	};
	form.addEventListener('submit', function (e) {
		e.preventDefault();
		let valid = true;
		['name','email','message'].forEach((field) => {
			const input = form.querySelector('#' + field);
			const row = getRow(field);
			const rule = validators[field];
			const result = rule(input.value);
			if (result !== true) {
				setError(row, result);
				valid = false;
			} else {
				setError(row, '');
			}
		});
		if (!valid) return;
		console.log('Form submitted:', {
			name: form.name.value,
			email: form.email.value,
			message: form.message.value
		});
		alert('메시지가 전송된 것으로 가정합니다. 감사합니다!');
		form.reset();
	});
})();

// Year in footer
(function setYear() {
	const y = document.getElementById('year');
	if (y) y.textContent = new Date().getFullYear();
})();

// Theme toggle with persistence
(function theme() {
	const storageKey = 'site-theme';
	const root = document.documentElement;
	const btn = document.getElementById('theme-toggle');
	const label = document.getElementById('theme-label');
	function applyTheme(theme) {
		if (theme === 'dark') {
			root.setAttribute('data-theme', 'dark');
			if (btn) btn.textContent = '🌙';
			if (label) label.textContent = 'Dark';
		} else {
			root.setAttribute('data-theme', 'light');
			if (btn) btn.textContent = '🌞';
			if (label) label.textContent = 'Light';
		}
	}
	function preferred() {
		const saved = localStorage.getItem(storageKey);
		if (saved === 'light' || saved === 'dark') return saved;
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}
	let current = preferred();
	applyTheme(current);
	if (btn) {
		btn.addEventListener('click', function () {
			current = current === 'dark' ? 'light' : 'dark';
			localStorage.setItem(storageKey, current);
			applyTheme(current);
		});
	}
	// Update if system theme changes and no explicit choice saved
	if (window.matchMedia) {
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		mq.addEventListener && mq.addEventListener('change', function (e) {
			const saved = localStorage.getItem(storageKey);
			if (saved !== 'light' && saved !== 'dark') {
				current = e.matches ? 'dark' : 'light';
				applyTheme(current);
			}
		});
	}
})();


