// Optimized CRM Application
class CRMApp {
  constructor() {
    this.currentModule = 'modules';
    this.currentView = 'home';
    this.leads = this.generateData('leads');
    this.contacts = this.generateData('contacts');
    this.deals = this.generateData('deals');
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderCards('leads-grid', this.leads, this.createLeadCard);
    this.renderCards('contacts-grid', this.contacts, this.createContactCard);
    this.renderDeals();
    this.setupDragAndDrop();
  }

  setupEventListeners() {
    // Navigation and sidebar
    document.querySelectorAll('.nav-btn, .sidebar-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-btn')) this.handleNavigation(e);
        else this.handleSidebarClick(e);
      });
    });

    // Search and filter
    ['leads-search', 'contacts-search'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', (e) => this.filterItems(e.target.value, id.split('-')[0]));
    });

    const leadsFilter = document.getElementById('leads-filter');
    if (leadsFilter) leadsFilter.addEventListener('change', (e) => this.filterByStatus(e.target.value));

    // Form and chat
    const leadForm = document.getElementById('lead-form');
    if (leadForm) leadForm.addEventListener('submit', (e) => this.handleLeadSubmit(e));

    const chatInput = document.getElementById('chat-input');
    if (chatInput) chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  handleNavigation(e) {
    const module = e.target.dataset.module;
    
    // Update UI
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    // Show content
    this.showContent(module);
    this.currentModule = module;
  }

  showContent(module) {
    // Hide all content
    document.querySelectorAll('.view, .scrollable-content').forEach(el => {
      el.classList.remove('active');
      el.classList.add('hidden');
    });

    // Show sidebar
    document.querySelectorAll('.sidebar-section').forEach(section => section.classList.add('hidden'));
    const sidebar = document.querySelector(`.sidebar-section[data-section="${module}"]`);
    if (sidebar) sidebar.classList.remove('hidden');

    // Show appropriate content
    if (module === 'modules') {
      document.getElementById('content').classList.remove('hidden');
      const view = document.querySelector(`.view[data-view="${this.currentView}"]`) || 
                   document.querySelector('.view[data-view="home"]');
      if (view) view.classList.add('active');
    } else if (module === 'profile') {
      document.getElementById('content').classList.remove('hidden');
      document.querySelector('.view[data-view="profile"]').classList.add('active');
    } else {
      const content = document.getElementById(`${module}-content`);
      if (content) content.classList.remove('hidden');
    }
  }

  handleSidebarClick(e) {
    const item = e.target;
    
    // Update active state
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    if (this.currentModule === 'modules') {
      const view = item.dataset.view;
      if (view) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const targetView = document.querySelector(`.view[data-view="${view}"]`);
        if (targetView) {
          targetView.classList.add('active');
          this.currentView = view;
        }
      }
    } else {
      const scrollTarget = item.dataset.scroll;
      if (scrollTarget) {
        const element = document.getElementById(scrollTarget);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // Generic data generation
  generateData(type) {
    const data = {
      leads: [
        { id: 1, name: 'Sarah Johnson', email: 'sarah@techcorp.com', company: 'Tech Corp', phone: '+1-555-0123', status: 'new' },
        { id: 2, name: 'Mike Chen', email: 'mike@innovate.io', company: 'Innovate Inc', phone: '+1-555-0124', status: 'contacted' },
        { id: 3, name: 'Emily Rodriguez', email: 'emily@startup.com', company: 'Startup Solutions', phone: '+1-555-0125', status: 'qualified' },
        { id: 4, name: 'David Kim', email: 'david@enterprise.net', company: 'Enterprise Networks', phone: '+1-555-0126', status: 'qualified' },
        { id: 5, name: 'Lisa Wang', email: 'lisa@digital.co', company: 'Digital Dynamics', phone: '+1-555-0127', status: 'contacted' },
        { id: 6, name: 'James Thompson', email: 'james@global.org', company: 'Global Solutions', phone: '+1-555-0128', status: 'new' }
      ],
      contacts: [
        { id: 1, name: 'John Doe', email: 'john@example.com', company: 'Example Corp', phone: '+1-555-0100' },
        { id: 2, name: 'Jane Smith', email: 'jane@demo.com', company: 'Demo Inc', phone: '+1-555-0101' },
        { id: 3, name: 'Bob Wilson', email: 'bob@test.org', company: 'Test Solutions', phone: '+1-555-0102' },
        { id: 4, name: 'Alice Brown', email: 'alice@sample.net', company: 'Sample Systems', phone: '+1-555-0103' }
      ],
      deals: {
        prospect: [
          { id: 1, title: 'Web Development Project', company: 'Tech Startup', value: '$25,000' },
          { id: 2, title: 'Mobile App Design', company: 'Digital Agency', value: '$18,000' }
        ],
        qualified: [
          { id: 3, title: 'Enterprise Software License', company: 'Big Corp', value: '$125,000' },
          { id: 4, title: 'Cloud Migration', company: 'Medium Business', value: '$45,000' },
          { id: 5, title: 'Security Audit', company: 'Finance Firm', value: '$32,000' }
        ],
        proposal: [
          { id: 6, title: 'CRM Implementation', company: 'Growing Company', value: '$85,000' },
          { id: 7, title: 'Data Analytics Platform', company: 'Retail Chain', value: '$95,000' }
        ],
        negotiation: [
          { id: 8, title: 'Marketing Automation', company: 'E-commerce Store', value: '$55,000' },
          { id: 9, title: 'Custom Integration', company: 'Manufacturing Co', value: '$75,000' }
        ],
        closed: [
          { id: 10, title: 'Website Redesign', company: 'Local Business', value: '$15,000' },
          { id: 11, title: 'IT Consulting', company: 'Professional Services', value: '$28,000' }
        ]
      }
    };
    return data[type];
  }

  // Generic card renderer
  renderCards(containerId, data, cardCreator) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = data.map(item => cardCreator(item)).join('');
  }

  createLeadCard(lead) {
    return `
      <div class="lead-card card" data-lead-id="${lead.id}">
        <div class="card-header">
          <div>
            <h3 class="card-title">${lead.name}</h3>
            <p class="card-subtitle">${lead.company}</p>
          </div>
          <span class="status-badge ${lead.status}">${lead.status}</span>
        </div>
        <div class="card-info">
          <p>📧 ${lead.email}</p>
          <p>📞 ${lead.phone}</p>
        </div>
        <div class="card-actions">
          <button class="btn btn-primary" onclick="app.editLead(${lead.id})">Edit</button>
          <button class="btn btn-secondary" onclick="app.deleteLead(${lead.id})">Delete</button>
        </div>
      </div>
    `;
  }

  createContactCard(contact) {
    return `
      <div class="contact-card card" data-contact-id="${contact.id}">
        <div class="card-header">
          <div>
            <h3 class="card-title">${contact.name}</h3>
            <p class="card-subtitle">${contact.company}</p>
          </div>
        </div>
        <div class="card-info">
          <p>📧 ${contact.email}</p>
          <p>📞 ${contact.phone}</p>
        </div>
        <div class="card-actions">
          <button class="btn btn-primary">Edit</button>
          <button class="btn btn-secondary">Delete</button>
        </div>
      </div>
    `;
  }

  renderDeals() {
    Object.keys(this.deals).forEach(stage => {
      const container = document.getElementById(`${stage}-deals`);
      if (!container) return;

      container.innerHTML = this.deals[stage].map(deal => `
        <div class="deal-card" data-deal-id="${deal.id}" data-stage="${stage}" draggable="true">
          <h4 class="deal-title">${deal.title}</h4>
          <p class="deal-company">${deal.company}</p>
          <p class="deal-value">${deal.value}</p>
        </div>
      `).join('');
    });
  }

  // Generic filter function
  filterItems(searchTerm, type) {
    const data = this[type];
    const searchProps = type === 'leads' ? ['name', 'company', 'email'] : ['name', 'company', 'email'];
    
    const filtered = data.filter(item => 
      searchProps.some(prop => 
        item[prop].toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const cardCreator = type === 'leads' ? this.createLeadCard : this.createContactCard;
    this.renderCards(`${type}-grid`, filtered, cardCreator);
  }

  filterByStatus(status) {
    const filtered = status === 'all' ? this.leads : this.leads.filter(lead => lead.status === status);
    this.renderCards('leads-grid', filtered, this.createLeadCard);
  }

  // Drag and Drop
  setupDragAndDrop() {
    document.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('deal-card')) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', JSON.stringify({
          dealId: e.target.dataset.dealId,
          currentStage: e.target.dataset.stage
        }));
      }
    });

    document.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('deal-card')) {
        e.target.classList.remove('dragging');
      }
    });

    document.querySelectorAll('.deals-list').forEach(list => {
      list.addEventListener('dragover', (e) => {
        e.preventDefault();
        list.classList.add('drag-over');
      });

      list.addEventListener('dragleave', (e) => {
        if (!list.contains(e.relatedTarget)) {
          list.classList.remove('drag-over');
        }
      });

      list.addEventListener('drop', (e) => {
        e.preventDefault();
        list.classList.remove('drag-over');
        
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const newStage = list.id.replace('-deals', '');
        
        if (data.currentStage !== newStage) {
          this.moveDeal(data.dealId, data.currentStage, newStage);
        }
      });
    });
  }

  moveDeal(dealId, fromStage, toStage) {
    const dealIndex = this.deals[fromStage].findIndex(deal => deal.id === parseInt(dealId));
    if (dealIndex === -1) return;

    const deal = this.deals[fromStage].splice(dealIndex, 1)[0];
    this.deals[toStage].push(deal);
    
    this.updateStageCounts();
    this.renderDeals();
    this.setupDragAndDrop();
  }

  updateStageCounts() {
    Object.keys(this.deals).forEach(stage => {
      const countElement = document.querySelector(`.pipeline-stage[data-stage="${stage}"] .stage-count`);
      if (countElement) {
        countElement.textContent = this.deals[stage].length;
      }
    });
  }

  // Form handling
  handleLeadSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const leadData = Object.fromEntries(formData);
    
    if (this.validateForm(leadData)) {
      const newLead = {
        id: Date.now(),
        name: leadData.name,
        email: leadData.email,
        company: leadData.company || 'N/A',
        phone: leadData.phone || 'N/A',
        status: leadData.status
      };
      
      this.leads.unshift(newLead);
      this.renderCards('leads-grid', this.leads, this.createLeadCard);
      this.hideLeadForm();
      this.showNotification('Lead added successfully!', 'success');
    }
  }

  validateForm(data) {
    let isValid = true;
    
    // Clear errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
    // Validate name
    if (!data.name || data.name.trim().length < 2) {
      document.getElementById('name-error').textContent = 'Name must be at least 2 characters long';
      isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      document.getElementById('email-error').textContent = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Validate phone
    if (data.phone && data.phone.length > 0) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(data.phone)) {
        document.getElementById('phone-error').textContent = 'Please enter a valid phone number';
        isValid = false;
      }
    }
    
    return isValid;
  }

  // Utility functions
  editLead(leadId) {
    const lead = this.leads.find(l => l.id === leadId);
    if (lead) {
      ['name', 'email', 'company', 'phone', 'status'].forEach(field => {
        const el = document.getElementById(`lead-${field}`);
        if (el) el.value = lead[field];
      });
      this.showLeadForm();
    }
  }

  deleteLead(leadId) {
    if (confirm('Are you sure you want to delete this lead?')) {
      this.leads = this.leads.filter(l => l.id !== leadId);
      this.renderCards('leads-grid', this.leads, this.createLeadCard);
      this.showNotification('Lead deleted successfully', 'success');
    }
  }

  showLeadForm() {
    document.getElementById('lead-modal').classList.remove('hidden');
    document.getElementById('lead-name').focus();
  }

  hideLeadForm() {
    document.getElementById('lead-modal').classList.add('hidden');
    document.getElementById('lead-form').reset();
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; padding: 12px 24px;
      border-radius: 8px; color: white; font-weight: 500; z-index: 1001;
      animation: slideIn 0.3s ease-out;
      background-color: ${type === 'success' ? 'var(--secondary-green)' : 'var(--info-blue)'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (message) {
      this.addChatMessage(message, 'user');
      input.value = '';
      
      setTimeout(() => {
        const responses = [
          "I can help you navigate the CRM. What specific feature would you like to learn about?",
          "To add a new lead, click the 'Add Lead' button in the Leads section.",
          "You can drag and drop deals between pipeline stages to update their status.",
          "Use the search bar to quickly find leads or contacts.",
          "The dashboard shows your key metrics and recent activity.",
          "Would you like me to explain how to use any specific feature?"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.addChatMessage(randomResponse, 'bot');
      }, 1000);
    }
  }

  addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// Global functions for HTML onclick handlers
function showLeadForm() { app.showLeadForm(); }
function hideLeadForm() { app.hideLeadForm(); }
function toggleChat() {
  document.getElementById('chat-content').classList.toggle('hidden');
}
function sendMessage() { app.sendMessage(); }

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Initialize app
const app = new CRMApp();

// Event handlers
window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.sidebar-menu').forEach(menu => {
      menu.style.display = 'flex';
    });
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.add('hidden');
    });
  }
});

// Initial responsive check
if (window.innerWidth <= 768) {
  document.querySelectorAll('.sidebar-menu').forEach(menu => {
    menu.style.display = 'flex';
  });
}