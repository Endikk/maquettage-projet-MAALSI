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
  
  // Fonction pour ajouter un carrousel (simple exemple avec des images fixes)
  function addCarousel() {
    const canvas = document.getElementById("canvas");
    const carousel = document.createElement("div");
    carousel.classList.add("element");
    carousel.innerHTML = `
      <div style="display: flex; overflow-x: auto;">
        <img src="https://via.placeholder.com/100" alt="Image 1">
        <img src="https://via.placeholder.com/100" alt="Image 2">
        <img src="https://via.placeholder.com/100" alt="Image 3">
      </div>
    `;
    canvas.appendChild(carousel);
    makeElementDraggable(carousel); // Rendre le carrousel déplaçable
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
    const canvas = document.getElementById("canvas");
    const image = document.createElement("img");
    image.src = "https://via.placeholder.com/150";
    image.classList.add("element");
    image.alt = "Nouvelle image";
    image.style.width = prompt("Choisissez la largeur de l'image (en px):", "150px");
    canvas.appendChild(image);
    makeElementDraggable(image); // Rendre l'image déplaçable
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
  }

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