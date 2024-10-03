//--------------------------------video container--------------------------------

let videos = document.querySelectorAll("video");
let currentVideoIndex = 0;

function playNextVideo() {
    videos[currentVideoIndex].style.display = "none"; // Hide current video
    currentVideoIndex = (currentVideoIndex + 1) % videos.length; // Move to next video
    videos[currentVideoIndex].style.display = "block"; // Show next video
    videos[currentVideoIndex].play(); // Play the next video
}
// Set each video to play next on ended
videos.forEach((video) => {
    video.addEventListener("ended", playNextVideo);
});

// Start with the first video
videos[currentVideoIndex].play();

//----------------------------------hamburger menu--------------------------------------------------------------
//--------------------------------button--------------------------------

document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll('.tab-button');
    const grids = document.querySelectorAll('.grid');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');

            // Hide all grids
            grids.forEach(grid => {
                grid.style.display = 'none';
            });

            // Show the selected grid
            const selectedGrid = document.getElementById(target);
            if (selectedGrid) {
                selectedGrid.style.display = 'grid';
            }
        });
    });
});
//-------------------------------- container--------------------

//--------------------------------join page--------------------------------
document.getElementById('joinForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Basic form validation
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const paymentId = document.getElementById('payment-id').value;

    if (name === '' || email === '' || paymentId === '') {
        alert('Please fill in all required fields.');
        return;
    }

    // Placeholder for further actions, like sending data to backend
    alert('Form submitted successfully. You will receive a confirmation email soon!');

    // Reset the form after submission
    this.reset();
});

