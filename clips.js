// Storage key for clips
const CLIPS_STORAGE_KEY = 'admin_clips';

// Sample clips data
const sampleClips = [
    {
        id: 1,
        title: "Victoire épique en finale",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80",
        author: "GameMaster_42",
        description: "Une victoire incroyable lors de la finale du tournoi de League of Legends 2023."
    },
    {
        id: 2,
        title: "Meilleur play de la saison",
        url: "https://www.twitch.tv/videos/1234567890",
        thumbnail: "https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80",
        author: "ProGamer99",
        description: "Ce joueur a réalisé le meilleur play que nous ayons jamais vu en compétition de CSGO."
    },
    {
        id: 3,
        title: "Interview exclusive",
        url: "https://www.youtube.com/watch?v=abcdefghijk",
        thumbnail: "https://images.unsplash.com/photo-1559102877-4a2cc0e37fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80",
        author: "ESportNews",
        description: "Interview exclusive avec le champion du dernier tournoi de Fortnite."
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize clips data if needed
    if (!localStorage.getItem(CLIPS_STORAGE_KEY)) {
        localStorage.setItem(CLIPS_STORAGE_KEY, JSON.stringify(sampleClips));
    }
    
    // Load clips
    loadClips();
    
    // Clip form handlers
    initClipForms();
});

// Load clips into the table
function loadClips() {
    const clipsData = JSON.parse(localStorage.getItem(CLIPS_STORAGE_KEY)) || [];
    const tableBody = document.getElementById('clips-table-body');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (clipsData.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                Aucun clip trouvé. Cliquez sur "Ajouter un clip" pour commencer.
            </td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    clipsData.forEach(clip => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="flex items-center">
                    <img src="${clip.thumbnail}" alt="${clip.title}" class="clip-thumbnail mr-3">
                    <span>${truncateText(clip.title, 30)}</span>
                </div>
            </td>
            <td>${clip.author}</td>
            <td>
                <a href="${clip.url}" target="_blank" class="text-blue-600 hover:text-blue-800 flex items-center">
                    <i data-lucide="external-link" class="h-4 w-4 mr-1"></i>
                    ${truncateText(clip.url, 25)}
                </a>
            </td>
            <td>
                <div class="flex space-x-2">
                    <button class="edit-clip-btn p-1 text-blue-600 hover:text-blue-800" data-id="${clip.id}">
                        <i data-lucide="edit" class="h-5 w-5"></i>
                    </button>
                    <button class="delete-clip-btn p-1 text-red-600 hover:text-red-800" data-id="${clip.id}">
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
    document.querySelectorAll('.edit-clip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const clipId = parseInt(btn.getAttribute('data-id'));
            editClip(clipId);
        });
    });
    
    document.querySelectorAll('.delete-clip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const clipId = parseInt(btn.getAttribute('data-id'));
            const clip = clipsData.find(c => c.id === clipId);
            showDeleteConfirmation('clip', clipId, clip.title);
        });
    });
}

// Initialize clip forms
function initClipForms() {
    // Add clip form toggle
    const addClipBtn = document.getElementById('add-clip-button');
    const addClipForm = document.getElementById('add-clip-form');
    const cancelClipBtn = document.getElementById('cancel-clip-button');
    
    const editClipForm = document.getElementById('edit-clip-form');
    const cancelEditClipBtn = document.getElementById('cancel-edit-clip-button');
    
    addClipBtn?.addEventListener('click', () => {
        addClipForm.classList.remove('hidden');
        addClipForm.classList.add('show');
        editClipForm.classList.add('hidden');
    });
    
    cancelClipBtn?.addEventListener('click', () => {
        addClipForm.classList.add('hidden');
        document.getElementById('clip-form').reset();
    });
    
    cancelEditClipBtn?.addEventListener('click', () => {
        editClipForm.classList.add('hidden');
        document.getElementById('edit-clip-form-element').reset();
    });
    
    // Clip form submission
    const clipForm = document.getElementById('clip-form');
    clipForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newClip = {
            id: Date.now(), // Use timestamp as ID
            title: document.getElementById('clip-title').value,
            url: document.getElementById('clip-url').value,
            thumbnail: document.getElementById('clip-thumbnail').value,
            author: document.getElementById('clip-author').value,
            description: document.getElementById('clip-description').value
        };
        
        // Get existing clips and add new one
        const clips = JSON.parse(localStorage.getItem(CLIPS_STORAGE_KEY)) || [];
        clips.push(newClip);
        
        // Save to localStorage
        localStorage.setItem(CLIPS_STORAGE_KEY, JSON.stringify(clips));
        
        // Reset form and hide
        clipForm.reset();
        addClipForm.classList.add('hidden');
        
        // Reload clips table
        loadClips();
    });
    
    // Edit clip form submission
    const editForm = document.getElementById('edit-clip-form-element');
    editForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const clipId = parseInt(document.getElementById('edit-clip-id').value);
        
        const updatedClip = {
            id: clipId,
            title: document.getElementById('edit-clip-title').value,
            url: document.getElementById('edit-clip-url').value,
            thumbnail: document.getElementById('edit-clip-thumbnail').value,
            author: document.getElementById('edit-clip-author').value,
            description: document.getElementById('edit-clip-description').value
        };
        
        // Get existing clips and update the matching one
        let clips = JSON.parse(localStorage.getItem(CLIPS_STORAGE_KEY)) || [];
        clips = clips.map(clip => clip.id === clipId ? updatedClip : clip);
        
        // Save to localStorage
        localStorage.setItem(CLIPS_STORAGE_KEY, JSON.stringify(clips));
        
        // Reset form and hide
        editForm.reset();
        editClipForm.classList.add('hidden');
        
        // Reload clips table
        loadClips();
    });
}

// Edit clip
function editClip(clipId) {
    const clips = JSON.parse(localStorage.getItem(CLIPS_STORAGE_KEY)) || [];
    const clip = clips.find(c => c.id === clipId);
    
    if (!clip) return;
    
    // Fill the edit form
    document.getElementById('edit-clip-id').value = clip.id;
    document.getElementById('edit-clip-title').value = clip.title;
    document.getElementById('edit-clip-url').value = clip.url;
    document.getElementById('edit-clip-thumbnail').value = clip.thumbnail;
    document.getElementById('edit-clip-author').value = clip.author;
    document.getElementById('edit-clip-description').value = clip.description;
    
    // Show edit form, hide add form
    document.getElementById('add-clip-form').classList.add('hidden');
    const editForm = document.getElementById('edit-clip-form');
    editForm.classList.remove('hidden');
    editForm.classList.add('show');
}

// Delete clip
function deleteClip(clipId) {
    let clips = JSON.parse(localStorage.getItem(CLIPS_STORAGE_KEY)) || [];
    clips = clips.filter(clip => clip.id !== clipId);
    
    // Save to localStorage
    localStorage.setItem(CLIPS_STORAGE_KEY, JSON.stringify(clips));
    
    // Reload clips table
    loadClips();
}
