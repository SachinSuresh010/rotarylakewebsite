// Members Data Loader
class MembersLoader {
    constructor() {
        this.membersData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadMembersData();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing MembersLoader:', error);
        }
    }

    async loadMembersData() {
        try {
            const response = await fetch('assets/data/members.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.membersData = await response.json();
        } catch (error) {
            console.error('Error loading members data:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Listen for DOM content loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.populateDirectors();
                this.populatePastPresidents();
                this.populateHomeDirectors();
            });
        } else {
            this.populateDirectors();
            this.populatePastPresidents();
            this.populateHomeDirectors();
        }
    }

    populateDirectors() {
        // Populate current directors section
        const directorsContainer = document.querySelector('#features3-19 .row');
        if (directorsContainer && this.membersData) {
            directorsContainer.innerHTML = '';
            this.membersData.currentDirectors.forEach(director => {
                const directorElement = this.createDirectorElement(director);
                directorsContainer.appendChild(directorElement);
            });
        }

        // Populate office bearers section
        const officeBearersContainer = document.querySelector('#gallery3-1a .row');
        if (officeBearersContainer && this.membersData) {
            officeBearersContainer.innerHTML = '';
            this.membersData.officeBearers.forEach(bearer => {
                const bearerElement = this.createOfficeBearerElement(bearer);
                officeBearersContainer.appendChild(bearerElement);
            });
        }
    }

    populatePastPresidents() {
        const pastPresidentsContainer = document.querySelector('#features3-18 .row');
        if (pastPresidentsContainer && this.membersData) {
            pastPresidentsContainer.innerHTML = '';
            this.membersData.pastPresidents.forEach(president => {
                const presidentElement = this.createPastPresidentElement(president);
                pastPresidentsContainer.appendChild(presidentElement);
            });
        }
    }

    createDirectorElement(director) {
        const div = document.createElement('div');
        div.className = 'item features-image сol-12 col-md-6 col-lg-4';
        
        const link = director.link ? `href="${director.link}" target="_blank"` : '';
        const imgLink = director.link ? `<a ${link}><img src="${director.image}" alt="${director.alt}"></a>` : `<img src="${director.image}" alt="${director.alt}">`;
        
        div.innerHTML = `
            <div class="item-wrapper">
                <div class="item-img">
                    ${imgLink}
                </div>
                <div class="item-content">
                    <h5 class="item-title mbr-fonts-style display-7"><strong>${director.name}</strong></h5>
                    <p class="mbr-text mbr-fonts-style mt-3 display-7">${director.position}</p>
                </div>
            </div>
        `;
        
        return div;
    }

    createOfficeBearerElement(bearer) {
        const div = document.createElement('div');
        div.className = 'item features-image сol-12 col-md-6 col-lg-3';
        
        const link = bearer.link ? `href="${bearer.link}" target="_blank"` : '';
        const imgLink = bearer.link ? `<a ${link}><img src="${bearer.image}" alt="${bearer.alt}"></a>` : `<img src="${bearer.image}" alt="${bearer.alt}">`;
        
        div.innerHTML = `
            <div class="item-wrapper">
                <div class="item-img">
                    ${imgLink}
                </div>
                <div class="item-content">
                    <h5 class="item-title mbr-fonts-style display-7"><strong>${bearer.name}</strong></h5>
                    <p class="mbr-text mbr-fonts-style mt-3 display-7">${bearer.position}</p>
                </div>
            </div>
        `;
        
        return div;
    }

    createPastPresidentElement(president) {
        const div = document.createElement('div');
        div.className = 'item features-image сol-12 col-md-6 col-lg-4';
        
        div.innerHTML = `
            <div class="item-wrapper">
                <div class="item-img">
                    <img src="${president.image}" alt="${president.alt}">
                </div>
                <div class="item-content">
                    <h5 class="item-title mbr-fonts-style display-7"><strong>${president.name}</strong></h5>
                    <p class="mbr-text mbr-fonts-style mt-3 display-7">${president.years}</p>
                </div>
            </div>
        `;
        
        return div;
    }

    // Method to populate home page directors carousel
    populateHomeDirectors() {
        const carouselContainer = document.querySelector('#people5-p .embla__container');
        if (carouselContainer && this.membersData) {
            carouselContainer.innerHTML = '';
            
            // Combine current directors and office bearers for home page
            const allDirectors = [...this.membersData.currentDirectors, ...this.membersData.officeBearers];
            
            allDirectors.forEach((director, index) => {
                const slideElement = this.createHomeDirectorSlide(director, index);
                carouselContainer.appendChild(slideElement);
            });
        }
    }

    createHomeDirectorSlide(director, index) {
        const div = document.createElement('div');
        div.className = 'embla__slide slider-image item';
        if (index === 0) div.classList.add('active');
        div.style.marginLeft = '0rem';
        div.style.marginRight = '0rem';
        
        const link = director.link ? `href="${director.link}"` : '';
        const imgLink = director.link ? `<a ${link}><img src="${director.image}" alt="${director.alt}" data-slide-to="${index}" data-bs-slide-to="${index}"></a>` : `<img src="${director.image}" alt="${director.alt}" data-slide-to="${index}" data-bs-slide-to="${index}">`;
        
        div.innerHTML = `
            <div class="user">
                <div class="user_image">
                    <div class="item-wrapper position-relative">
                        ${imgLink}
                    </div>
                </div>
                <div class="user_text mb-4">
                    <p class="mbr-fonts-style display-7"></p>
                </div>
                <div class="user_name mbr-fonts-style mb-2 display-7">
                    <strong>${director.name}</strong>
                </div>
                <div class="user_desk mbr-fonts-style display-7">
                    ${director.position}
                </div>
            </div>
        `;
        
        return div;
    }
}

// Initialize the members loader when the script is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.membersLoader = new MembersLoader();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MembersLoader;
} 