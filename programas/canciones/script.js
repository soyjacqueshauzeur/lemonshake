document.addEventListener('DOMContentLoaded', function () {
    // Theme Toggle with Surprise
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const html = document.documentElement;
    const body = document.body;

    const surpriseEmojis = ['✨', '🎉', '🌟', '💫', '🔮', '🎆', '💥', '🌈', '🦄', '🐉'];
    const lightIcon = '☀️';
    const darkIcon = '🌙';

    let isDark = document.documentElement.classList.contains('dark');

    themeToggle.addEventListener('click', function () {
        // Surprise animation - spin and change emoji randomly
        let rotation = 0;
        let emojiIndex = 0;

        const surpriseInterval = setInterval(() => {
            rotation += 180;
            themeIcon.style.transform = `rotate(${rotation}deg)`;
            themeIcon.textContent = surpriseEmojis[emojiIndex];
            emojiIndex = (emojiIndex + 1) % surpriseEmojis.length;
        }, 80);

        setTimeout(() => {
            clearInterval(surpriseInterval);

            // Toggle theme
            isDark = !isDark;

            if (isDark) {
                // Switch to dark
                html.classList.add('dark');
                html.classList.remove('light');
                html.setAttribute('data-theme', 'dark');
                themeIcon.textContent = darkIcon;
                body.classList.add('bg-background', 'text-on-surface');
                body.classList.remove('bg-gray-50', 'text-gray-900');

                // Restore dark colors
                updateColors('dark');
            } else {
                // Switch to light
                html.classList.remove('dark');
                html.classList.add('light');
                html.setAttribute('data-theme', 'light');
                themeIcon.textContent = lightIcon;
                body.classList.remove('bg-background', 'text-on-surface');
                body.classList.add('bg-gray-50', 'text-gray-900');

                // Update to light colors
                updateColors('light');
            }

            // Final spin to land
            rotation += 360;
            themeIcon.style.transform = `rotate(${rotation}deg)`;

            setTimeout(() => {
                themeIcon.style.transform = 'rotate(0deg)';
            }, 300);

            // Save preference
            localStorage.setItem('jh-theme', isDark ? 'dark' : 'light');

        }, 800);
    });

    function updateColors(mode) {
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) metaTheme.setAttribute('content', mode === 'dark' ? '#0A0A0C' : '#F4F4F0');
        const style = document.getElementById('dynamic-styles') || document.createElement('style');
        style.id = 'dynamic-styles';

        if (mode === 'light') {
            style.textContent = `
                body.bg-gray-50 { background: linear-gradient(180deg, #ffffff 0%, #f3f3f3 100%) !important; }
                .bg-background, body:not(.bg-gray-50) { background: linear-gradient(180deg, #ffffff 0%, #f3f3f3 100%) !important; }
                main { background: #ffffff !important; }
                .bg-surface { background: hsla(0, 0%, 97%, 1) !important; }
                .bg-surface-bright { background: hsla(0, 0%, 90%, 1) !important; }
                .text-on-surface { color: #1a1a1a !important; }
                .text-on-surface-variant { color: #4a4a4a !important; }
                .text-white { color: #ffffff !important; }
                .text-black { color: #050507 !important; }
                .text-white\/70 { color: rgba(42, 42, 42, 0.7) !important; }
                .glass-panel { background: rgba(255, 255, 255, 0.85) !important; border-color: rgba(0, 0, 0, 0.06) !important; box-shadow: 0 4px 24px rgba(0,0,0,0.08) !important; }
                .glass-panel-form { background: rgba(255, 255, 255, 0.95) !important; border-color: rgba(0, 0, 0, 0.08) !important; box-shadow: 0 4px 24px rgba(0,0,0,0.45) !important; }
                .grid-overlay { background-image: linear-gradient(to right, hsla(73, 100%, 62%, 0.06) 1px, transparent 1px), linear-gradient(to bottom, hsla(194.41, 100%, 50%, 0.06) 1px, transparent 1px) !important; }
                .scanlines { display: none !important; }
                nav { background: rgba(255, 255, 255, 0.98) !important; box-shadow: 0 2px 20px rgba(0,0,0,0.06) !important; }
                .hero { background: #ffffff !important; }
                footer { background: linear-gradient(180deg, #f0f0f0 0%, #e8e8e8 100%) !important; border-color: rgba(0,0,0,0.08) !important; }
                .glow-lime { filter: drop-shadow(0 0 8px hsla(73, 100%, 62%, 0.35)) !important; }
                .glow-blue { filter: drop-shadow(0 0 8px hsla(194.41, 100%, 50%, 0.35)) !important; }
                section { background: transparent !important; }
                .border { border-color: rgba(0,0,0,0.08) !important; }
                input:not([type="checkbox"]), textarea, select { background: #fafafa !important; border-color: rgba(0,0,0,0.1) !important; color: #1a1a1a !important; }
                button:not(.bg-gradient-to-br), .bg-surface-bright { background: hsla(0, 0%, 94%, 1) !important; }
            `;
        } else {
            style.textContent = `
                .bg-background { background: hsla(240, 4%, 6%, 1) !important; }
                .bg-surface { background: hsla(240, 5%, 8%, 1) !important; }
                .bg-surface-bright { background: hsla(240, 2%, 17%, 1) !important; }
                .text-on-surface { color: hsla(0, 0%, 100%, 1) !important; }
                .text-on-surface-variant { color: hsla(340, 2%, 67%, 1) !important; }
                .text-white { color: #ffffff !important; }
                .glass-panel { background: rgba(32, 31, 33, 0.4) !important; border-color: rgba(255, 255, 255, 0.1) !important; box-shadow: none !important; }
                .glass-panel-form { background: rgba(32, 31, 33, 0.6) !important; border-color: rgba(255, 255, 255, 0.15) !important; box-shadow: 0 4px 24px rgba(0,0,0,0.6) !important; }
                .grid-overlay { background-image: linear-gradient(to right, hsla(73, 100%, 62%, 0.05) 1px, transparent 1px), linear-gradient(to bottom, hsla(194.41, 100%, 50%, 0.05) 1px, transparent 1px) !important; }
                .scanlines { display: block !important; opacity: 0.03 !important; }
                nav { background: rgba(14, 14, 15, 0.9) !important; box-shadow: 0 8px 32px rgba(212,255,61,0.08) !important; }
                .hero { background: linear-gradient(135deg, hsla(240, 4%, 6%, 1) 0%, hsla(240, 5%, 8%, 1) 100%) !important; }
                footer { background: hsla(0, 0%, 0%, 1) !important; }
                .glow-lime { filter: drop-shadow(0 0 10px hsla(73, 100%, 62%, 0.5)) !important; }
                .glow-blue { filter: drop-shadow(0 0 10px hsla(194.41, 100%, 50%, 0.5)) !important; }
                section { background: transparent !important; }
            `;
        }

        if (!document.getElementById('dynamic-styles')) {
            document.head.appendChild(style);
        }
    }

    // Load saved theme or auto-detect by time
    const savedTheme = localStorage.getItem('jh-theme');
    if (savedTheme) {
        if (savedTheme === 'dark') {
            isDark = true;
            themeIcon.textContent = darkIcon;
            html.classList.remove('light');
            html.classList.add('dark');
            html.setAttribute('data-theme', 'dark');
            body.classList.remove('bg-gray-50', 'text-gray-900');
            body.classList.add('bg-background', 'text-on-surface');
            updateColors('dark');
        } else {
            updateColors('light');
        }
    } else {
        const hour = new Date().getHours();
        if (hour < 4 || hour >= 18) {
            isDark = true;
            themeIcon.textContent = darkIcon;
            html.classList.remove('light');
            html.classList.add('dark');
            html.setAttribute('data-theme', 'dark');
            body.classList.remove('bg-gray-50', 'text-gray-900');
            body.classList.add('bg-background', 'text-on-surface');
            updateColors('dark');
        } else {
            updateColors('light');
        }
    }

    // FAQ Accordion
    const faqBtns = document.querySelectorAll('.faq-btn');

    faqBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const item = this.closest('.glass-panel');
            const content = item.querySelector('.faq-content');
            const icon = this.querySelector('.material-symbols-outlined');

            content.classList.toggle('hidden');

            if (content.classList.contains('hidden')) {
                icon.textContent = 'add';
            } else {
                icon.textContent = 'remove';
            }

            document.querySelectorAll('.glass-panel').forEach(otherItem => {
                if (otherItem !== item) {
                    const otherContent = otherItem.querySelector('.faq-content');
                    const otherIcon = otherItem.querySelector('.material-symbols-outlined');
                    if (otherContent && !otherContent.classList.contains('hidden')) {
                        otherContent.classList.add('hidden');
                        if (otherIcon) otherIcon.textContent = 'add';
                    }
                }
            });
        });
    });


    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Nav background on scroll
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('shadow-lg');
        } else {
            nav.classList.remove('shadow-lg');
        }
    });

    // Modal functionality for payment methods
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modals = document.querySelectorAll('.modal');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        });
    });

    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            });
        }
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    });

    console.log('🎵 Lemon Shake Canciones — theme loaded');
});