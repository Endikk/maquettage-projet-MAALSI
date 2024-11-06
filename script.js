// Fonction générique pour rendre un élément déplaçable
function makeElementDraggable(element) {
    element.style.position = "absolute"; // Permet de positionner l'élément librement dans la maquette
    element.onmousedown = function (event) {
      // Position initiale du curseur
      let shiftX = event.clientX - element.getBoundingClientRect().left;
      let shiftY = event.clientY - element.getBoundingClientRect().top;
  
      // Fonction de déplacement de l'élément
      function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + "px";
        element.style.top = pageY - shiftY + "px";
      }
  
      // Déplace l'élément sous le curseur initial
      moveAt(event.pageX, event.pageY);
  
      // Déplace l'élément lorsque le curseur bouge
      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }
  
      // Attache l'événement de déplacement à la souris
      document.addEventListener("mousemove", onMouseMove);
  
      // Relâche l'élément quand on arrête de cliquer
      element.onmouseup = function () {
        document.removeEventListener("mousemove", onMouseMove);
        element.onmouseup = null;
      };
    };
  
    // Empêche le comportement par défaut du navigateur lors du drag
    element.ondragstart = function () {
      return false;
    };
  }
  // Modifie les fonctions d'ajout pour rendre chaque élément déplaçable
  // Fonction pour ajouter un bouton
  function addButton() {
    const canvas = document.getElementById("canvas");
    const button = document.createElement("button");
    button.innerText = "Nouveau Bouton";
    button.classList.add("element");
    button.style.backgroundColor = prompt("Choisissez la couleur du bouton:", "#3498db");
    button.onclick = () => alert("Bouton cliqué !");
    canvas.appendChild(button);
    makeElementDraggable(button); // Rendre le bouton déplaçable
  }
  
  // Fonction pour ajouter un carrousel
  function addCarousel() {
  const canvas = document.getElementById("canvas");
  const carousel = document.createElement("div");
  carousel.classList.add("element");
  
  // Demander les URLs des images
  const urls = [];
  for (let i = 1; i <= 3; i++) {
    const url = prompt(`Entrez l'URL de l'image ${i} pour le carrousel :`);
    if (url) urls.push(url);
  }
  
  // Création de la structure du carrousel
  carousel.innerHTML = `
    <div class="carousel-container" style="position: relative; width: 300px; height: 200px; overflow: hidden;">
      <div class="carousel-track" style="display: flex; transition: transform 0.5s ease; width: ${300 * urls.length}px;">
        ${urls.map((url, index) => `
          <img src="${url}" alt="Image ${index + 1}" style="width: 300px; height: 200px; object-fit: cover;">
        `).join('')}
      </div>
      <button class="carousel-button prev" style="position: absolute; top: 50%; left: 10px; transform: translateY(-50%);">❮</button>
      <button class="carousel-button next" style="position: absolute; top: 50%; right: 10px; transform: translateY(-50%);">❯</button>
    </div>
  `;
  
  // Ajout du carrousel dans le canvas
  canvas.appendChild(carousel);
  makeElementDraggable(carousel);
  
  // Configuration du carrousel
  const track = carousel.querySelector(".carousel-track");
  const nextButton = carousel.querySelector(".next");
  const prevButton = carousel.querySelector(".prev");
  let currentIndex = 0;
  
  function updateCarousel() {
    track.style.transform = `translateX(-${300 * currentIndex}px)`;
  }
  
  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % urls.length;
    updateCarousel();
  });
  
  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + urls.length) % urls.length;
    updateCarousel();
  });
  
  // Défilement automatique toutes les 3 secondes
  setInterval(() => {
    currentIndex = (currentIndex + 1) % urls.length;
    updateCarousel();
  }, 3000);
}
  
  // Fonction pour ajouter un champ de texte
  function addTextField() {
    const canvas = document.getElementById("canvas");
    const textField = document.createElement("input");
    textField.type = "text";
    textField.placeholder = "Texte personnalisé";
    textField.classList.add("element");
    textField.style.fontSize = prompt("Choisissez la taille du texte (en px):", "16px");
    canvas.appendChild(textField);
    makeElementDraggable(textField); // Rendre le champ de texte déplaçable
  }
  
  // Fonction pour ajouter une image
  function addImage() {
    const imageURL = prompt("Entrez l'URL de l'image :");
    
    if (imageURL) {
      const canvas = document.getElementById("canvas");
      const image = document.createElement("img");
      image.src = imageURL;
      image.classList.add("element");
      image.alt = "Image personnalisée";
      image.style.width = prompt("Choisissez la largeur de l'image (en px):", "150px");
      
      // Gestion des erreurs de chargement d'image
      image.onerror = function() {
        alert("Erreur de chargement de l'image. Vérifiez l'URL.");
        image.remove();
      };
      
      canvas.appendChild(image);
      makeElementDraggable(image);
    }
  }
  
// Fonction pour ajouter une vidéo avec une URL personnalisée
function addVideo() {
  const videoURL = prompt("Entrez l'URL de la vidéo YouTube (format : https://www.youtube.com/watch?v=ID_VIDEO) :");

  if (videoURL) {
    const videoId = extractYouTubeId(videoURL);
    if (videoId) {
      const canvas = document.getElementById("canvas");
      const video = document.createElement("iframe");

      // Construire l'URL d'intégration YouTube
      video.src = `https://www.youtube.com/embed/${videoId}`;
      video.width = "450";
      video.height = "250";
      video.classList.add("element");
      video.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      video.allowFullscreen = true;

      // Ajouter la vidéo à la maquette et la rendre déplaçable
      canvas.appendChild(video);
      makeElementDraggable(video);
    } else {
      alert("URL invalide. Veuillez entrer une URL YouTube valide.");
    }
  }
}

// Fonction pour extraire l'ID de la vidéo YouTube à partir de l'URL
function extractYouTubeId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

  // Fonction pour ajouter la géolocalisation
  function addLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const canvas = document.getElementById("canvas");
        const locationInfo = document.createElement("div");
        locationInfo.classList.add("element");
        locationInfo.innerText = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
        canvas.appendChild(locationInfo);
        makeElementDraggable(locationInfo); // Rendre les coordonnées déplaçables
      });
    } else {
      alert("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  }

// Fonction pour exporter la maquette en PDF
function addExportToPDF() {
  const { jsPDF } = window.jspdf;
  const videoElements = document.querySelectorAll('#canvas video');
  
  html2canvas(document.getElementById('canvas')).then(async (canvas) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Ajouter l'image du canvas au PDF
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

    // Pour chaque vidéo, ajouter un aperçu dans le PDF
    for (let video of videoElements) {
      try {
        const videoPreview = await captureVideoPreview(video);
        const rect = video.getBoundingClientRect();
        const pdfX = rect.left * 0.2646;  // Conversion en mm
        const pdfY = rect.top * 0.2646;   // Conversion en mm
        const previewWidth = rect.width * 0.2646;
        const previewHeight = rect.height * 0.2646;

        pdf.addImage(videoPreview, 'PNG', 10 + pdfX, 10 + pdfY, previewWidth, previewHeight);
      } catch (error) {
        console.error("Erreur lors de la capture de l'aperçu vidéo :", error);
      }
    }

    pdf.save('maquette.pdf');
  });
}

async function AddExportToHTMLAndCSS() {
  try {
      // Récupérer le contenu HTML et CSS
      const htmlContent = document.documentElement.outerHTML;
      const cssContent = Array.from(document.styleSheets)
          .map(styleSheet => {
              try {
                  return Array.from(styleSheet.cssRules)
                      .map(rule => rule.cssText)
                      .join('\n');
              } catch (e) {
                  console.warn('Impossible de lire les règles CSS:', e);
                  return '';
              }
          })
          .join('\n');

      // Créer un nouvel objet JSZip
      const zip = new JSZip();

      // Ajouter les fichiers HTML et CSS au ZIP
      zip.file("page.html", htmlContent);
      zip.file("styles.css", cssContent);

      // Générer le fichier ZIP
      const zipContent = await zip.generateAsync({ type: "blob" });

      // Créer un lien de téléchargement
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(zipContent);
      downloadLink.download = "export.zip";

      // Déclencher le téléchargement
      downloadLink.click();

      // Nettoyer l'URL
      URL.revokeObjectURL(downloadLink.href);
  } catch (error) {
      console.error("Erreur lors de l'export:", error);
  }
}

// Ajouter l'événement au bouton
document.getElementById('AddExportToHTMLAndCSS').addEventListener('click', AddExportToHTMLAndCSS);

// Fonction pour créer la toolbar de modification
function createEditToolbar(element) {
  const toolbar = document.createElement('div');
  toolbar.classList.add('edit-toolbar');
  toolbar.style.display = 'none';

  // Boutons de la toolbar selon le type d'élément
  if (element.tagName === 'BUTTON') {
    // Couleur
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = element.style.backgroundColor;
    colorPicker.onchange = (e) => element.style.backgroundColor = e.target.value;
    toolbar.appendChild(colorPicker);

    // Taille du texte
    const fontSizeInput = document.createElement('input');
    fontSizeInput.type = 'number';
    fontSizeInput.min = '8';
    fontSizeInput.max = '72';
    fontSizeInput.value = parseInt(window.getComputedStyle(element).fontSize);
    fontSizeInput.onchange = (e) => element.style.fontSize = e.target.value + 'px';
    toolbar.appendChild(fontSizeInput);
  } else if (element.tagName === 'IMG') {
    // Largeur
    const widthInput = document.createElement('input');
    widthInput.type = 'number';
    widthInput.min = '50';
    widthInput.max = '800';
    widthInput.value = parseInt(element.style.width);
    widthInput.onchange = (e) => element.style.width = e.target.value + 'px';
    toolbar.appendChild(widthInput);
  } else if (element.tagName === 'INPUT') {
    // Taille du texte pour les champs de texte
    const fontSizeInput = document.createElement('input');
    fontSizeInput.type = 'number';
    fontSizeInput.min = '8';
    fontSizeInput.max = '72';
    fontSizeInput.value = parseInt(window.getComputedStyle(element).fontSize);
    fontSizeInput.onchange = (e) => element.style.fontSize = e.target.value + 'px';
    toolbar.appendChild(fontSizeInput);

    // Ajout du sélecteur de police
    const fontSelect = document.createElement('select');
    const fonts = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Helvetica'];
    fonts.forEach(font => {
      const option = document.createElement('option');
      option.value = font;
      option.text = font;
      fontSelect.appendChild(option);
    });
    fontSelect.value = window.getComputedStyle(element).fontFamily.split(',')[0].replace(/['"]/g, '');
    fontSelect.onchange = (e) => element.style.fontFamily = e.target.value;
    toolbar.appendChild(fontSelect);
  }
  // Bouton d'animation
  const animationButton = document.createElement('button');
  animationButton.innerText = '🎞️ Animation';
  animationButton.onclick = () => {
    // Choisir une animation au hasard (ou vous pouvez ajouter un sélecteur)
    const animations = ['animate-bounce', 'animate-rotate', 'animate-pulse'];
    const currentAnimation = element.dataset.animation;

    // Retire l'animation actuelle si elle existe
    if (currentAnimation) {
      element.classList.remove(currentAnimation);
    }

    // Applique une nouvelle animation
    const newAnimation = animations[Math.floor(Math.random() * animations.length)];
    element.classList.add(newAnimation);
    element.dataset.animation = newAnimation;  // Stocke le nom de l'animation
  };
  toolbar.appendChild(animationButton);

  // Bouton de suppression pour tous les éléments
  const deleteButton = document.createElement('button');
  deleteButton.innerText = '🗑️';
  deleteButton.onclick = () => element.remove();
  toolbar.appendChild(deleteButton);

  return toolbar;
}

// Modification de la fonction makeElementDraggable pour ajouter la toolbar
function makeElementDraggable(element) {
  element.style.position = "absolute";
  
  // Ajout de la toolbar
  const toolbar = createEditToolbar(element);
  element.parentNode.appendChild(toolbar);

  // Afficher/masquer la toolbar au clic
  element.addEventListener('click', (e) => {
    e.stopPropagation();
    // Masquer toutes les toolbars
    document.querySelectorAll('.edit-toolbar').forEach(t => t.style.display = 'none');
    // Afficher la toolbar de l'élément cliqué
    toolbar.style.display = 'flex';
    // Positionner la toolbar au-dessus de l'élément
    const rect = element.getBoundingClientRect();
    toolbar.style.position = 'absolute';
    toolbar.style.left = rect.left + 'px';
    toolbar.style.top = (rect.top - toolbar.offsetHeight - 5) + 'px';
  });

  // Masquer la toolbar quand on clique ailleurs
  document.addEventListener('click', (e) => {
    if (!element.contains(e.target) && !toolbar.contains(e.target)) {
      toolbar.style.display = 'none';
    }
  });

  // Code existant du drag and drop
  element.onmousedown = function(event) {
    if (event.target === element) {  // Seulement si on clique sur l'élément lui-même
      let shiftX = event.clientX - element.getBoundingClientRect().left;
      let shiftY = event.clientY - element.getBoundingClientRect().top;
      
      function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
        // Déplacer la toolbar avec l'élément
        const rect = element.getBoundingClientRect();
        toolbar.style.left = rect.left + 'px';
        toolbar.style.top = (rect.top - toolbar.offsetHeight - 5) + 'px';
      }

      moveAt(event.pageX, event.pageY);

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }

      document.addEventListener('mousemove', onMouseMove);

      element.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
      };
    }
  };

  element.ondragstart = function() {
    return false;
  };
}