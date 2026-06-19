/* 
 * AuroraAI - Point Reveal Premium (Global Component)
 * Version: 1.0
 * Usage: Charger ce script sur n'importe quelle page.
 * Déclenchement: window.dispatchEvent(new CustomEvent('aurora:points', { detail: { amount: 10, reason: 'Vidéo regardée', total: 50 } }));
 */

(function() {
    // Empêcher le chargement multiple
    if (window.AuroraPointRevealLoaded) return;
    window.AuroraPointRevealLoaded = true;

    // Injecter le CSS
    var style = document.createElement('style');
    style.textContent = `
        #aurora-point-reveal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none; /* Ne bloque pas les clics */
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        #aurora-point-reveal-overlay.active {
            opacity: 1;
        }
        .pr-card {
            background: rgba(0, 0, 0, 0.92);
            border: 1px solid rgba(212, 175, 55, 0.4);
            border-radius: 20px;
            padding: 2rem 3rem;
            text-align: center;
            box-shadow: 0 0 60px rgba(212, 175, 55, 0.3);
            backdrop-filter: blur(15px);
            transform: scale(0.8);
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            max-width: 90%;
        }
        #aurora-point-reveal-overlay.active .pr-card {
            transform: scale(1);
        }
        .pr-icon {
            font-size: 3rem;
            margin-bottom: 0.5rem;
            animation: prPulse 0.6s ease infinite alternate;
            display: inline-block;
        }        @keyframes prPulse {
            0% { transform: scale(1); filter: brightness(1); }
            100% { transform: scale(1.2); filter: brightness(1.5); text-shadow: 0 0 20px #d4af37; }
        }
        .pr-amount {
            font-size: 3.5rem;
            font-weight: 900;
            color: #d4af37;
            line-height: 1;
            margin-bottom: 0.5rem;
            text-shadow: 0 0 30px rgba(212, 175, 55, 0.6);
        }
        .pr-reason {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 1rem;
            letter-spacing: 0.5px;
            font-weight: 600;
        }
        .pr-bar-container {
            width: 100%;
            height: 6px;
            background: rgba(212, 175, 55, 0.2);
            border-radius: 3px;
            overflow: hidden;
            position: relative;
        }
        .pr-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #b8941f, #d4af37);
            border-radius: 3px;
            width: 0%;
            transition: width 1.5s ease-out;
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
        .pr-badge-info {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.5);
            margin-top: 0.5rem;
        }
    `;
    document.head.appendChild(style);

    // Injecter le HTML
    var overlay = document.createElement('div');
    overlay.id = 'aurora-point-reveal-overlay';
    overlay.innerHTML = `
        <div class="pr-card">
            <div class="pr-icon">⭐</div>
            <div class="pr-amount" id="pr-amount">+0</div>            <div class="pr-reason" id="pr-reason">Points gagnés</div>
            <div class="pr-bar-container">
                <div class="pr-bar-fill" id="pr-bar"></div>
            </div>
            <div class="pr-badge-info" id="pr-badge">Prochain badge...</div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Fonction d'affichage
    function showReveal(amount, reason, currentTotal) {
        var el = document.getElementById('aurora-point-reveal-overlay');
        var amountEl = document.getElementById('pr-amount');
        var reasonEl = document.getElementById('pr-reason');
        var barEl = document.getElementById('pr-bar');
        var badgeEl = document.getElementById('pr-badge');

        if (!el) return;

        // Mise à jour du contenu
        amountEl.textContent = '+' + amount;
        reasonEl.textContent = reason || 'Points gagnés';

        // Calcul progression badge
        var nextBadge = currentTotal < 100 ? 100 : currentTotal < 500 ? 500 : currentTotal < 1500 ? 1500 : currentTotal < 5000 ? 5000 : 10000;
        var prevBadge = currentTotal < 100 ? 0 : currentTotal < 500 ? 100 : currentTotal < 1500 ? 500 : currentTotal < 5000 ? 1500 : 5000;
        var pct = Math.min(100, ((currentTotal - prevBadge) / (nextBadge - prevBadge)) * 100);
        
        barEl.style.width = '0%'; // Reset pour animation
        badgeEl.textContent = nextBadge >= 10000 ? 'Niveau Max atteint !' : 'Vers le badge ' + nextBadge + ' pts';

        // Afficher
        el.classList.add('active');
        
        // Animer la barre après un court délai
        setTimeout(function() {
            barEl.style.width = pct + '%';
        }, 100);

        // Cacher après 2.5 secondes
        setTimeout(function() {
            el.classList.remove('active');
        }, 2500);
    }

    // Écouter l'événement global
    window.addEventListener('aurora:points', function(e) {
        if (e.detail && e.detail.amount) {
            showReveal(e.detail.amount, e.detail.reason, e.detail.total || 0);
        }    });

})();
