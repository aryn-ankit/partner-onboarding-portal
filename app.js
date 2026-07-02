/**
 * Servify Partner Onboarding Portal (POP) MVP
 * State Management, Routing, Wizard Flows, and Demo Mechanics
 */

class PartnerOnboardingPortal {
  constructor() {
    this.currentRole = 'Specialist'; // Default: Specialist
    this.currentView = 'dashboard';
    this.partners = [];
    
    // Wizard state
    this.wizardStep = 1;
    this.wizardData = {
      name: '',
      type: '',
      country: '',
      currency: 'USD',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      selectedTemplateId: '',
      programConfig: {
        duration: '24',
        deductible: 49,
        pricingType: 'flat',
        pricingVal: 99
      },
      sandboxClientId: '',
      sandboxClientSecret: '',
      webhookUrl: '',
      status: 'Draft',
      history: []
    };

    // Predefined standard program templates
    this.templates = [
      {
        id: 'adld',
        name: 'Accidental & Liquid Damage (ADLD)',
        description: 'Comprehensive coverage protecting devices against drops, spillages, liquid immersion, and screen breaks.',
        durations: ['12', '24'],
        defaultDeductible: 49,
        defaultPricingVal: 99,
        defaultPricingType: 'flat',
        category: 'Damage Protection'
      },
      {
        id: 'ew',
        name: 'Extended Warranty (EW)',
        description: 'Extends the manufacturer\'s original mechanical and electrical breakdown warranty coverage after expiry.',
        durations: ['12', '24', '36'],
        defaultDeductible: 0,
        defaultPricingVal: 79,
        defaultPricingType: 'flat',
        category: 'Warranty'
      },
      {
        id: 'theft',
        name: 'Theft Protection',
        description: 'Coverage against theft, burglary, and robbery. Requires standard police reporting verification.',
        durations: ['12', '24'],
        defaultDeductible: 99,
        defaultPricingVal: 129,
        defaultPricingType: 'flat',
        category: 'Loss Protection'
      }
    ];

    this.selectedPartnerId = null;

    // Initialize DOM binds
    window.addEventListener('DOMContentLoaded', () => {
      this.init();
    });
  }

  init() {
    this.loadDatabase();
    this.bindEvents();
    this.renderSidebarAndHeader();
    this.renderDashboardMetrics();
    this.renderPartnersTable();
    this.renderTemplatesTab();
    this.setupRouter();
    
    // Initialise Lucide icons
    lucide.createIcons();
  }

  // --- PERSISTENCE LAYER ---
  loadDatabase() {
    const saved = localStorage.getItem('servify_pop_partners');
    if (saved) {
      this.partners = JSON.parse(saved);
    } else {
      this.loadDefaults();
    }
  }

  saveDatabase() {
    localStorage.setItem('servify_pop_partners', JSON.stringify(this.partners));
    this.renderDashboardMetrics();
    this.renderPartnersTable();
  }

  loadDefaults() {
    this.partners = [
      {
        id: 'p-101',
        name: 'Apple Retail US',
        type: 'OEM',
        country: 'United States',
        currency: 'USD',
        contactName: 'Sarah Jenkins',
        contactEmail: 'sjenkins@apple.com',
        contactPhone: '+1 (408) 996-1010',
        selectedTemplateId: 'adld',
        programConfig: {
          duration: '24',
          deductible: 49,
          pricingType: 'flat',
          pricingVal: 129
        },
        sandboxClientId: 'sp_sb_3a8b291c920f',
        sandboxClientSecret: 'sp_sec_sb_9f82dcd23910ab38d7c',
        prodClientId: 'sp_prod_0f293b281dcc',
        prodClientSecret: 'sp_sec_prod_4d92a10be28c83a0029c',
        webhookUrl: 'https://api.apple.com/v1/servify-webhook',
        status: 'Live',
        updatedAt: '2026-07-01T10:30:00Z',
        history: [
          { time: '2026-06-28T09:00:00Z', text: 'Partner profile initiated', user: 'Ankit Sharma' },
          { time: '2026-06-28T10:15:00Z', text: 'Configured ADLD protection program', user: 'Ankit Sharma' },
          { time: '2026-06-28T11:00:00Z', text: 'Generated Sandbox credentials', user: 'Ankit Sharma' },
          { time: '2026-06-29T14:20:00Z', text: 'Submitted for manager review', user: 'Ankit Sharma' },
          { time: '2026-06-30T10:00:00Z', text: 'Approved & Pushed to Production', user: 'Ops Manager' },
          { time: '2026-07-01T10:30:00Z', text: 'Marked partner as Live/Active', user: 'Ankit Sharma' }
        ]
      },
      {
        id: 'p-102',
        name: 'Samsung India',
        type: 'OEM',
        country: 'India',
        currency: 'INR',
        contactName: 'Rajesh Kumar',
        contactEmail: 'rajesh.k@samsung.com',
        contactPhone: '+91 98765 43210',
        selectedTemplateId: 'ew',
        programConfig: {
          duration: '12',
          deductible: 500,
          pricingType: 'percentage',
          pricingVal: 3.5
        },
        sandboxClientId: 'sp_sb_d291fa0910ee',
        sandboxClientSecret: 'sp_sec_sb_bb88290cdc0192bc7b0',
        webhookUrl: 'https://claims.samsungcare.co.in/hooks/servify',
        status: 'Pending Review',
        updatedAt: '2026-07-02T06:45:00Z',
        history: [
          { time: '2026-07-02T06:00:00Z', text: 'Partner profile initiated', user: 'Ankit Sharma' },
          { time: '2026-07-02T06:30:00Z', text: 'Configured Extended Warranty program', user: 'Ankit Sharma' },
          { time: '2026-07-02T06:40:00Z', text: 'Generated Sandbox credentials & configured webhook', user: 'Ankit Sharma' },
          { time: '2026-07-02T06:45:00Z', text: 'Submitted for manager review', user: 'Ankit Sharma' }
        ]
      },
      {
        id: 'p-103',
        name: 'Best Buy Retailers',
        type: 'Retailer',
        country: 'United States',
        currency: 'USD',
        contactName: 'David Miller',
        contactEmail: 'david.miller@bestbuy.com',
        contactPhone: '+1 (612) 291-1000',
        selectedTemplateId: 'theft',
        programConfig: {
          duration: '24',
          deductible: 99,
          pricingType: 'flat',
          pricingVal: 149
        },
        sandboxClientId: 'sp_sb_ec91bb20dc10',
        sandboxClientSecret: 'sp_sec_sb_4f923bcd109efab2',
        webhookUrl: '',
        status: 'Draft',
        updatedAt: '2026-07-02T08:15:00Z',
        history: [
          { time: '2026-07-02T08:00:00Z', text: 'Partner profile initiated', user: 'Ankit Sharma' },
          { time: '2026-07-02T08:15:00Z', text: 'Configured Theft Protection program & saved draft', user: 'Ankit Sharma' }
        ]
      }
    ];
    this.saveDatabase();
  }

  // --- ROUTER & VIEW MANAGEMENT ---
  setupRouter() {
    const handleHash = () => {
      const hash = window.location.hash || '#dashboard';
      const view = hash.replace('#', '');
      
      // Separate routing if details page or wizard
      if (view.startsWith('partner-details/')) {
        const id = view.split('/')[1];
        this.showPartnerDetails(id);
      } else {
        this.switchView(view);
      }
    };
    
    window.addEventListener('hashchange', handleHash);
    // Trigger on load
    handleHash();
  }

  switchView(viewId) {
    if (!['dashboard', 'partners', 'programs', 'settings', 'wizard', 'partner-details'].includes(viewId.split('/')[0])) {
      viewId = 'dashboard';
    }
    
    this.currentView = viewId;
    
    // Hide all views, show active one
    document.querySelectorAll('.content-view').forEach(view => {
      view.classList.remove('active');
    });
    
    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
      targetView.classList.add('active');
    }
    
    // Update sidebar active menu link
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      }
    });
    
    // Header title context
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    
    switch (viewId) {
      case 'dashboard':
        pageTitle.innerText = 'Dashboard';
        pageSubtitle.innerText = 'Overview of your partner pipeline and program statuses';
        this.renderDashboardMetrics();
        this.renderPartnersTable();
        break;
      case 'partners':
        pageTitle.innerText = 'Partners';
        pageSubtitle.innerText = 'Full list of registered and onboarding partners';
        this.renderAllPartnersTable();
        break;
      case 'programs':
        pageTitle.innerText = 'Program Templates';
        pageSubtitle.innerText = 'View available device protection configurations';
        break;
      case 'settings':
        pageTitle.innerText = 'Portal Settings';
        pageSubtitle.innerText = 'Manage role permissions and portal mock data';
        break;
      case 'wizard':
        pageTitle.innerText = 'Partner Onboarding';
        pageSubtitle.innerText = 'Wizard-driven configurations for device protection';
        break;
    }
    
    // Re-trigger Lucide icons render
    lucide.createIcons();
  }

  // --- ACTIONS ---
  setRole(role) {
    this.currentRole = role;
    
    // Update active visual status in Settings view
    document.querySelectorAll('.role-card').forEach(card => card.classList.remove('active'));
    if (role === 'Specialist') {
      document.getElementById('role-card-specialist').classList.add('active');
      document.getElementById('display-user-name').innerText = 'Ankit Sharma';
      document.getElementById('display-user-role').innerText = 'Onboarding Specialist';
      document.getElementById('user-initials').innerText = 'AS';
      document.getElementById('header-role-pill').className = 'role-pill';
      document.getElementById('role-pill-text').innerText = 'Specialist View';
    } else {
      document.getElementById('role-card-manager').classList.add('active');
      document.getElementById('display-user-name').innerText = 'Elena Rostova';
      document.getElementById('display-user-role').innerText = 'Operations Manager';
      document.getElementById('user-initials').innerText = 'ER';
      document.getElementById('header-role-pill').className = 'role-pill text-emerald';
      document.getElementById('role-pill-text').innerText = 'Manager View';
    }
    
    this.renderSidebarAndHeader();
    this.showToast(`Switched simulation role to ${role}`, 'info');
    
    // If details screen is currently open, refresh to show new buttons
    if (this.currentView === 'partner-details' && this.selectedPartnerId) {
      this.showPartnerDetails(this.selectedPartnerId);
    }
  }

  // --- RENDERING HANDLERS ---
  renderSidebarAndHeader() {
    // Hide or show special onboarding buttons based on role if needed, 
    // but both specialists and managers can start onboarding or view details in MVP.
  }

  renderDashboardMetrics() {
    const total = this.partners.length;
    const active = this.partners.filter(p => p.status === 'Live').length;
    const pending = this.partners.filter(p => p.status === 'Pending Review').length;
    const draft = this.partners.filter(p => p.status === 'Draft').length;

    document.getElementById('val-total-partners').innerText = total;
    document.getElementById('val-active-partners').innerText = active;
    document.getElementById('val-pending-partners').innerText = pending;
    document.getElementById('val-draft-partners').innerText = draft;
  }

  renderPartnersTable() {
    const tbody = document.getElementById('partners-table-body');
    tbody.innerHTML = '';
    
    const searchVal = document.getElementById('partner-search').value.toLowerCase();
    const stageVal = document.getElementById('stage-filter').value;
    
    const filtered = this.partners.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchVal) || p.type.toLowerCase().includes(searchVal);
      const matchStage = stageVal === 'all' || p.status === stageVal;
      return matchSearch && matchStage;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-muted text-center" style="padding: 40px 0;">No partners match the filters.</td></tr>`;
      return;
    }

    filtered.forEach(p => {
      const tr = document.createElement('tr');
      
      const badgeClass = this.getBadgeClass(p.status);
      const dateFormatted = new Date(p.updatedAt).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      
      const templateName = this.templates.find(t => t.id === p.selectedTemplateId)?.name || 'None';

      tr.innerHTML = `
        <td><strong class="text-white">${p.name}</strong></td>
        <td>${p.type}</td>
        <td>${p.country}</td>
        <td class="text-sm">${templateName}</td>
        <td><span class="badge ${badgeClass}">${p.status}</span></td>
        <td class="text-sm text-muted">${dateFormatted}</td>
        <td class="text-right">
          <button class="btn btn-secondary btn-xs" onclick="app.navigateToPartner('${p.id}')">
            <i data-lucide="eye" style="width: 14px; height: 14px; margin-right: 4px;"></i> View
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderAllPartnersTable() {
    const tbody = document.getElementById('all-partners-table-body');
    tbody.innerHTML = '';
    
    const searchVal = document.getElementById('all-partners-search').value.toLowerCase();
    
    const filtered = this.partners.filter(p => {
      return p.name.toLowerCase().includes(searchVal) || 
             p.type.toLowerCase().includes(searchVal) || 
             p.country.toLowerCase().includes(searchVal);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-muted text-center" style="padding: 40px 0;">No partners found.</td></tr>`;
      return;
    }

    filtered.forEach(p => {
      const tr = document.createElement('tr');
      const badgeClass = this.getBadgeClass(p.status);
      const templateName = this.templates.find(t => t.id === p.selectedTemplateId)?.name || 'None';

      tr.innerHTML = `
        <td><strong class="text-white">${p.name}</strong></td>
        <td>${p.type}</td>
        <td>${p.country}</td>
        <td class="text-sm">
          <div>${p.contactName}</div>
          <div class="text-muted text-xs">${p.contactEmail}</div>
        </td>
        <td class="text-sm">${templateName}</td>
        <td><span class="badge ${badgeClass}">${p.status}</span></td>
        <td class="text-right">
          <button class="btn btn-secondary btn-xs" onclick="app.navigateToPartner('${p.id}')">
            <i data-lucide="eye" style="width: 14px; height: 14px; margin-right: 4px;"></i> Open
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderTemplatesTab() {
    const container = document.getElementById('templates-container');
    container.innerHTML = '';
    
    this.templates.forEach(t => {
      const card = document.createElement('div');
      card.className = 'program-template-card';
      
      card.innerHTML = `
        <div>
          <span class="template-badge">${t.category}</span>
          <h3>${t.name}</h3>
          <p>${t.description}</p>
        </div>
        <div class="template-metadata">
          <span>Standard Deductible: $${t.defaultDeductible}</span>
          <span>Base Premium: $${t.defaultPricingVal}</span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  getBadgeClass(status) {
    switch (status) {
      case 'Draft': return 'badge-draft';
      case 'Pending Review': return 'badge-pending';
      case 'Approved': return 'badge-approved';
      case 'Live': return 'badge-live';
      default: return 'badge-draft';
    }
  }

  navigateToPartner(id) {
    window.location.hash = `#partner-details/${id}`;
  }

  // --- PARTNER DETAILS VIEW ---
  showPartnerDetails(id) {
    this.selectedPartnerId = id;
    this.currentView = 'partner-details';
    
    // Find partner
    const partner = this.partners.find(p => p.id === id);
    if (!partner) {
      this.showToast('Partner not found', 'error');
      window.location.hash = '#dashboard';
      return;
    }
    
    // Show details container
    document.querySelectorAll('.content-view').forEach(view => view.classList.remove('active'));
    document.getElementById('view-partner-details').classList.add('active');
    
    // Set headers
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    pageTitle.innerText = partner.name;
    pageSubtitle.innerText = `Details, Coverages, and API logs for ${partner.name}`;

    // Fill profile fields
    document.getElementById('detail-partner-name').innerText = partner.name;
    document.getElementById('detail-partner-subtitle').innerText = `${partner.type} • ${partner.country}`;
    
    const badge = document.getElementById('detail-partner-badge');
    badge.innerText = partner.status;
    badge.className = `badge ${this.getBadgeClass(partner.status)}`;
    
    document.getElementById('detail-type').innerText = partner.type;
    document.getElementById('detail-country').innerText = partner.country;
    document.getElementById('detail-currency').innerText = partner.currency;
    document.getElementById('detail-contact-name').innerText = partner.contactName;
    document.getElementById('detail-contact-email').innerText = partner.contactEmail;
    document.getElementById('detail-contact-phone').innerText = partner.contactPhone;

    // Programs configuration
    const programsList = document.getElementById('detail-programs-list');
    programsList.innerHTML = '';
    
    const template = this.templates.find(t => t.id === partner.selectedTemplateId);
    if (template) {
      const progCard = document.createElement('div');
      progCard.className = 'configured-program-card';
      
      const config = partner.programConfig;
      const currencySymbol = this.getCurrencySymbol(partner.currency);
      const pricingDisplay = config.pricingType === 'flat' 
        ? `${currencySymbol}${config.pricingVal}` 
        : `${config.pricingVal}% of Device Price`;
      
      progCard.innerHTML = `
        <div class="prog-info">
          <h4>${template.name}</h4>
          <p>${template.description}</p>
        </div>
        <div class="prog-stats">
          <div class="stat-pill">
            <span class="stat-lbl">Duration</span>
            <span class="stat-val">${config.duration} Months</span>
          </div>
          <div class="stat-pill">
            <span class="stat-lbl">Deductible</span>
            <span class="stat-val">${currencySymbol}${config.deductible}</span>
          </div>
          <div class="stat-pill">
            <span class="stat-lbl">Pricing</span>
            <span class="stat-val">${pricingDisplay}</span>
          </div>
        </div>
      `;
      programsList.appendChild(progCard);
    } else {
      programsList.innerHTML = `<p class="text-muted italic">No programs configured.</p>`;
    }

    // Credentials Card
    document.getElementById('detail-sandbox-id').innerText = partner.sandboxClientId || 'None';
    document.getElementById('detail-webhook-url').innerText = partner.webhookUrl || 'Not configured';
    
    // Hide or show prod credentials
    const prodSection = document.getElementById('detail-prod-credentials-section');
    const prodId = document.getElementById('detail-prod-id');
    const prodSecret = document.getElementById('detail-prod-secret');
    const prodMsg = document.getElementById('detail-prod-pending-msg');
    const prodIdRow = document.getElementById('detail-prod-id-row');
    const prodSecretRow = document.getElementById('detail-prod-secret-row');
    
    if (partner.status === 'Live') {
      prodSection.classList.remove('hidden');
      prodMsg.classList.add('hidden');
      prodIdRow.classList.remove('hidden');
      prodSecretRow.classList.remove('hidden');
      prodId.innerText = partner.prodClientId || 'sp_prod_xxxxxxxxxxxx';
      prodSecret.innerText = partner.prodClientSecret || 'sp_sec_prod_xxxxxxxxxxxxxxxxxxxxxxxx';
    } else if (partner.status === 'Approved') {
      prodSection.classList.remove('hidden');
      prodMsg.className = 'text-xs text-muted italic margin-bottom-xs';
      prodMsg.innerText = 'Ready for production activation. Click "Activate & Go Live" above.';
      prodIdRow.classList.add('hidden');
      prodSecretRow.classList.add('hidden');
    } else {
      prodSection.classList.remove('hidden');
      prodMsg.className = 'text-xs text-muted italic';
      prodMsg.innerText = 'Credentials will be activated upon Manager approval.';
      prodIdRow.classList.add('hidden');
      prodSecretRow.classList.add('hidden');
    }

    // Build timeline logs
    const timeline = document.getElementById('detail-activity-log');
    timeline.innerHTML = '';
    
    if (partner.history && partner.history.length > 0) {
      partner.history.slice().reverse().forEach((h, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        if (index === 0) item.classList.add('active-event');
        else if (h.text.includes('review')) item.classList.add('pending-event');
        else item.classList.add('create-event');
        
        const dateFormatted = new Date(h.time).toLocaleDateString(undefined, {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        
        item.innerHTML = `
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <span class="timeline-time">${dateFormatted}</span>
            <span class="timeline-text">${h.text}</span>
            <span class="timeline-user">by ${h.user}</span>
          </div>
        `;
        timeline.appendChild(item);
      });
    }

    // Actions panel configuration
    const actionPanel = document.getElementById('detail-actions-panel');
    actionPanel.innerHTML = '';
    
    // Context buttons based on stage and role
    if (partner.status === 'Draft') {
      if (this.currentRole === 'Specialist') {
        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn btn-primary';
        btnEdit.innerHTML = `<i data-lucide="edit-3"></i> <span>Resume Onboarding</span>`;
        btnEdit.onclick = () => this.resumeWizard(partner.id);
        actionPanel.appendChild(btnEdit);
      }
    } else if (partner.status === 'Pending Review') {
      if (this.currentRole === 'Manager') {
        const btnApprove = document.createElement('button');
        btnApprove.className = 'btn btn-primary';
        btnApprove.innerHTML = `<i data-lucide="shield-check"></i> <span>Approve Partner</span>`;
        btnApprove.onclick = () => this.approvePartner(partner.id);
        actionPanel.appendChild(btnApprove);
      } else {
        // Specialist views review
        actionPanel.innerHTML = `<span class="text-muted text-sm italic">Pending manager review and approval.</span>`;
      }
    } else if (partner.status === 'Approved') {
      if (this.currentRole === 'Specialist') {
        const btnGoLive = document.createElement('button');
        btnGoLive.className = 'btn btn-primary';
        btnGoLive.innerHTML = `<i data-lucide="play"></i> <span>Activate & Go Live</span>`;
        btnGoLive.onclick = () => this.activatePartner(partner.id);
        actionPanel.appendChild(btnGoLive);
      } else {
        actionPanel.innerHTML = `<span class="text-muted text-sm italic">Waiting for specialist to trigger production Go Live.</span>`;
      }
    } else if (partner.status === 'Live') {
      actionPanel.innerHTML = `<span class="text-emerald text-sm font-semibold flex-row align-center"><i data-lucide="activity" style="display:inline-block; vertical-align:middle; width: 16px; margin-right: 6px;"></i> Active Partner</span>`;
    }
    
    lucide.createIcons();
  }

  // --- WIZARD WORKFLOW FLOWS ---
  startWizard() {
    this.wizardStep = 1;
    this.wizardData = {
      id: 'p-' + Date.now().toString().slice(-4), // generate last 4 digits
      name: '',
      type: '',
      country: '',
      currency: 'USD',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      selectedTemplateId: '',
      programConfig: {
        duration: '24',
        deductible: 49,
        pricingType: 'flat',
        pricingVal: 99
      },
      sandboxClientId: '',
      sandboxClientSecret: '',
      webhookUrl: '',
      status: 'Draft',
      history: []
    };

    this.showWizardStep(1);
    
    // Clear inputs in HTML
    document.getElementById('w-partner-name').value = '';
    document.getElementById('w-partner-type').value = '';
    document.getElementById('w-partner-country').value = '';
    document.getElementById('w-contact-name').value = '';
    document.getElementById('w-contact-email').value = '';
    document.getElementById('w-contact-phone').value = '';
    document.getElementById('w-partner-currency').value = 'USD';
    
    // Hide template configuration panel
    document.getElementById('w-template-config').classList.add('hidden');
    document.getElementById('w-sandbox-keys-display').classList.add('hidden');
    document.getElementById('btn-wizard-gen-sandbox').disabled = false;
    document.getElementById('w-webhook-url').value = '';
    
    // Render list of step 2 templates
    this.renderWizardTemplateSelector();

    window.location.hash = '#wizard';
  }

  resumeWizard(id) {
    const partner = this.partners.find(p => p.id === id);
    if (!partner) return;
    
    this.wizardStep = 1;
    this.wizardData = JSON.parse(JSON.stringify(partner)); // Deep copy
    
    // Populate form
    document.getElementById('w-partner-name').value = this.wizardData.name;
    document.getElementById('w-partner-type').value = this.wizardData.type;
    document.getElementById('w-partner-country').value = this.wizardData.country;
    document.getElementById('w-contact-name').value = this.wizardData.contactName;
    document.getElementById('w-contact-email').value = this.wizardData.contactEmail;
    document.getElementById('w-contact-phone').value = this.wizardData.contactPhone;
    document.getElementById('w-partner-currency').value = this.wizardData.currency;
    
    this.renderWizardTemplateSelector();
    
    // Check if step 2 template was already selected
    if (this.wizardData.selectedTemplateId) {
      this.selectWizardTemplate(this.wizardData.selectedTemplateId);
      document.getElementById('w-program-duration').value = this.wizardData.programConfig.duration;
      document.getElementById('w-program-deductible').value = this.wizardData.programConfig.deductible;
      
      const pricingVal = this.wizardData.programConfig.pricingVal;
      document.getElementById('w-program-pricing-val').value = pricingVal;
      
      const rbs = document.getElementsByName('w-program-pricing-type');
      for (const rb of rbs) {
        if (rb.value === this.wizardData.programConfig.pricingType) {
          rb.checked = true;
        }
      }
    }
    
    // Check if Sandbox keys generated
    const genBtn = document.getElementById('btn-wizard-gen-sandbox');
    const displayKeys = document.getElementById('w-sandbox-keys-display');
    if (this.wizardData.sandboxClientId) {
      document.getElementById('w-sandbox-client-id').innerText = this.wizardData.sandboxClientId;
      document.getElementById('w-sandbox-client-secret').innerText = this.wizardData.sandboxClientSecret;
      displayKeys.classList.remove('hidden');
      genBtn.disabled = true;
    } else {
      displayKeys.classList.add('hidden');
      genBtn.disabled = false;
    }
    
    document.getElementById('w-webhook-url').value = this.wizardData.webhookUrl || '';
    
    this.showWizardStep(1);
    window.location.hash = '#wizard';
  }

  showWizardStep(step) {
    this.wizardStep = step;
    
    // Show pane
    document.querySelectorAll('.wizard-step-pane').forEach(pane => {
      pane.classList.remove('active');
    });
    document.querySelector(`.wizard-step-pane[data-step="${step}"]`).classList.add('active');
    
    // Update top progress indicators
    document.querySelectorAll('.wizard-step-node').forEach(node => {
      node.classList.remove('active', 'completed');
      const nodeStep = parseInt(node.getAttribute('data-step'));
      if (nodeStep === step) {
        node.classList.add('active');
      } else if (nodeStep < step) {
        node.classList.add('completed');
      }
    });

    document.querySelectorAll('.wizard-line').forEach((line, index) => {
      line.classList.remove('completed');
      if (index < step - 1) {
        line.classList.add('completed');
      }
    });

    // Configure buttons
    const prevBtn = document.getElementById('btn-wizard-prev');
    const nextBtn = document.getElementById('btn-wizard-next');
    
    prevBtn.disabled = step === 1;
    
    if (step === 4) {
      nextBtn.innerHTML = `<span>Submit for Approval</span> <i data-lucide="check"></i>`;
      this.compileSummaryReport();
    } else {
      nextBtn.innerHTML = `<span>Next</span> <i data-lucide="arrow-right"></i>`;
    }
    
    lucide.createIcons();
  }

  validateWizardStep(step) {
    if (step === 1) {
      const name = document.getElementById('w-partner-name').value;
      const type = document.getElementById('w-partner-type').value;
      const country = document.getElementById('w-partner-country').value;
      const contact = document.getElementById('w-contact-name').value;
      const email = document.getElementById('w-contact-email').value;
      const phone = document.getElementById('w-contact-phone').value;
      const currency = document.getElementById('w-partner-currency').value;
      
      if (!name || !type || !country || !contact || !email || !phone) {
        this.showToast('Please fill all mandatory profile details.', 'error');
        return false;
      }
      
      // Save data
      this.wizardData.name = name;
      this.wizardData.type = type;
      this.wizardData.country = country;
      this.wizardData.contactName = contact;
      this.wizardData.contactEmail = email;
      this.wizardData.contactPhone = phone;
      this.wizardData.currency = currency;
    } else if (step === 2) {
      if (!this.wizardData.selectedTemplateId) {
        this.showToast('Please select a program template.', 'error');
        return false;
      }
      
      // Save program configurations
      const duration = document.getElementById('w-program-duration').value;
      const deductible = parseInt(document.getElementById('w-program-deductible').value) || 0;
      const pricingVal = parseFloat(document.getElementById('w-program-pricing-val').value) || 0;
      
      let pricingType = 'flat';
      const rbs = document.getElementsByName('w-program-pricing-type');
      for (const rb of rbs) {
        if (rb.checked) {
          pricingType = rb.value;
          break;
        }
      }

      this.wizardData.programConfig = {
        duration,
        deductible,
        pricingType,
        pricingVal
      };
    } else if (step === 3) {
      // API generated?
      if (!this.wizardData.sandboxClientId) {
        this.showToast('Please generate Sandbox credentials before proceeding.', 'error');
        return false;
      }
      
      // Save webhook
      this.wizardData.webhookUrl = document.getElementById('w-webhook-url').value;
    }
    
    return true;
  }

  renderWizardTemplateSelector() {
    const list = document.getElementById('w-template-list');
    list.innerHTML = '';
    
    this.templates.forEach(t => {
      const card = document.createElement('div');
      card.className = 'template-select-card';
      if (this.wizardData.selectedTemplateId === t.id) {
        card.classList.add('active');
      }
      
      card.innerHTML = `
        <h4>${t.name}</h4>
        <p>${t.description.slice(0, 75)}...</p>
      `;
      
      card.onclick = () => this.selectWizardTemplate(t.id);
      list.appendChild(card);
    });
  }

  selectWizardTemplate(id) {
    this.wizardData.selectedTemplateId = id;
    this.renderWizardTemplateSelector();
    
    // Get details
    const template = this.templates.find(t => t.id === id);
    if (!template) return;
    
    // Set dynamic headers/values
    document.getElementById('w-active-template-name').innerText = template.name;
    document.getElementById('w-program-deductible').value = template.defaultDeductible;
    document.getElementById('w-program-pricing-val').value = template.defaultPricingVal;
    
    const currSym = this.getCurrencySymbol(this.wizardData.currency || 'USD');
    document.getElementById('w-currency-symbol').innerText = currSym;
    
    // Pricing details configuration
    const rbs = document.getElementsByName('w-program-pricing-type');
    for (const rb of rbs) {
      if (rb.value === template.defaultPricingType) rb.checked = true;
    }
    
    this.updatePricingSuffixes();
    
    // Show panel
    document.getElementById('w-template-config').classList.remove('hidden');
  }

  updatePricingSuffixes() {
    const currSym = this.getCurrencySymbol(this.wizardData.currency || 'USD');
    let pricingType = 'flat';
    
    const rbs = document.getElementsByName('w-program-pricing-type');
    for (const rb of rbs) {
      if (rb.checked) {
        pricingType = rb.value;
        break;
      }
    }
    
    const prefix = document.getElementById('w-pricing-value-prefix');
    const hint = document.getElementById('w-pricing-hint');
    
    if (pricingType === 'flat') {
      prefix.innerText = currSym;
      hint.innerText = 'Fixed base premium fee charged per device configured.';
    } else {
      prefix.innerText = '%';
      hint.innerText = 'Percentage premium based on the invoice value of the device.';
    }
  }

  generateSandboxCredentials() {
    const randomHex = (len) => {
      const chars = '0123456789abcdef';
      let res = '';
      for (let i = 0; i < len; i++) {
        res += chars[Math.floor(Math.random() * chars.length)];
      }
      return res;
    };
    
    const clientId = 'sp_sb_' + randomHex(12);
    const clientSecret = 'sp_sec_sb_' + randomHex(24);
    
    this.wizardData.sandboxClientId = clientId;
    this.wizardData.sandboxClientSecret = clientSecret;
    
    // Update display
    document.getElementById('w-sandbox-client-id').innerText = clientId;
    document.getElementById('w-sandbox-client-secret').innerText = clientSecret;
    
    document.getElementById('w-sandbox-keys-display').classList.remove('hidden');
    document.getElementById('btn-wizard-gen-sandbox').disabled = true;
    
    this.showToast('Sandbox credentials provisioned successfully.', 'success');
  }

  compileSummaryReport() {
    document.getElementById('summary-partner-name').innerText = this.wizardData.name;
    document.getElementById('summary-partner-type').innerText = this.wizardData.type;
    document.getElementById('summary-partner-country').innerText = this.wizardData.country;
    document.getElementById('summary-partner-currency').innerText = this.wizardData.currency;
    
    document.getElementById('summary-contact-name').innerText = this.wizardData.contactName;
    document.getElementById('summary-contact-email').innerText = this.wizardData.contactEmail;
    document.getElementById('summary-contact-phone').innerText = this.wizardData.contactPhone;

    // Program configured
    const template = this.templates.find(t => t.id === this.wizardData.selectedTemplateId);
    const summaryProgBox = document.getElementById('summary-program-box');
    
    if (template) {
      const config = this.wizardData.programConfig;
      const currencySymbol = this.getCurrencySymbol(this.wizardData.currency);
      const pricingDisplay = config.pricingType === 'flat' 
        ? `${currencySymbol}${config.pricingVal}` 
        : `${config.pricingVal}% of Device Price`;
        
      summaryProgBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong class="text-white">${template.name}</strong>
            <div class="text-xs text-muted" style="margin-top: 4px;">Duration: ${config.duration} Months</div>
          </div>
          <div class="text-right">
            <div>Deductible: ${currencySymbol}${config.deductible}</div>
            <div class="text-indigo text-sm font-semibold" style="margin-top: 4px;">Pricing: ${pricingDisplay}</div>
          </div>
        </div>
      `;
    } else {
      summaryProgBox.innerHTML = `<span class="text-muted italic">None selected.</span>`;
    }
    
    document.getElementById('summary-webhook-url').innerText = this.wizardData.webhookUrl || 'Not configured';
  }

  submitOnboardingRequest() {
    // If onboarding is submitted, it goes into "Pending Review" if role is specialist
    // or goes directly live? Standard flow: goes to "Pending Review" status.
    const partnerId = this.wizardData.id;
    
    const existingIndex = this.partners.findIndex(p => p.id === partnerId);
    
    // Build update event
    const nowStr = new Date().toISOString();
    
    if (existingIndex > -1) {
      // Re-onboarding or updating draft
      const currentHist = this.partners[existingIndex].history || [];
      this.wizardData.history = [
        ...currentHist,
        { time: nowStr, text: 'Resumed onboarding & submitted for Manager review', user: this.currentRole === 'Specialist' ? 'Ankit Sharma' : 'Ops Manager' }
      ];
      this.wizardData.status = 'Pending Review';
      this.wizardData.updatedAt = nowStr;
      this.partners[existingIndex] = JSON.parse(JSON.stringify(this.wizardData));
    } else {
      // New Partner
      this.wizardData.history = [
        { time: nowStr, text: 'Partner profile initiated', user: 'Ankit Sharma' },
        { time: nowStr, text: 'Configured protection program policy', user: 'Ankit Sharma' },
        { time: nowStr, text: 'Generated Sandbox credentials', user: 'Ankit Sharma' },
        { time: nowStr, text: 'Submitted for manager review & approval', user: 'Ankit Sharma' }
      ];
      this.wizardData.status = 'Pending Review';
      this.wizardData.updatedAt = nowStr;
      this.partners.push(JSON.parse(JSON.stringify(this.wizardData)));
    }
    
    this.saveDatabase();
    this.showToast('Onboarding application submitted to Operations Manager.', 'success');
    
    // Send to details view of this partner
    this.navigateToPartner(partnerId);
  }

  cancelWizard() {
    if (confirm('Cancel onboarding? Your details will be saved as a Draft.')) {
      const partnerId = this.wizardData.id;
      const existingIndex = this.partners.findIndex(p => p.id === partnerId);
      
      const nowStr = new Date().toISOString();
      this.wizardData.status = 'Draft';
      this.wizardData.updatedAt = nowStr;
      
      if (existingIndex > -1) {
        const currentHist = this.partners[existingIndex].history || [];
        this.wizardData.history = [
          ...currentHist,
          { time: nowStr, text: 'Onboarding paused; saved as draft', user: 'Ankit Sharma' }
        ];
        this.partners[existingIndex] = JSON.parse(JSON.stringify(this.wizardData));
      } else {
        this.wizardData.history = [
          { time: nowStr, text: 'Partner profile initiated', user: 'Ankit Sharma' },
          { time: nowStr, text: 'Saved partner onboarding as draft', user: 'Ankit Sharma' }
        ];
        this.partners.push(JSON.parse(JSON.stringify(this.wizardData)));
      }
      
      this.saveDatabase();
      this.showToast('Partner onboarding draft saved.', 'info');
      window.location.hash = '#dashboard';
    }
  }

  // --- APPROVAL FLOW PROCESSES ---
  approvePartner(id) {
    if (this.currentRole !== 'Manager') {
      this.showToast('Only Operations Managers can approve partners.', 'error');
      return;
    }
    
    const partner = this.partners.find(p => p.id === id);
    if (!partner) return;
    
    const nowStr = new Date().toISOString();
    partner.status = 'Approved';
    partner.updatedAt = nowStr;
    partner.history.push({
      time: nowStr,
      text: 'Approved partner details & authorized production deployment',
      user: 'Ops Manager'
    });
    
    this.saveDatabase();
    this.showToast('Partner approved successfully.', 'success');
    this.showPartnerDetails(id);
  }

  activatePartner(id) {
    const partner = this.partners.find(p => p.id === id);
    if (!partner) return;
    
    const nowStr = new Date().toISOString();
    
    // Generate Production Credentials
    const randomHex = (len) => {
      const chars = '0123456789abcdef';
      let res = '';
      for (let i = 0; i < len; i++) {
        res += chars[Math.floor(Math.random() * chars.length)];
      }
      return res;
    };
    
    partner.prodClientId = 'sp_prod_' + randomHex(12);
    partner.prodClientSecret = 'sp_sec_prod_' + randomHex(24);
    partner.status = 'Live';
    partner.updatedAt = nowStr;
    partner.history.push({
      time: nowStr,
      text: 'Production API keys generated; partner is active/live',
      user: this.currentRole === 'Specialist' ? 'Ankit Sharma' : 'Ops Manager'
    });
    
    this.saveDatabase();
    this.showToast('Production environment activated. Partner is Live!', 'success');
    this.showPartnerDetails(id);
  }

  // --- HELPERS ---
  getCurrencySymbol(curr) {
    switch (curr) {
      case 'INR': return '₹';
      case 'EUR': return '€';
      case 'AED': return 'د.إ';
      case 'GBP': return '£';
      default: return '$';
    }
  }

  copyToClipboard(elementId) {
    const code = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(code).then(() => {
      this.showToast('Copied to clipboard!', 'info');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle-2';
    else if (type === 'error') iconName = 'alert-triangle';
    
    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span>${message}</span>
    `;
    
    container.appendChild(toast);
    lucide.createIcons();
    
    // Fade out after 4 seconds
    setTimeout(() => {
      toast.classList.add('toast-fadeout');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }

  resetDatabase() {
    if (confirm('Are you sure you want to reset all partner mock data to defaults? This will erase custom drafts.')) {
      this.loadDefaults();
      this.showToast('Database reset to factory configurations.', 'info');
      
      // Navigate back if on details view
      if (this.currentView === 'partner-details') {
        window.location.hash = '#dashboard';
      } else {
        this.switchView(this.currentView);
      }
    }
  }

  // --- BIND HTML LISTENERS ---
  bindEvents() {
    // Menu items
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = item.getAttribute('data-view');
        window.location.hash = `#${targetView}`;
      });
    });

    // Start onboarding button
    document.getElementById('btn-start-onboarding').addEventListener('click', () => {
      this.startWizard();
    });

    // Quick role toggle button
    document.getElementById('quick-role-toggle').addEventListener('click', () => {
      const nextRole = this.currentRole === 'Specialist' ? 'Manager' : 'Specialist';
      this.setRole(nextRole);
    });

    // Wizard Next/Prev/Cancel buttons
    document.getElementById('btn-wizard-prev').addEventListener('click', () => {
      if (this.wizardStep > 1) {
        this.showWizardStep(this.wizardStep - 1);
      }
    });

    document.getElementById('btn-wizard-next').addEventListener('click', () => {
      if (this.validateWizardStep(this.wizardStep)) {
        if (this.wizardStep === 4) {
          this.submitOnboardingRequest();
        } else {
          this.showWizardStep(this.wizardStep + 1);
        }
      }
    });

    document.getElementById('btn-wizard-cancel').addEventListener('click', () => {
      this.cancelWizard();
    });

    // Step 2 pricing updates
    const rbs = document.getElementsByName('w-program-pricing-type');
    for (const rb of rbs) {
      rb.addEventListener('change', () => this.updatePricingSuffixes());
    }

    // Step 3 API generator
    document.getElementById('btn-wizard-gen-sandbox').addEventListener('click', (e) => {
      e.preventDefault();
      this.generateSandboxCredentials();
    });

    // Dashboard search filters
    document.getElementById('partner-search').addEventListener('input', () => {
      this.renderPartnersTable();
    });
    document.getElementById('stage-filter').addEventListener('change', () => {
      this.renderPartnersTable();
    });

    // All partners page filter
    document.getElementById('all-partners-search').addEventListener('input', () => {
      this.renderAllPartnersTable();
    });

    // Settings data reset
    document.getElementById('btn-reset-data').addEventListener('click', () => {
      this.resetDatabase();
    });

    // Details back to list
    document.getElementById('btn-back-to-list').addEventListener('click', () => {
      window.history.back();
    });
  }
}

// Launch application globally
const app = new PartnerOnboardingPortal();
window.app = app;
