document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.buttons button');
    const handleClick = (e) => {
        const buttonId = e.target.id; //konsa button select kiya h
        const targetSectionId = buttonId + '1';        
        // Hide all sections by default
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.display = 'none';
        });
        // Show the clicked section
        const targetSection = document.getElementById(targetSectionId);
        targetSection.style.display = 'block';
    };
    buttons.forEach(btn => {
        btn.addEventListener('click', handleClick);
    });

    // script.js

document.getElementById("toggle").addEventListener("click", function() {
    // Get the body element
    const body = document.body;

    // Toggle between dark-mode and day-mode classes
    if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
        body.classList.add("day-mode");
        this.textContent = "Switch to Dark Mode";
    } else {
        body.classList.remove("day-mode");
        body.classList.add("dark-mode");
        this.textContent = "Switch to Day Mode";
    }
});


});
