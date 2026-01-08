/* ========================================
   CONSTRUTORA CARVALHO ENGENHARIA
   JavaScript Principal
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos os módulos
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initGallerySlider();
    initGalleryTabs();
    initAnimations();
    initCurrentYear();
});

/* ----------------------------------------
   HEADER - Efeito Scroll
   ---------------------------------------- */
function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Adiciona classe quando rola a página
        if (currentScroll > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ----------------------------------------
   MENU MOBILE - Hambúrguer
   ---------------------------------------- */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const body = document.body;

    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    body.appendChild(overlay);

    // Toggle menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Fechar menu ao clicar no overlay
    overlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    });

    // Fechar menu ao clicar em um link
    const navLinks = nav.querySelectorAll('.header__link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Fechar menu com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

/* ----------------------------------------
   SCROLL SUAVE
   ---------------------------------------- */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);

            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Atualizar link ativo
                updateActiveLink(href);
            }
        });
    });

    // Atualizar link ativo ao rolar
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                updateActiveLink('#' + sectionId);
            }
        });
    });
}

function updateActiveLink(href) {
    const navLinks = document.querySelectorAll('.header__link');

    navLinks.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === href) {
            link.classList.add('active');
        }
    });
}

/* ----------------------------------------
   GALERIA - Slider
   ---------------------------------------- */
function initGallerySlider() {
    const slider = document.getElementById('galeriaSlider');
    const prevBtn = document.getElementById('galeriaPrev');
    const nextBtn = document.getElementById('galeriaNext');
    const dotsContainer = document.getElementById('galeriaDots');

    if (!slider) return;

    let slides = slider.querySelectorAll('.galeria__slide');
    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();
    let totalSlides = slides.length;
    let maxIndex = Math.max(0, totalSlides - slidesPerView);
    let autoplayInterval;

    // Criar dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const dotsCount = maxIndex + 1;

        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('span');
            dot.className = 'galeria__dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', function() {
                goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }
    }

    // Atualizar dots
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.galeria__dot');
        dots.forEach(function(dot, index) {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Ir para slide
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateSlider();
        updateDots();
        resetAutoplay();
    }

    // Atualizar posição do slider
    function updateSlider() {
        const slideWidth = slides[0].offsetWidth + 10; // width + margin
        slider.style.transform = 'translateX(-' + (currentIndex * slideWidth) + 'px)';
    }

    // Próximo slide
    function nextSlide() {
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateSlider();
        updateDots();
    }

    // Slide anterior
    function prevSlide() {
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        updateSlider();
        updateDots();
    }

    // Calcular slides por view
    function getSlidesPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Event Listeners
    if (prevBtn) prevBtn.addEventListener('click', function() {
        prevSlide();
        resetAutoplay();
    });

    if (nextBtn) nextBtn.addEventListener('click', function() {
        nextSlide();
        resetAutoplay();
    });

    // Pausar autoplay ao hover
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // Touch events para mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Recalcular no resize
    window.addEventListener('resize', function() {
        slidesPerView = getSlidesPerView();
        maxIndex = Math.max(0, totalSlides - slidesPerView);
        currentIndex = Math.min(currentIndex, maxIndex);
        createDots();
        updateSlider();
    });

    // Inicializar
    createDots();
    startAutoplay();

    // Expor função para filtro
    window.updateGallerySlider = function(filteredSlides) {
        slides = filteredSlides;
        totalSlides = slides.length;
        maxIndex = Math.max(0, totalSlides - slidesPerView);
        currentIndex = 0;
        createDots();
        updateSlider();
    };
}

/* ----------------------------------------
   GALERIA - Tabs/Filtros
   ---------------------------------------- */
function initGalleryTabs() {
    const tabs = document.querySelectorAll('.galeria__tab');
    const slider = document.getElementById('galeriaSlider');

    if (!tabs.length || !slider) return;

    const allSlides = Array.from(slider.querySelectorAll('.galeria__slide'));

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            // Atualizar tab ativa
            tabs.forEach(function(t) { t.classList.remove('active'); });
            tab.classList.add('active');

            const category = tab.dataset.category;

            // Filtrar slides
            allSlides.forEach(function(slide) {
                if (category === 'todos' || slide.dataset.category === category) {
                    slide.style.display = 'block';
                } else {
                    slide.style.display = 'none';
                }
            });

            // Atualizar slider
            const visibleSlides = allSlides.filter(function(slide) {
                return slide.style.display !== 'none';
            });

            if (window.updateGallerySlider) {
                window.updateGallerySlider(visibleSlides);
            }

            // Resetar posição
            slider.style.transform = 'translateX(0)';
        });
    });
}

/* ----------------------------------------
   ANIMAÇÕES AO SCROLL
   ---------------------------------------- */
function initAnimations() {
    // Adicionar classe de animação aos elementos
    const animatedElements = document.querySelectorAll(
        '.diferencial-card, .servico-card, .area-card, .section-header'
    );

    animatedElements.forEach(function(el, index) {
        el.classList.add('animate-on-scroll');
        el.classList.add('animate-delay-' + ((index % 4) + 1));
    });

    // Observer para animações
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    animatedElements.forEach(function(el) {
        observer.observe(el);
    });
}

/* ----------------------------------------
   ANO ATUAL NO COPYRIGHT
   ---------------------------------------- */
function initCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/* ----------------------------------------
   UTILITÁRIOS
   ---------------------------------------- */

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const context = this;
        const args = arguments;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

/* ----------------------------------------
   LAZY LOADING DE IMAGENS
   ---------------------------------------- */
document.addEventListener('DOMContentLoaded', function() {
    // Verificar suporte nativo
    if ('loading' in HTMLImageElement.prototype) {
        // Browser suporta lazy loading nativo
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(function(img) {
            img.src = img.src;
        });
    } else {
        // Fallback com Intersection Observer
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.removeAttribute('loading');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }
});

/* ----------------------------------------
   ACESSIBILIDADE - Navegação por Teclado
   ---------------------------------------- */
document.addEventListener('keydown', function(e) {
    // Permitir navegação por Tab
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
});

/* ----------------------------------------
   PRELOAD DE IMAGENS CRÍTICAS
   ---------------------------------------- */
function preloadImage(src) {
    return new Promise(function(resolve, reject) {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
    });
}

// Preload hero background
document.addEventListener('DOMContentLoaded', function() {
    preloadImage('imagens/galeria/vespasiano-bh/vespasiano-1.jpeg');
});
