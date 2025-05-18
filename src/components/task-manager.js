import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { getUser } from '../auth.js';
import { BASE_URL } from '../config.js';
import { DateTime } from 'https://cdn.jsdelivr.net/npm/luxon@3.6.1/+esm';

export class DataManager extends LitElement {
  // ----- Variables -----
  static properties = {
    listId: { type: Number },
    items: { type: Array },
    newItem: { type: Object },
    user: { state: true },
    showFormModal : {type: Boolean}
  };

  constructor(){
    super();
    this.showFormModal = false;
    this.user = getUser();
    this.listId = 0;
    this.items = [];
    this.newItem = {
      title: "", // title = summary
      text: "", //full text description
      priority:0,
      dueDate:'2025-01-01', //YY - MM - DD
      dueTime:'12:00' // HH : mm
    };
    

  }
  //

  // ----- Lifecycle -----
connectedCallback() {
  super.connectedCallback();
  // Optional: place early setup here (before rendering)
}

firstUpdated() {
  // Safe to interact with the DOM or run data fetches after initial render
  this.loadData();
}


  // ----- Data Methods -----
  /**
   * Load data from your source (API, local storage, etc.).
   * Implement fetching logic here.
   */
  async loadData() {
  

  try {
    const res = await fetch(`${BASE_URL}tasks?start=0&count=15`, {
      headers: {
        'Authorization': `Bearer ${this.user.token}`
      }
    });

    if (!res.ok) throw new Error(`Fetch failed (${res.status})`);

    const json = await res.json();

    const convertedItems = [];
    for (let i = 0; i < json.tasks.length; i++) {
      const task = json.tasks[i];

      let dueDateObj = null;
      if (task.due) {
        console.log('🔍 raw task.due:', task.due);
        dueDateObj = DateTime
        .fromMillis(task.due)                 
        .setZone('Australia/Sydney') 
        .toLocaleString(DateTime.DATETIME_MED);
}

      const newItem = {
        id: task.id,
        summary: task.summary,
        text: task.text,
        priority: task.priority,
        category: task.category,
        due: task.due,
        timestamp: task.timestamp,
        dueDateObj: dueDateObj
      };

      convertedItems.push(newItem);
    }

    this.items = convertedItems;

  } catch (err) {
    console.error(err);
    this.items = [];
  }

  return this.items;
}


 /**
 * Add a new data item to the source and update items.
 * Implement add logic here.
 */
async addData() {
  
  const ausDueDate = DateTime.fromISO(
  `${this.newItem.dueDate}T${this.newItem.dueTime}`,
  { zone: "Australia/Sydney" }
);

  const payload = {
    summary: this.newItem.title,
    text: this.newItem.text,
    priority: this.newItem.priority,
    due: ausDueDate.toMillis()
  };

  try {
    const res = await fetch(`${BASE_URL}tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.user.token}`
      },
      body: JSON.stringify(payload) 
    });

    if (!res.ok) throw new Error(`Add failed (${res.status})`);




    await this.loadData(); 
  } catch (err) {
    console.error(err);
    alert('Could not add item.');
  }
}


  /**
   * Delete a data item by id or index and update dataItems.
   * @param {string|number} id - identifier of the item to delete.
   */
  async deleteData(id) {
  if (!this.user) {
    alert('Please log in first.');
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.user.token}`
      }
    });

    if (!res.ok) throw new Error(`Delete failed (${res.status})`);

    await this.loadData();
  } catch (err) {
    console.error(err);
    alert('Could not delete data');
  }
}


  // ----- Render -----
  render() {
  return html`


    <link rel="stylesheet" href="https://unpkg.com/98.css">
    ${!this.user ? html `
      <div class = "window" style = "width: 280px;">
        <div class = "title-bar">
          <div class = "title-bar-text">
            Warning : Please log in
          </div>
          <div class = "title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div class="window-body">
          <p>Log in to use feature</p>
        </div>
      </div>
        
      
      ` : html `

        <div class = "window" style = "width: 300px;">
        <div class = "title-bar">
          <div class = "title-bar-text">
            TODO list
          </div>
          <div class = "title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div class="window-body">

          <div class="sunken-panel" style="height: 200px; width: 280px;">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Due Date </th>
                  <th>Details</th>
                </tr>
              </thead>
              
                ${this.items.map(item => html`
                  <tr>
                    <td style = "text-transform: uppercase; padding: 5px;"> <strong> ${item.summary} </strong> (id: ${item.id}) </td>
                    <td style = "padding: 5px;"> ${item.dueDateObj} </td>
                    <td style = "
                      word-wrap: break-word;
                      white-space: normal;
                      font-size: 1rem;
                    ">  ${item.text} </td>
                  </tr>                  
                  
                  `)}
              </tbody>
            </table>
          </div>
            

          <div class = "action-bar" style = "margin-top: 5px; gap: 5px;">
            <button class="button" type = "button" @click=${() => this.toggleModal()} >Add Task</button>
            <button class = "delete-button" type = "button" @click=${e => this._handleDelete(e)}>Delete task</button>
            <input class = "delete-input" type = "number" placeholder  = "Delete by ID" id = "deleteID" style  = "width: 110px;"/>
          
          </div>
          
          

          
          ${this.showFormModal ? html `
            
            <div class="window submit-form" style="width: 400px;">
              <div class="title-bar">
                <div class="title-bar-text">Add a new task</div>
                <div class="title-bar-controls">
                  <button aria-label="Close" @click=${() => this.closeModal()}></button>
                </div>
              </div>

              <div class="window-body">
                <form @submit=${this._handleSubmit}>
                <fieldset class="fieldset">
                  <legend class="legend" style = "text-align: left;">Task Details</legend>

                  <div class="field-row">
                    <label for="title">Title:</label>
                    <input id="title" type="text" @input=${e => this.newItem.title = e.target.value} required>
                  </div>

                  <div class="field-row">
                    <label for="text">Description:</label>
                    <textarea id="text" @input=${e => this.newItem.text = e.target.value}></textarea>
                  </div>

                  <div class="field-row">
                    <label for="priority">Priority:</label>
                    <input id="priority" type="number" min="0" max="5" @input=${e => this.newItem.priority = parseInt(e.target.value)}>
                  </div>

                  <div class="field-row">
                    <label for="dueDate">Due Date:</label>
                    <input id="dueDate" type="date" @input=${e => this.newItem.dueDate = e.target.value}>
                  </div>

                  <div class="field-row">
                    <label for="dueTime">Due Time:</label>
                    <input id="dueTime" type="time" @input=${e => this.newItem.dueTime = e.target.value}>
                  </div>
                </fieldset>

                  <div class="dialog-button-row" style = "margin-top: 5px;">
                  <button class="button" type="submit">Add</button>
                  <button class="button" type="button" @click=${() => this.closeModal()}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
            
            ` : ''}
          



<!--construction -->

          </div>


        </div>
      </div>



        

          

      
      
      
      `}


  `;
}




_handleSubmit(e) {
  e.preventDefault();
  this.addData(); // addData will also reload the items
}

_handleDelete(e){
  e.preventDefault();
  const id = this.renderRoot.querySelector('#deleteID');
  const idValue = parseInt(id.value,10);
  if (!Number.isInteger(idValue)){
    alert("Enter a valid ID");
    return;
  }

  this.deleteData(idValue);

  id.value=  '';

}

toggleModal() {
  this.showFormModal = true;
}

closeModal(){
  this.showFormModal = false;
}

  // ----- Styles -----
 static styles = css`
  .submit-form {
  position: absolute;
  margin-left: -200px;
  
  }


  .window, .window-body, .window * {
      font-family: "MS Gothic", sans-serif !important;
      

      
  }

  .action-bar {
    display: flex;
  }

  .title-bar-text, th {
    font-size: 1.12em;
  }

  td {font-size: 0.8rem;}

 `
  





}


customElements.define('data-manager', DataManager);
