// BBC Sport Style Header Component
function createBBCHeader(currentPage = '') {
    return `
    <!-- Header -->
    <header class="main-header">
        <!-- Top Header -->
        <div class="header-top">
            <div class="header-top-content">
                <div class="bbc-logo">BSix</div>
                <nav class="header-nav">
                    <a href="index.html">Home</a>
                    <a href="#news">News</a>
                    <a href="#sport" class="active">Sport</a>
                    <a href="#analysis">Analysis</a>
                    <a href="#more">More</a>
                </nav>
            </div>
        </div>

        <!-- Sport Header -->
        <div class="sport-header">
            <div class="sport-header-content">
                <a href="index.html" class="sport-logo">SPORT</a>
                <nav class="sport-nav">
                    <a href="index.html" class="active">Football</a>
                    <a href="#premier-league">Premier League</a>
                    <a href="#champions-league">Champions League</a>
                    <a href="#transfer-news">Transfer News</a>
                    <a href="fixtures.html">Scores</a>
                    <a href="stats.html">Tables</a>
                </nav>
            </div>
        </div>

        <!-- Football Navigation -->
        <div class="football-nav">
            <div class="football-nav-content">
                <a href="index.html" class="${currentPage === 'home' ? 'active' : ''}">Big 6 Hub</a>
                <a href="teams-advanced-stats.html" class="${currentPage === 'stats' ? 'active' : ''}">Team Stats</a>
                <a href="liverpool-detail.html" class="${currentPage === 'liverpool' ? 'active' : ''}">Liverpool</a>
                <a href="arne-slot-special.html" class="${currentPage === 'slot' ? 'active' : ''}">Slot Special</a>
                <a href="arsenal.html" class="${currentPage === 'arsenal' ? 'active' : ''}">Arsenal</a>
                <a href="chelsea.html" class="${currentPage === 'chelsea' ? 'active' : ''}">Chelsea</a>
                <a href="fixtures.html" class="${currentPage === 'fixtures' ? 'active' : ''}">Fixtures</a>
                <a href="stats.html" class="${currentPage === 'table' ? 'active' : ''}">League Table</a>
            </div>
        </div>
    </header>
    `;
}

// Common JavaScript functionality
function initializeBBCStyle() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeBBCStyle);
