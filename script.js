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

// Copiez ici le reste de votre code existant...

// Copiez ici le reste de votre code existant...

function exportToHTML() {
  const canvas = document.getElementById('canvas');
  let htmlContent = '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Maquette Exportée</title><link rel="stylesheet" href="export.css"></head><body><div class="canvas">\n';
  let cssContent = `/* Styles générés pour la maquette exportée */\n\n.canvas {\n  width: 80vw;\n  height: 60vh;\n  position: relative;\n  background-color: #fff;\n  border: 2px dashed #ccc;\n  overflow: hidden;\n}\n\n`;

  // Parcourir chaque élément de la maquette
  Array.from(canvas.children).forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    const elementClass = `element-${index}`;

    // HTML pour l'élément
    if (tagName === 'input' && element.type === 'text') {
      htmlContent += `<input type="text" class="${elementClass}" placeholder="${element.placeholder}">\n`;
    } else if (tagName === 'button') {
      htmlContent += `<button class="${elementClass}">${element.innerText}</button>\n`;
    } else if (tagName === 'img') {
      htmlContent += `<img src="${element.src}" alt="${element.alt}" class="${elementClass}">\n`;
    } else if (tagName === 'iframe') {
      htmlContent += `<iframe src="${element.src}" class="${elementClass}" allow="${element.allow}"></iframe>\n`;
    } else {
      htmlContent += `<div class="${elementClass}">${element.innerHTML}</div>\n`;
    }

    // CSS pour l'élément
    const styles = window.getComputedStyle(element);
    cssContent += `.${elementClass} {\n  position: absolute;\n  left: ${styles.left};\n  top: ${styles.top};\n`;
    cssContent += `  width: ${styles.width};\n  height: ${styles.height};\n  font-size: ${styles.fontSize};\n  color: ${styles.color};\n  background-color: ${styles.backgroundColor};\n`;
    if (tagName === 'img' || tagName === 'iframe') cssContent += `  display: inline-block;\n`;
    cssContent += '}\n\n';
  });

  htmlContent += '</div></body></html>';

  // Créer et télécharger les fichiers HTML et CSS
  downloadFile('export.html', htmlContent);
  downloadFile('export.css', cssContent);
}

// Fonction utilitaire pour télécharger un fichier
function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}