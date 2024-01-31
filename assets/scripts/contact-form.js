`use strict`;

/**
 * @typedef {Object} Field
 * @property {string} name
 * @property {boolean} required
 * @property {boolean} valid
 * @property {RegExp} pattern
 * @property {string} patternErrorMessage
 * @property {HTMLInputElement} input
 * @property {HTMLSpanElement} errorElem
 */

class ContactForm {
  method = 'POST';

  /**
   * @type {string}
   */
  url;
  /**
   * @type {HTMLFormElement}
   */
  form;
  /**
   * @type {HTMLButtonElement}
   */
  submitButton;

  /**
   * @type {Field[]}
   */
  fields = [
    {
      name: 'fullName',
      required: true,
      valid: false,
    },
    {
      name: 'email',
      required: true,
      valid: false,
      pattern: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm,
      patternErrorMessage: 'Invalid email address',
    },
    {
      name: 'message',
      required: true,
      valid: false,
    },
  ];

  /**
   * @type {{[key: string]: any}}
   */
  defaultSwalConfig = {
    width: '19rem',
    padding: '4rem 1rem',
    showConfirmButton: false,
    showCloseButton: true,
  };

  /**
   * @returns {{[key:string]: string}}
   */
  get requestBody() {
    return this.fields.reduce((body, { name, input }) => {
      body[name] = input.value;
      return body;
    }, {});
  }

  /**
   * @param {string} url
   * @param {HTMLFormElement} form
   */
  constructor(url, form) {
    if (!form) {
      throw new Error('Form is missing!');
    }

    if (!url.trim()) {
      throw new Error('URL is missing!');
    }

    this.url = url.trim();
    this.form = form;
    this.init();
  }

  init() {
    for (const field of this.fields) {
      field.input = this.form.querySelector(`[name='${field.name}']`);
      field.errorElem = field.input.parentElement.querySelector('.form-text');
      if (!field.input) {
        console.warn(`Field ${field.name} is missing`);
        continue;
      }

      // Set field to fieldData propery of input for validation purposes
      field.input.fieldData = field;
      field.input.addEventListener('input', e => {
        this.validateInput(e.target);
      });
    }

    if (this.fields.filter(({ input }) => !!input).length !== this.fields.length) {
      throw new Error('Form fields are missing! Please, check warning(s) above.');
    }

    this.submitButton = this.form.querySelector('button[type="submit"]');
    this.form.addEventListener('submit', e => this.onSubmit(e));
  }

  /**
   * @param {HTMLInputElement} input
   */
  validateInput(input) {
    const errors = [];

    // fieldData property has been set in init function for validation purposes
    /**
     * @type {{fieldData: Field; value: string}}
     */
    const {
      fieldData: { required, pattern, patternErrorMessage },
      value,
    } = input;

    if (required && !value.trim().length) {
      errors.push('This field is required!');
    }

    if (pattern && !value.match(pattern)) {
      errors.push(patternErrorMessage);
    }

    this.setInputValidState(input.fieldData, errors);

    return !errors.length;
  }

  /**
   * @param {Field} field
   * @param {string[]} errors
   */
  setInputValidState({ input, errorElem }, errors) {
    if (!errors.length) {
      input.setCustomValidity('');
      errorElem.innerText = '';
      return;
    }

    input.setCustomValidity(errors[0]);
    errorElem.innerText = errors[0];
  }

  /**
   * @param {SubmitEvent} e
   */
  async onSubmit(e) {
    e.preventDefault();
    let formIsValid = true;

    for (const field of this.fields) {
      formIsValid = this.validateInput(field.input);
    }

    if (!formIsValid) return;

    this.form.disabled = true;
    this.submitButton.disabled = true;

    try {
      const response = await fetch(this.url, {
        body: this.requestBody,
        method: this.method,
        cache: 'no-cache',
      });

      if (!response.ok) {
        this.showMessage(false);
        return;
      }

      this.form.reset();
      this.showMessage();
    } catch (err) {
      this.showMessage(false);
      console.error(err);
    }

    this.form.disabled = false;
    this.submitButton.disabled = false;
  }

  showMessage(success = true) {
    if (success) {
      Swal.fire({
        ...this.defaultSwalConfig,
        title: 'Well done!',
        html: 'Your message has been<br>sent successfully.',
        iconHtml: '<i class="fa-solid fa-circle-check text-success"></i>',
      });

      return;
    }

    Swal.fire({
      ...this.defaultSwalConfig,
      title: 'Oops...',
      html: 'Error occurred.<br>Please, try again later.',
      iconHtml: '<i class="fa-solid fa-circle-xmark text-danger"></i>',
    });
  }
}
