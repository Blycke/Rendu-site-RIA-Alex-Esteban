// Menu mobile toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animation du burger menu
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translateY(8px)' : 'none';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translateY(-8px)' : 'none';
    });
}

// Smooth scroll pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Fermer le menu mobile après clic
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    });
});

// Active link sur scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function activateNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavOnScroll);

// Animation au scroll (fade in)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les cartes pour animation
document.querySelectorAll('.feature-card, .process-card, .stat-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Formulaire de contact
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Récupération des données
        const formData = {
            nom: document.getElementById('nom').value,
            email: document.getElementById('email').value,
            entreprise: document.getElementById('entreprise').value,
            typeIA: document.getElementById('typeIA').value,
            message: document.getElementById('message').value
        };
        
        console.log('Données du formulaire:', formData);
        
        // Simulation d'envoi
        alert('Merci pour votre demande ! Nous vous contacterons sous 24h.');
        contactForm.reset();
    });
}

// Questionnaire diagnostic
const questionnaireForm = document.getElementById('questionnaireForm');
if (questionnaireForm) {
    const questions = document.querySelectorAll('.question-card');
    let currentQuestion = 0;
    const answers = {};
    
    // Afficher la première question
    if (questions.length > 0) {
        questions[currentQuestion].style.display = 'block';
    }
    
    // Navigation entre questions
    document.querySelectorAll('.next-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentCard = questions[currentQuestion];
            const questionId = currentCard.dataset.question;
            const selectedOption = currentCard.querySelector('input[type="radio"]:checked');
            
            if (!selectedOption) {
                alert('Veuillez sélectionner une réponse');
                return;
            }
            
            answers[questionId] = selectedOption.value;
            
            // Masquer la question actuelle
            currentCard.style.display = 'none';
            
            // Afficher la suivante ou soumettre
            currentQuestion++;
            if (currentQuestion < questions.length) {
                questions[currentQuestion].style.display = 'block';
            } else {
                // Calculer le score et rediriger
                calculateScore(answers);
            }
        });
    });
    
    // Bouton précédent
    document.querySelectorAll('.prev-question').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentQuestion > 0) {
                questions[currentQuestion].style.display = 'none';
                currentQuestion--;
                questions[currentQuestion].style.display = 'block';
            }
        });
    });
}

// Calcul du score de conformité
function calculateScore(answers) {
    let score = 0;
    let riskLevel = 'low';
    
    // Logique de calcul basée sur les réponses
    Object.values(answers).forEach(answer => {
        if (answer === 'high-risk') score += 30;
        else if (answer === 'medium-risk') score += 15;
        else score += 5;
    });
    
    // Déterminer le niveau de risque
    if (score >= 60) riskLevel = 'high';
    else if (score >= 30) riskLevel = 'medium';
    else riskLevel = 'low';
    
    // Sauvegarder dans localStorage pour la page résultat
    const resultData = {
        score: score,
        riskLevel: riskLevel,
        answers: answers,
        date: new Date().toISOString()
    };
    
    // Note: On simule le stockage ici car localStorage n'est pas disponible
    // Dans un vrai environnement, utilisez localStorage.setItem()
    console.log('Résultats:', resultData);
    
    // Rediriger vers la page résultat
    window.location.href = `result.html?score=${score}&risk=${riskLevel}`;
}

// Page résultat - affichage des données
if (window.location.pathname.includes('result.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const score = urlParams.get('score') || 45;
    const riskLevel = urlParams.get('risk') || 'medium';
    
    // Afficher le score
    const scoreElement = document.getElementById('scoreValue');
    if (scoreElement) {
        scoreElement.textContent = score;
        
        // Animation du score
        let currentScore = 0;
        const targetScore = parseInt(score);
        const increment = targetScore / 50;
        
        const scoreInterval = setInterval(() => {
            currentScore += increment;
            if (currentScore >= targetScore) {
                currentScore = targetScore;
                clearInterval(scoreInterval);
            }
            scoreElement.textContent = Math.round(currentScore);
        }, 20);
    }
    
    // Afficher le niveau de risque
    const riskBadge = document.querySelector('.risk-badge');
    if (riskBadge) {
        riskBadge.classList.add(riskLevel);
        const riskText = {
            'high': '🔴 Haut Risque',
            'medium': '🟡 Risque Moyen',
            'low': '🟢 Risque Faible'
        };
        riskBadge.textContent = riskText[riskLevel] || riskText['medium'];
    }
}

// Téléchargement du rapport PDF
const downloadBtn = document.getElementById('downloadReport');
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        // Simulation du téléchargement
        alert('Génération du rapport PDF en cours...\n\nVotre rapport de conformité RIA sera téléchargé dans quelques instants.');
        
        // Dans un vrai projet, vous appelleriez une API pour générer le PDF
        // fetch('/api/generate-report', { ... })
    });
}

// Animation des statistiques au scroll
const statCards = document.querySelectorAll('.stat-card');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValue = entry.target.querySelector('.stat-value');
            if (statValue && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateValue(statValue);
            }
        }
    });
}, { threshold: 0.5 });

statCards.forEach(card => statsObserver.observe(card));

function animateValue(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const isTime = text.includes('min');
    const isAll = text === 'All';
    
    if (isAll) return;
    
    const value = parseInt(text.replace(/\D/g, ''));
    if (isNaN(value)) return;
    
    let current = 0;
    const increment = value / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
            current = value;
            clearInterval(timer);
        }
        
        let displayValue = Math.round(current);
        if (hasPlus) displayValue += '+';
        if (hasPercent) displayValue += '%';
        if (isTime) displayValue += 'min';
        
        element.textContent = displayValue;
    }, 30);
}

// Effet parallax léger sur le hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 800);
    }
});

console.log('🚀 RIA Check & Go - Application chargée avec succès!');