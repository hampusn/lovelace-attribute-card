/**
 * AttributeCard - Custom card for Lovelace UI
 * ...
 * 
 * @class
 */
class AttributeCard extends HTMLElement {
  /**
   * Constructor for this card.
   */
  constructor () {
    super();

    this._card    = null;
    this._content = null;
    this._style   = null;
    this.root     = null;

    this._config = {
      entity: null,
      attribute: null,
      fromFormat: 'json',
      title: ''
    };
    this._hass = {};

    this._initContent();
  }

  /**
   * Initializes the DOM for this card.
   */
  _initContent () {
    this._card    = document.createElement('ha-card');
    this._content = document.createElement('div');
    this._style   = document.createElement('style');

    this._card.header = '';

    this._card.appendChild(this._content);
    this._card.appendChild(this._style);

    this.root = this.attachShadow({mode: 'open'});
    this.root.appendChild(this._card);
  }

  /**
   * Updates the styling of this card.
   */
  _updateStyle () {
    this._style.textContent = `
      ha-card {
        color: var(--primary-text-color);
        position: relative;
      }
    `;
  }

  /**
   * Updates the content of this card.
   */
  _updateContent () {
    let entity    = this._hass.states[this._config.entity];
    let attribute = entity.attributes[this._config.attribute];

    this._content.innerHTML = `
      <p>${attribute}</p>
    `;
  }

  /**
   * Called whenever the configuration changes which is:
   * - always on initialization of the card
   * - when HA trigger a change
   * 
   * @param {Object} config 
   */
  setConfig (config) {
    // A sensor is required for this card to work properly.
    if (!config.sensor) {
      throw new Error('Please define a sensor');
    }

    // Merge config
    this._config = Object.assign({}, this._config, config);

    // Set card title
    this._card.header = this._config.title;

    // Update styles
    this._updateStyle();    
  }

  /**
   * Called whenever the state is changed which 
   * will happen quite frequently.
   * 
   * @param {Object} hass The Home Assistant state object
   * @param {Object} hass.states Contains the state for each object under the objects name.
   */
  set hass (hass) {
    this._hass = hass;

    // Update content
    this._updateContent();
  }

  /**
   * @returns {int}
   */
  getCardSize () {
    return 1;
  }
}

customElements.define('attribute-card', AttributeCard);
