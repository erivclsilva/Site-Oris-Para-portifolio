/* ============================================
   ORIS ODONTOLOGIA - JavaScript principal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeaderScroll();
    initAccordion();
    initTreatmentModals();
    initLightbox();
    initFormValidation();
    initScrollReveal();
    initBackToTop();
    initWhatsAppButton();
    setYear();
});

/* ============ Menu Mobile ============ */
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
        const isOpen = toggle.classList.toggle('active');
        menu.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
        menu.setAttribute('aria-hidden', !isOpen);
    });
    
    // Fechar ao clicar em qualquer link do menu
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
        });
    });
    
    // Fechar ao pressionar Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
            toggle.classList.remove('active');
            menu.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
            toggle.focus();
        }
    });
}

/* ============ Header Scroll ============ */
function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    
    const onScroll = () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ============ Accordion (FAQ) ============ */
function initAccordion() {
    const accordion = document.getElementById('faqAccordion');
    if (!accordion) return;
    
    const buttons = accordion.querySelectorAll('.accordion-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const expanded = button.getAttribute('aria-expanded') === 'true';
            const panel = document.getElementById(button.getAttribute('aria-controls'));
            
            // Fechar todos
            buttons.forEach(btn => {
                btn.setAttribute('aria-expanded', 'false');
                const relatedPanel = document.getElementById(btn.getAttribute('aria-controls'));
                if (relatedPanel) relatedPanel.hidden = true;
            });
            
            // Abrir o clicado se estava fechado
            if (!expanded && panel) {
                button.setAttribute('aria-expanded', 'true');
                panel.hidden = false;
            }
        });
    });
}

/* ============ Modais de Tratamentos ============ */
function initTreatmentModals() {
    const modal = document.getElementById('treatmentModal');
    const modalTitle = document.getElementById('treatmentModalTitle');
    const modalDesc = document.getElementById('treatmentModalDescription');
    const modalClose = document.getElementById('modalClose');
    const openButtons = document.querySelectorAll('.open-treatment');
    
    if (!modal || !modalTitle || !modalDesc) return;
    
    const treatmentsData = {
        'clinica-geral': {
            title: 'Clínica Geral',
            description: 'A clínica geral é a base de um sorriso saudável. Realizamos avaliações completas, limpeza profissional, prevenção de cáries e doenças gengivais, restaurações e acompanhamento contínuo. Nosso foco é manter sua saúde bucal em dia, com orientações personalizadas para o seu dia a dia.'
        },
        'ortodontia': {
            title: 'Ortodontia',
            description: 'A ortodontia é responsável pelo alinhamento dos dentes e pela correção da mordida. Trabalhamos com técnicas modernas e discretas, buscando resultados funcionais e estéticos. Cada caso é avaliado individualmente para definir o melhor plano de tratamento, respeitando seu ritmo e suas expectativas.'
        },
        'implantodontia': {
            title: 'Implantodontia',
            description: 'A implantodontia é a especialidade que reabilita a perda de dentes por meio de implantes. O procedimento devolve função, estética e qualidade de vida. Na Oris, contamos com tecnologia para planejamento e execução precisa, sempre priorizando segurança e conforto.'
        },
        'estetica-dental': {
            title: 'Estética Dental',
            description: 'A estética dental envolve procedimentos como facetas, lentes de contato e harmonização do sorriso. Nosso objetivo é realçar a beleza natural dos seus dentes, respeitando a harmonia do rosto e a saúde bucal. Cada sorriso é único, por isso o planejamento é totalmente personalizado.'
        },
        'clareamento': {
            title: 'Clareamento',
            description: 'O clareamento dental é um procedimento seguro para remover manchas e devolver o brilho natural aos dentes. Realizamos avaliação criteriosa antes de iniciar, definindo a técnica mais adequada para o seu caso. O resultado é um sorriso mais branco e confiante, com total acompanhamento profissional.'
        },
        'proteses': {
            title: 'Próteses',
            description: 'As próteses dentárias são indicadas para substituir dentes ausentes, devolvendo conforto, estética e função mastigatória. Trabalhamos com próteses fixas, removíveis e sobre implantes, sempre com materiais de alta qualidade e um acabamento natural.'
        }
    };
    
    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            const treatment = button.getAttribute('data-treatment');
            const data = treatmentsData[treatment];
            if (data) {
                modalTitle.textContent = data.title;
                modalDesc.textContent = data.description;
                modal.classList.add('open');
                modal.setAttribute('aria-hidden', 'false');
                modalClose.focus();
            }
        });
    });
    
    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    };
    
    modalClose.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
}

/* ============ Lightbox da Galeria ============ */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    
    if (!lightbox || !lightboxImage || galleryItems.length === 0) return;
    
    let currentIndex = 0;
    
    const images = galleryItems.map(item => ({
        src: item.getAttribute('data-image'),
        caption: item.getAttribute('data-caption')
    }));
    
    const openLightbox = (index) => {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        closeBtn.focus();
    };
    
    const updateLightbox = () => {
        const image = images[currentIndex];
        lightboxImage.src = image.src;
        lightboxImage.alt = image.caption;
        lightboxCaption.textContent = image.caption;
    };
    
    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
    };
    
    const showPrev = () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
    };
    
    const showNext = () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
    };
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
    
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
}

/* ============ Validação do Formulário ============ */
function initFormValidation() {
    const form = document.getElementById('appointmentForm');
    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('formFeedback');
    
    if (!form || !submitBtn || !feedback) return;
    
    const validateField = (field) => {
        const group = field.closest('.form-group');
        let isValid = true;
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
        }
        
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
            }
        }
        
        if (field.type === 'tel' && field.value.trim()) {
            const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
            if (!phoneRegex.test(field.value.trim())) {
                isValid = false;
            }
        }
        
        if (isValid) {
            group.classList.remove('has-error');
        } else {
            group.classList.add('has-error');
        }
        
        return isValid;
    };
    
    const validateAll = () => {
        const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
        let allValid = true;
        fields.forEach(field => {
            if (!validateField(field)) allValid = false;
        });
        return allValid;
    };
    
    // Validação em tempo real
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.closest('.form-group').classList.contains('has-error')) {
                validateField(field);
            }
        });
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        feedback.className = 'form-feedback';
        feedback.textContent = '';
        
        if (!validateAll()) {
            feedback.textContent = 'Por favor, corrija os campos destacados.';
            feedback.classList.add('error');
            const firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
            if (firstError) firstError.focus();
            return;
        }
        
        // Simulação de envio (sem servidor)
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Solicitar agendamento';
            feedback.textContent = 'Solicitação recebida com sucesso! Nossa equipe entrará em contato em breve.';
            feedback.classList.add('success');
            form.reset();
        }, 1500);
    });
}

/* ============ Reveal on Scroll ============ */
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;
    
    // Adiciona a classe reveal às seções que desejamos animar
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const headings = section.querySelectorAll('.section-title, .section-subtitle');
        headings.forEach(el => el.classList.add('reveal'));
        const cards = section.querySelectorAll('.trust-card, .treatment-card, .differential-item, .team-card, .timeline-step, .gallery-item, .location-info, .map-mockup');
        cards.forEach(card => card.classList.add('reveal'));
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============ Back to Top ============ */
function initBackToTop() {
    const button = document.getElementById('backToTop');
    if (!button) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    }, { passive: true });
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============ WhatsApp Button ============ */
function initWhatsAppButton() {
    const float = document.getElementById('whatsappFloat');
    if (!float) return;
    
    // O link já está definido no HTML. Apenas garantimos que abra em nova aba.
    float.setAttribute('target', '_blank');
    float.setAttribute('rel', 'noopener');
}

/* ============ Ano dinâmico no footer ============ */
function setYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
