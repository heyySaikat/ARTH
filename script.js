// Select all SVG icons with the 'like-icon' class
const likeIcons = document.querySelectorAll('.like-icon');

// Function to change the SVG icon color to green on click
function changeIconColor(event) {
  // Change the source of the clicked icon to the green version
  event.target.src = '/resoucesImg/leaf-svgrepo-com(green).svg';
}

// Add click event listeners to each icon
likeIcons.forEach(icon => {
  icon.addEventListener('click', changeIconColor);
});





const leaderBrd = document.getElementById('leaderBrd');
const popup = document.getElementById('popup');
const closePopupButton = document.getElementById('closePopup');

// Function to open the popup
function openPopup() {
  popup.classList.remove('hidden');
}

// Function to close the popup
function closePopup() {
  popup.classList.add('hidden');
}

// Event listeners
leaderBrd.addEventListener('click', openPopup);
closePopupButton.addEventListener('click', closePopup);

// Close popup if clicking outside of the content
popup.addEventListener('click', (e) => {
  if (e.target === popup) {
    closePopup();
  }
});



