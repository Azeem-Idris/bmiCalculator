import { LightningElement } from 'lwc';

const UNIT = {
    METRIC: 'METRIC',
    IMPERIAL: 'IMPERIAL'
};

export default class BmiCalculator extends LightningElement {
    unit = UNIT.METRIC;

    // Metric inputs
    weightKg = null;
    heightCm = null;

    // Imperial inputs
    weightLb = null;
    heightIn = null;

    errorMessage = '';

    // -- unit toggles ------------------------------------------------------
    handleMetric() {
        if (this.unit === UNIT.METRIC) {
            return;
        }
        this.unit = UNIT.METRIC;
        this._resetImperial();
        this._validate();
    }

    handleImperial() {
        if (this.unit === UNIT.IMPERIAL) {
            return;
        }
        this.unit = UNIT.IMPERIAL;
        this._resetMetric();
        this._validate();
    }

    // -- input handlers ---------------------------------------------------
    handleWeightKgChange(e) {
        this.weightKg = this._toNumberOrNull(e.target.value);
        this._validate();
    }

    handleHeightCmChange(e) {
        this.heightCm = this._toNumberOrNull(e.target.value);
        this._validate();
    }

    handleWeightLbChange(e) {
        this.weightLb = this._toNumberOrNull(e.target.value);
        this._validate();
    }

    handleHeightInChange(e) {
        this.heightIn = this._toNumberOrNull(e.target.value);
        this._validate();
    }

    handleClear() {
        this._resetMetric();
        this._resetImperial();
        this.errorMessage = '';
        this._validate();
    }

    // -- validation --------------------------------------------------------
    _validate() {
        this.errorMessage = '';
        if (this.unit === UNIT.METRIC) {
            if (this.weightKg !== null && this.weightKg <= 0) {
                this.errorMessage = 'Weight (kg) must be greater than 0';
            }
            if (!this.errorMessage && this.heightCm !== null && this.heightCm <= 0) {
                this.errorMessage = 'Height (cm) must be greater than 0';
            }
        } else {
            if (this.weightLb !== null && this.weightLb <= 0) {
                this.errorMessage = 'Weight (lb) must be greater than 0';
            }
            if (!this.errorMessage && this.heightIn !== null && this.heightIn <= 0) {
                this.errorMessage = 'Height (in) must be greater than 0';
            }
        }
    }

    // -- computed state ----------------------------------------------------
    get isMetric() {
        return this.unit === UNIT.METRIC;
    }

    get metricVariant() {
        return this.isMetric ? 'brand' : 'neutral';
    }

    get imperialVariant() {
        return this.isMetric ? 'neutral' : 'brand';
    }

    get hasError() {
        return !!this.errorMessage;
    }

    get bmi() {
        if (this.hasError) {
            return null;
        }
        if (this.isMetric) {
            if (this.weightKg == null || this.heightCm == null) {
                return null;
            }
            const heightM = this.heightCm / 100;
            if (heightM <= 0) {
                return null;
            }
            return this._round(this.weightKg / (heightM * heightM), 1);
        } else {
            if (this.weightLb == null || this.heightIn == null) {
                return null;
            }
            if (this.heightIn <= 0) {
                return null;
            }
            return this._round((703 * this.weightLb) / (this.heightIn * this.heightIn), 1);
        }
    }

    get hasBmi() {
        return typeof this.bmi === 'number';
    }

    get bmiDisplay() {
        return this.hasBmi ? `BMI: ${this.bmi}` : '';
    }

    get category() {
        const b = this.bmi;
        if (b == null) {
            return '';
        }
        if (b < 18.5) return 'Underweight';
        if (b < 25) return 'Normal weight';
        if (b < 30) return 'Overweight';
        return 'Obesity';
    }

    get resultClass() {
        let base =
            'result slds-p-around_medium slds-border_left slds-border_right ' +
            'slds-border_bottom slds-border_top slds-radius_small';

        if (!this.hasBmi) {
            return base;
        }

        switch (this.category) {
            case 'Underweight':
                return base + ' underweight';
            case 'Normal weight':
                return base + ' normal';
            case 'Overweight':
                return base + ' overweight';
            default:
                return base + ' obesity';
        }
    }

    // -- helpers -----------------------------------------------------------
    _toNumberOrNull(val) {
        if (val == null || val === '') {
            return null;
        }
        const n = Number(val);
        return isNaN(n) ? null : n;
    }

    _round(n, digits) {
        const pow = Math.pow(10, digits);
        return Math.round(n * pow) / pow;
    }

    _resetMetric() {
        this.weightKg = null;
        this.heightCm = null;
    }

    _resetImperial() {
        this.weightLb = null;
        this.heightIn = null;
    }
}
