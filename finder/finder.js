// Pharmacy Finder JavaScript

// Analytics tracking function
function trackEvent(eventName, eventParams) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventParams);
    }
    // Google Tag Manager
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': eventName,
            ...eventParams
        });
    }
    console.log('Analytics Event:', eventName, eventParams);
}

// Featured pharmacy (WellPharma) - always shown first
const featuredPharmacy = {
    id: 1,
    name: "WellPharma Pharmacy",
    address: "3622 Offutt Rd, Randallstown, MD 21133",
    phone: "(410) 698-9068",
    hours: "Mon-Fri: 9am-6pm, Sat: 9am-2pm",
    city: "Randallstown",
    zipCode: "21133",
    features: ["Free Delivery", "Compounding", "Immunizations", "Birth Control Prescribing", "Hormone Testing"],
    services: ["delivery", "compounding", "immunizations", "birthcontrol"],
    website: "https://www.wellpharmapharmacy.com",
    isFeatured: true,
    description: "Your trusted independent pharmacy offering personalized care and same-day services."
};

// Pharmacy data - will be loaded from JSON + featured pharmacy
let pharmacyData = [featuredPharmacy];

// JSON Loading Function
async function loadPharmaciesFromJSON() {
    try {
        const response = await fetch('pharmacies.json');
        const jsonData = await response.json();
        
        let idCounter = 2; // Start from 2 since WellPharma is 1
        
        jsonData.forEach(pharmacy => {
            // Skip entries with invalid data
            if (!pharmacy.name || !pharmacy.address) return;
            
            // Determine features based on pharmacy name
            const features = determineFeatures(pharmacy.name, pharmacy.address);
            const services = determineServices(features);
            
            pharmacyData.push({
                id: idCounter++,
                name: pharmacy.name,
                address: pharmacy.address,
                city: pharmacy.city || 'Unknown',
                zipCode: pharmacy.zipCode || '',
                phone: pharmacy.phone || 'N/A',
                hours: 'Call for hours',
                features: features,
                services: services,
                website: pharmacy.website || '#',
                rating: pharmacy.rating,
                mapLink: pharmacy.map_url,
                isFeatured: false,
                description: `${pharmacy.name}${pharmacy.city ? ' in ' + pharmacy.city : ''}${pharmacy.rating ? ' - Rated ' + pharmacy.rating + ' stars' : ''}`
            });
        });
        
        console.log(`✅ Loaded ${pharmacyData.length - 1} pharmacies from JSON (+ 1 featured WellPharma)`);
    } catch (error) {
        console.error('Error loading pharmacies from JSON:', error);
        // If JSON fails to load, app will still work with just WellPharma
        console.log('⚠️ Using WellPharma only - JSON file not found');
    }
}

// Determine features based on pharmacy name and type
function determineFeatures(name, address) {
    const features = [];
    const nameLower = name.toLowerCase();
    
    // Chain pharmacies
    if (nameLower.includes('cvs')) {
        features.push('Drive-Thru', 'Photo Services', 'Health Products');
        if (nameLower.includes('24')) features.push('24 Hour Pharmacy');
    } else if (nameLower.includes('walgreens')) {
        features.push('Drive-Thru', 'Photo Services', 'Immunizations');
    } else if (nameLower.includes('rite aid')) {
        features.push('Drive-Thru', 'Immunizations');
    } else if (nameLower.includes('giant') || nameLower.includes('safeway')) {
        features.push('Immunizations', 'Grocery Pickup');
    } else if (nameLower.includes('walmart')) {
        features.push('Immunizations', 'Low Prices');
    } else if (nameLower.includes('costco')) {
        features.push('Low Prices', 'Bulk Orders');
    } else {
        // Independent pharmacies - assume more personalized services
        features.push('Personalized Care', 'Prescription Services');
    }
    
    return features;
}

// Determine service filter codes from features
function determineServices(features) {
    const services = [];
    const featuresLower = features.map(f => f.toLowerCase()).join(' ');
    
    if (featuresLower.includes('24 hour') || featuresLower.includes('24-hour')) {
        services.push('24h');
    }
    if (featuresLower.includes('delivery')) {
        services.push('delivery');
    }
    if (featuresLower.includes('compounding')) {
        services.push('compounding');
    }
    if (featuresLower.includes('immunization') || featuresLower.includes('vaccine')) {
        services.push('immunizations');
    }
    if (featuresLower.includes('birth control')) {
        services.push('birthcontrol');
    }
    
    return services;
}

// State management
let currentResults = [];
let activeFilters = [];

// DOM Elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const pharmacyGrid = document.getElementById('pharmacyGrid');
const resultsCount = document.getElementById('resultsCount');
const emptyState = document.getElementById('emptyState');
const filterCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');

// Make trackEvent globally accessible
window.trackEvent = trackEvent;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Track page view
    trackEvent('finder_page_view', {
        'page_path': window.location.pathname,
        'page_title': 'Pharmacy Finder'
    });
    
    // Load pharmacies from JSON file
    await loadPharmaciesFromJSON();
    
    // Set up event listeners
    searchForm.addEventListener('submit', handleSearch);
    
    // Filter checkboxes
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
});

// Handle search submission
function handleSearch(e) {
    e.preventDefault();
    
    const searchQuery = searchInput.value.trim().toLowerCase();
    
    if (!searchQuery) {
        showEmptyState('Please enter a zip code or city to search.');
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Simulate API delay for better UX
    setTimeout(() => {
        performSearch(searchQuery);
    }, 500);
}

// Perform the search
function performSearch(query) {
    // Search by zip code or city name
    const results = pharmacyData.filter(pharmacy => {
        const matchesZip = pharmacy.zipCode.includes(query);
        const matchesCity = pharmacy.city.toLowerCase().includes(query);
        return matchesZip || matchesCity;
    });
    
    if (results.length === 0) {
        showEmptyState(`No pharmacies found for "${query}". Try a different location.`);
        // Track search with no results
        trackEvent('pharmacy_search', {
            'search_query': query,
            'results_count': 0,
            'search_type': query.match(/^\d{5}/) ? 'zip_code' : 'city'
        });
        return;
    }
    
    // Sort results: Featured first, then alphabetically
    results.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return a.name.localeCompare(b.name);
    });
    
    currentResults = results;
    
    // Track successful search
    trackEvent('pharmacy_search', {
        'search_query': query,
        'results_count': results.length,
        'search_type': query.match(/^\d{5}/) ? 'zip_code' : 'city',
        'wellpharma_shown': results.some(p => p.isFeatured)
    });
    
    applyFilters();
}

// Handle filter changes
function handleFilterChange(e) {
    const filterValue = e.target.value;
    
    if (e.target.checked) {
        activeFilters.push(filterValue);
    } else {
        activeFilters = activeFilters.filter(f => f !== filterValue);
    }
    
    // Track filter usage
    trackEvent('filter_applied', {
        'filter_type': filterValue,
        'is_checked': e.target.checked,
        'active_filters': activeFilters.join(','),
        'results_count': currentResults.length
    });
    
    applyFilters();
}

// Apply active filters to current results
function applyFilters() {
    let filteredResults = [...currentResults];
    
    // If filters are active, apply them
    if (activeFilters.length > 0) {
        filteredResults = filteredResults.filter(pharmacy => {
            return activeFilters.every(filter => 
                pharmacy.services.includes(filter)
            );
        });
    }
    
    if (filteredResults.length === 0) {
        showEmptyState('No pharmacies match your selected filters. Try adjusting your search.');
        return;
    }
    
    displayResults(filteredResults);
}

// Display results in the grid
function displayResults(results) {
    pharmacyGrid.innerHTML = '';
    resultsCount.textContent = `Found ${results.length} ${results.length === 1 ? 'pharmacy' : 'pharmacies'}`;
    
    results.forEach(pharmacy => {
        const card = createPharmacyCard(pharmacy);
        pharmacyGrid.appendChild(card);
    });
}

// Create a pharmacy card element
function createPharmacyCard(pharmacy) {
    const card = document.createElement('div');
    card.className = 'pharmacy-card';
    
    // Create features HTML
    const featuresHTML = pharmacy.features
        .map(feature => `<span class="feature-tag">${feature}</span>`)
        .join('');
    
    // Badge - Featured or High Rating
    let badgeHTML = '';
    if (pharmacy.isFeatured) {
        badgeHTML = '<span class="pharmacy-badge featured">⭐ Recommended</span>';
    } else if (pharmacy.rating && pharmacy.rating >= 4.5) {
        badgeHTML = `<span class="pharmacy-badge">⭐ ${pharmacy.rating}</span>`;
    }
    
    // Rating display
    const ratingHTML = pharmacy.rating 
        ? `<div class="info-item">
                <i class="fas fa-star"></i>
                <span>${pharmacy.rating} stars</span>
           </div>`
        : '';
    
    // Use Apify map link if available, otherwise create one
    const mapLink = pharmacy.mapLink || 
                   `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharmacy.address)}`;
    
    card.innerHTML = `
        <div class="pharmacy-header">
            <div>
                <h3 class="pharmacy-name">${pharmacy.name}</h3>
            </div>
            ${badgeHTML}
        </div>
        
        <div class="pharmacy-info">
            <div class="info-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${pharmacy.address}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-phone"></i>
                <a href="tel:${pharmacy.phone.replace(/[^0-9]/g, '')}">${pharmacy.phone}</a>
            </div>
            ${ratingHTML}
            <div class="info-item">
                <i class="fas fa-clock"></i>
                <span>${pharmacy.hours}</span>
            </div>
        </div>
        
        <div class="pharmacy-features">
            ${featuresHTML}
        </div>
        
        <div class="pharmacy-actions">
            <a href="${mapLink}" 
               target="_blank" 
               class="action-button secondary"
               onclick="trackPharmacyClick('${pharmacy.name.replace(/'/g, "\\'")}', 'directions')">
                <i class="fas fa-directions"></i>
                Directions
            </a>
            <a href="tel:${pharmacy.phone.replace(/[^0-9]/g, '')}" 
               class="action-button primary"
               onclick="trackPharmacyClick('${pharmacy.name.replace(/'/g, "\\'")}', 'call')">
                <i class="fas fa-phone"></i>
                Call Now
            </a>
        </div>
    `;
    
    return card;
}

// Show loading state
function showLoadingState() {
    pharmacyGrid.innerHTML = `
        <div class="loading" style="grid-column: 1 / -1;">
            <div class="loading-spinner"></div>
            <p>Searching for pharmacies...</p>
        </div>
    `;
    resultsCount.textContent = 'Searching...';
}

// Show empty state with custom message
function showEmptyState(message) {
    pharmacyGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
            <i class="fas fa-search-location"></i>
            <h3>No Results Found</h3>
            <p>${message}</p>
        </div>
    `;
    resultsCount.textContent = 'No results';
}

// Track clicks for analytics
function trackPharmacyClick(pharmacyName, action) {
    trackEvent('pharmacy_interaction', {
        'pharmacy_name': pharmacyName,
        'action': action,
        'is_wellpharma': pharmacyName === 'WellPharma Pharmacy'
    });
}

