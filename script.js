document.addEventListener('DOMContentLoaded', () => {
    // Array with the banners located in the Alertas folder
    const banners = [
        "Alertas/CSIRT Nacional - Adobe Acrobat Reader.png",
        "Alertas/CSIRT Nacional - Apache HttpClient.png",
        "Alertas/CSIRT Nacional - Ataque a cadeia de suprimentos a biblioteca Axios.png",
        "Alertas/CSIRT Nacional - Camaras inteligentes TP-Link Tapo C520WS .png",
        "Alertas/CSIRT Nacional - Drupal XSS.png",
        "Alertas/CSIRT Nacional - Microsoft Defender Antimalware Previlegios.png",
        "Alertas/CSIRT Nacional - Microsoft-AspNetCore.png",
        "Alertas/CSIRT Nacional - MongoDB_vuln.png",
        "Alertas/CSIRT Nacional - OpenSSH_vuln.png",
        "Alertas/CSIRT Nacional - OpenSSL 3.x.png",
        "Alertas/CSIRT Nacional - Plugin Plapfmatters Wordpress.png",
        "Alertas/CSIRT Nacional - Zimbra Collaboration Suite XSS.png",
        "Alertas/CSIRT Nacional - kernel do Linux.png",
        "Alertas/CSIRT Nacional -Notepad_vulnarabilidade.png",
        "Alertas/CSIRT Nacional -cPanel_vuln.png"
    ];

    const track = document.getElementById('carouselTrack');
    const nav = document.getElementById('carouselNav');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Initialize the carousel DOM elements
    banners.forEach((bannerSrc, index) => {
        // Create slide
        const li = document.createElement('li');
        li.classList.add('carousel-slide');
        
        const img = document.createElement('img');
        img.src = bannerSrc;
        img.alt = `Alerta de Segurança ${index + 1}`;
        img.loading = index === 0 ? 'eager' : 'lazy'; // Lazy load for off-screen images
        
        li.appendChild(img);
        track.appendChild(li);
        
        // Create indicator dot
        const dot = document.createElement('button');
        dot.classList.add('carousel-indicator');
        if (index === 0) dot.classList.add('current-slide');
        dot.setAttribute('aria-label', `Slide ${index + 1}`);
        dot.dataset.index = index;
        
        nav.appendChild(dot);
    });

    const slides = Array.from(track.children);
    const dots = Array.from(nav.children);
    let currentIndex = 0;
    
    // Auto slide interval variable
    let slideInterval;

    // Functions to move slides
    const updateCarousel = (index) => {
        // Move track
        track.style.transform = `translateX(-${index * 100}%)`;
        
        // Update dots
        dots.forEach(dot => dot.classList.remove('current-slide'));
        dots[index].classList.add('current-slide');
        
        currentIndex = index;
    };

    const nextSlide = () => {
        let newIndex = currentIndex + 1;
        if (newIndex >= slides.length) {
            newIndex = 0;
        }
        updateCarousel(newIndex);
    };

    const prevSlide = () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) {
            newIndex = slides.length - 1;
        }
        updateCarousel(newIndex);
    };

    // Event Listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    nav.addEventListener('click', (e) => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;
        
        const targetIndex = parseInt(targetDot.dataset.index);
        updateCarousel(targetIndex);
        resetInterval();
    });

    // Auto-slide functionality
    let isPaused = false;
    const pauseBtn = document.getElementById('pauseBtn');
    const pauseIcon = document.getElementById('pauseIcon');

    const startInterval = () => {
        if (!isPaused) {
            slideInterval = setInterval(nextSlide, 5000);
        }
    };

    const resetInterval = () => {
        clearInterval(slideInterval);
        startInterval();
    };

    const setPaused = (paused) => {
        isPaused = paused;
        if (isPaused) {
            clearInterval(slideInterval);
            pauseBtn.classList.add('paused');
            pauseIcon.className = 'fa-solid fa-play'; // mostra ícone de play
            pauseBtn.setAttribute('aria-label', 'Retomar carrossel');
        } else {
            startInterval();
            pauseBtn.classList.remove('paused');
            pauseIcon.className = 'fa-solid fa-pause'; // mostra ícone de pausa
            pauseBtn.setAttribute('aria-label', 'Pausar carrossel');
        }
    };

    pauseBtn.addEventListener('click', () => {
        setPaused(!isPaused);
    });

    // ===== MODAL / LIGHTBOX COM ZOOM E PAN =====
    const modal         = document.getElementById('imageModal');
    const modalImg      = document.getElementById('fullImage');
    const imgContainer  = document.getElementById('modalImageContainer');
    const zoomLabel     = document.getElementById('zoomLabel');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const zoomInBtn     = document.getElementById('zoomInBtn');
    const zoomOutBtn    = document.getElementById('zoomOutBtn');
    const zoomResetBtn  = document.getElementById('zoomResetBtn');

    const ZOOM_STEP = 0.25;
    const ZOOM_MIN  = 0.5;
    const ZOOM_MAX  = 5;

    // Estado do zoom e pan (totalmente baseado em transform, sem scroll)
    let scale = 1;
    let tx = 0, ty = 0;      // translação em píxeis
    let isDragging = false;
    let lastMouseX = 0, lastMouseY = 0;

    /**
     * Aplica o transform à imagem e actualiza o label de percentagem.
     * NOTA: translate ANTES de scale garante que a translação é em
     * coordenadas do contentor (não escaladas), o que torna o pan intuitivo.
     */
    const applyTransform = () => {
        modalImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
        zoomLabel.textContent = Math.round(scale * 100) + '%';
        imgContainer.style.cursor = isDragging ? 'grabbing' : (scale > 1 ? 'grab' : 'zoom-in');
    };

    const resetTransform = () => {
        scale = 1; tx = 0; ty = 0;
        applyTransform();
    };

    const openModal = (src) => {
        resetTransform();
        modalImg.src = src;
        modal.style.display = 'flex';
        // Bloqueia scroll da página enquanto o modal está aberto
        document.body.style.overflow = 'hidden';
        setTimeout(() => modal.classList.add('show'), 10);
        clearInterval(slideInterval);
    };

    const closeModalFunc = () => {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restaura scroll da página
        setTimeout(() => { modal.style.display = 'none'; }, 250);
        if (!isPaused) resetInterval();
    };

    // Abrir modal ao clicar numa imagem do carrossel
    track.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') openModal(e.target.src);
    });

    closeModalBtn.addEventListener('click', closeModalFunc);

    // ----- ZOOM com botões da toolbar -----
    const changeScale = (newScale, originX, originY) => {
        // originX/Y são as coordenadas do ponto de foco (centro se não especificado)
        const rect = imgContainer.getBoundingClientRect();
        const cx = (originX ?? rect.left + rect.width  / 2) - rect.left - rect.width  / 2;
        const cy = (originY ?? rect.top  + rect.height / 2) - rect.top  - rect.height / 2;
        const ratio = newScale / scale;
        // Ajusta a translação para que o ponto sob o cursor fique fixo
        tx = cx + ratio * (tx - cx);
        ty = cy + ratio * (ty - cy);
        scale = newScale;
        applyTransform();
    };

    zoomInBtn.addEventListener('click', () => {
        changeScale(Math.min(ZOOM_MAX, parseFloat((scale + ZOOM_STEP).toFixed(2))));
    });
    zoomOutBtn.addEventListener('click', () => {
        changeScale(Math.max(ZOOM_MIN, parseFloat((scale - ZOOM_STEP).toFixed(2))));
    });
    zoomResetBtn.addEventListener('click', resetTransform);

    // ----- ZOOM com roda do rato -----
    // Listener no modal inteiro para capturar mesmo antes de atingir o contentor
    modal.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
        const newScale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, parseFloat((scale + delta).toFixed(2))));
        changeScale(newScale, e.clientX, e.clientY);
    }, { passive: false });

    // ----- PAN / arrastar -----
    // Drag em qualquer direcção — funciona sempre porque usamos translate puro
    imgContainer.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // só botão esquerdo
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        applyTransform();
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        // Delta do rato em relação ao frame anterior → acumula na translação
        tx += e.clientX - lastMouseX;
        ty += e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        applyTransform();
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) { isDragging = false; applyTransform(); }
    });

    // Impede que o scroll do modal afecte a página (segurança extra)
    modal.addEventListener('scroll', (e) => e.preventDefault(), { passive: false });

    // ----- Teclas de atalho -----
    document.addEventListener('keydown', (e) => {
        const modalOpen = modal.style.display === 'flex';
        if (modalOpen) {
            if (e.key === 'Escape') closeModalFunc();
            if (e.key === '+' || e.key === '=') zoomInBtn.click();
            if (e.key === '-') zoomOutBtn.click();
            if (e.key === '0') zoomResetBtn.click();
        } else {
            if (e.key === 'ArrowLeft')  { prevSlide(); resetInterval(); }
            if (e.key === 'ArrowRight') { nextSlide(); resetInterval(); }
        }
    });

    // Start auto-slide
    startInterval();
});
