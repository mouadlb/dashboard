// Storage key for events
const EVENTS_STORAGE_KEY = 'admin_events';

// Sample events data
const sampleEvents = [
    {
        id: 1,
        title: "Tournoi Esport Marseille 2023",
        date: "2023-07-15",
        location: "Palais des Sports, Marseille",
        image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80",
        description: "Grand tournoi d'esport avec compétitions de CSGO, League of Legends et Fortnite. Prix à gagner: 10,000€. Venez participer ou assister aux matchs!"
    },
    {
        id: 2,
        title: "Workshop Game Design",
        date: "2023-08-22",
        location: "Médiathèque centrale, Lyon",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80",
        description: "Atelier de game design pour débutants et intermédiaires. Apprenez les bases de la conception de jeux vidéo avec nos experts."
    },
    {
        id: 3,
        title: "Conférence Gaming & Education",
        date: "2023-09-10",
        location: "Université Paris-Saclay, Paris",
        image: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80",
        description: "Une journée de conférences sur l'utilisation des jeux vidéo dans l'éducation. Rencontrez des chercheurs et des enseignants qui utilisent le gaming comme outil pédagogique."
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize events data if needed
    if (!localStorage.getItem(EVENTS_STORAGE_KEY)) {
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(sampleEvents));
    }
    
    // Load events
    loadEvents();
    
    // Event form handlers
    initEventForms();
});

// Load events into the table
function loadEvents() {
    const eventsData = JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY)) || [];
    const tableBody = document.getElementById('events-table-body');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (eventsData.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                Aucun événement trouvé. Cliquez sur "Ajouter un événement" pour commencer.
            </td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    eventsData.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="whitespace-nowrap">${event.title}</td>
            <td>${formatDate(event.date)}</td>
            <td>${event.location}</td>
            <td>
                <div class="flex space-x-2">
                    <button class="edit-event-btn p-1 text-blue-600 hover:text-blue-800" data-id="${event.id}">
                        <i data-lucide="edit" class="h-5 w-5"></i>
                    </button>
                    <button class="delete-event-btn p-1 text-red-600 hover:text-red-800" data-id="${event.id}">
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
    document.querySelectorAll('.edit-event-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const eventId = parseInt(btn.getAttribute('data-id'));
            editEvent(eventId);
        });
    });
    
    document.querySelectorAll('.delete-event-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const eventId = parseInt(btn.getAttribute('data-id'));
            const event = eventsData.find(e => e.id === eventId);
            showDeleteConfirmation('event', eventId, event.title);
        });
    });
}

// Initialize event forms
function initEventForms() {
    // Add event form toggle
    const addEventBtn = document.getElementById('add-event-button');
    const addEventForm = document.getElementById('add-event-form');
    const cancelEventBtn = document.getElementById('cancel-event-button');
    
    const editEventForm = document.getElementById('edit-event-form');
    const cancelEditEventBtn = document.getElementById('cancel-edit-event-button');
    
    addEventBtn?.addEventListener('click', () => {
        addEventForm.classList.remove('hidden');
        addEventForm.classList.add('show');
        editEventForm.classList.add('hidden');
    });
    
    cancelEventBtn?.addEventListener('click', () => {
        addEventForm.classList.add('hidden');
        document.getElementById('event-form').reset();
    });
    
    cancelEditEventBtn?.addEventListener('click', () => {
        editEventForm.classList.add('hidden');
        document.getElementById('edit-event-form-element').reset();
    });
    
    // Event form submission
    const eventForm = document.getElementById('event-form');
    eventForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newEvent = {
            id: Date.now(), // Use timestamp as ID
            title: document.getElementById('event-title').value,
            date: document.getElementById('event-date').value,
            location: document.getElementById('event-location').value,
            image: document.getElementById('event-image').value,
            description: document.getElementById('event-description').value
        };
        
        // Get existing events and add new one
        const events = JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY)) || [];
        events.push(newEvent);
        
        // Save to localStorage
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
        
        // Reset form and hide
        eventForm.reset();
        addEventForm.classList.add('hidden');
        
        // Reload events table
        loadEvents();
    });
    
    // Edit event form submission
    const editForm = document.getElementById('edit-event-form-element');
    editForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const eventId = parseInt(document.getElementById('edit-event-id').value);
        
        const updatedEvent = {
            id: eventId,
            title: document.getElementById('edit-event-title').value,
            date: document.getElementById('edit-event-date').value,
            location: document.getElementById('edit-event-location').value,
            image: document.getElementById('edit-event-image').value,
            description: document.getElementById('edit-event-description').value
        };
        
        // Get existing events and update the matching one
        let events = JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY)) || [];
        events = events.map(event => event.id === eventId ? updatedEvent : event);
        
        // Save to localStorage
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
        
        // Reset form and hide
        editForm.reset();
        editEventForm.classList.add('hidden');
        
        // Reload events table
        loadEvents();
    });
}

// Edit event
function editEvent(eventId) {
    const events = JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY)) || [];
    const event = events.find(e => e.id === eventId);
    
    if (!event) return;
    
    // Fill the edit form
    document.getElementById('edit-event-id').value = event.id;
    document.getElementById('edit-event-title').value = event.title;
    document.getElementById('edit-event-date').value = event.date;
    document.getElementById('edit-event-location').value = event.location;
    document.getElementById('edit-event-image').value = event.image;
    document.getElementById('edit-event-description').value = event.description;
    
    // Show edit form, hide add form
    document.getElementById('add-event-form').classList.add('hidden');
    const editForm = document.getElementById('edit-event-form');
    editForm.classList.remove('hidden');
    editForm.classList.add('show');
}

// Delete event
function deleteEvent(eventId) {
    let events = JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY)) || [];
    events = events.filter(event => event.id !== eventId);
    
    // Save to localStorage
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    
    // Reload events table
    loadEvents();
}
