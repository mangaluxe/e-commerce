const articlesOut = document.getElementById("articles-out");
const addArticleForm = document.getElementById('add-article-form');
const addArticleFormContainer = document.getElementById('add-article-form-container');
const editArticleForm = document.getElementById('edit-article-form');
const editArticleFormContainer = document.getElementById('edit-article-form-container');
const panierList = document.getElementById('panier-list');
const boutiqueList = document.getElementById('boutique-list');

// ========== Read ==========

/**
 * Obtenir tous les articles
 */
function getArticles() {
    const stored = localStorage.getItem('articles'); // Récupère depuis localStorage
    if (stored) {
        return JSON.parse(stored);
    }
    return []; // On retourne un tableau vide si on ne trouve rien
}


// ---- Admin ----- 

/**
 * Afficher tous les articles dans admin
 */
function showArticles() {
    articlesOut.innerHTML = ''; // Vider d'abord, sinon dédouble

    const articles = getArticles();

    // --- Boucle for ---

    // for (let i = 0; i < articles.length; i++) {
    //     const article = articles[i];
    //     articlesOut.innerHTML += `
    //         <li>
    //             <div class="e">${article.id}</div>
    //             <div class="e">${article.nom}</div>
    //             <div class="e">${article.description}</div>
    //             <div class="e">${article.prix} €</div>
    //             <div class="e center"><button class="mini-btn btn-warning" onclick="editArticle('${article.id}')">Modifier</button></div>
    //             <div class="e center"><button class="mini-btn btn-danger" onclick="deleteArticle('${article.id}')">Supprimer</button></div>
    //         </li>`;
    // }

    // --- Boucle forEach ---

    articles.forEach(article => {
        articlesOut.innerHTML += `
            <li>
                <div class="e">${article.id}</div>
                <div class="e">${article.nom}</div>
                <div class="e">${article.description}</div>
                <div class="e">${article.prix} €</div>
                <div class="e center"><button class="mini-btn btn-warning" onclick="editArticle('${article.id}')">Modifier</button></div>
                <div class="e center"><button class="mini-btn btn-danger" onclick="deleteArticle('${article.id}')">Supprimer</button></div>
            </li>`;
    });

    // --- ---
}

if (articlesOut) { // Uniquement sur la page admin
    showArticles();
}


// ----- Boutique ----- 

/**
 * Afficher tous les articles dans la boutique
 */
function showArticlesBoutique() {
    const articles = getArticles();

    if (articles.length === 0) {
        boutiqueList.innerHTML = '<p>Tous les articles ont été vendus.</p>';
        return;
    }

    // --- Boucle for ---

    // for (let i = 0; i < articles.length; i++) {
    //     const article = articles[i];
    //     boutiqueList.innerHTML += `
    //         <li class="art">
    //             <div class="title">${article.nom}</div>
    //             <div class="body">
    //                 <div>Description: ${article.description}</div>
    //                 <div class="price">Prix: ${article.prix} €</div>
    //                 <button onclick="ajouterAuPanier('${article.id}')" class="mini-btn btn-success mt-2">Ajouter au panier</button>
    //             </div>
    //         </li>`;
    // }

    // --- Boucle forEach ---

    articles.forEach(article => {
        boutiqueList.innerHTML += `
            <li class="art">
                <div class="title">${article.nom}</div>
                <div class="body">
                    <div>Description: ${article.description}</div>
                    <div class="price">Prix: ${article.prix} €</div>
                    <button onclick="ajouterAuPanier('${article.id}')" class="mini-btn btn-success mt-2">Ajouter au panier</button>
                </div>
            </li>`;
    });

    // --- ---

}

if (boutiqueList) { // Uniquement sur la page boutique
    showArticlesBoutique();
}


// ----- Panier ----- 

/**
 * Afficher contenu du panier
 */
function showPanier() {
    let panier = JSON.parse(localStorage.getItem('panier')) || [];

    if (panier.length === 0) {
        panierList.innerHTML = '<p>Votre panier est vide.</p>';
        return;
    }

    panier.forEach((article, index) => {
        panierList.innerHTML += `
            <li class="art">
                <div class="title">Nom: ${article.nom}</div>
                <div class="body">
                    <div>Description: ${article.description}</div>
                    <div class="price">Prix: ${article.prix} €</div>
                    <button onclick="supprimerDuPanier('${index}')" class="mini-btn btn-danger mt-2">Supprimer</button>
                </div>
            </li>`;
    });
}


// ========== Create ==========

/**
 * Ajouter un article depuis admin (dans localStorage)
 */
function addArticle(article) {
    article.id = Date.now().toString(); // ID unique
    let articles = getArticles();
    articles.push(article);
    localStorage.setItem('articles', JSON.stringify(articles)); // Sauvegarde dans localStorage
}

// Gestion de l'ajout d'article via le formulaire
if (addArticleForm) {
    addArticleForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nom = document.getElementById('nom').value;
        const description = document.getElementById('description').value;
        const prix = document.getElementById('prix').value;

        const newArticle = {
            nom: nom,
            description: description,
            prix: prix
        };

        addArticle(newArticle);
        addArticleForm.reset(); // Réinitialise le formulaire après un ajout

        showArticles(); // Actualiser la liste d'articles affichée
    });
}

/**
 * Ajouter un article au panier
 */
function ajouterAuPanier(articleId) {
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    let articles = getArticles();

    // --- Avec Boucle for ---

    let article;
    for (let i = 0; i < articles.length; i++) {
        if (articles[i].id === articleId) {
            article = articles[i];
            break;
        }
    }

    // --- Avec find ---

    // const article = articles.find(a => a.id === articleId);

    // --- ---

    if (article) {
        panier.push(article);
        localStorage.setItem('panier', JSON.stringify(panier)); // Sauvegarde le panier dans localStorage

        document.getElementById('flash').innerText = 'Article ajouté au panier !'; // Message temporaire pour dire que c'est ajouté
        setTimeout(() => document.getElementById('flash').innerText = '', 3000);
    }
}

// ========== Update ==========

/**
 * Mettre à jour un article dans localStorage
 * @param {string} id - L'ID de l'article à mettre à jour
 */
function updateArticle(id) {
    let articles = getArticles();

    // --- Boucle for ---

    // let articleIndex;
    // for (let i = 0; i < articles.length; i++) {
    //     if (articles[i].id === id) {
    //         articleIndex = i;
    //         break;
    //     }
    // }

    // --- findIndex ---

    const articleIndex = articles.findIndex(a => a.id === id);

    // --- ---

    // Récupérer les nouvelles valeurs du formulaire
    if (articleIndex !== -1) {
        articles[articleIndex].nom = document.getElementById('edit-nom').value;
        articles[articleIndex].description = document.getElementById('edit-description').value;
        articles[articleIndex].prix = document.getElementById('edit-prix').value;

        localStorage.setItem('articles', JSON.stringify(articles));

        editArticleForm.reset();
        editArticleFormContainer.classList.remove("visible");
        addArticleFormContainer.classList.remove("hidden");

        showArticles();
        location.reload(); // Pour éviter que les écouteurs d'évènement ne s'accumulent et provoquent bug
    }
}

/**
 * Éditer un article
 * @param {string} id - L'ID de l'article à éditer
 */
function editArticle(id) {
    document.getElementById("id-edit").innerText = id; // Vérifier quel article on modifie

    const articles = getArticles();

    // --- Boucle for ---

    // let article;
    // for (let i = 0; i < articles.length; i++) {
    //     if (articles[i].id === id) {
    //         article = articles[i];
    //         break;
    //     }
    // }

    // --- find ---

    const article = articles.find(a => a.id === id);

    // --- ---

    if (article) {
        document.getElementById('edit-nom').value = article.nom; // Insère valeurs existantes
        document.getElementById('edit-description').value = article.description;
        document.getElementById('edit-prix').value = article.prix;

        editArticleFormContainer.classList.add("visible"); // Affiche le formulaire d'édition
        addArticleFormContainer.classList.add("hidden");

        editArticleForm.addEventListener("submit", function(e) {
            e.preventDefault();
            updateArticle(id);
        });
    }
}

// ========== Delete ==========

/**
 * Supprimer un article
 * @param {string} id - L'ID de l'article à supprimer
 */
function deleteArticle(id) {
    let articles = getArticles();

    // --- Boucle for ---

    // for (let i = 0; i < articles.length; i++) {
    //     if (articles[i].id === id) {
    //         articles.splice(i, 1); // Supprime l'article en fonction de l'ID
    //         break;
    //     }
    // }

    // --- filter ---

    articles = articles.filter(a => a.id !== id); // Supprime l'article en fonction de l'ID

    // --- ---

    localStorage.setItem('articles', JSON.stringify(articles));

    document.getElementById('articles-out').innerHTML = '';
    showArticles(); // Recharge les articles dans le DOM
}


/**
 * Supprimer un article du panier
 */
function supprimerDuPanier(index) {
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    panier.splice(index, 1);
    localStorage.setItem('panier', JSON.stringify(panier));

    document.getElementById('panier-list').innerHTML = '';
    showPanier();
}

if (panierList) { // Uniquement sur la page panier
    showPanier();
}