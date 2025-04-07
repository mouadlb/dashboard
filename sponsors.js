// Storage key for sponsors
const SPONSORS_STORAGE_KEY = 'admin_sponsors';

// Sample sponsors data
const sampleSponsors = [
    {
        id: 1,
        name: "TechGiant",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        website: "https://example.com/techgiant",
        level: "platinum",
        description: "Leader mondial des technologies de gaming et partenaire officiel de nos tournois."
    },
    {
        id: 2,
        name: "GameFuel",
        logo: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        website: "https://example.com/gamefuel",
        level: "gold",
        description: "Boisson énergétique conçue spécifiquement pour les gamers professionnels."
    },
    {
        id: 3,
        name: "ProGear",
        logo: "https://images.unsplash.com/photo-1618762044398-ec1e7e048bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        website: "https://example.com/progear",
        level: "silver",
        description: "Équipement de gaming haute performance pour les joueurs exigeants."
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sponsors data if needed
    if (!localStorage.getItem(SPONSORS_STORAGE_KEY)) {
        localStorage.setItem(SPONSORS_STORAGE_KEY, JSON.stringify(sampleSponsors));
    }
    
    // Load sponsors
    loadSponsors();
    
    // Sponsor form handlers
    initSponsorForms();
});

// Load sponsors into the table
function loadSponsors() {
    const sponsorsData = JSON.parse(localStorage.getItem(SPONSORS_STORAGE_KEY)) || [];
    const tableBody = document.getElementById('sponsors-table-body');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (sponsorsData.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                Aucun sponsor trouvé. Cliquez sur "Ajouter un sponsor" pour commencer.
            </td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    sponsorsData.forEach(sponsor => {
        const row = document.createElement('tr');
        
        // Format level badge
        let levelBadge = '';
        switch(sponsor.level) {
            case 'platinum':
                levelBadge = '<span class="sponsor-badge sponsor-badge-platinum">Platinum</span>';
                break;
            case 'gold':
                levelBadge = '<span class="sponsor-badge sponsor-badge-gold">Gold</span>';
                break;
            case 'silver':
                levelBadge = '<span class="sponsor-badge sponsor-badge-silver">Silver</span>';
                break;
            case 'bronze':
                levelBadge = '<span class="sponsor-badge sponsor-badge-bronze">Bronze</span>';
                break;
            default:
                levelBadge = '<span class="sponsor-badge sponsor-badge-silver">Standard</span>';
        }
        
        row.innerHTML = `
            <td>
                <div class="flex items-center">
                    <img src="${sponsor.logo}" alt="${sponsor.name}" class="sponsor-logo mr-3">
                    <span>${sponsor.name}</span>
                </div>
            </td>
            <td>${levelBadge}</td>
            <td>
                <a href="${sponsor.website}" target="_blank" class="text-blue-600 hover:text-blue-800 flex items-center">
                    <i data-lucide="external-link" class="h-4 w-4 mr-1"></i>
                    ${truncateText(sponsor.website, 25)}
                </a>
            </td>
            <td>
                <div class="flex space-x-2">
                    <button class="edit-sponsor-btn p-1 text-blue-600 hover:text-blue-800" data-id="${sponsor.id}">
                        <i data-lucide="edit" class="h-5 w-5"></i>
                    </button>
                    <button class="delete-sponsor-btn p-1 text-red-600 hover:text-red-800" data-id="${sponsor.id}">
                        <i data-lucide="trash-2" class="h-5 w-5"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Initialize Lucide icons in the table
    lucide.createIcons();
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-sponsor-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sponsorId = parseInt(btn.getAttribute('data-id'));
            editSponsor(sponsorId);
        });
    });
    
    document.querySelectorAll('.delete-sponsor-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sponsorId = parseInt(btn.getAttribute('data-id'));
            const sponsor = sponsorsData.find(s => s.id === sponsorId);
            showDeleteConfirmation('sponsor', sponsorId, sponsor.name);
        });
    });
}

// Initialize sponsor forms
function initSponsorForms() {
    // Add sponsor form toggle
    const addSponsorBtn = document.getElementById('add-sponsor-button');
    const addSponsorForm = document.getElementById('add-sponsor-form');
    const cancelSponsorBtn = document.getElementById('cancel-sponsor-button');
    
    const editSponsorForm = document.getElementById('edit-sponsor-form');
    const cancelEditSponsorBtn = document.getElementById('cancel-edit-sponsor-button');
    
    addSponsorBtn?.addEventListener('click', () => {
        addSponsorForm.classList.remove('hidden');
        addSponsorForm.classList.add('show');
        editSponsorForm.classList.add('hidden');
    });
    
    cancelSponsorBtn?.addEventListener('click', () => {
        addSponsorForm.classList.add('hidden');
        document.getElementById('sponsor-form').reset();
    });
    
    cancelEditSponsorBtn?.addEventListener('click', () => {
        editSponsorForm.classList.add('hidden');
        document.getElementById('edit-sponsor-form-element').reset();
    });
    
    // Sponsor form submission
    const sponsorForm = document.getElementById('sponsor-form');
    sponsorForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newSponsor = {
            id: Date.now(), // Use timestamp as ID
            name: document.getElementById('sponsor-name').value,
            logo: document.getElementById('sponsor-logo').value,
            website: document.getElementById('sponsor-website').value,
            level: document.getElementById('sponsor-level').value,
            description: document.getElementById('sponsor-description').value
        };
        
        // Get existing sponsors and add new one
        const sponsors = JSON.parse(localStorage.getItem(SPONSORS_STORAGE_KEY)) || [];
        sponsors.push(newSponsor);
        
        // Save to localStorage
        localStorage.setItem(SPONSORS_STORAGE_KEY, JSON.stringify(sponsors));
        
        // Reset form and hide
        sponsorForm.reset();
        addSponsorForm.classList.add('hidden');
        
        // Reload sponsors table
        loadSponsors();
    });
    
    // Edit sponsor form submission
    const editForm = document.getElementById('edit-sponsor-form-element');
    editForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const sponsorId = parseInt(document.getElementById('edit-sponsor-id').value);
        
        const updatedSponsor = {
            id: sponsorId,
            name: document.getElementById('edit-sponsor-name').value,
            logo: document.getElementById('edit-sponsor-logo').value,
            website: document.getElementById('edit-sponsor-website').value,
            level: document.getElementById('edit-sponsor-level').value,
            description: document.getElementById('edit-sponsor-description').value
        };
        
        // Get existing sponsors and update the matching one
        let sponsors = JSON.parse(localStorage.getItem(SPONSORS_STORAGE_KEY)) || [];
        sponsors = sponsors.map(sponsor => sponsor.id === sponsorId ? updatedSponsor : sponsor);
        
        // Save to localStorage
        localStorage.setItem(SPONSORS_STORAGE_KEY, JSON.stringify(sponsors));
        
        // Reset form and hide
        editForm.reset();
        editSponsorForm.classList.add('hidden');
        
        // Reload sponsors table
        loadSponsors();
    });
}

// Edit sponsor
function editSponsor(sponsorId) {
    const sponsors = JSON.parse(localStorage.getItem(SPONSORS_STORAGE_KEY)) || [];
    const sponsor = sponsors.find(s => s.id === sponsorId);
    
    if (!sponsor) return;
    
    // Fill the edit form
    document.getElementById('edit-sponsor-id').value = sponsor.id;
    document.getElementById('edit-sponsor-name').value = sponsor.name;
    document.getElementById('edit-sponsor-logo').value = sponsor.logo;
    document.getElementById('edit-sponsor-website').value = sponsor.website;
    document.getElementById('edit-sponsor-level').value = sponsor.level;
    document.getElementById('edit-sponsor-description').value = sponsor.description;
    
    // Show edit form, hide add form
    document.getElementById('add-sponsor-form').classList.add('hidden');
    const editForm = document.getElementById('edit-sponsor-form');
    editForm.classList.remove('hidden');
    editForm.classList.add('show');
}

// Delete sponsor
function deleteSponsor(sponsorId) {
    let sponsors = JSON.parse(localStorage.getItem(SPONSORS_STORAGE_KEY)) || [];
    sponsors = sponsors.filter(sponsor => sponsor.id !== sponsorId);
    
    // Save to localStorage
    localStorage.setItem(SPONSORS_STORAGE_KEY, JSON.stringify(sponsors));
    
    // Reload sponsors table
    loadSponsors();
}
