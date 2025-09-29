// Main interactivity for TransX
document.addEventListener('DOMContentLoaded', () => {
    // Mobile nav (CORRECTED FOR ARIA-EXPANDED CSS CONTROL)
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('menu');
    if (toggle && menu) {
        // Set initial state for accessibility
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-expanded', 'false');

        toggle.addEventListener('click', () => {
            // Check the current state of the toggle button
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            
            // Set the new state to the opposite
            toggle.setAttribute('aria-expanded', String(!isExpanded));
            menu.setAttribute('aria-expanded', String(!isExpanded)); // CSS uses this on the menu
        });
    }

    // Highlight active nav link
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu a').forEach(a => {
        const href = a.getAttribute('href');
        // Handle services/index.html correctly when on that page
        const isServicesIndex = (location.pathname.endsWith('services/index.html') || location.pathname.endsWith('/services/')) && href.includes('services/index.html');
        
        if (href === path || (path === '' && href === 'index.html') || isServicesIndex) {
            a.classList.add('active');
        }
    });

    // Track form demo
    const trackForm = document.getElementById('trackForm');
    if (trackForm) {
        trackForm.addEventListener('submit', e => {
            e.preventDefault();
            const out = document.getElementById('trackResult');
            const id = new FormData(trackForm).get('trackNo');
            if (!id) return;
            const steps = ['Collected','At Depot','In Transit','Out for Delivery','Delivered'];
            const rnd = Math.floor(Math.random() * steps.length);
            out.innerHTML = `<p><strong>${id}</strong></p><p>Status: ${steps[rnd]}</p>`;
        });
    }

    // Multi-step quote form
    const qForm = document.getElementById('quoteForm');
    if (qForm) {
        const steps = Array.from(qForm.querySelectorAll('fieldset'));
        let idx = 0;
        function show(i){
            steps.forEach((fs, n) => fs.hidden = n !== i);
            idx = i;
        }
        qForm.addEventListener('click', e => {
            const t = e.target;
            if (t.classList.contains('next')){
                const cur = steps[idx];
                const invalid = Array.from(cur.querySelectorAll('[required]'))
                    .filter(el => !el.value || (el.type==='checkbox' && !el.checked));
                if (invalid.length){
                    invalid[0].focus();
                    invalid[0].setAttribute('aria-invalid','true');
                    return;
                }
                show(Math.min(idx+1, steps.length-1));
            }
            if (t.classList.contains('prev')) show(Math.max(idx-1, 0));
        });
        qForm.addEventListener('submit', e => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(qForm).entries());
            document.getElementById('quoteResult').textContent =
                `Thanks ${data.name}! Your quote request has been received. We will email ${data.email}.`;
            qForm.reset();
            show(0);
        });
        show(0);
    }

    // Contact form (demo)
    const cForm = document.getElementById('contactForm');
    if (cForm){
        cForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = new FormData(cForm).get('name');
            alert(`Thanks ${name}, we will get back to you shortly.`);
            cForm.reset();
        });
    }
});