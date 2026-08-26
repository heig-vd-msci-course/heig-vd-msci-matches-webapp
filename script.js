// === LOGIQUE DU JEU DES ALLUMETTES ===

// État du jeu
let matches;
let currentPlayer = 1;
let gameMode = "human";
let player1Name = "Personne 1";
let player2Name = "Personne 2";
let initialMatches = 21;
let moveHistory = [];

// === NAVIGATION ENTRE PAGES ===

function showPage(pageId) {
    // Cacher toutes les pages
    document.querySelectorAll(".page").forEach(function(page) {
        page.classList.add("hidden");
    });
    // Afficher la page demandée
    document.getElementById(pageId).classList.remove("hidden");
}

// === PAGE CONFIGURATION ===

// Initialiser les placeholders avec les valeurs par défaut
document.getElementById("player1Name").placeholder = player1Name;
document.getElementById("player2Name").placeholder = player2Name;
document.getElementById("matchCount").value = initialMatches;

// Gérer le changement de mode de jeu
document.querySelectorAll('input[name="gameMode"]').forEach(function(radio) {
    radio.addEventListener("change", function() {
        let player2Group = document.getElementById("player2NameGroup");
        if (this.value === "bot") {
            player2Group.classList.add("hidden");
        } else {
            player2Group.classList.remove("hidden");
        }
    });
});

// Démarrer la partie
function startGame() {
    // Récupérer les paramètres
    gameMode = document.querySelector('input[name="gameMode"]:checked').value;
    player1Name = document.getElementById("player1Name").value || player1Name;
    player2Name = gameMode === "bot" ? "Robot" : (document.getElementById("player2Name").value || player2Name);
    initialMatches = parseInt(document.getElementById("matchCount").value) || initialMatches;

    // Initialiser le jeu
    matches = initialMatches;
    moveHistory = [];
    isAnimating = false;

    // Choisir aléatoirement qui commence
    currentPlayer = Math.random() < 0.5 ? 1 : 2;

    // Afficher la page de jeu
    showPage("page-game");
    updateGameDisplay();

    // Si le robot commence, le faire jouer
    if (gameMode === "bot" && currentPlayer === 2) {
        setTimeout(botPlay, 1000);
    }
}

// === PAGE JEU ===

// Afficher toutes les allumettes (feux + tombes)
function displayMatches() {
    let display = "";
    let deadCount = initialMatches - matches;

    // D'abord les feux (allumettes vivantes)
    for (let i = 0; i < matches; i++) {
        display += '<span class="match">🔥</span>';
    }
    // Ensuite les tombes (allumettes mortes)
    for (let i = 0; i < deadCount; i++) {
        display += '<span class="match dead">🪦</span>';
    }

    document.getElementById("matches").innerHTML = display;
}

// Mettre à jour l'affichage du jeu
function updateGameDisplay() {
    displayMatches();
    updateCounter();
}

// Mettre à jour le compteur et le tour
function updateCounter() {
    document.getElementById("counter").textContent = "Allumettes restantes : " + matches;

    let currentName = currentPlayer === 1 ? player1Name : player2Name;
    document.getElementById("turnTitle").textContent = "Tour de " + currentName;
}

// Variable pour éviter les clics multiples pendant l'animation
let isAnimating = false;

// Retirer des allumettes
function remove(number) {
    // Ne rien faire si animation en cours ou partie finie
    if (isAnimating || matches <= 0) {
        return;
    }

    // Ne pas retirer plus que ce qu'il reste
    if (number > matches) {
        number = matches;
    }

    // Bloquer les clics pendant l'animation
    isAnimating = true;

    // Enregistrer le coup dans l'historique
    let playerName = currentPlayer === 1 ? player1Name : player2Name;
    moveHistory.push({
        player: currentPlayer,
        name: playerName,
        removed: number,
        remaining: matches - number
    });

    // Sélectionner les feux (pas les tombes)
    let fires = document.querySelectorAll(".match:not(.dead)");
    let startIndex = fires.length - number;

    // Étape 1: Animer les feux qui brûlent
    for (let i = startIndex; i < fires.length; i++) {
        fires[i].classList.add("burning");
    }

    // Étape 2: Après l'animation du feu, afficher les tombes
    setTimeout(function() {
        for (let i = startIndex; i < fires.length; i++) {
            fires[i].textContent = "🪦";
            fires[i].classList.remove("burning");
            fires[i].classList.add("dead");
        }

        // Mettre à jour le compteur
        matches = matches - number;
        updateCounter();

        // Vérifier si la partie est finie
        if (matches <= 0) {
            isAnimating = false;
            setTimeout(endGame, 500);
        } else {
            // Changer de Personne
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateCounter();
            isAnimating = false;

            // Si c'est au tour du robot, jouer automatiquement
            if (gameMode === "bot" && currentPlayer === 2) {
                setTimeout(botPlay, 800);
            }
        }
    }, 400);
}

// Tour du robot
function botPlay() {
    // Stratégie gagnante : laisser un multiple de 4
    let toRemove = matches % 4;

    // Si on ne peut pas jouer stratégiquement, jouer au hasard
    if (toRemove === 0) {
        toRemove = Math.floor(Math.random() * 3) + 1;
    }

    // Ne pas retirer plus que possible
    if (toRemove > matches) {
        toRemove = matches;
    }

    remove(toRemove);
}

// === PAGE FIN DE PARTIE ===

function endGame() {
    // Déterminer le perdant (celui qui a pris la dernière)
    let loserName = currentPlayer === 1 ? player1Name : player2Name;
    let winnerName = currentPlayer === 1 ? player2Name : player1Name;

    // Afficher le message de fin
    document.getElementById("winnerMessage").textContent =
        loserName + " a pris la dernière allumette. " + winnerName + " gagne !";

    // Afficher l'historique
    displayHistory();

    // Afficher la page de fin
    showPage("page-end");
}

function displayHistory() {
    let historyHTML = "";

    for (let i = 0; i < moveHistory.length; i++) {
        let move = moveHistory[i];
        let playerClass = move.player === 1 ? "player1" : "player2";
        historyHTML += '<div class="move ' + playerClass + '">';
        historyHTML += '<strong>' + move.name + '</strong> retire ' + move.removed;
        historyHTML += ' → reste ' + move.remaining;
        historyHTML += '</div>';
    }

    document.getElementById("moveHistory").innerHTML = historyHTML;
}

// Rejouer avec les mêmes Personnes
function replayWithSamePlayers() {
    matches = initialMatches;
    currentPlayer = 1;
    moveHistory = [];
    isAnimating = false;
    showPage("page-game");
    updateGameDisplay();
}

// Nouvelle partie avec nouveaux Personnes
function replayWithNewPlayers() {
    showPage("page-setup");
}
