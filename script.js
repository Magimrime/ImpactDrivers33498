document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');

            // Burger Animation
            burger.classList.toggle('toggle');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }

    // Scroll Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.fade-in');
    hiddenElements.forEach((el) => observer.observe(el));

    // Scroll Spy for Sidebar
    const sections = document.querySelectorAll('section[id]');
    const sidebarLinks = document.querySelectorAll('.sidebar-list a');

    if (sections.length > 0 && sidebarLinks.length > 0) {
        const spyOptions = {
            threshold: 0.3, // Trigger when 30% of section is visible
            rootMargin: "-100px 0px -50% 0px" // Adjusted offset for fixed header
        };

        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    sidebarLinks.forEach(link => {
                        link.classList.remove('active-section');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active-section');
                        }
                    });
                }
            });
        }, spyOptions);

        sections.forEach(section => spyObserver.observe(section));
    }

    // Stats Expansion Logic
    const expandButtons = document.querySelectorAll('.stats-expand-btn');
    expandButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor interactions if any
            const targetId = btn.getAttribute('data-target');
            const detailsSection = document.getElementById(targetId);

            if (detailsSection) {
                detailsSection.classList.toggle('open');
                // Optional: Change button text
                if (detailsSection.classList.contains('open')) {
                    btn.textContent = "Hide Details";
                } else {
                    btn.textContent = "View Details";
                }
            }
        });
    });
});

// Season Switcher (stats page)
document.addEventListener('DOMContentLoaded', () => {
    const seasonTabs = document.querySelectorAll('.season-tab');
    const seasonPanels = document.querySelectorAll('.season-panel');
    if (seasonTabs.length === 0 || seasonPanels.length === 0) return;

    const titleEl = document.getElementById('season-title');
    const subtitleEl = document.getElementById('season-subtitle');

    function showSeason(season, updateHash) {
        let found = false;
        seasonPanels.forEach(panel => {
            const match = panel.dataset.season === season;
            panel.hidden = !match;
            if (match) {
                found = true;
                if (titleEl && panel.dataset.title) titleEl.textContent = panel.dataset.title;
                if (subtitleEl && panel.dataset.subtitle) subtitleEl.textContent = panel.dataset.subtitle;
            }
        });
        if (!found) return false;

        seasonTabs.forEach(tab => {
            const active = tab.dataset.season === season;
            tab.classList.toggle('active', active);
            tab.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        if (updateHash && history.replaceState) {
            history.replaceState(null, '', '#season-' + season);
        }
        return true;
    }

    seasonTabs.forEach(tab => {
        tab.addEventListener('click', () => showSeason(tab.dataset.season, true));
    });

    // Deep link support: stats.html#season-2025-26 opens that season directly
    const hashSeason = location.hash.startsWith('#season-') ? location.hash.slice(8) : null;
    if (!hashSeason || !showSeason(hashSeason, false)) {
        showSeason(seasonTabs[0].dataset.season, false);
    }
});
