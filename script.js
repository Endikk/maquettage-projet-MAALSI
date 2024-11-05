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
  