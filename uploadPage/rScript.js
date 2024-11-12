document.getElementById("uploadForm").onsubmit = async function (e) {
  e.preventDefault();
  const fileInput = document.getElementById("photoUpload").files[0];
  const commentText = document.getElementById("commentBox").value;

  if (fileInput) {
      const reader = new FileReader();

      reader.onload = function(event) {
          const base64String = event.target.result;
          saveToLocal(base64String, commentText);
          displayStoredPhotosAndComments();
          resetForm(); // Clear form fields after successful upload
      };

      reader.readAsDataURL(fileInput);
  } else {
      alert("Please select a photo to upload."); // Alert if no file is selected
  }
};

function saveToLocal(photo, comment) {
  const photosData = JSON.parse(localStorage.getItem("photosData")) || [];
  photosData.push({ photo, comment, date: new Date().toLocaleString() });
  localStorage.setItem("photosData", JSON.stringify(photosData));
}

function displayStoredPhotosAndComments() {
  const photosData = JSON.parse(localStorage.getItem("photosData")) || [];
  const commentDisplay = document.getElementById("commentDisplay");
  commentDisplay.innerHTML = ''; // Clear existing content

  photosData.forEach(data => {
      const photoDiv = document.createElement("div");
      photoDiv.className = "photo-entry";

      if (data.photo) {
          const img = document.createElement("img");
          img.src = data.photo;
          img.alt = "Uploaded photo";
          photoDiv.appendChild(img);
      }

      const comment = document.createElement("p");
      comment.textContent = data.comment || "No comment provided";
      photoDiv.appendChild(comment);

      const date = document.createElement("small");
      date.textContent = `Uploaded on: ${data.date}`;
      photoDiv.appendChild(date);

      commentDisplay.appendChild(photoDiv);
  });
}

function submitComment() {
  const commentText = document.getElementById("commentBox").value;
  if (commentText) {
      saveToLocal('', commentText); // Save comment without photo
      displayStoredPhotosAndComments();
      resetCommentBox(); // Clear the comment box after submission
  } else {
      alert("Please enter a comment."); // Alert if comment box is empty
  }
}

function resetForm() {
  document.getElementById("uploadForm").reset();
  document.getElementById("commentBox").value = ''; // Clear comment box
}

function resetCommentBox() {
  document.getElementById("commentBox").value = ''; // Clear only the comment box
}

// Display photos and comments on page load
window.onload = displayStoredPhotosAndComments;