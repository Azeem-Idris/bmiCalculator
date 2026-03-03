import { LightningElement, track } from 'lwc';

const UNIT = {
    METRIC: 'METRIC',
    IMPERIAL: 'IMPERIAL'
};

export default class BmiCalculator extends LightningElement {
    @track unit = UNIT.METRIC;

    // Metric inputs
    @track weightKg = null;
    @track heightCm = null;

    // Imperial inputs
    @track weightLb = null;
    @track heightIn = null;

    @track errorMessage = '';

    // Handlers: unit toggle
    handleMetric() {
        if (this.unit !== UNIT.METRIC) {
            this.unit = UNIT.METRIC;
            // Clear imperial inputs when switching to keep state clean
            this.weightLb = null;
            this.heightIn = null;
            this.errorMessage = '';
        }
    }

    handleImperial() {
        if (this.unit !== UNIT.IMPERIAL) {
            this.unit = UNIT.IMPERIAL;
            // Clear metric inputs when switching to keep state clean
            this.weightKg = null;
            this.heightCm = null;
            this.errorMessage = '';
        }
    }

    // Input handlers
    handleWeightKgChange(event) {
        this.weightKg = this._toNumberOrNull(event.target.value);
        this._validate();
    }

    handleHeightCmChange(event) {
        this.heightCm = this._toNumberOrNull(event.target.value);
        this._validate();
    }

    handleWeightLbChange(event) {
        this.weightLb = this._toNumberOrNull(event.target.value);
        this._validate();
    }

    handleHeightInChange(event) {
        this.heightIn = this._toNumberOrNull(event.target.value);
        this._validate();
    }

    handleClear() {
        this.weightKg = null;
        this.heightCm = null;
        this.weightLb = null;
        this.heightIn = null;
        this.errorMessage = '';
    }

    // Validation
    _validate() {
        this.errorMessage = '';
        if (this.unit === UNIT.METRIC) {
            if (this.weightKg !== null && this.weightKg <= 0) {
                this.errorMessage = 'Weight (kg) must be greater than 0';
            } else if (this.heightCm !== null && this.heightCm <= 0) {
                this.errorMessage = 'Height (cm) must be greater than 0';
            }
        } else {
            if (this.weightLb !== null && this.weightLb <= 0) {
                this.errorMessage = 'Weight (lb) must be greater than 0';
            } else if (this.heightIn !== null && this.heightIn <= 0) {
                this.errorMessage = 'Height (in) must be greater than 0';
            }
        }
    }

    // Computed state
    get isMetric() {
        return this.unit === UNIT.METRIC;
    }

    get metricVariant() {
        return this.isMetric ? 'brand' : 'neutral';
    }

    get imperialVariant() {
        return this.isMetric ? 'neutral' : 'brand';
    }

    get bmi() {
        if (this.errorMessage) {
            return null;
        }
        if (this.isMetric) {
            if (this.weightKg == null || this.heightCm == null) {
                return null;
            }
            const heightM = this.heightCm / 100;
            if (!heightM) return null;
            const val = this.weightKg / (heightM * heightM);
            return this._round(val, 1);
        } else {
            if (this.weightLb == null || this.heightIn == null) {
                return null;
            }
            if (!this.heightIn) return null;
            const val = (703 * this.weightLb) / (this.heightIn * this.heightIn);
            return this._round(val, 1);
        }
    }

    get hasBmi() {
        return this.bmi !== null && !isNaN(this.bmi);
    }

    get bmiDisplay() {
        return this.hasBmi ? `BMI: ${this.bmi}` : '';
    }

    get category() {
        const b = this.bmi;
        if (b == null || isNaN(b)) return '';
        if (b < 18.5) return 'Underweight';
        if (b < 25) return 'Normal weight';
        if (b < 30) return 'Overweight';
        return 'Obesity';
    }

    // Rather than inline styles that may trigger template CSS parsing, keep style string simple
    get resultClass() {
    let base = 'result slds-p-around_medium slds-border_left slds-border_right slds-border_bottom slds-border_top slds-radius_small';

    if (!this.hasBmi) {
        return base;
    }

    if (this.category === 'Underweight') {
        return base + ' underweight';
    }
    if (this.category === 'Normal weight') {
        return base + ' normal';
    }
    if (this.category === 'Overweight') {
        return base + ' overweight';
    }

    return base + ' obesity';
}

    // Utils
    _toNumberOrNull(val) {
        if (val === '' || val === null || val === undefined) return null;
        const n = Number(val);
        return isNaN(n) ? null : n;
    }

    _round(n, digits) {
        const pow = Math.pow(10, digits);
        return Math.round(n * pow) / pow;
    }
}
