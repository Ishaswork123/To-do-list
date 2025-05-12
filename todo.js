 const notesContainer = document.getElementById('notesContainer');
        const addNoteBtn = document.getElementById('addNote');
        const noteTemplate = document.getElementById('noteTemplate');
        const emptyState = document.getElementById('emptyState');
        
        // Load notes from localStorage on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadNotes();
        });
        
        // Add event listener for the add note button
        addNoteBtn.addEventListener('click', function() {
            createNewNote();
        });
        
        // Toggle dropdown menu
        function toggleDropdown() {
            document.getElementById("myDropdown").classList.toggle("show");
        }
        
        // Close dropdown when clicking outside
        window.onclick = function(event) {
            if (!event.target.matches('.dropdown-toggle')) {
                const dropdowns = document.getElementsByClassName("dropdown-content");
                for (let i = 0; i < dropdowns.length; i++) {
                    const openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        }
        
        // Create a new note
        function createNewNote() {
            // Hide empty state if visible
            emptyState.style.display = 'none';
            
            // Clone the template
            const noteClone = document.importNode(noteTemplate.content, true);
            const noteElement = noteClone.querySelector('.note');
            
            // Generate a unique ID for the note
            const noteId = 'note-' + Date.now();
            noteElement.dataset.id = noteId;
            
            // Add the note to the container
            notesContainer.appendChild(noteClone);
            
            // Add event listener to save content when it changes
            const noteContent = noteElement.querySelector('.note-content');
            noteContent.addEventListener('input', function() {
                saveNotes();
            });
            
            // Save the new note
            saveNotes();
            
            // Focus on the new note
            noteContent.focus();
        }
        
        // Delete a specific note
        function deleteNote(button) {
            const note = button.closest('.note');
            note.remove();
            saveNotes();
            
            // Show empty state if no notes left
            if (notesContainer.querySelectorAll('.note').length === 0) {
                emptyState.style.display = 'block';
            }
        }
        
        // Delete all notes
        function deleteAllNotes() {
            if (confirm('Are you sure you want to delete all notes?')) {
                const notes = notesContainer.querySelectorAll('.note');
                notes.forEach(note => note.remove());
                saveNotes();
                emptyState.style.display = 'block';
            }
        }
        
        // Show all notes (already visible, but could be used for filtering in the future)
        function showAllNotes() {
            loadNotes();
        }
        
        // Save notes to localStorage
        function saveNotes() {
            const notes = notesContainer.querySelectorAll('.note');
            const notesData = [];
            
            notes.forEach(note => {
                notesData.push({
                    id: note.dataset.id,
                    content: note.querySelector('.note-content').innerHTML
                });
            });
            
            localStorage.setItem('todoNotes', JSON.stringify(notesData));
        }
        
        // Load notes from localStorage
        function loadNotes() {
            const savedNotes = localStorage.getItem('todoNotes');
            
            if (savedNotes) {
                const notesData = JSON.parse(savedNotes);
                
                // Clear existing notes
                const existingNotes = notesContainer.querySelectorAll('.note');
                existingNotes.forEach(note => note.remove());
                
                if (notesData.length > 0) {
                    emptyState.style.display = 'none';
                    
                    // Add each saved note
                    notesData.forEach(noteData => {
                        const noteClone = document.importNode(noteTemplate.content, true);
                        const noteElement = noteClone.querySelector('.note');
                        
                        noteElement.dataset.id = noteData.id;
                        noteElement.querySelector('.note-content').innerHTML = noteData.content;
                        
                        notesContainer.appendChild(noteClone);
                        
                        // Add event listener to save content when it changes
                        const noteContent = noteElement.querySelector('.note-content');
                        noteContent.addEventListener('input', function() {
                            saveNotes();
                        });
                    });
                } else {
                    emptyState.style.display = 'block';
                }
            }
        }
        
        // Text formatting functions
        function formatText(command) {
            document.execCommand(command, false, null);
            saveNotes();
        }
        
        function changeFont(fontName) {
            document.execCommand('fontName', false, fontName);
            saveNotes();
        }