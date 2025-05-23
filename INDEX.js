document.addEventListener('DOMContentLoaded', function() {

    // --- Smooth Scrolling for Navigation Links ---
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('header') ? document.querySelector('header').offsetHeight : 70;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // --- Update Active Nav Link on Scroll ---
    function updateActiveNavOnScroll() {
        let fromTop = window.scrollY + (document.querySelector('header') ? document.querySelector('header').offsetHeight : 70) + 40; // Added a bit more buffer

        let currentActiveFound = false;
        navLinks.forEach(link => {
            let section = document.querySelector(link.getAttribute('href'));
            if (section) {
                if (
                    section.offsetTop <= fromTop &&
                    section.offsetTop + section.offsetHeight > fromTop
                ) {
                    navLinks.forEach(l => l.classList.remove('active')); // Remove from all first
                    link.classList.add('active');
                    currentActiveFound = true;
                }
            }
        });

        // If near bottom of page, activate Contact link
        if (!currentActiveFound && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) { // 100px buffer
            navLinks.forEach(l => l.classList.remove('active'));
            const contactLink = document.querySelector('.nav-links a[href="#contact"]');
            if (contactLink) contactLink.classList.add('active');
        } else if (!currentActiveFound && window.scrollY < 50) { // If at the very top, activate Home
             navLinks.forEach(l => l.classList.remove('active'));
             const homeLink = document.querySelector('.nav-links a[href="#home"]');
             if (homeLink) homeLink.classList.add('active');
        }
    }
    window.addEventListener('scroll', updateActiveNavOnScroll);
    updateActiveNavOnScroll(); // Initial check


    // --- Update Footer Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Basic Search Functionality ---
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const contentSections = document.querySelectorAll('.content-section, .hero-section');
    const searchResultsContainer = document.getElementById('searchResults'); // Assumed to be in #join-us section

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const searchResultsSection = searchResultsContainer ? searchResultsContainer.closest('section[id]') : null;

        // Hide all content sections initially, then show relevant ones
        contentSections.forEach(section => section.style.display = 'none');
        document.querySelectorAll('[data-keywords]').forEach(el => el.style.display = 'none'); // Also hide individual keyword elements


        if (searchTerm.length < 2) {
            if (searchResultsContainer) {
                 searchResultsContainer.innerHTML = '<p>Please enter at least 2 characters to search.</p>';
                 if(searchResultsSection) searchResultsSection.style.display = ''; // Show section with search results
            } else { // If no dedicated search result container, show all sections
                 contentSections.forEach(section => section.style.display = '');
                 document.querySelectorAll('[data-keywords]').forEach(el => el.style.display = '');
            }
            return;
        }

        let resultsFound = false;
        let resultHTML = '<h3>Search Results:</h3><ul>';

        document.querySelectorAll('[data-keywords]').forEach(element => {
            const keywords = element.getAttribute('data-keywords').toLowerCase();
            const elementText = element.textContent.toLowerCase();
            let parentSection = element.closest('section[id]');

            if (keywords.includes(searchTerm) || elementText.includes(searchTerm)) {
                if (parentSection) parentSection.style.display = ''; // Show section containing the result
                element.style.display = ''; // Show the element itself (if it was a sub-element)

                let sectionTitle = "Relevant Content";
                let sectionId = "#";

                if (parentSection) {
                    sectionId = '#' + parentSection.id;
                    const h2 = parentSection.querySelector('h2');
                    if (h2) sectionTitle = h2.textContent;
                }

                let itemTitle = element.querySelector('h3, h4') ? element.querySelector('h3, h4').textContent : (element.id || 'Matching Content');
                // More specific title extraction if needed
                if (element.classList.contains('service-item') && element.querySelector('h3')) {
                     itemTitle = element.querySelector('h3').textContent;
                } else if (element.classList.contains('pillar') && element.querySelector('h4')) {
                     itemTitle = element.querySelector('h4').textContent;
                } else if (element.classList.contains('opportunity-item') && element.querySelector('h4')) {
                     itemTitle = element.querySelector('h4').textContent;
                }

                resultHTML += `<li class="result-item"><a href="${sectionId}" data-target-id="${parentSection ? parentSection.id : ''}">${itemTitle}</a> (in ${sectionTitle})</li>`;
                resultsFound = true;
            }
        });

        if (searchResultsContainer) {
            if (resultsFound) {
                resultHTML += '</ul>';
                searchResultsContainer.innerHTML = resultHTML;
                // Add click listeners to search result links for smooth scroll
                searchResultsContainer.querySelectorAll('.result-item a').forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const targetId = this.getAttribute('data-target-id'); // Target the section ID
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                             const headerOffset = document.querySelector('header') ? document.querySelector('header').offsetHeight : 70;
                             const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                             const offsetPosition = elementPosition - headerOffset;
                             window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        }
                    });
                });
            } else {
                searchResultsContainer.innerHTML = '<p>No results found for "' + searchTerm + '".</p>';
            }
            if (searchResultsSection) searchResultsSection.style.display = ''; // Ensure search results section is visible
            // Scroll to search results
            if (searchResultsContainer.innerHTML.trim() !== '') {
                 const headerOffset = document.querySelector('header') ? document.querySelector('header').offsetHeight : 70;
                 const containerPosition = searchResultsContainer.getBoundingClientRect().top + window.pageYOffset;
                 const offsetPosition = containerPosition - headerOffset - 20; // Extra 20px buffer
                 window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        } else if (!resultsFound) { // If no dedicated container and no results
            alert('No results found for "' + searchTerm + '".');
            // Restore all sections if no results and no dedicated container
            contentSections.forEach(section => section.style.display = '');
            document.querySelectorAll('[data-keywords]').forEach(el => el.style.display = '');
        }


    }


    if (searchButton && searchInput) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
            if(searchInput.value.trim() === '') {
                if(searchResultsContainer) searchResultsContainer.innerHTML = '';
                // Restore all sections when search is cleared
                contentSections.forEach(section => section.style.display = '');
                document.querySelectorAll('[data-keywords]').forEach(el => el.style.display = '');
            }
        });
    }

    // --- Contact Form Submission (Placeholder) ---
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! (This is a demo - form not connected.)');
            this.reset();
        });
    }

    // --- Mobile Navigation (Burger Menu - Basic Logic) ---
    const burgerMenu = document.querySelector('.burger-menu'); // Add <button class="burger-menu">☰</button> to HTML nav
    const navMenu = document.querySelector('.nav-links');

    if (burgerMenu && navMenu) {
        burgerMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            burgerMenu.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    burgerMenu.textContent = '☰';
                }
            });
        });
    }
});