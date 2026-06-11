document.addEventListener("DOMContentLoaded", () => {
    
    const announcer = document.getElementById("sr-announcer");
    const announceMessage = (message) => {
        announcer.textContent = message;
    };

    // ==========================================
    // 1. GESTÃO DE TEMA
    // ==========================================
    const toggleThemeCheckbox = document.querySelector('.theme-switch input[type="checkbox"]');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        toggleThemeCheckbox.checked = savedTheme === 'dark';
    }

    toggleThemeCheckbox.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        announceMessage(`Modo escuro ${e.target.checked ? 'ativado' : 'desativado'}.`);
    });

    // ==========================================
    // 2. MODAL INTERATIVO COM TRAP FOCUS
    // ==========================================
    const modalElement = document.getElementById("modalInscricao");
    const openModalTriggers = document.querySelectorAll(".cta-button, .btn-contato");
    const closeModalTrigger = document.querySelector(".close-button");
    const interactionForm = document.getElementById("formSustentavel");
    
    let lastActiveElement;

    const openModal = (event) => {
        event.preventDefault();
        lastActiveElement = document.activeElement;
        
        modalElement.style.display = "block";
        modalElement.setAttribute('aria-hidden', 'false');
        announceMessage("Janela de contato aberta. Digite seus dados.");
        
        document.getElementById("nome").focus();
        document.addEventListener("keydown", trapFocus);
    };

    const closeModal = () => {
        modalElement.style.display = "none";
        modalElement.setAttribute('aria-hidden', 'true');
        document.removeEventListener("keydown", trapFocus);
        announceMessage("Janela de contato fechada.");
        
        if (lastActiveElement) lastActiveElement.focus();
    };

    const trapFocus = (e) => {
        if (e.key === 'Escape') { closeModal(); return; }
        if (e.key !== 'Tab') return;

        const focusableElements = modalElement.querySelectorAll('input, button');
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstEl) { lastEl.focus(); e.preventDefault(); }
        } else {
            if (document.activeElement === lastEl) { firstEl.focus(); e.preventDefault(); }
        }
    };

    openModalTriggers.forEach(trigger => trigger.addEventListener("click", openModal));
    closeModalTrigger.addEventListener("click", closeModal);
    
    window.addEventListener("click", (e) => {
        if (e.target === modalElement) closeModal();
    });

    interactionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = document.getElementById("nome").value;
        alert(`Obrigado pelo contato, ${nome}! Em breve retornaremos.`);
        announceMessage("Formulário enviado com sucesso!");
        interactionForm.reset();
        closeModal();
    });

    // ==========================================
    // 3. ANIMAÇÃO E CORREÇÃO DE PLAY DO VÍDEO HERO
    // ==========================================
    const revealElements = document.querySelectorAll(".reveal");
    const bgVideo = document.querySelector(".hero-video-bg");
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Forçar início do vídeo de fundo (Ignorar bloqueio agressivo de autoplay do navegador)
    if (bgVideo) {
        bgVideo.muted = true;
        const playPromise = bgVideo.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Se o navegador bloqueou mesmo assim, tentamos rodar novamente ao primeiro clique na tela
                document.body.addEventListener('click', () => {
                    bgVideo.play();
                }, { once: true });
            });
        }
    }

    if (prefersReducedMotion) {
        if (bgVideo) bgVideo.pause();
        revealElements.forEach(el => el.classList.add("active"));
    } else {
        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            revealElements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                if (elementTop < windowHeight - 80) {
                    el.classList.add("active");
                }
            });
        };
        window.addEventListener("scroll", revealOnScroll);
        revealOnScroll();
    }

    // ==========================================
    // 4. ROLAGEM SUAVE PARA LINKS INTERNOS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchorLink => {
        anchorLink.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith("#") && targetId !== "#") {
                event.preventDefault();
                const destinationSection = document.querySelector(targetId);
                if (destinationSection) {
                    destinationSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
