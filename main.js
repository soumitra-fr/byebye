// Optimized CRM Application with Universal Card Component
class CRMApp {
  constructor() {
    this.currentModule = 'modules';
    this.currentView = 'home';
    this.leads = this.generateData('leads');
    this.contacts = this.generateData('contacts');
    this.deals = this.generateData('deals');
    this.reports = this.generateData('reports');
    this.analytics = this.generateData('analytics');
    this.requests = this.generateData('requests');
    this.relationshipIntelligence = this.generateData('relationshipIntelligence');
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderCards('leads-grid', this.leads, this.createLeadCard);
    this.renderCards('contacts-grid', this.contacts, this.createContactCard);
    this.renderDeals();
    this.renderReports();
    this.renderAnalytics();
    this.renderRequests();
    this.renderRelationshipIntelligence();
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

  // Universal Card Component
  createGenericCard(config) {
    const {
      id = '',
      type = 'generic',
      classes = '',
      dataAttributes = {},
      header = {},
      body = '',
      actions = [],
      draggable = false
    } = config;

    // Build data attributes string
    const dataAttrs = Object.entries(dataAttributes)
      .map(([key, value]) => `data-${key}="${value}"`)
      .join(' ');

    // Build header content
    let headerContent = '';
    if (header.title || header.subtitle || header.badge) {
      headerContent = `
        <div class="card-header">
          <div>
            ${header.title ? `<h3 class="card-title">${header.title}</h3>` : ''}
            ${header.subtitle ? `<p class="card-subtitle">${header.subtitle}</p>` : ''}
          </div>
          ${header.badge ? `<span class="status-badge ${header.badge.class || ''}">${header.badge.text}</span>` : ''}
          ${header.icon ? `<div class="card-icon">${header.icon}</div>` : ''}
        </div>
      `;
    }

    // Build actions content
    let actionsContent = '';
    if (actions.length > 0) {
      const actionButtons = actions.map(action => 
        `<button class="btn ${action.class || 'btn-secondary'}" ${action.onclick ? `onclick="${action.onclick}"` : ''}>${action.text}</button>`
      ).join('');
      actionsContent = `<div class="card-actions">${actionButtons}</div>`;
    }

    return `
      <div class="card ${type}-card ${classes}" 
           ${id ? `id="${id}"` : ''} 
           ${dataAttrs} 
           ${draggable ? 'draggable="true"' : ''}>
        ${headerContent}
        ${body ? `<div class="card-body">${body}</div>` : ''}
        ${actionsContent}
      </div>
    `;
  }

  // Enhanced data generation with more types
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
      },
      reports: [
        { id: 1, title: 'Lead Conversion Report', description: 'Track lead to customer conversion rates', type: 'conversion' },
        { id: 2, title: 'Sales Performance', description: 'Monthly sales team performance metrics', type: 'performance' },
        { id: 3, title: 'Revenue Analysis', description: 'Comprehensive revenue breakdown by quarter', type: 'revenue' },
        { id: 4, title: 'Daily Dashboard', description: 'Key metrics and KPIs at a glance', type: 'dashboard' }
      ],
      analytics: [
        { id: 1, title: 'Revenue Trend', value: '$847K', change: '+15%', type: 'positive' },
        { id: 2, title: 'Lead Sources', value: '2,847', change: '+12%', type: 'positive' },
        { id: 3, title: 'Conversion Rate', value: '23%', change: '-2%', type: 'negative' },
        { id: 4, title: 'Avg Deal Size', value: '$12,450', change: '+8.3%', type: 'positive' }
      ],
      requests: [
        { id: 1, title: 'Discount Approval', description: '15% discount for Enterprise deal', status: 'pending', date: '2 days ago' },
        { id: 2, title: 'Price Override', description: 'Custom pricing for bulk order', status: 'approved', date: '1 week ago' },
        { id: 3, title: 'Extended Trial', description: '30-day trial extension request', status: 'rejected', date: '3 days ago' }
      ],
      relationshipIntelligence: [
        { 
          id: 1, 
          name: 'Sarah Johnson', 
          company: 'Tech Corp', 
          healthScore: 92, 
          sentiment: 'positive', 
          lastContact: '2 days ago',
          riskLevel: 'low',
          communicationFreq: 'high',
          responseTime: '1.2 hours',
          engagementTrend: 'increasing'
        },
        { 
          id: 2, 
          name: 'Mike Chen', 
          company: 'Innovate Inc', 
          healthScore: 67, 
          sentiment: 'neutral', 
          lastContact: '1 week ago',
          riskLevel: 'medium',
          communicationFreq: 'medium',
          responseTime: '4.5 hours',
          engagementTrend: 'stable'
        },
        { 
          id: 3, 
          name: 'Emily Rodriguez', 
          company: 'Startup Solutions', 
          healthScore: 34, 
          sentiment: 'negative', 
          lastContact: '2 weeks ago',
          riskLevel: 'high',
          communicationFreq: 'low',
          responseTime: '12+ hours',
          engagementTrend: 'decreasing'
        },
        { 
          id: 4, 
          name: 'David Kim', 
          company: 'Enterprise Networks', 
          healthScore: 88, 
          sentiment: 'positive', 
          lastContact: '1 day ago',
          riskLevel: 'low',
          communicationFreq: 'high',
          responseTime: '0.8 hours',
          engagementTrend: 'increasing'
        },
        { 
          id: 5, 
          name: 'Lisa Wang', 
          company: 'Digital Dynamics', 
          healthScore: 45, 
          sentiment: 'neutral', 
          lastContact: '10 days ago',
          riskLevel: 'high',
          communicationFreq: 'low',
          responseTime: '8+ hours',
          engagementTrend: 'decreasing'
        }
      ]
    };
    return data[type];
  }

  // Generic card renderer
  renderCards(containerId, data, cardCreator) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = data.map(item => cardCreator.call(this, item)).join('');
  }

  // Refactored card creators using universal component
  createLeadCard(lead) {
    return this.createGenericCard({
      type: 'lead',
      dataAttributes: { 'lead-id': lead.id },
      header: {
        title: lead.name,
        subtitle: lead.company,
        badge: { text: lead.status, class: lead.status }
      },
      body: `
        <div class="card-info">
          <p>📧 ${lead.email}</p>
          <p>📞 ${lead.phone}</p>
        </div>
      `,
      actions: [
        { text: 'Edit', class: 'btn btn-primary', onclick: `app.editLead(${lead.id})` },
        { text: 'Delete', class: 'btn btn-secondary', onclick: `app.deleteLead(${lead.id})` }
      ]
    });
  }

  createContactCard(contact) {
    return this.createGenericCard({
      type: 'contact',
      dataAttributes: { 'contact-id': contact.id },
      header: {
        title: contact.name,
        subtitle: contact.company
      },
      body: `
        <div class="card-info">
          <p>📧 ${contact.email}</p>
          <p>📞 ${contact.phone}</p>
        </div>
      `,
      actions: [
        { text: 'Edit', class: 'btn btn-primary' },
        { text: 'Delete', class: 'btn btn-secondary' }
      ]
    });
  }

  createDealCard(deal, stage) {
    return this.createGenericCard({
      type: 'deal',
      classes: 'deal-card',
      dataAttributes: { 'deal-id': deal.id, 'stage': stage },
      draggable: true,
      body: `
        <h4 class="deal-title">${deal.title}</h4>
        <p class="deal-company">${deal.company}</p>
        <p class="deal-value">${deal.value}</p>
      `
    });
  }

  createReportCard(report) {
    return this.createGenericCard({
      type: 'report',
      dataAttributes: { 'report-id': report.id },
      header: {
        title: report.title
      },
      body: `
        <div class="card-info">
          <p>${report.description}</p>
        </div>
      `,
      actions: [
        { text: 'View', class: 'btn btn-secondary' },
        { text: 'Edit', class: 'btn btn-secondary' }
      ]
    });
  }

  createAnalyticsCard(analytics) {
    const changeClass = analytics.type === 'positive' ? 'positive' : 'negative';
    return this.createGenericCard({
      type: 'analytics',
      classes: 'stat-card',
      dataAttributes: { 'analytics-id': analytics.id },
      header: {
        title: analytics.title,
        icon: `
          <div class="stat-icon">
            <svg viewBox="0 0 24 24">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
        `
      },
      body: `
        <div class="stat-content">
          <p class="stat-number">${analytics.value}</p>
          <span class="stat-change ${changeClass}">${analytics.change} from last month</span>
        </div>
      `
    });
  }

  createRequestCard(request) {
    return this.createGenericCard({
      type: 'request',
      dataAttributes: { 'request-id': request.id },
      header: {
        title: request.title,
        badge: { text: request.status, class: request.status }
      },
      body: `
        <div class="card-info">
          <p>${request.description}</p>
          <span class="request-date">${request.date}</span>
        </div>
      `,
      actions: request.status === 'pending' ? [
        { text: 'Approve', class: 'btn btn-success' },
        { text: 'Reject', class: 'btn btn-danger' }
      ] : []
    });
  }

  createRelationshipIntelligenceCard(customer) {
    const healthClass = customer.healthScore >= 80 ? 'healthy' : customer.healthScore >= 50 ? 'warning' : 'critical';
    const sentimentEmoji = customer.sentiment === 'positive' ? '😊' : customer.sentiment === 'neutral' ? '😐' : '😟';
    
    return this.createGenericCard({
      type: 'ri-customer',
      classes: `ri-customer-card ${healthClass}`,
      dataAttributes: { 'customer-id': customer.id },
      header: {
        title: customer.name,
        subtitle: customer.company,
        badge: { text: customer.riskLevel.toUpperCase(), class: `risk-${customer.riskLevel}` }
      },
      body: `
        <div class="ri-health-bar">
          <div class="health-score-label">Health Score</div>
          <div class="health-bar">
            <div class="health-fill ${healthClass}" style="width: ${customer.healthScore}%"></div>
            <span class="health-score">${customer.healthScore}/100</span>
          </div>
        </div>
        <div class="ri-insights">
          <div class="insight-item">
            <span class="insight-label">Sentiment:</span>
            <span class="insight-value">${sentimentEmoji} ${customer.sentiment}</span>
          </div>
          <div class="insight-item">
            <span class="insight-label">Last Contact:</span>
            <span class="insight-value">${customer.lastContact}</span>
          </div>
          <div class="insight-item">
            <span class="insight-label">Response Time:</span>
            <span class="insight-value">${customer.responseTime}</span>
          </div>
          <div class="insight-item">
            <span class="insight-label">Engagement:</span>
            <span class="insight-value trend-${customer.engagementTrend}">${customer.engagementTrend}</span>
          </div>
        </div>
      `,
      actions: [
        { text: 'View Details', class: 'btn btn-primary' },
        { text: 'Contact', class: 'btn btn-secondary' }
      ]
    });
  }

  // Enhanced render methods
  renderDeals() {
    Object.keys(this.deals).forEach(stage => {
      const container = document.getElementById(`${stage}-deals`);
      if (!container) return;

      container.innerHTML = this.deals[stage].map(deal => 
        this.createDealCard(deal, stage)
      ).join('');
    });
  }

  renderReports() {
    // Render reports in their respective sections
    const sections = ['my-reports', 'all-reports', 'favourites', 'shared-reports'];
    sections.forEach((section, index) => {
      const container = document.querySelector(`#${section} .reports-grid`);
      if (container) {
        const sectionReports = this.reports.slice(index, index + 2); // Distribute reports
        container.innerHTML = sectionReports.map(report => 
          this.createReportCard(report)
        ).join('');
      }
    });
  }

  renderAnalytics() {
    const container = document.querySelector('#dashboard .analytics-grid');
    if (container) {
      container.innerHTML = this.analytics.map(analytics => 
        this.createAnalyticsCard(analytics)
      ).join('');
    }
  }

  renderRequests() {
    const sections = ['pending', 'approved', 'rejected'];
    sections.forEach(section => {
      const container = document.querySelector(`#${section} .requests-list`);
      if (container) {
        const sectionRequests = this.requests.filter(req => req.status === section);
        container.innerHTML = sectionRequests.map(request => 
          this.createRequestCard(request)
        ).join('');
      }
    });
  }

  renderRelationshipIntelligence() {
    const container = document.getElementById('ri-customer-grid');
    if (container) {
      container.innerHTML = this.relationshipIntelligence.map(customer => 
        this.createRelationshipIntelligenceCard(customer)
      ).join('');
    }
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
          "The Relationship Intelligence panel provides insights into customer health and sentiment.",
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