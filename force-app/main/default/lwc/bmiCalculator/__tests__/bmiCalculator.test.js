import { createElement } from '@lwc/engine-dom';
import BmiCalculator from 'c/bmiCalculator';

function flushPromises() {
    return Promise.resolve();
}

describe('c-bmi-calculator', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('renders default metric UI and no BMI initially', async () => {
        const element = createElement('c-bmi-calculator', { is: BmiCalculator });
        document.body.appendChild(element);

        await flushPromises();

        // Metric button should be brand by default
        const metricBtn = element.shadowRoot.querySelector('lightning-button[label="Metric"]');
        const imperialBtn = element.shadowRoot.querySelector('lightning-button[label="Imperial"]');
        expect(metricBtn).toBeTruthy();
        expect(imperialBtn).toBeTruthy();

        // Result placeholder
        const result = element.shadowRoot.querySelector('[data-testid="result"]');
        expect(result).toBeTruthy();
        expect(result.textContent).toContain('—');
    });

    it('calculates BMI in metric units', async () => {
        const element = createElement('c-bmi-calculator', { is: BmiCalculator });
        document.body.appendChild(element);

        await flushPromises();

        // Enter weight 70kg and height 170cm
        const weightKg = element.shadowRoot.querySelector('lightning-input[name="weightKg"]');
        weightKg.value = '70';
        weightKg.dispatchEvent(new CustomEvent('change', { detail: { value: '70' } }));

        const heightCm = element.shadowRoot.querySelector('lightning-input[name="heightCm"]');
        heightCm.value = '170';
        heightCm.dispatchEvent(new CustomEvent('change', { detail: { value: '170' } }));

        await flushPromises();

        const result = element.shadowRoot.querySelector('[data-testid="result"]');
        expect(result.textContent).toContain('BMI:');

        // BMI for 70/(1.7^2)=24.22 -> 24.2
        expect(result.textContent).toContain('24.2');
        // Category Normal weight
        expect(result.textContent).toMatch(/Normal weight/);
    });

    it('calculates BMI in imperial units', async () => {
        const element = createElement('c-bmi-calculator', { is: BmiCalculator });
        document.body.appendChild(element);
        await flushPromises();

        // Switch to Imperial
        const imperialBtn = element.shadowRoot.querySelector('lightning-button[label="Imperial"]');
        imperialBtn.click();

        await flushPromises();

        // Enter weight 154 lb and height 67 in
        const weightLb = element.shadowRoot.querySelector('lightning-input[name="weightLb"]');
        weightLb.value = '154';
        weightLb.dispatchEvent(new CustomEvent('change', { detail: { value: '154' } }));

        const heightIn = element.shadowRoot.querySelector('lightning-input[name="heightIn"]');
        heightIn.value = '67';
        heightIn.dispatchEvent(new CustomEvent('change', { detail: { value: '67' } }));

        await flushPromises();

        const result = element.shadowRoot.querySelector('[data-testid="result"]');
        // 703*154/(67^2)=24.1
        expect(result.textContent).toContain('24.1');
        expect(result.textContent).toMatch(/Normal weight/);
    });

    it('shows validation error for non-positive inputs', async () => {
        const element = createElement('c-bmi-calculator', { is: BmiCalculator });
        document.body.appendChild(element);
        await flushPromises();

        const weightKg = element.shadowRoot.querySelector('lightning-input[name="weightKg"]');
        weightKg.value = '0';
        weightKg.dispatchEvent(new CustomEvent('change', { detail: { value: '0' } }));
        await flushPromises();

        const errorText = element.shadowRoot.querySelector('.slds-text-color_error');
        expect(errorText).toBeTruthy();
        expect(errorText.textContent).toMatch(/greater than 0/);

        const result = element.shadowRoot.querySelector('[data-testid="result"]');
        // Should not show BMI when error present
        expect(result.textContent).not.toMatch(/BMI:/);
    });

    it('clears inputs and result when Clear is clicked', async () => {
        const element = createElement('c-bmi-calculator', { is: BmiCalculator });
        document.body.appendChild(element);
        await flushPromises();

        // Fill values
        const weightKg = element.shadowRoot.querySelector('lightning-input[name="weightKg"]');
        const heightCm = element.shadowRoot.querySelector('lightning-input[name="heightCm"]');
        weightKg.value = '70';
        weightKg.dispatchEvent(new CustomEvent('change', { detail: { value: '70' } }));
        heightCm.value = '170';
        heightCm.dispatchEvent(new CustomEvent('change', { detail: { value: '170' } }));
        await flushPromises();

        // Click Clear
        const clearBtn = element.shadowRoot.querySelector('lightning-button[variant="brand"]');
        clearBtn.click();
        await flushPromises();

        // Inputs should be cleared
        expect(weightKg.value).toBe('');
        expect(heightCm.value).toBe('');

        // Result back to placeholder
        const result = element.shadowRoot.querySelector('[data-testid="result"]');
        expect(result.textContent).toContain('—');
    });
});
