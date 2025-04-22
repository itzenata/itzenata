// Variables globales
let allEvents = [];
let filteredEvents = [];

// Fonction pour charger et afficher les événements
function loadEvents() {
  fetch("data/sielData.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Stocker tous les événements
      allEvents = Array.isArray(data) ? data : [data];

      // Nettoyer les éventuels caractères non visibles des thèmes
      cleanEventData();

      // Trier les événements par date
      allEvents.sort((a, b) => {
        const dateA = new Date(a.date.split("-").join("/"));
        const dateB = new Date(b.date.split("-").join("/"));
        return dateA - dateB;
      });

      // Initialiser les filtres
      initFilters();

      // Afficher tous les événements au départ
      filteredEvents = [...allEvents];
      displayEvents();

      // Mettre à jour les indicateurs de filtres actifs
      updateFilterIndicators();
    })
    .catch((error) => {
      console.error("Erreur de chargement des données SIEL :", error);
      document.getElementById(
        "eventCards"
      ).innerHTML = `<div class="no-events">Erreur de chargement des données: ${error.message}</div>`;
    });
}

// Fonction pour nettoyer les données d'événements
function cleanEventData() {
  allEvents.forEach((event) => {
    // S'assurer que le thème est bien une chaîne de caractères
    if (typeof event.theme !== "string") {
      event.theme = String(event.theme);
    }

    // Nettoyer les espaces et caractères non visibles en début et fin
    event.theme = event.theme.trim();

    // S'assurer que d'autres propriétés essentielles sont définies
    if (!event.date) event.date = "Date non spécifiée";
    if (!event.time) event.time = "Heure non spécifiée";
    if (!event.title) event.title = "Événement sans titre";
    if (!event.description) event.description = "Aucune description disponible";
    if (!event.lieu) event.lieu = "Lieu non spécifié";
    if (!Array.isArray(event.intervenants))
      event.intervenants = ["Non spécifié"];

    // Extraire l'heure de début pour le filtre (première partie avant le tiret ou l'événement complet)
    event.startTime = event.time.split("–")[0].split("-")[0].trim();

    // Extraire les jours et mois pour les pills
    try {
      const [year, month, day] = event.date.split("-");
      event.day = parseInt(day);
      event.month = parseInt(month);
    } catch (e) {
      // En cas d'erreur, définir des valeurs par défaut
      event.day = 0;
      event.month = 0;
      console.error(
        "Erreur lors de l'extraction de la date pour l'événement:",
        event.title
      );
    }
  });
}

// Fonction pour initialiser les filtres
function initFilters() {
  const themeFilter = document.getElementById("themeFilter");
  const timeFilter = document.getElementById("timeFilter");
  const daysSelector = document.getElementById("daysSelector");

  // Vider les options existantes (sauf la première)
  while (themeFilter.options.length > 1) {
    themeFilter.remove(1);
  }

  while (timeFilter.options.length > 1) {
    timeFilter.remove(1);
  }

  // Vider les jours Pills précédentes s'il y en a
  if (daysSelector) {
    daysSelector.innerHTML = "";

    // Ajouter le jour "Tous" en premier
    const allDaysBtn = document.createElement("div");
    allDaysBtn.className = "day-pill active";
    allDaysBtn.dataset.date = "all";
    allDaysBtn.textContent = "Tous";
    allDaysBtn.addEventListener("click", (e) => selectDayPill(e));
    daysSelector.appendChild(allDaysBtn);
  }

  // Extraire les dates uniques et les organiser par jours
  const uniqueDates = [...new Set(allEvents.map((event) => event.date))];
  uniqueDates.sort();

  // Créer les pills de jours
  if (daysSelector) {
    uniqueDates.forEach((date) => {
      if (date && date !== "Date non spécifiée") {
        try {
          // Créer une pill pour chaque jour
          const [year, month, day] = date.split("-");
          const dateObj = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
          );

          // Formater juste le jour (numéro)
          const dayNum = dateObj.getDate();

          // Obtenir le nom court du mois en français
          const monthNames = [
            "Jan",
            "Fév",
            "Mar",
            "Avr",
            "Mai",
            "Juin",
            "Juil",
            "Août",
            "Sep",
            "Oct",
            "Nov",
            "Déc",
          ];
          const monthName = monthNames[dateObj.getMonth()];

          const dayPill = document.createElement("div");
          dayPill.className = "day-pill";
          dayPill.dataset.date = date;
          dayPill.textContent = `${dayNum} ${monthName}`;
          dayPill.addEventListener("click", (e) => selectDayPill(e));
          daysSelector.appendChild(dayPill);
        } catch (error) {
          console.error(
            "Erreur lors de la création des pills de jours:",
            error
          );
        }
      }
    });
  }

  // Extraire les thèmes uniques
  const uniqueThemes = [...new Set(allEvents.map((event) => event.theme))];
  uniqueThemes.sort((a, b) => a.localeCompare(b, "fr"));

  // Ajouter les options de thème
  uniqueThemes.forEach((theme) => {
    if (theme && theme.trim() !== "") {
      const option = document.createElement("option");
      option.value = theme;
      option.textContent = theme;
      themeFilter.appendChild(option);
    }
  });

  // Extraire les heures uniques
  const uniqueTimes = [...new Set(allEvents.map((event) => event.startTime))];

  // Trier les heures dans l'ordre chronologique
  uniqueTimes.sort((a, b) => {
    const timeA = parseTimeToMinutes(a);
    const timeB = parseTimeToMinutes(b);
    return timeA - timeB;
  });

  // Ajouter les options d'heure
  uniqueTimes.forEach((time) => {
    if (time && time.trim() !== "" && time !== "Heure non spécifiée") {
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      timeFilter.appendChild(option);
    }
  });

  // Ajouter les écouteurs d'événements
  themeFilter.addEventListener("change", applyFilters);
  timeFilter.addEventListener("change", applyFilters);
  document
    .getElementById("resetFilters")
    .addEventListener("click", resetFilters);
}

// Nouvelle fonction pour la sélection des day pills
function selectDayPill(e) {
  const pill = e.target;
  const daysSelector = document.getElementById("daysSelector");

  // Supprimer la classe active de toutes les pills
  const allPills = daysSelector.querySelectorAll(".day-pill");
  allPills.forEach((p) => p.classList.remove("active"));

  // Ajouter la classe active à la pill sélectionnée
  pill.classList.add("active");

  // Appliquer les filtres
  applyFilters();
}

// Fonction pour convertir l'heure en minutes pour le tri
function parseTimeToMinutes(timeStr) {
  try {
    // Format attendu: "10h30", "14h", etc.
    const timePattern = /(\d+)h(\d*)/;
    const match = timeStr.match(timePattern);

    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = match[2] ? parseInt(match[2], 10) : 0;
      return hours * 60 + minutes;
    }

    return 0; // Valeur par défaut si le format ne correspond pas
  } catch (e) {
    return 0;
  }
}

// Fonction pour formater la date
function formatDate(dateStr) {
  try {
    const [year, month, day] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return dateStr;
    }

    // Options pour formater la date
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("fr-FR", options);
  } catch (error) {
    console.error("Erreur de formatage de date:", error);
    return dateStr;
  }
}

// Fonction pour mettre à jour les indicateurs de filtres actifs
function updateFilterIndicators() {
  const filterIndicator = document.getElementById("filterIndicator");
  if (!filterIndicator) return;

  const selectedDate = getSelectedDate();
  const selectedTheme = document.getElementById("themeFilter").value;
  const selectedTime = document.getElementById("timeFilter").value;

  // Vider les indicateurs précédents
  filterIndicator.innerHTML = "";

  // Vérifier s'il y a des filtres actifs
  const hasActiveFilters =
    selectedDate !== "all" || selectedTheme !== "all" || selectedTime !== "all";

  if (!hasActiveFilters) {
    filterIndicator.innerHTML = "Aucun filtre actif";
    return;
  }

  // Construire les indicateurs pour chaque filtre actif
  if (selectedDate !== "all") {
    const formattedDate = formatDate(selectedDate);
    const indicator = document.createElement("span");
    indicator.className = "active-filter";
    indicator.innerHTML = `Date: ${formattedDate} <span class="clear-filter" data-filter="date">×</span>`;
    indicator.querySelector(".clear-filter").addEventListener("click", () => {
      resetDateFilter();
      applyFilters();
    });
    filterIndicator.appendChild(indicator);
  }

  if (selectedTheme !== "all") {
    const indicator = document.createElement("span");
    indicator.className = "active-filter";
    indicator.innerHTML = `Thème: ${selectedTheme} <span class="clear-filter" data-filter="theme">×</span>`;
    indicator.querySelector(".clear-filter").addEventListener("click", () => {
      document.getElementById("themeFilter").value = "all";
      applyFilters();
    });
    filterIndicator.appendChild(indicator);
  }

  if (selectedTime !== "all") {
    const indicator = document.createElement("span");
    indicator.className = "active-filter";
    indicator.innerHTML = `Heure: ${selectedTime} <span class="clear-filter" data-filter="time">×</span>`;
    indicator.querySelector(".clear-filter").addEventListener("click", () => {
      document.getElementById("timeFilter").value = "all";
      applyFilters();
    });
    filterIndicator.appendChild(indicator);
  }
}

// Fonction pour obtenir la date sélectionnée
function getSelectedDate() {
  const daysSelector = document.getElementById("daysSelector");
  if (daysSelector) {
    const activePill = daysSelector.querySelector(".day-pill.active");
    if (activePill) {
      return activePill.dataset.date;
    }
  }
  return "all";
}

// Fonction pour réinitialiser le filtre de date
function resetDateFilter() {
  const daysSelector = document.getElementById("daysSelector");
  if (daysSelector) {
    const allPills = daysSelector.querySelectorAll(".day-pill");
    allPills.forEach((pill) => pill.classList.remove("active"));

    const allPill = daysSelector.querySelector('.day-pill[data-date="all"]');
    if (allPill) {
      allPill.classList.add("active");
    }
  }
}

// Fonction pour appliquer les filtres
function applyFilters() {
  const selectedDate = getSelectedDate();
  const selectedTheme = document.getElementById("themeFilter").value;
  const selectedTime = document.getElementById("timeFilter").value;

  filteredEvents = allEvents.filter((event) => {
    const dateMatch = selectedDate === "all" || event.date === selectedDate;
    const themeMatch = selectedTheme === "all" || event.theme === selectedTheme;
    const timeMatch =
      selectedTime === "all" || event.startTime === selectedTime;
    return dateMatch && themeMatch && timeMatch;
  });

  displayEvents();
  updateFilterIndicators();
}

// Fonction pour réinitialiser les filtres
function resetFilters() {
  document.getElementById("themeFilter").value = "all";
  document.getElementById("timeFilter").value = "all";

  // Réinitialiser également les day pills
  resetDateFilter();

  filteredEvents = [...allEvents];
  displayEvents();
  updateFilterIndicators();
}

// Fonction pour afficher les événements
function displayEvents() {
  const container = document.getElementById("eventCards");
  const countElement = document.getElementById("eventCount");

  // Mettre à jour le compteur d'événements
  countElement.textContent = `${filteredEvents.length} événement${
    filteredEvents.length > 1 ? "s" : ""
  } trouvé${filteredEvents.length > 1 ? "s" : ""}`;

  // Vider le conteneur
  container.innerHTML = "";

  // Afficher un message si aucun événement ne correspond aux critères
  if (filteredEvents.length === 0) {
    container.innerHTML = `<div class="no-events">Aucun événement ne correspond aux critères sélectionnés.</div>`;
    return;
  }

  // Afficher les événements filtrés
  filteredEvents.forEach((event) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="event-title">${event.title}</div>
      <div class="event-date">${formatDate(event.date)} - ${event.time}</div>
      <div class="event-description">
        <div class="theme-tag">${event.theme}</div>
        <p><strong>Lieu :</strong> ${event.lieu}</p>
        <p><strong>Intervenants :</strong> ${event.intervenants.join(", ")}</p>
        ${
          event.moderation
            ? `<p><strong>Modération :</strong> ${event.moderation}</p>`
            : ""
        }
        <p>${event.description}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

// Charger les événements au chargement de la page
document.addEventListener("DOMContentLoaded", loadEvents);
