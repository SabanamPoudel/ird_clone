# IRD Nepal Taxpayer Portal - Setup Notes

## Files Integrated from Original IRD Portal

### ExtJS Framework (from original portal)
- **Location**: `extjs/`
- **Files**:
  - `ext-all.js` (1.2M) - ExtJS 4.x JavaScript library
  - `resources/ext-all.css` (241K) - ExtJS CSS styles

### IRD Custom Files (from original portal)
- **Location**: `css/all.css` and `js/all.js`
- **Files**:
  - `css/all.css` (238K) - IRD custom CSS styles
  - `js/all.js` (2.4M) - IRD custom JavaScript functions

### Additional Original Files (backup)
- **Location**: `js/ird_original/`
- Contains all original IRD JavaScript files:
  - app.js
  - LoginSecurity.js
  - MenuController.js
  - MyViewport.js
  - Viewport.js
  - etc.

## VAT Return Entry Form

### Files Created:
1. **HTML**: `html/vat/vat_return_entry.html`
   - Uses ExtJS class names and structure
   - Includes ExtJS library files
   - Table-based layout matching original

2. **CSS**: `css/vat/vat_return_entry.css`
   - Minimal custom styles (ExtJS handles most styling)
   - Only custom colors for Register/Reset buttons
   - Instructions panel positioning

3. **JavaScript**: `js/vat/vat_return_entry.js`
   - Form validation
   - Password matching
   - PAN number validation (9 digits)
   - Contact number validation (10 digits)

## How to Test

1. **Start Server**:
   ```bash
   cd /Users/sabanampoudel/IRD_CLONE
   python3 -m http.server 8000
   ```

2. **Access Forms**:
   - Main Portal: http://localhost:8000/html/taxpayer_portal.html
   - VAT Form Direct: http://localhost:8000/html/vat/vat_return_entry.html

3. **Navigate**:
   - Click "Integrated Tax System" → "VAT" → "VAT Return Entry"
   - Form loads in iframe with original ExtJS styling

## Key Differences from Original

### What Matches:
✅ ExtJS styling (using original ext-all.css)
✅ IRD custom styles (using original all.css)
✅ Form layout and structure
✅ Field labels and placeholders in Nepali
✅ Visual appearance

### What's Different:
❌ Backend functionality (no actual submission)
❌ Server-side validation
❌ Database integration
❌ Authentication system

## Next Steps

To add more forms:
1. Create HTML in `html/{module}/{form_name}.html`
2. Include ExtJS and IRD CSS files
3. Create minimal custom CSS in `css/{module}/{form_name}.css`
4. Add validation JS in `js/{module}/{form_name}.js`
5. Add `data-content` attribute in taxpayer_portal.html menu

## File Structure

```
IRD_CLONE/
├── extjs/
│   ├── ext-all.js          (Original ExtJS library)
│   └── resources/
│       └── ext-all.css     (Original ExtJS styles)
├── css/
│   ├── all.css             (Original IRD styles)
│   ├── taxpayer_portal.css
│   └── vat/
│       └── vat_return_entry.css
├── js/
│   ├── all.js              (Original IRD functions)
│   ├── taxpayer_portal.js
│   ├── ird_original/       (Backup of all original JS files)
│   └── vat/
│       └── vat_return_entry.js
├── html/
│   ├── taxpayer_portal.html
│   └── vat/
│       └── vat_return_entry.html
└── media/
    └── resources/          (Logo, flag, slogan images)
```

## Notes

- The form now uses the **exact same ExtJS library** as the original IRD portal
- All styling comes from the **original CSS files** (ext-all.css + all.css)
- This ensures pixel-perfect visual matching with the original portal
- Custom CSS is minimal, only for form-specific positioning and button colors

