# 📋 How to Add Pharmacies via CSV

## Quick Start

1. Open `pharmacies.csv` in Excel, Google Sheets, or any text editor
2. Add a new row for each pharmacy
3. Save the file
4. Refresh your pharmacy finder page - new pharmacies will automatically load!

## CSV Format

Your CSV file should have these columns (in this exact order):

| Column | Description | Example | Required |
|--------|-------------|---------|----------|
| **name** | Pharmacy name | `CVS Pharmacy` | ✅ Yes |
| **address** | Full street address | `8801 Liberty Rd, Randallstown, MD 21133` | ✅ Yes |
| **city** | City name | `Randallstown` | ✅ Yes |
| **zipCode** | 5-digit zip code | `21133` | ✅ Yes |
| **phone** | Phone number | `(410) 521-5678` | ✅ Yes |
| **hours** | Operating hours | `Mon-Fri: 9am-6pm, Sat: 10am-2pm` | ✅ Yes |
| **features** | Display tags (separated by \|) | `Free Delivery\|Compounding\|Immunizations` | ❌ No |
| **services** | Filter codes (separated by \|) | `delivery\|compounding\|immunizations` | ❌ No |
| **website** | Website URL | `https://example.com` or `#` | ❌ No |
| **description** | Brief description | `Independent pharmacy with personalized care` | ❌ No |

## Service Filter Codes

Use these exact codes in the **services** column (separated by `|`):

- `24h` - 24 Hour Pharmacy
- `delivery` - Free Delivery
- `compounding` - Compounding Services
- `immunizations` - Immunizations
- `birthcontrol` - Birth Control Prescribing

**Example:**
```
delivery|compounding|immunizations
```

## Feature Tags

The **features** column is what displays on the pharmacy card. You can use any text you want, separated by `|`:

**Example:**
```
Free Delivery|Compounding|Same-Day Service|Drive-Thru
```

## Example Row

Here's a complete example:

```csv
Care Plus Pharmacy,"1234 Main St, Towson, MD 21204",Towson,21204,(410) 555-1234,Mon-Fri: 9am-7pm,"Free Delivery|Compounding|Health Screenings","delivery|compounding",https://careplus.com,Family-owned pharmacy serving Towson for 20 years
```

## Tips for Using Excel/Google Sheets

### ✅ DO:
- Put addresses in quotes if they contain commas: `"123 Main St, City, MD 21234"`
- Use the pipe character `|` to separate multiple items
- Keep zip codes as text (not numbers) so leading zeros aren't removed
- Save as `.csv` format (not `.xlsx`)

### ❌ DON'T:
- Don't use commas in the features/services fields (use `|` instead)
- Don't add extra columns
- Don't change the column order
- Don't add a total row or extra headers

## Bulk Adding Pharmacies

If you have a list of pharmacies from another source:

1. **Option 1:** Copy-paste into Excel and format to match the template
2. **Option 2:** Use a spreadsheet formula to format data
3. **Option 3:** Let me know and I can help convert your data!

## Finding Pharmacy Data

Sources for Baltimore County pharmacy data:
- Google Maps
- Maryland Board of Pharmacy: https://www.mbp.state.md.us/
- Yellow Pages / Local directories
- Insurance provider directories
- NPI Registry: https://npiregistry.cms.hhs.gov/

## Need Help?

If you have:
- A list of pharmacies in a different format
- Questions about the CSV structure
- Errors loading the CSV

Just let me know and I'll help! 🚀

---

**Note:** WellPharma is hardcoded as the featured pharmacy and will always appear first, regardless of what's in the CSV.

