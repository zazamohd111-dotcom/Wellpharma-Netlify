const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../finder/pharmacies-baltimore-coounty- Sheet1.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const pharmacies = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = parseCSVLine(line);
        if (values.length < 3) continue;
        
        pharmacies.push({
            name: values[0] || '',
            address: values[1] || '',
            phone: values[2] || '',
            website: values[3] || '',
            rating: values[4] ? parseFloat(values[4]) : null,
            map_url: values[5] || ''
        });
    }
    
    return pharmacies;
}

// Helper to parse CSV line with quoted fields
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    values.push(current.trim());
    return values;
}

// Extract city and zip from address
function extractCityZip(address) {
    const parts = address.split(',');
    let city = '';
    let zipCode = '';
    
    if (parts.length >= 3) {
        city = parts[1].trim();
        const lastPart = parts[parts.length - 1].trim();
        const zipMatch = lastPart.match(/\d{5}/);
        if (zipMatch) {
            zipCode = zipMatch[0];
        }
    }
    
    return { city, zipCode };
}

// Main processing
console.log('📋 Processing pharmacy data...\n');

// Step 1: Parse CSV
let pharmacies = parseCSV(csvContent);
console.log(`✅ Parsed ${pharmacies.length} pharmacies from CSV`);

// Step 2: Remove Rite Aid
const beforeRiteAid = pharmacies.length;
pharmacies = pharmacies.filter(p => !p.name.toLowerCase().includes('rite aid'));
console.log(`✅ Removed ${beforeRiteAid - pharmacies.length} Rite Aid pharmacies`);

// Step 3: Remove duplicates by address
const addressMap = new Map();
const beforeDedup = pharmacies.length;

pharmacies.forEach(pharmacy => {
    const normalizedAddress = pharmacy.address.toLowerCase().trim();
    
    if (!addressMap.has(normalizedAddress)) {
        addressMap.set(normalizedAddress, pharmacy);
    } else {
        // If duplicate exists, keep the one with higher rating
        const existing = addressMap.get(normalizedAddress);
        if (pharmacy.rating && (!existing.rating || pharmacy.rating > existing.rating)) {
            addressMap.set(normalizedAddress, pharmacy);
        }
    }
});

pharmacies = Array.from(addressMap.values());
console.log(`✅ Removed ${beforeDedup - pharmacies.length} duplicate entries`);

// Step 4: Add city and zip code to each pharmacy
pharmacies = pharmacies.map(pharmacy => {
    const { city, zipCode } = extractCityZip(pharmacy.address);
    return {
        ...pharmacy,
        city,
        zipCode
    };
});

// Step 5: Sort by city, then name
pharmacies.sort((a, b) => {
    if (a.city !== b.city) {
        return a.city.localeCompare(b.city);
    }
    return a.name.localeCompare(b.name);
});

// Step 6: Write to JSON file
const outputPath = path.join(__dirname, '../finder/pharmacies.json');
fs.writeFileSync(outputPath, JSON.stringify(pharmacies, null, 2), 'utf-8');

console.log(`✅ Created pharmacies.json with ${pharmacies.length} unique pharmacies`);
console.log('\n📊 Summary by City:');

// Count by city
const cityCount = {};
pharmacies.forEach(p => {
    cityCount[p.city] = (cityCount[p.city] || 0) + 1;
});

Object.entries(cityCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([city, count]) => {
        console.log(`   ${city}: ${count} pharmacies`);
    });

console.log('\n✅ Done! File saved to: finder/pharmacies.json\n');

