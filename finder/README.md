# Pharmacy Finder Directory

A simple, traffic-driving pharmacy finder tool for WellPharma Pharmacy.

## 🎯 Purpose

Drive organic traffic by helping users find local pharmacies while promoting WellPharma as the preferred choice with a persistent sticky banner.

## 📁 Files

- `index.html` - Main pharmacy finder page
- `finder.js` - Search functionality and pharmacy data
- `README.md` - This file

## 🏥 Adding New Pharmacies

### Method 1: CSV File (Recommended for Bulk Updates)

Simply edit `pharmacies.csv` and add new rows. The finder will automatically load them!

**Quick CSV Template:**
```csv
name,address,city,zipCode,phone,hours,features,services,website,description
Care Plus Pharmacy,"1234 Main St, Towson, MD 21204",Towson,21204,(410) 555-1234,Mon-Fri: 9am-7pm,"Free Delivery|Compounding","delivery|compounding",#,Family-owned pharmacy
```

📖 **See `PHARMACY_CSV_GUIDE.md` for detailed instructions!**

### Method 2: Manual (JavaScript)

For special cases, edit `finder.js` and add entries to the `pharmacyData` array:

```javascript
{
    id: 8, // Increment this number
    name: "Pharmacy Name",
    address: "123 Main St, City, MD 21234",
    phone: "(410) 123-4567",
    hours: "Mon-Fri: 9am-6pm",
    city: "City Name",
    zipCode: "21234",
    features: ["Free Delivery", "Compounding"], // Display tags
    services: ["delivery", "compounding"], // For filtering
    website: "https://example.com", // or "#" if none
    isFeatured: false, // Set true for WellPharma or sponsored
    description: "Brief description of the pharmacy."
}
```

## 🏷️ Available Service Filters

When adding pharmacies, use these service tags for filtering:

- `"24h"` - 24 Hour Pharmacy
- `"delivery"` - Free Delivery
- `"compounding"` - Compounding Services
- `"immunizations"` - Immunizations
- `"birthcontrol"` - Birth Control Prescribing

## 🎨 Customization

The finder uses the same color scheme as your main website:
- Primary: `rgb(77, 123, 107)` - Green
- Secondary: `rgb(144, 173, 114)` - Light Green
- Uses Google Fonts: Open Sans & Roboto

## 📊 SEO Benefits

This directory helps with:
- Local SEO ("pharmacy near me" searches)
- Long-tail keywords (city + pharmacy combinations)
- Internal links back to WellPharma
- Content freshness as you add more locations

## 🚀 Future Enhancements

Consider adding:
- API integration for real-time pharmacy data
- User reviews and ratings
- Distance calculation from user's location
- More filter options (insurance accepted, languages spoken)
- Pharmacy hours in structured data (Schema.org)
- Map view integration

## 📈 Analytics

The finder tracks:
- Search queries
- Pharmacy clicks
- Transfer prescription button clicks
- Filter usage

All events are sent to your existing Google Analytics (GA-46RZZWDTDH).

## 🔗 Integration

Link to the finder from your main site:
```html
<a href="/finder/">Find a Pharmacy Near You</a>
```

---

**Questions?** The sticky banner ensures every visitor sees your WellPharma call-to-action, driving transfers even as they browse other pharmacies. 🎯

