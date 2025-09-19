document.getElementById('btn').addEventListener('click', async () => {
  const prompt = document.getElementById('input').value.trim();
  if (!prompt) {
    alert('Please enter a prompt');
    return;
  }

  const imageEl = document.getElementById('image');
  const loadingSpinner = document.getElementById('loading-spinner');
  const placeholderText = document.getElementById('placeholder-text');

  // Hide image and placeholder, show loading
  imageEl.style.display = 'none';
  placeholderText.style.display = 'none';
  loadingSpinner.style.display = 'flex';

  try {
    const response = await fetch("http://127.0.0.1:5000/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate image.");
    }

    const data = await response.json();

    if (data.imageData) {
      // Hide loading, show image
      loadingSpinner.style.display = 'none';
      imageEl.src = `data:image/jpeg;base64,${data.imageData}`;
      imageEl.style.display = 'block';
    } else {
      throw new Error("Image generation failed.");
    }

  } catch (err) {
    console.error("Error:", err);
    alert("Error: " + err.message);
    
    // Hide loading, show placeholder on error
    loadingSpinner.style.display = 'none';
    placeholderText.style.display = 'flex';
    imageEl.style.display = 'none';
  }
});

// Reset button functionality
document.getElementById('reset').addEventListener('click', () => {
  const imageEl = document.getElementById('image');
  const loadingSpinner = document.getElementById('loading-spinner');
  const placeholderText = document.getElementById('placeholder-text');
  const inputEl = document.getElementById('input');

  // Reset to initial state
  imageEl.style.display = 'none';
  loadingSpinner.style.display = 'none';
  placeholderText.style.display = 'flex';
  inputEl.value = '';
});

// Download button functionality
document.getElementById('download').addEventListener('click', () => {
  const imageEl = document.getElementById('image');
  if (imageEl.src && imageEl.style.display !== 'none' && !imageEl.src.includes('placeholder')) {
    const link = document.createElement('a');
    link.download = 'generated-image.jpg';
    link.href = imageEl.src;
    link.click();
  } else {
    alert('No image to download. Please generate an image first.');
  }
});