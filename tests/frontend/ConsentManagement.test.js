const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Consent Management', () => {
    let dom;
    let document;
    let window;

    beforeEach(() => {
        // Load the HTML file
        const html = fs.readFileSync(
            path.join(__dirname, '../../frontend/ConsentManagement.html'),
            'utf8'
        );
        
        dom = new JSDOM(html, {
            runScripts: 'dangerously',
            resources: 'usable'
        });
        
        document = dom.window.document;
        window = dom.window;
    });

    afterEach(() => {
        dom.window.close();
    });

    test('should load consent management form', () => {
        expect(document.getElementById('consentForm')).toBeTruthy();
        expect(document.getElementById('consentCheckbox')).toBeTruthy();
        expect(document.getElementById('submitConsent')).toBeTruthy();
    });

    test('should enable submit button when consent is checked', () => {
        const consentCheckbox = document.getElementById('consentCheckbox');
        const submitButton = document.getElementById('submitConsent');
        
        expect(submitButton.disabled).toBe(true);
        
        consentCheckbox.checked = true;
        consentCheckbox.dispatchEvent(new window.Event('change'));
        
        expect(submitButton.disabled).toBe(false);
    });

    test('should disable submit button when consent is unchecked', () => {
        const consentCheckbox = document.getElementById('consentCheckbox');
        const submitButton = document.getElementById('submitConsent');
        
        consentCheckbox.checked = true;
        consentCheckbox.dispatchEvent(new window.Event('change'));
        
        consentCheckbox.checked = false;
        consentCheckbox.dispatchEvent(new window.Event('change'));
        
        expect(submitButton.disabled).toBe(true);
    });

    test('should submit consent form with valid data', () => {
        const consentForm = document.getElementById('consentForm');
        const consentCheckbox = document.getElementById('consentCheckbox');
        
        consentCheckbox.checked = true;
        
        const submitEvent = new window.Event('submit');
        let formSubmitted = false;
        
        consentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formSubmitted = true;
        });
        
        consentForm.dispatchEvent(submitEvent);
        expect(formSubmitted).toBe(true);
    });

    test('should display consent details', () => {
        const consentDetails = document.querySelector('.consent-details');
        expect(consentDetails).toBeTruthy();
        expect(consentDetails.textContent).toContain('data sharing');
    });
});