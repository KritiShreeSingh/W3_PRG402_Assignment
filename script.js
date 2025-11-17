$(document).ready(function() {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentEditId = null;
    let currentTheme = localStorage.getItem('theme') || 'light';

    initApp();

    function initApp() {
        setTheme(currentTheme);
        updateStats();
        renderNotes();
        setupEventListeners();
        checkEmptyState();
    }

    function setupEventListeners() {
        $('#saveNote').click(handleSaveNote);
        $('#clearForm').click(clearForm);
        $('#searchInput').on('input', handleSearch);
        $('#sortSelect').change(handleSort);
        $('#closeModal, #cancelEdit').click(closeModal);
        $('#updateNote').click(handleUpdateNote);
        $('#themeIcon').click(toggleTheme);
        $('#createFirstNote').click(()=>$('#noteTitle').focus());
        $('#noteTitle, #noteContent, #noteTags').keypress(function(e){
            if(e.which===13 && !e.shiftKey){ e.preventDefault(); handleSaveNote();}
        });
    }

    function handleSaveNote(){
        const title=$('#noteTitle').val().trim();
        const content=$('#noteContent').val().trim();
        const tags=$('#noteTags').val().split(',').map(t=>t.trim()).filter(t=>t);
        if(!title || !content){ showNotification('Please add both title and content!','warning'); return; }
        const newNote={id:Date.now(),title,content,tags,date:new Date().toISOString(),pinned:false};
        notes.unshift(newNote);
        saveNotes(); updateStats(); renderNotes(); clearForm(); checkEmptyState();
        showNotification('Note added successfully!','success');
    }

    function editNote(id){
        const note=notes.find(n=>n.id===id);
        if(note){ $('#editTitle').val(note.title); $('#editContent').val(note.content); $('#editTags').val(note.tags.join(', ')); currentEditId=id; $('#editModal').addClass('active'); }
    }

    function handleUpdateNote(){
        if(!currentEditId) return;
        const title=$('#editTitle').val().trim();
        const content=$('#editContent').val().trim();
        const tags=$('#editTags').val().split(',').map(t=>t.trim()).filter(t=>t);
        if(!title || !content){ showNotification('Please add both title and content!','warning'); return; }
        const idx=notes.findIndex(n=>n.id===currentEditId);
        if(idx!==-1){ notes[idx].title=title; notes[idx].content=content; notes[idx].tags=tags; notes[idx].date=new Date().toISOString(); saveNotes(); updateStats(); renderNotes(); closeModal(); showNotification('Note updated successfully!','success'); }
    }

    function deleteNote(id){ if(confirm('Are you sure you want to delete this note?')){ notes=notes.filter(n=>n.id!==id); saveNotes(); updateStats(); renderNotes(); checkEmptyState(); showNotification('Note deleted successfully!','success'); } }

    function togglePin(id){ const idx=notes.findIndex(n=>n.id===id); if(idx!==-1){ notes[idx].pinned=!notes[idx].pinned; saveNotes(); renderNotes(); const action
