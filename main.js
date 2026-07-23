/* ==========================================================================
   Prakhar Sharma Portfolio JavaScript Logic
   Includes: Project Filter, Theme Switcher, Contact Form, Toast Notifications,
   Project Modal Viewer, Smooth Animations.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Navigation & Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (mobileToggle) {
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            }
        });
    });

    // Active link indicator on scroll
    window.addEventListener('scroll', () => {
        let currentSection = 'hero';
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        // Navbar floating shadow update on scroll
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 20px 45px rgba(0, 0, 0, 0.55), 0 0 25px rgba(238, 93, 54, 0.18)';
            } else {
                navbar.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.35), 0 0 20px rgba(238, 93, 54, 0.08)';
            }
        }
    });

    // --- 2. Dark / Light Mode Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check saved preference or default to light
    const savedTheme = localStorage.getItem('prakhar_theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('prakhar_theme', newTheme);
            updateThemeIcon(newTheme);

            showToast(`Switched to ${newTheme} mode!`);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }

    // --- 3. Portfolio Category Filter ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                if (filterValue === 'all' || (categories && categories.includes(filterValue))) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // --- 4. Project Modal Viewer ---
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body');
    const openModalBtns = document.querySelectorAll('.open-modal');

    const projectData = {
        '1': {
            title: 'Mahadev Fitness Club',
            category: 'Full-Stack / Gym Web Application',
            img: 'mahadev-fitness.png',
            desc: 'A modern, high-energy gym and fitness platform created for Mahadev Fitness Club. Features comprehensive workout plans, membership subscriptions, trainer directory, gym equipment showcase, interactive schedules, and sleek dark/orange UI aesthetics.',
            tech: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Responsive UI', 'SEO & Web Performance'],
            liveUrl: 'https://www.mahadevfitnessclub.in/'
        },
        '2': {
            title: 'Mahadev Fitness Club Backend API',
            category: 'Backend Architecture & REST API',
            img: 'mahadev-backend.png',
            desc: 'Scalable RESTful API service powering Mahadev Fitness Club, hosted live on Render cloud. Handles user authentication, membership data operations, secure API routes, database integrations, and server business logic.',
            tech: ['Node.js', 'Express.js', 'REST API', 'Render Cloud', 'Backend Security'],
            liveUrl: 'https://mahadevfitnessclub-backend.onrender.com/'
        },
        '3': {
            title: 'Roop Singh Tikki Chaat',
            category: 'Restaurant & Food Showcase Website',
            img: 'roop-singh-tikki.png',
            desc: 'An inviting web storefront for Roop Singh Tikki Chaat. Features digital food menu showcase, authentic street food photography, customer inquiries, catering services overview, and mobile-friendly UI layout.',
            tech: ['HTML5', 'Vanilla CSS3', 'JavaScript', 'UI/UX Design', 'Food Ordering Flow'],
            liveUrl: 'https://www.roopsinghtikkichaat.in/'
        },
        '4': {
            title: 'Nar Singh Tour & Travels',
            category: 'Travel & Tourism Booking Platform',
            img: 'nar-singh-travels.png',
            desc: 'Comprehensive travel agency and booking platform deployed on Vercel. Enables users to explore North India tour packages, request outstation cab bookings, view vehicle fleets, and submit booking inquiries.',
            tech: ['JavaScript', 'HTML5/CSS3', 'Vercel Cloud Deployment', 'Responsive Grid', 'UX Wireframes'],
            liveUrl: 'https://nar-singh-tour-trevels.vercel.app/'
        }
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute('data-project');
            const data = projectData[projectId];

            if (data && modal && modalBody) {
                modalBody.innerHTML = `
                    <div class="modal-project-img" style="margin-bottom: 1.5rem; overflow: hidden; border-radius: 12px; max-height: 320px;">
                        <img src="${data.img}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary-orange); text-transform: uppercase; letter-spacing: 0.05em;">${data.category}</span>
                    <h2 style="font-family: var(--font-heading); font-size: 1.8rem; margin: 0.5rem 0 1rem 0; color: var(--text-main);">${data.title}</h2>
                    <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">${data.desc}</p>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="font-size: 0.95rem; margin-bottom: 0.6rem; color: var(--text-main);">Technologies Used:</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${data.tech.map(t => `<span style="font-size: 0.8rem; font-weight: 600; padding: 0.3rem 0.7rem; background: var(--primary-orange-light); color: var(--primary-orange); border-radius: 20px;">${t}</span>`).join('')}
                        </div>
                    </div>

                    <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
                        <a href="${data.liveUrl}" target="_blank" class="btn btn-primary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Live Project / Link</a>
                        <button class="btn btn-outline btn-sm" onclick="document.getElementById('project-modal').classList.remove('active')">Close Window</button>
                    </div>
                `;
                modal.classList.add('active');
            }
        });
    });

    if (modalClose && modal) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // --- 5. Contact Form Submission & Validation (Formspree) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Sent Successfully!`;
                    submitBtn.style.backgroundColor = 'var(--accent-green)';
                    showToast('Thank you! Your message has been sent to Prakhar.');
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (err) {
                console.error('Contact form error:', err);
                submitBtn.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Failed to Send`;
                submitBtn.style.backgroundColor = '#DC2626';
                showToast('Something went wrong. Please email me directly instead.');
            } finally {
                submitBtn.disabled = false;
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.backgroundColor = 'var(--primary-orange)';
                }, 3000);
            }
        });
    }

    // --- 6. Copy Email Button ---
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-text');

    if (copyEmailBtn && emailText) {
        copyEmailBtn.addEventListener('click', () => {
            const textToCopy = emailText.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast('Email copied to clipboard!');
                copyEmailBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
                setTimeout(() => {
                    copyEmailBtn.innerHTML = `<i class="fa-regular fa-copy"></i>`;
                }, 2000);
            }).catch(err => {
                console.error('Copy error:', err);
            });
        });
    }

    // --- 7. Toast Notification Helper ---
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-msg');
        if (!toast || !toastMsg) return;

        toastMsg.innerText = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }

});
