import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import './components/widget-block.js';
import './components/widget-column.js';
import './components/ad-widget.js';
import './components/login-widget.js';

class Comp2110Dashboard extends LitElement {
  static properties = {
    header: { type: String },
  }

  static styles = css`
    :host {
      min-height: 100vh;   
      font-size: 14pt;
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: lightgoldenrodyellow;
    }

    main {
      display: flex;
      justify-self: center;
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

  constructor() {
    super();
    this.header = 'COMP2110 Home Automation';
  }

  render() {
    return html`
      <header>
        <h1>${this.header}</h1>
        <login-widget></login-widget>
      </header>

      <main>
        <widget-column header="Left">
          <widget-block header="First Widget"></widget-block>
          <widget-block header="Second Widget"></widget-block>
          <widget-block header="Third Widget"></widget-block>
        </widget-column>  
        <widget-column header="Middle">
          <widget-block header="First Widget"></widget-block>
          <widget-block header="Second Widget"></widget-block>
          <widget-block header="Third Widget"></widget-block>
        </widget-column>  
        <widget-column header="Right">
          <ad-widget></ad-widget>
          <widget-block header="Fourth Widget"></widget-block>
          <widget-block header="Fifth Widget"></widget-block>
        </widget-column>
        
      </main>

      <p class="app-footer">
        A product of the COMP2110 Web Development Collective &copy; 2025
      </p>
    `;
  }
}

customElements.define('comp2110-dashboard', Comp2110Dashboard);