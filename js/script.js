// NASA API configuration - connects to NASA's space image database
const NASA_API_KEY = 'fSpb2jviUz6cFzsUv3XBIIorrJDo3xutSgDFTGxq';
const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';

// Get the HTML elements we need to work with
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const getImagesButton = document.querySelector('button');
const imageGallery = document.getElementById('gallery');

// Space facts that change every 10 seconds
const spaceFacts = [
  "Did you know? The Sun is so big that about 1.3 million Earths could fit inside it!",
  "Did you know? Jupiter is the largest planet in our solar system.",
  "Did you know? A day on Venus is longer than a year on Venus.",
  "Did you know? There are more stars in the universe than grains of sand on Earth!",
  "Did you know? Saturn's rings are made mostly of ice and rock.",
  "Did you know? The footprints on the Moon will stay there for millions of years.",
  "Did you know? Light from the Sun takes about 8 minutes to reach Earth.",
  "Did you know? The Milky Way galaxy is about 100,000 light-years across."

];

// Function to create the cute animated rocket that flies horizontally across the screen
function createCuteRocket() {
  // Create the rocket container div
  const rocket = document.createElement('div');
  rocket.className = 'cute-rocket';
  
  // Create a cute rocket using SVG - designed to point right for horizontal flight
  rocket.innerHTML = `
    <svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
      <!-- Rocket body (main part) - horizontal design -->
      <rect x="20" y="25" width="40" height="10" fill="#e0e0e0" rx="5"/>
      
      <!-- Rocket nose (front part) - points right -->
      <polygon points="60,25 75,30 60,35" fill="#ff6b6b" />
      
      <!-- Rocket fins (back part) -->
      <polygon points="20,20 5,25 20,25" fill="#4ecdc4" />
      <polygon points="20,35 5,35 20,40" fill="#4ecdc4" />
      
      <!-- Window (where astronauts look out) -->
      <circle cx="35" cy="30" r="4" fill="#87ceeb"/>
      
      <!-- Rocket flame (coming out the back) - animated -->
      <polygon points="20,25 5,27 10,30 5,33 20,35" fill="#ffa726">
        <animate attributeName="fill" values="#ffa726;#ff7043;#ffa726" dur="0.3s" repeatCount="indefinite"/>
      </polygon>
      
      <!-- Inner flame (smaller, brighter flame) -->
      <polygon points="20,27 10,28 12,30 10,32 20,33" fill="#ffeb3b">
        <animate attributeName="fill" values="#ffeb3b;#ffc107;#ffeb3b" dur="0.2s" repeatCount="indefinite"/>
      </polygon>
    </svg>
  `;
  
  // Set rocket size and starting position
  rocket.style.position = 'fixed';
  rocket.style.width = '80px';
  rocket.style.height = '60px';
  rocket.style.zIndex = '5';
  rocket.style.pointerEvents = 'none';
  
  // Position rocket exactly where the solar system is located
  rocket.style.left = '-100px';  // Start off the left side of screen
  rocket.style.top = '50%';      // Perfect center - same as solar system
  rocket.style.transform = 'translateY(-50%)'; // Center the rocket perfectly
  rocket.style.transition = 'left 5s linear';  // Smooth horizontal movement
  
  // Add the rocket to the webpage
  document.body.appendChild(rocket);
  
  // Start the horizontal animation after a tiny delay
  setTimeout(() => {
    // Move rocket straight across through the solar system area
    rocket.style.left = 'calc(100vw + 100px)';
  }, 100);
  
  // Remove the rocket after animation finishes
  setTimeout(() => {
    // Check if rocket still exists before removing it
    if (document.body.contains(rocket)) {
      document.body.removeChild(rocket);
    }
  }, 5200); // 5.2 seconds (animation time + buffer)
}

// Show the cute rocket every 15 seconds
setInterval(createCuteRocket, 15000);

// Show the first rocket after 3 seconds so students see it quickly
setTimeout(createCuteRocket, 3000);

// ---- Space Facts Feature ----
// Create the space fact box and add it to the top right corner
const factBox = document.createElement('div');
factBox.id = 'space-fact-box';
factBox.style.position = 'fixed';
factBox.style.top = '24px';
factBox.style.right = '24px';
factBox.style.background = 'rgba(20, 20, 40, 0.92)';
factBox.style.color = '#fff';
factBox.style.padding = '18px 22px';
factBox.style.borderRadius = '12px';
factBox.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
factBox.style.fontSize = '1.1rem';
factBox.style.fontFamily = "'Inter', 'Source Sans Pro', Arial, sans-serif";
factBox.style.maxWidth = '320px';
factBox.style.zIndex = '1000';
factBox.style.transition = 'opacity 0.5s';
factBox.style.opacity = '0.95';
document.body.appendChild(factBox);

// Function to show a random space fact
function showRandomFact() {
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  factBox.textContent = spaceFacts[randomIndex];
}
showRandomFact();
setInterval(showRandomFact, 10000);

// Set default dates when the page loads
document.addEventListener('DOMContentLoaded', function() {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastWeekString = lastWeek.toISOString().split('T')[0];
  startDateInput.value = lastWeekString;
  endDateInput.value = todayString;
});

// Fetch and display NASA images
getImagesButton.addEventListener('click', async function() {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (!startDate || !endDate) {
    imageGallery.innerHTML = '<p>Please select both start and end dates!</p>';
    return;
  }

  imageGallery.innerHTML = '<p>🚀 Loading amazing space images...</p>';

  try {
    const apiUrl = `${NASA_API_URL}?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Log the response for debugging
    console.log('NASA API response:', data);

    // Always use an array for easy looping
    const items = Array.isArray(data) ? data : [data];

    imageGallery.innerHTML = '';
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      if (item.media_type === 'image') {
        // Add a click event to enlarge the image
        div.innerHTML = `
          <img src="${item.url}" alt="${item.title}" style="cursor:pointer;" />
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        `;
        // Add event listener for enlarging image
        div.querySelector('img').addEventListener('click', function() {
          showModal(item.url, item.title);
        });
      } else if (item.media_type === 'video') {
        div.innerHTML = `
          <iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        `;
      }
      imageGallery.appendChild(div);
    });

    if (imageGallery.children.length === 0) {
      imageGallery.innerHTML = '<p>No images or videos found for these dates.</p>';
    }
  } catch (error) {
    console.error('Error fetching data from NASA API:', error);
    imageGallery.innerHTML = '<p>Error loading images. Please try again later.</p>';
  }
});

// Modal functionality for image enlargement
// (Removed duplicate showModal function to avoid errors)

// Add some global styles for the body and gallery
const style = document.createElement('style');
style.textContent = `
  body {
    font-family: 'Inter', 'Source Sans Pro', Arial, sans-serif;
    background: radial-gradient(circle, rgba(10,10,30,1) 0%, rgba(0,0,0,1) 100%);
    color: #fff;
    margin: 0;
    padding: 0;
    line-height: 1.6;
  }
  #gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .gallery-item {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s;
  }
  .gallery-item:hover {
    transform: scale(1.05);
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
  }
  .modal-content {
    position: relative;
    max-width: 90vw;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: none;
  }
  .modal-content img {
    width: 100%;
    height: auto;
    max-width: 90vw;
    max-height: 80vh;
    border-radius: 8px;
    box-shadow: 0 8px 32px #000a;
    background: #222;
  }
  .caption {
    color: #ffcc00;
    margin-top: 10px;
    text-align: center;
    font-size: 1.5rem;
  }
  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
  }
  h1, h2, h3 {
    color: #ffcc00;
    margin: 0 0 10px 0;
    padding: 0;
    border-bottom: 2px solid #ffcc00;
    display: inline-block;
    padding-bottom: 5px;
  }
  h1 {
    font-size: 2.5rem;
    text-align: center;
    margin-top: 20px;
  }
  h2 {
    font-size: 2rem;
    text-align: center;
    margin-top: 20px;
  }
  h3 {
    font-size: 1.5rem;
    margin-top: 10px;
  }
  p {
    margin: 0 0 10px 0;
    padding: 0;
    font-size: 1.1rem;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

document.head.appendChild(style);
// Add a nice smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Simple modal for enlarging images
function showModal(imgUrl, imgTitle) {
  // Create modal background
  const modalBg = document.createElement('div');
  modalBg.style.position = 'fixed';
  modalBg.style.top = '0';
  modalBg.style.left = '0';
  modalBg.style.width = '100vw';
  modalBg.style.height = '100vh';
  modalBg.style.background = 'rgba(0,0,0,0.85)';
  modalBg.style.display = 'flex';
  modalBg.style.alignItems = 'center';
  modalBg.style.justifyContent = 'center';
  modalBg.style.zIndex = '2000';

  // Create modal image
  const modalImg = document.createElement('img');
  modalImg.src = imgUrl;
  modalImg.alt = imgTitle;
  modalImg.style.maxWidth = '90vw';
  modalImg.style.maxHeight = '80vh';
  modalImg.style.borderRadius = '16px';
  modalImg.style.boxShadow = '0 8px 32px #000a';
  modalImg.style.background = '#222';

  // Close modal on click
  modalBg.addEventListener('click', function() {
    document.body.removeChild(modalBg);
  });

  // Stop propagation so clicking the image doesn't close the modal
  modalImg.addEventListener('click', function(event) {
    event.stopPropagation();
  });

  // Add image and show modal
  modalBg.appendChild(modalImg);
  document.body.appendChild(modalBg);
}
