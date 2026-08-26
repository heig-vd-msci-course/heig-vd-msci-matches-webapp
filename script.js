// === LOGIQUE DU JEU DES ALLUMETTES ===

// État du jeu
let matches = 21;
let currentPlayer = 1;
let gameMode = "human";
let player1Name = "Joueur 1";
let player2Name = "Joueur 2";
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
    player1Name = document.getElementById("player1Name").value || "Joueur 1";
    player2Name = gameMode === "bot" ? "Robot" : (document.getElementById("player2Name").value || "Joueur 2");
    initialMatches = parseInt(document.getElementById("matchCount").value) || 21;

    // Initialiser le jeu
    matches = initialMatches;
    currentPlayer = 1;
    moveHistory = [];

    // Afficher la page de jeu
    showPage("page-game");
    updateGameDisplay();
}

// === PAGE JEU ===

// Afficher les allumettes
function displayMatches() {
    let display = "";
    for (let i = 0; i < matches; i++) {
        display += '<span class="match">🔥</span>';
    }
    document.getElementById("matches").innerHTML = display;
}

// Mettre à jour l'affichage du jeu
function updateGameDisplay() {
    displayMatches();
    document.getElementById("counter").textContent = "Allumettes restantes : " + matches;

    let currentName = currentPlayer === 1 ? player1Name : player2Name;
    document.getElementById("turnTitle").textContent = "Tour de " + currentName;
}

// Retirer des allumettes
function remove(number) {
    // Ne rien faire si la partie est finie
    if (matches <= 0) {
        return;
    }

    // Ne pas retirer plus que ce qu'il reste
    if (number > matches) {
        number = matches;
    }

    // Enregistrer le coup dans l'historique
    let playerName = currentPlayer === 1 ? player1Name : player2Name;
    moveHistory.push({
        player: currentPlayer,
        name: playerName,
        removed: number,
        remaining: matches - number
    });

    // Retirer les allumettes
    matches = matches - number;

    // Vérifier si la partie est finie
    if (matches <= 0) {
        endGame();
    } else {
        // Changer de joueur
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateGameDisplay();

        // Si c'est au tour du robot, jouer automatiquement
        if (gameMode === "bot" && currentPlayer === 2) {
            setTimeout(botPlay, 1000);
        }
    }
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

// Rejouer avec les mêmes joueurs
function replayWithSamePlayers() {
    matches = initialMatches;
    currentPlayer = 1;
    moveHistory = [];
    showPage("page-game");
    updateGameDisplay();
}

// Nouvelle partie avec nouveaux joueurs
function replayWithNewPlayers() {
    showPage("page-setup");
}
