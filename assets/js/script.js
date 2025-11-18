// Gestion du formulaire de diagnostic
document.getElementById('ria-form')?.addEventListener('submit', function(e) {
    e.preventDefault();

    // Récupération des réponses
    const q1 = document.querySelector('input[name="q1"]:checked')?.value;
    const q2 = document.querySelector('input[name="q2"]:checked')?.value;
    const q3 = document.querySelector('input[name="q3"]:checked')?.value;

    // Calcul du score (exemple simplifié)
    let score = 0;
    if (q1 === "oui") score += 2;
    if (q2 === "oui") score += 2;
    if (q3 === "non") score += 1;

    // Stockage des réponses dans localStorage
    localStorage.setItem('ria-responses', JSON.stringify({ q1, q2, q3, score }));

    // Redirection vers la page de résultat
    window.location.href = 'result.html';
});

// Affichage du score et des recommandations
if (window.location.pathname.includes('result.html')) {
    const responses = JSON.parse(localStorage.getItem('ria-responses'));
    const scoreDisplay = document.getElementById('score-display');
    const recommendations = document.getElementById('recommendations');

    if (responses) {
        scoreDisplay.innerHTML = `
            <h3>Votre score : ${responses.score}/5</h3>
            <p>Niveau de risque estimé : ${responses.score >= 3 ? 'Élevé' : 'Faible/Moyen'}</p>
        `;

        let recs = [];
        if (responses.q1 === "oui") recs.push("Votre système est probablement soumis à des obligations strictes (Art. 6-10 du RIA).");
        if (responses.q2 === "oui") recs.push("Vous devez documenter la provenance et la qualité de vos données biométriques.");
        if (responses.q3 === "non") recs.push("Améliorez la transparence de votre système pour les utilisateurs.");

        recommendations.innerHTML = recs.length ?
            `<h3>Recommandations :</h3><ul>${recs.map(r => `<li>${r}</li>`).join('')}</ul>` :
            "<p>Aucune recommandation spécifique.</p>";
    }
}
