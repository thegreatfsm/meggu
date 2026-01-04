// Load captions and photos
async function loadGallery() {
    try {
        const response = await fetch('captions.json');
        const data = await response.json();

        // Set title
        document.getElementById('gallery-title').textContent = data.title;

        // Create photo cards
        const timeline = document.getElementById('timeline');
        data.photos.forEach((photo, index) => {
            const card = createPhotoCard(photo, index + 1);
            timeline.appendChild(card);
        });

        // Initialize drag functionality
        initDragScroll();

    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

function createPhotoCard(photo, number) {
    const card = document.createElement('div');
    card.className = 'photo-card';

    card.innerHTML = `
        <div class="photo-wrapper">
            <img
                src="photos/${photo.filename}"
                alt="${photo.caption}"
                class="photo-img"
                loading="lazy"
                data-caption="${photo.caption}"
            >
            <div class="caption-overlay">
                ${photo.caption}
            </div>
        </div>
    `;

    // Add click handler for lightbox
    const img = card.querySelector('.photo-img');
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(photo.filename, photo.caption);
    });

    return card;
}

function initDragScroll() {
    const slider = document.querySelector('.timeline-wrapper');

    // Only enable drag on desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!isMobile) {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    }
}

// Lightbox functionality
function openLightbox(filename, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    lightboxImg.src = `photos/${filename}`;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close lightbox on click
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');

    lightbox.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', closeLightbox);

    // Prevent closing when clicking the image
    document.getElementById('lightbox-img').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    loadGallery();
});
