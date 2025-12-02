# 🚀 Nutrient Calculator Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Calculator is complete and tested
- [x] Google Analytics integrated (G-46RZZWDTDH)
- [x] Google Tag Manager integrated (GTM-K36QPF39)
- [x] Event tracking implemented
- [x] Email capture ready for n8n webhook
- [x] All product URLs auto-generating
- [x] Bundle functionality working

---

## 📊 Analytics Events Tracked

Your calculator now tracks these events in Google Analytics:

### 1. **Page Views**
- `calculator_page_view` - When someone visits the calculator

### 2. **Medication Searches**
- `medication_searched` - Tracks:
  - Medication name(s)
  - Single vs multiple medications
  - Number of depleted nutrients found
  - Number of recommended products

### 3. **Product Interactions**
- `product_clicked` - When someone clicks "Buy This One"
  - Product code and name
  - Which medication it's for
  
- `bundle_product_clicked` - When someone clicks from bundle modal
  - Product code and name
  - Bundle size

### 4. **Bundle Selections**
- `bundle_selected` - When someone selects multiple products
  - Bundle size
  - Product codes selected
  - Medication searched

### 5. **Email Captures**
- `email_captured` - When someone submits email
  - Email domain
  - Medications searched
  - Products selected

---

## 🌐 Deployment Steps

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Add Nutrient Depletion Calculator with analytics"
git push origin master
```

### Step 2: Netlify Auto-Deploy

Netlify will automatically:
- Detect the push
- Build and deploy
- Make calculator live at: `https://www.wellpharmapharmacy.com/Nutrient-Calculator/`

### Step 3: Verify Deployment

1. Visit: `https://www.wellpharmapharmacy.com/Nutrient-Calculator/`
2. Test search functionality
3. Check browser console for analytics events
4. Verify Google Analytics is receiving events

---

## 🔗 URL Structure

**Main Calculator URL:**
```
https://www.wellpharmapharmacy.com/Nutrient-Calculator/
```

**Short URLs (via redirects):**
```
https://www.wellpharmapharmacy.com/calculator
https://www.wellpharmapharmacy.com/nutrient-calculator
```

---

## 📈 Viewing Analytics

### Google Analytics Dashboard

1. Go to: https://analytics.google.com/
2. Select property: WellPharma Pharmacy
3. Navigate to: **Reports > Engagement > Events**

### Key Metrics to Monitor

**Top Events:**
- `medication_searched` - Most popular medications
- `product_clicked` - Most clicked products
- `email_captured` - Lead generation rate
- `bundle_selected` - Bundle purchase intent

**Custom Reports to Create:**

1. **Medication Popularity Report**
   - Event: `medication_searched`
   - Dimension: `medication_name`
   - Metric: Event count

2. **Product Performance Report**
   - Event: `product_clicked`
   - Dimension: `product_name`
   - Metric: Event count

3. **Conversion Funnel**
   - Step 1: `calculator_page_view`
   - Step 2: `medication_searched`
   - Step 3: `product_clicked`
   - Step 4: `email_captured`

---

## 🔍 Testing Analytics

### Test in Browser Console

1. Open calculator page
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Search for a medication
5. You should see: `Analytics Event: medication_searched {...}`

### Test in Google Analytics Real-Time

1. Go to GA4 > Reports > Real-time
2. Use calculator on another device/browser
3. Events should appear within seconds

---

## 📱 Integration Points

### Already Connected:
- ✅ Pharmacy Finder → Links to calculator
- ✅ Sticky banner on finder → CTA to calculator

### To Add:
- [ ] Main navigation menu link
- [ ] Homepage CTA section
- [ ] Blog posts about nutrient depletion
- [ ] Email signature link
- [ ] Social media posts

---

## 🎯 Next Steps After Deployment

1. **Monitor Analytics** (Week 1)
   - Check which medications are searched most
   - See which products get clicked
   - Monitor email capture rate

2. **Optimize** (Week 2-4)
   - Add more medications if needed
   - Update product URLs based on performance
   - A/B test email capture messaging

3. **Email Automation** (Next Phase)
   - Connect n8n webhook
   - Set up email sequences
   - Track email conversions

---

## 🐛 Troubleshooting

### Analytics Not Showing?

1. Check browser console for errors
2. Verify GA4 property ID: `G-46RZZWDTDH`
3. Check GTM container: `GTM-K36QPF39`
4. Use GA4 DebugView to see events in real-time

### Calculator Not Loading?

1. Check Netlify build logs
2. Verify file path: `/Nutrient-Calculator/index.html`
3. Check browser console for JavaScript errors

### Product Links Not Working?

1. Check product URL overrides in code
2. Verify Designs for Health URLs are correct
3. Test links manually

---

## 📞 Support

If you need help:
- Check browser console for errors
- Review Netlify deployment logs
- Test in Google Analytics DebugView

---

**Your calculator is ready to deploy! 🎉**

Just push to GitHub and Netlify will handle the rest.

