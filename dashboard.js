document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize navigation
    initNavigation();
    
    // Show initial section (events by default)
    showSection('events');
    
    // Handle mobile menu
    initMobileMenu();
    
    // Initialize delete modal
    initDeleteModal();
});

function initNavigation() {
    // Desktop navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show corresponding section
            showSection(section);
        });
    });
    
    // Mobile navigation
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            
            // Update active state
            mobileNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show corresponding section
            showSection(section);
            
            // Close mobile menu
            document.getElementById('mobile-menu').classList.add('hidden');
        });
    });
    
    // Handle hash navigation
    if (window.location.hash) {
        const section = window.location.hash.substring(1);
        if (document.getElementById(`${section}-section`)) {
            showSection(section);
            
            // Update active state
            navLinks.forEach(l => {
                if (l.getAttribute('data-section') === section) {
                    l.classList.add('active');
                } else {
                    l.classList.remove('active');
                }
            });
        }
    }
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show requested section
    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    // Update URL hash without scrolling
    const scrollPosition = window.scrollY;
    window.location.hash = sectionId;
    window.scrollTo(0, scrollPosition);
}

function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    
    mobileMenuButton?.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
    });
    
    mobileMenuClose?.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    });
}

function initDeleteModal() {
    const deleteModal = document.getElementById('delete-modal');
    const cancelDelete = document.getElementById('cancel-delete');
    
    // Close the modal when cancel is clicked
    cancelDelete?.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
    });
    
    // Close the modal when clicking outside
    deleteModal?.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            deleteModal.classList.add('hidden');
        }
    });
}

// Format date helper
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format date for input field (yyyy-mm-dd)
function formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Show delete confirmation modal
function showDeleteConfirmation(type, id, name) {
    const deleteModal = document.getElementById('delete-modal');
    const deleteMessage = document.getElementById('delete-message');
    const confirmDelete = document.getElementById('confirm-delete');
    
    deleteMessage.textContent = `Êtes-vous sûr de vouloir supprimer "${name}" ?`;
    
    // Clear previous event listener
    const newConfirmBtn = confirmDelete.cloneNode(true);
    confirmDelete.parentNode.replaceChild(newConfirmBtn, confirmDelete);
    
    // Add the appropriate delete function
    newConfirmBtn.addEventListener('click', () => {
        if (type === 'event') {
            deleteEvent(id);
        } else if (type === 'clip') {
            deleteClip(id);
        } else if (type === 'sponsor') {
            deleteSponsor(id);
        }
        deleteModal.classList.add('hidden');
    });
    
    // Show modal
    deleteModal.classList.remove('hidden');
}

// Truncate text helper
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
