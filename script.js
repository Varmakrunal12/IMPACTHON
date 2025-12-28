// dashboard.js - Enhanced with Real-time Features

// Global dashboard state
window.dashboardState = {
    isMobile: false,
    sidebarOpen: false,
    notifications: [],
    sessionRequests: [],
    activeSessions: []
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initialized');
    
    // Check authentication
    checkDashboardAuth();
    
    // Initialize dashboard components
    initDashboardMenu();
    initDashboardFeatures();
    initSessionManagement();
    initNotificationSystem();
    initRealTimeUpdates();
    initDataTables();
    
    // Add animations
    initDashboardAnimations();
    
    // Check for new data
    checkForNewData();
});

// Check dashboard authentication
function checkDashboardAuth() {
    const isLoggedIn = localStorage.getItem('wisdomBridgeLoggedIn');
    const userType = localStorage.getItem('wisdomBridgeUserType');
    const currentPage = window.location.pathname;
    
    if (!isLoggedIn) {
        // Redirect to appropriate login page
        if (currentPage.includes('s-dashbord')) {
            window.location.href = 's-login.html';
        } else if (currentPage.includes('j-dashbord')) {
            window.location.href = 'j-login.html';
        }
        return;
    }
    
    // Check if user is on the correct dashboard
    const expectedUserType = currentPage.includes('s-dashbord') ? 'senior' : 'junior';
    const actualUserType = localStorage.getItem('wisdomBridgeUserType');
    
    if (expectedUserType !== actualUserType) {
        // Redirect to correct dashboard
        const redirectUrl = actualUserType === 'senior' ? 's-dashbord.html' : 'j-dashbord.html';
        showAlert(`Redirecting to your ${actualUserType} dashboard...`, 'info');
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 2000);
    }
    
    // Update user info on dashboard
    updateDashboardUserInfo();
}

// Update dashboard user info
function updateDashboardUserInfo() {
    const userName = localStorage.getItem('wisdomBridgeUserName');
    const userType = localStorage.getItem('wisdomBridgeUserType');
    
    // Update welcome message
    const welcomeElement = document.querySelector('.header-left h1');
    if (welcomeElement && userName) {
        const firstName = userName.split(' ')[0];
        welcomeElement.innerHTML = `Welcome, ${firstName}!`;
    }
    
    // Update user info in sidebar
    const userInfoElements = document.querySelectorAll('.user-details h4');
    userInfoElements.forEach(el => {
        if (userName && !el.innerHTML.includes('Welcome')) {
            el.textContent = userName;
        }
    });
    
    // Update user type in sidebar
    const userTypeElements = document.querySelectorAll('.user-details p:first-child');
    userTypeElements.forEach(el => {
        if (userType === 'senior') {
            el.textContent = 'Business Strategy Expert';
        } else if (userType === 'junior') {
            el.textContent = 'Startup Founder';
        }
    });
}

// Initialize dashboard menu
function initDashboardMenu() {
    // Create mobile menu toggle button
    const dashboardMenuToggle = document.createElement('button');
    dashboardMenuToggle.className = 'dashboard-menu-toggle animate-fade-in';
    dashboardMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(dashboardMenuToggle);
    
    const sidebar = document.querySelector('.sidebar');
    window.dashboardState.isMobile = window.innerWidth <= 768;
    
    if (dashboardMenuToggle && sidebar) {
        dashboardMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            window.dashboardState.sidebarOpen = sidebar.classList.contains('active');
            dashboardMenuToggle.innerHTML = window.dashboardState.sidebarOpen 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
            
            // Add animation class
            if (window.dashboardState.sidebarOpen) {
                sidebar.classList.add('animate-slide-left');
            }
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.dashboardState.isMobile && 
                !sidebar.contains(e.target) && 
                !dashboardMenuToggle.contains(e.target) && 
                window.dashboardState.sidebarOpen) {
                sidebar.classList.remove('active');
                dashboardMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                window.dashboardState.sidebarOpen = false;
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            window.dashboardState.isMobile = window.innerWidth <= 768;
            if (!window.dashboardState.isMobile) {
                sidebar.classList.remove('active');
                dashboardMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                window.dashboardState.sidebarOpen = false;
            }
        });
    }
    
    // Handle active navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Close sidebar on mobile after click
            if (window.dashboardState.isMobile) {
                sidebar.classList.remove('active');
                dashboardMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                window.dashboardState.sidebarOpen = false;
            }
        });
    });
}

// Initialize dashboard features
function initDashboardFeatures() {
    // Find Expert button for junior dashboard
    const findExpertBtn = document.getElementById('findExpertBtn');
    if (findExpertBtn) {
        findExpertBtn.addEventListener('click', function() {
            showExpertSearchModal();
        });
    }
    
    // Availability toggle for senior dashboard
    const availabilityToggle = document.querySelector('.switch input');
    if (availabilityToggle) {
        const statusElement = document.querySelector('.status');
        
        // Load saved state
        const savedAvailability = localStorage.getItem('dashboardAvailability');
        if (savedAvailability === 'busy') {
            availabilityToggle.checked = false;
            if (statusElement) {
                statusElement.textContent = '● Busy';
                statusElement.className = 'status busy';
            }
        }
        
        availabilityToggle.addEventListener('change', function() {
            if (statusElement) {
                if (this.checked) {
                    statusElement.textContent = '● Available';
                    statusElement.className = 'status active';
                    localStorage.setItem('dashboardAvailability', 'available');
                    showAlert('You are now available for sessions', 'success');
                } else {
                    statusElement.textContent = '● Busy';
                    statusElement.className = 'status busy';
                    localStorage.setItem('dashboardAvailability', 'busy');
                    showAlert('You are now marked as busy', 'info');
                }
            }
        });
    }
    
    // Initialize all action buttons
    initActionButtons();
    
    // Initialize category search
    initCategorySearch();
    
    // Initialize booking functionality
    initBookingFunctionality();
}

// Show expert search modal
function showExpertSearchModal() {
    const searchModal = document.createElement('div');
    searchModal.className = 'modal';
    searchModal.innerHTML = `
        <div class="modal-content animate-slide-up" style="max-width: 700px;">
            <span class="close-modal">&times;</span>
            <h2 style="margin-bottom: 25px;">Find Your Expert</h2>
            
            <div style="position: relative; margin-bottom: 30px;">
                <input type="text" id="expertSearchInput" 
                    placeholder="Search by skill, industry, or name..." 
                    style="width: 100%; padding: 18px 50px 18px 25px; 
                           border: 2px solid #e0e0e0; border-radius: 15px;
                           font-size: 1.1rem; transition: all 0.3s;">
                <i class="fas fa-search" style="position: absolute; right: 25px; 
                    top: 50%; transform: translateY(-50%); color: #666; font-size: 1.2rem;"></i>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
                 gap: 15px; margin: 25px 0;">
                <button class="btn btn-outline" onclick="filterExperts('business')">
                    <i class="fas fa-chart-line"></i> Business
                </button>
                <button class="btn btn-outline" onclick="filterExperts('technology')">
                    <i class="fas fa-code"></i> Technology
                </button>
                <button class="btn btn-outline" onclick="filterExperts('finance')">
                    <i class="fas fa-balance-scale"></i> Finance
                </button>
                <button class="btn btn-outline" onclick="filterExperts('marketing')">
                    <i class="fas fa-bullhorn"></i> Marketing
                </button>
                <button class="btn btn-outline" onclick="filterExperts('career')">
                    <i class="fas fa-graduation-cap"></i> Career
                </button>
            </div>
            
            <div id="searchResults" style="margin-top: 30px; max-height: 400px; overflow-y: auto;">
                <div class="expert-result" style="background: #f8f9fa; padding: 25px; 
                    border-radius: 15px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s;">
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div style="flex: 1;">
                            <h4 style="margin-bottom: 5px; color: #2c3e50;">Mr. Rajesh Kumar</h4>
                            <p style="color: #666; margin-bottom: 8px;">Business Strategy Expert</p>
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <span style="color: #f1c40f;">
                                    <i class="fas fa-star"></i> 4.9 (42 reviews)
                                </span>
                                <span style="color: #3498db;">
                                    <i class="fas fa-rupee-sign"></i> 2,500/hour
                                </span>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="bookExpertSession('Mr. Rajesh Kumar')">
                            Book Session
                        </button>
                    </div>
                </div>
                
                <div class="expert-result" style="background: #f8f9fa; padding: 25px; 
                    border-radius: 15px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s;">
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); 
                            border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div style="flex: 1;">
                            <h4 style="margin-bottom: 5px; color: #2c3e50;">Mr. Sanjay Mehta</h4>
                            <p style="color: #666; margin-bottom: 8px;">Ex-CEO, Manufacturing</p>
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <span style="color: #f1c40f;">
                                    <i class="fas fa-star"></i> 4.9 (127 reviews)
                                </span>
                                <span style="color: #3498db;">
                                    <i class="fas fa-rupee-sign"></i> 2,000/hour
                                </span>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="bookExpertSession('Mr. Sanjay Mehta')">
                            Book Session
                        </button>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <p style="color: #666;">Can't find what you're looking for? 
                    <a href="#" style="color: #3498db; text-decoration: none; font-weight: 500;">
                        Contact support
                    </a>
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(searchModal);
    searchModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add hover effects to expert results
    const expertResults = searchModal.querySelectorAll('.expert-result');
    expertResults.forEach(result => {
        result.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        });
        result.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Search functionality
    const searchInput = searchModal.querySelector('#expertSearchInput');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        expertResults.forEach(result => {
            const text = result.textContent.toLowerCase();
            result.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });
    
    // Focus on search input
    setTimeout(() => searchInput.focus(), 100);
    
    // Close modal functionality
    const closeBtn = searchModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        searchModal.style.animation = 'slideInUp 0.6s ease-out reverse';
        setTimeout(() => {
            searchModal.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.style.animation = 'slideInUp 0.6s ease-out reverse';
            setTimeout(() => {
                searchModal.remove();
                document.body.style.overflow = 'auto';
            }, 300);
        }
    });
}

// Initialize action buttons
function initActionButtons() {
    // Session action buttons
    document.querySelectorAll('.session-actions button, .schedule-actions button, .request-actions button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.textContent.trim();
            const card = this.closest('.session-card, .schedule-item, .request-card');
            
            if (action === 'Start') {
                handleStartSession(card, this);
            } else if (action === 'Join Now') {
                handleJoinSession(card, this);
            } else if (action === 'Accept') {
                handleAcceptRequest(card, this);
            } else if (action === 'Decline') {
                handleDeclineRequest(card, this);
            } else if (action === 'Details') {
                showSessionDetails(card);
            } else if (action === 'Reschedule') {
                handleReschedule(card);
            }
        });
    });
    
    // Book Session buttons
    document.querySelectorAll('.btn-block').forEach(button => {
        if (button.textContent.includes('Book Session')) {
            button.addEventListener('click', function() {
                const expertCard = this.closest('.expert-card');
                const expertName = expertCard ? expertCard.querySelector('h4').textContent : 'Expert';
                showBookingModal(expertName);
            });
        }
    });
}

// Handle start session
function handleStartSession(card, button) {
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting...';
    button.disabled = true;
    
    setTimeout(() => {
        showAlert('Session started! Video call interface opening...', 'success');
        button.innerHTML = '<i class="fas fa-video"></i> In Progress';
        button.classList.remove('btn-secondary');
        button.classList.add('btn-primary');
        
        // Add session timer
        const timer = document.createElement('div');
        timer.className = 'session-timer';
        timer.innerHTML = '<i class="fas fa-clock"></i> 00:00';
        card.querySelector('.schedule-details').appendChild(timer);
        
        // Simulate session timer
        let seconds = 0;
        const timerInterval = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timer.innerHTML = `<i class="fas fa-clock"></i> ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
        
        // Simulate session ending after 1 minute
        setTimeout(() => {
            clearInterval(timerInterval);
            showAlert('Session completed successfully!', 'success');
            card.style.opacity = '0.5';
            button.innerHTML = '<i class="fas fa-check"></i> Completed';
            button.disabled = true;
            button.classList.remove('btn-primary');
            button.classList.add('btn-success');
            
            // Remove after delay
            setTimeout(() => {
                card.style.transition = 'all 0.5s';
                card.style.transform = 'translateX(100%)';
                card.style.opacity = '0';
                setTimeout(() => card.remove(), 500);
            }, 3000);
        }, 60000); // 1 minute for demo
    }, 2000);
}

// Handle join session
function handleJoinSession(card, button) {
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
    button.disabled = true;
    
    setTimeout(() => {
        showAlert('Joining session... Opening video call interface.', 'success');
        // In real implementation, this would connect to video call
        button.innerHTML = '<i class="fas fa-video"></i> Connected';
        button.classList.add('connected');
    }, 1500);
}

// Handle accept request
function handleAcceptRequest(card, button) {
    const requestDetails = card.querySelector('h4').textContent;
    const juniorName = card.querySelector('p').textContent.replace('With ', '');
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Accepting...';
    button.disabled = true;
    
    setTimeout(() => {
        showAlert(`Session request accepted! ${juniorName} has been notified.`, 'success');
        
        // Create new session in schedule
        createNewSession(juniorName, requestDetails);
        
        // Remove request card with animation
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0';
        setTimeout(() => card.remove(), 300);
        
        // Update notifications
        updateNotificationCount(-1);
    }, 1500);
}

// Handle decline request
function handleDeclineRequest(card, button) {
    const juniorName = card.querySelector('p').textContent.replace('With ', '');
    
    if (confirm(`Are you sure you want to decline this request from ${juniorName}?`)) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Declining...';
        button.disabled = true;
        
        setTimeout(() => {
            showAlert(`Request declined. ${juniorName} has been notified.`, 'info');
            
            // Remove request card with animation
            card.style.transform = 'scale(0.95)';
            card.style.opacity = '0';
            setTimeout(() => card.remove(), 300);
            
            // Update notifications
            updateNotificationCount(-1);
        }, 1000);
    }
}

// Show session details
function showSessionDetails(card) {
    const sessionName = card.querySelector('h4').textContent;
    const withPerson = card.querySelector('p').textContent;
    const timeInfo = card.querySelector('.schedule-time h3').textContent;
    
    const details = `
        <strong>Session Details:</strong><br>
        ${sessionName}<br>
        ${withPerson}<br>
        Time: ${timeInfo}<br><br>
        <strong>Agenda:</strong><br>
        • Introduction & context sharing<br>
        • Problem discussion<br>
        • Strategy formulation<br>
        • Q&A session<br><br>
        <strong>Preparation:</strong><br>
        Please have your questions ready and any relevant documents.
    `;
    
    showAlert(details, 'info');
}

// Handle reschedule
function handleReschedule(card) {
    const newTime = prompt('Enter new time for the session (e.g., Tomorrow, 2:00 PM):');
    if (newTime) {
        const timeElement = card.querySelector('.session-time p:first-child');
        if (timeElement) {
            timeElement.innerHTML = `<i class="fas fa-calendar"></i> ${newTime}`;
            showAlert('Session rescheduled successfully!', 'success');
        }
    }
}

// Show booking modal
function showBookingModal(expertName) {
    const bookingModal = document.createElement('div');
    bookingModal.className = 'modal';
    bookingModal.innerHTML = `
        <div class="modal-content animate-slide-up" style="max-width: 500px;">
            <span class="close-modal">&times;</span>
            <h2 style="margin-bottom: 25px;">Book Session with ${expertName}</h2>
            <form id="bookingForm" style="margin-top: 20px;">
                <div class="form-group">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #2c3e50;">
                        <i class="fas fa-comment"></i> Session Topic
                    </label>
                    <input type="text" placeholder="What would you like to discuss?" required
                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem;">
                </div>
                <div class="form-group">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #2c3e50;">
                        <i class="fas fa-calendar"></i> Date
                    </label>
                    <input type="date" required
                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem;">
                </div>
                <div class="form-group">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #2c3e50;">
                        <i class="fas fa-clock"></i> Time
                    </label>
                    <input type="time" required
                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem;">
                </div>
                <div class="form-group">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #2c3e50;">
                        <i class="fas fa-hourglass-half"></i> Duration
                    </label>
                    <select required style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem;">
                        <option value="">Select duration</option>
                        <option value="30">30 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="90">90 minutes</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary btn-block" 
                        style="margin-top: 30px; padding: 16px;">
                    <i class="fas fa-calendar-check"></i> Confirm Booking
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(bookingModal);
    bookingModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Set minimum date to today
    const dateInput = bookingModal.querySelector('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
    
    // Set default time to next hour
    const timeInput = bookingModal.querySelector('input[type="time"]');
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1);
    timeInput.value = `${nextHour.getHours().toString().padStart(2, '0')}:00`;
    
    // Close modal functionality
    const closeBtn = bookingModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        bookingModal.style.animation = 'slideInUp 0.6s ease-out reverse';
        setTimeout(() => {
            bookingModal.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.style.animation = 'slideInUp 0.6s ease-out reverse';
            setTimeout(() => {
                bookingModal.remove();
                document.body.style.overflow = 'auto';
            }, 300);
        }
    });
    
    // Handle booking form submission
    const bookingForm = bookingModal.querySelector('#bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const topic = bookingForm.querySelector('input[type="text"]').value;
            const date = bookingForm.querySelector('input[type="date"]').value;
            const time = bookingForm.querySelector('input[type="time"]').value;
            const duration = bookingForm.querySelector('select').value;
            
            if (!topic || !date || !time || !duration) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showAlert(`Booking confirmed with ${expertName}! They will review your request.`, 'success');
                
                // Create session request
                if (window.handleSessionRequest) {
                    window.handleSessionRequest(
                        'expert_' + expertName.replace(/\s+/g, '_').toLowerCase(),
                        expertName,
                        topic,
                        date,
                        time,
                        duration + ' minutes'
                    );
                }
                
                bookingModal.style.animation = 'slideInUp 0.6s ease-out reverse';
                setTimeout(() => {
                    bookingModal.remove();
                    document.body.style.overflow = 'auto';
                }, 300);
            }, 1500);
        });
    }
}

// Initialize category search
function initCategorySearch() {
    window.searchCategory = function(category) {
        const categoryNames = {
            'business': 'Business Strategy',
            'technology': 'Technology',
            'finance': 'Finance & Legal',
            'marketing': 'Marketing',
            'career': 'Career Guidance'
        };
        
        showAlert(`Searching for experts in ${categoryNames[category] || category} category...`, 'info');
        
        // Simulate search results
        setTimeout(() => {
            if (window.showExpertSearchModal) {
                window.showExpertSearchModal();
            }
        }, 500);
    };
}

// Initialize booking functionality
function initBookingFunctionality() {
    window.bookExpertSession = function(expertName) {
        showBookingModal(expertName);
    };
}

// Initialize session management
function initSessionManagement() {
    // Load existing sessions
    const savedSessions = localStorage.getItem('dashboardSessions');
    if (savedSessions) {
        window.dashboardState.activeSessions = JSON.parse(savedSessions);
    }
    
    // Create new session function
    window.createNewSession = function(juniorName, topic) {
        const newSession = {
            id: Date.now().toString(),
            juniorName: juniorName,
            topic: topic,
            date: new Date().toLocaleDateString(),
            time: 'Tomorrow, 10:00 AM',
            duration: '60 mins',
            status: 'scheduled'
        };
        
        window.dashboardState.activeSessions.push(newSession);
        localStorage.setItem('dashboardSessions', JSON.stringify(window.dashboardState.activeSessions));
        
        // Show success message
        showAlert(`New session created with ${juniorName}`, 'success');
    };
}

// Initialize notification system
function initNotificationSystem() {
    const notificationBell = document.querySelector('.notification');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            showNotificationsModal();
            
            // Reset badge
            const badge = this.querySelector('.badge');
            if (badge) badge.style.display = 'none';
            
            // Mark notifications as read
            markNotificationsAsRead();
        });
    }
    
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('dashboardNotifications');
    if (savedNotifications) {
        window.dashboardState.notifications = JSON.parse(savedNotifications);
        updateNotificationCount();
    }
    
    // Check for expert notifications
    const expertNotifications = localStorage.getItem('wisdomBridgeExpertNotifications');
    if (expertNotifications) {
        const notifications = JSON.parse(expertNotifications);
        if (notifications.length > 0) {
            // Add to dashboard notifications
            window.dashboardState.notifications.push(...notifications);
            localStorage.setItem('dashboardNotifications', 
                JSON.stringify(window.dashboardState.notifications));
            
            // Clear expert notifications
            localStorage.removeItem('wisdomBridgeExpertNotifications');
            
            // Update notification count
            updateNotificationCount();
        }
    }
}

// Show notifications modal
function showNotificationsModal() {
    const notificationsModal = document.createElement('div');
    notificationsModal.className = 'modal';
    notificationsModal.innerHTML = `
        <div class="modal-content animate-slide-up" style="max-width: 450px;">
            <span class="close-modal">&times;</span>
            <h2 style="margin-bottom: 25px;">Notifications</h2>
            <div id="notificationsList" style="max-height: 400px; overflow-y: auto; margin-top: 20px;">
                ${window.dashboardState.notifications.map((notif, index) => `
                    <div class="notification-item" style="padding: 20px; border-bottom: 1px solid #eee; 
                         transition: all 0.3s; cursor: pointer; background: ${notif.read ? 'white' : '#f8f9fa'};">
                        <div style="display: flex; align-items: flex-start; gap: 15px;">
                            <div style="width: 40px; height: 40px; background: ${getNotificationColor(notif.type)}; 
                                 border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                                 color: white; font-size: 1.1rem;">
                                <i class="fas ${getNotificationIcon(notif.type)}"></i>
                            </div>
                            <div style="flex: 1;">
                                <strong style="color: #2c3e50; display: block; margin-bottom: 5px;">
                                    ${notif.message}
                                </strong>
                                <p style="color: #666; font-size: 0.9rem; margin-bottom: 8px;">
                                    ${notif.data ? notif.data.topic || '' : ''}
                                </p>
                                <span style="color: #95a5a6; font-size: 0.8rem;">
                                    ${new Date(notif.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                            ${!notif.read ? '<div class="unread-dot" style="width: 10px; height: 10px; background: #3498db; border-radius: 50%;"></div>' : ''}
                        </div>
                    </div>
                `).join('')}
                
                ${window.dashboardState.notifications.length === 0 ? `
                    <div style="text-align: center; padding: 40px 20px; color: #666;">
                        <i class="fas fa-bell-slash" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                        <p>No notifications yet</p>
                    </div>
                ` : ''}
            </div>
            ${window.dashboardState.notifications.length > 0 ? `
                <div style="margin-top: 20px; text-align: center;">
                    <button id="markAllReadBtn" class="btn btn-outline" style="padding: 10px 25px;">
                        <i class="fas fa-check-double"></i> Mark all as read
                    </button>
                    <button id="clearAllBtn" class="btn btn-outline" style="padding: 10px 25px; margin-left: 10px;">
                        <i class="fas fa-trash"></i> Clear all
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(notificationsModal);
    notificationsModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add hover effects to notification items
    const notificationItems = notificationsModal.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.background = '#f8f9fa';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.background = this.querySelector('.unread-dot') ? '#f8f9fa' : 'white';
        });
        
        // Click handler for notifications
        item.addEventListener('click', function() {
            const unreadDot = this.querySelector('.unread-dot');
            if (unreadDot) {
                unreadDot.remove();
                this.style.background = 'white';
                updateNotificationCount(-1);
            }
        });
    });
    
    // Mark all as read button
    const markAllReadBtn = notificationsModal.getElementById('markAllReadBtn');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            window.dashboardState.notifications.forEach(notif => notif.read = true);
            localStorage.setItem('dashboardNotifications', 
                JSON.stringify(window.dashboardState.notifications));
            
            notificationItems.forEach(item => {
                const unreadDot = item.querySelector('.unread-dot');
                if (unreadDot) unreadDot.remove();
                item.style.background = 'white';
            });
            
            updateNotificationCount(0, true);
            showAlert('All notifications marked as read', 'success');
        });
    }
    
    // Clear all button
    const clearAllBtn = notificationsModal.getElementById('clearAllBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            if (confirm('Clear all notifications?')) {
                window.dashboardState.notifications = [];
                localStorage.setItem('dashboardNotifications', '[]');
                
                notificationsModal.querySelector('#notificationsList').innerHTML = `
                    <div style="text-align: center; padding: 40px 20px; color: #666;">
                        <i class="fas fa-bell-slash" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                        <p>No notifications yet</p>
                    </div>
                `;
                
                markAllReadBtn.style.display = 'none';
                clearAllBtn.style.display = 'none';
                
                updateNotificationCount(0, true);
                showAlert('All notifications cleared', 'info');
            }
        });
    }
    
    // Close modal functionality
    const closeBtn = notificationsModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        notificationsModal.style.animation = 'slideInUp 0.6s ease-out reverse';
        setTimeout(() => {
            notificationsModal.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === notificationsModal) {
            notificationsModal.style.animation = 'slideInUp 0.6s ease-out reverse';
            setTimeout(() => {
                notificationsModal.remove();
                document.body.style.overflow = 'auto';
            }, 300);
        }
    });
}

// Get notification color by type
function getNotificationColor(type) {
    switch(type) {
        case 'session_request': return 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
        case 'payment': return 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
        case 'message': return 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)';
        default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
}

// Get notification icon by type
function getNotificationIcon(type) {
    switch(type) {
        case 'session_request': return 'fa-calendar-check';
        case 'payment': return 'fa-money-bill-wave';
        case 'message': return 'fa-comment';
        default: return 'fa-bell';
    }
}

// Mark notifications as read
function markNotificationsAsRead() {
    window.dashboardState.notifications.forEach(notif => notif.read = true);
    localStorage.setItem('dashboardNotifications', 
        JSON.stringify(window.dashboardState.notifications));
    updateNotificationCount(0, true);
}

// Update notification count
function updateNotificationCount(change = 0, reset = false) {
    const badge = document.querySelector('.notification .badge');
    if (badge) {
        if (reset) {
            badge.style.display = 'none';
            return;
        }
        
        let currentCount = parseInt(badge.textContent) || 0;
        if (change === -1) {
            currentCount = Math.max(0, currentCount - 1);
        } else if (change > 0) {
            currentCount += change;
        } else {
            currentCount = window.dashboardState.notifications.filter(n => !n.read).length;
        }
        
        if (currentCount > 0) {
            badge.textContent = currentCount;
            badge.style.display = 'flex';
            badge.classList.add('notification-pulse');
        } else {
            badge.style.display = 'none';
            badge.classList.remove('notification-pulse');
        }
    }
}

// Initialize real-time updates
function initRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        // Random chance to get new notification
        if (Math.random() < 0.3) {
            addRandomNotification();
        }
        
        // Random chance to get new session request (for seniors)
        const userType = localStorage.getItem('wisdomBridgeUserType');
        if (userType === 'senior' && Math.random() < 0.2) {
            addRandomSessionRequest();
        }
    }, 30000); // Every 30 seconds
    
    // Check for updates immediately
    checkForNewData();
}

// Add random notification
function addRandomNotification() {
    const notificationTypes = [
        {
            type: 'session_request',
            message: 'New session request from Amit Verma',
            data: { topic: 'Business plan validation' }
        },
        {
            type: 'payment',
            message: 'Payment received ₹3,000',
            data: { from: 'Priya Patel' }
        },
        {
            type: 'message',
            message: 'New message from Rahul Sharma',
            data: { preview: 'Thank you for the session...' }
        }
    ];
    
    const randomNotif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    const notification = {
        id: Date.now().toString(),
        ...randomNotif,
        read: false,
        createdAt: new Date().toISOString()
    };
    
    window.dashboardState.notifications.push(notification);
    localStorage.setItem('dashboardNotifications', 
        JSON.stringify(window.dashboardState.notifications));
    
    updateNotificationCount(1);
    
    // Show toast notification
    if (document.hasFocus()) {
        showToastNotification(notification.message);
    }
}

// Add random session request (for seniors)
function addRandomSessionRequest() {
    const juniors = [
        { name: 'Amit Verma', type: 'Tech Startup Founder', topic: 'Business plan validation' },
        { name: 'Priya Patel', type: 'Marketing Manager', topic: 'Marketing strategy' },
        { name: 'Rahul Sharma', type: 'Student', topic: 'Career guidance' },
        { name: 'Sneha Singh', type: 'Entrepreneur', topic: 'Funding advice' }
    ];
    
    const randomJunior = juniors[Math.floor(Math.random() * juniors.length)];
    
    // Add to session requests in the UI if on senior dashboard
    if (window.location.pathname.includes('s-dashbord')) {
        addSessionRequestToUI(randomJunior);
    }
}

// Add session request to UI
function addSessionRequestToUI(junior) {
    const requestsGrid = document.querySelector('.requests-grid');
    if (!requestsGrid) return;
    
    const requestCard = document.createElement('div');
    requestCard.className = 'request-card animate-fade-in';
    requestCard.innerHTML = `
        <div class="request-header">
            <div class="junior-avatar">
                <i class="fas fa-user-graduate"></i>
            </div>
            <div>
                <h4>${junior.name}</h4>
                <p>${junior.type}</p>
            </div>
        </div>
        <div class="request-details">
            <p><i class="fas fa-file-alt"></i> Need help with ${junior.topic.toLowerCase()}</p>
            <p><i class="fas fa-clock"></i> Requested: 2 hours</p>
            <p><i class="fas fa-calendar"></i> Preferred: Tomorrow, 3 PM</p>
        </div>
        <div class="request-actions">
            <button class="btn btn-outline">Decline</button>
            <button class="btn btn-secondary">Accept</button>
        </div>
    `;
    
    requestsGrid.appendChild(requestCard);
    
    // Initialize buttons for new card
    const declineBtn = requestCard.querySelector('.btn-outline');
    const acceptBtn = requestCard.querySelector('.btn-secondary');
    
    declineBtn.addEventListener('click', function() {
        handleDeclineRequest(requestCard, this);
    });
    
    acceptBtn.addEventListener('click', function() {
        handleAcceptRequest(requestCard, this);
    });
    
    // Show notification
    showAlert(`New session request from ${junior.name}`, 'info');
}

// Show toast notification
function showToastNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <i class="fas fa-bell" style="color: #3498db;"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: white;
        padding: 20px 25px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        z-index: 4000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        backdrop-filter: blur(10px);
        border-left: 5px solid #3498db;
    `;
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        padding: 5px;
        opacity: 0.7;
        transition: opacity 0.3s;
    `;
    
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    });
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// Initialize data tables
function initDataTables() {
    const dataTables = document.querySelectorAll('.data-table');
    dataTables.forEach(table => {
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                sortTable(table, index);
            });
        });
    });
}

// Sort table function
function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isAscending = table.getAttribute('data-sort-order') !== 'asc';
    
    rows.sort((a, b) => {
        const aText = a.children[columnIndex].textContent.trim();
        const bText = b.children[columnIndex].textContent.trim();
        
        // Try to parse as numbers
        const aNum = parseFloat(aText);
        const bNum = parseFloat(bText);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAscending ? aNum - bNum : bNum - aNum;
        }
        
        // Compare as strings
        return isAscending 
            ? aText.localeCompare(bText)
            : bText.localeCompare(aText);
    });
    
    // Remove existing rows
    rows.forEach(row => tbody.removeChild(row));
    
    // Add sorted rows
    rows.forEach(row => tbody.appendChild(row));
    
    // Update sort order
    table.setAttribute('data-sort-order', isAscending ? 'asc' : 'desc');
    
    // Update header indicators
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
        header.classList.remove('sort-asc', 'sort-desc');
        if (index === columnIndex) {
            header.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
        }
    });
}

// Initialize dashboard animations
function initDashboardAnimations() {
    // Add entrance animations to cards
    const cards = document.querySelectorAll('.stat-card, .category-box, .expert-card, .request-card, .session-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fade-in');
    });
    
    // Add hover animations
    const hoverElements = document.querySelectorAll('.stat-card, .category-box, .expert-card');
    hoverElements.forEach(el => {
        el.classList.add('hover-lift');
    });
}

// Check for new data
function checkForNewData() {
    // Simulate checking for new data
    setTimeout(() => {
        // Check for pending session requests from localStorage
        const pendingRequests = localStorage.getItem('wisdomBridgePendingSessionRequests');
        if (pendingRequests) {
            const requests = JSON.parse(pendingRequests);
            if (requests.length > 0) {
                // Process pending requests
                requests.forEach(request => {
                    if (window.addSessionRequestToUI) {
                        window.addSessionRequestToUI({
                            name: request.juniorName || 'New User',
                            type: request.juniorType || 'Startup Founder',
                            topic: request.topic || 'General Consultation'
                        });
                    }
                });
                
                // Clear pending requests
                localStorage.removeItem('wisdomBridgePendingSessionRequests');
            }
        }
    }, 1000);
}

// Logout functionality
document.addEventListener('DOMContentLoaded', function() {
    const logoutLinks = document.querySelectorAll('.logout');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showLogoutConfirmation();
        });
    });
});

// Show logout confirmation
function showLogoutConfirmation() {
    const confirmModal = document.createElement('div');
    confirmModal.className = 'modal';
    confirmModal.innerHTML = `
        <div class="modal-content animate-slide-up" style="max-width: 400px; text-align: center;">
            <div style="width: 80px; height: 80px; background: #ffe6e6; border-radius: 50%; 
                 display: flex; align-items: center; justify-content: center; margin: 0 auto 25px;">
                <i class="fas fa-sign-out-alt" style="font-size: 2.5rem; color: #e74c3c;"></i>
            </div>
            <h3 style="margin-bottom: 15px; color: #2c3e50;">Logout Confirmation</h3>
            <p style="color: #666; margin-bottom: 30px; line-height: 1.6;">
                Are you sure you want to logout from WisdomBridge?
            </p>
            <div style="display: flex; gap: 15px;">
                <button id="cancelLogout" class="btn btn-outline" style="flex: 1; padding: 15px;">
                    Cancel
                </button>
                <button id="confirmLogout" class="btn btn-primary" style="flex: 1; padding: 15px; background: #e74c3c;">
                    Logout
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmModal);
    confirmModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Cancel button
    const cancelBtn = confirmModal.getElementById('cancelLogout');
    cancelBtn.addEventListener('click', () => {
        confirmModal.style.animation = 'slideInUp 0.6s ease-out reverse';
        setTimeout(() => {
            confirmModal.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    });
    
    // Confirm button
    const confirmBtn = confirmModal.getElementById('confirmLogout');
    confirmBtn.addEventListener('click', () => {
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
        confirmBtn.disabled = true;
        
        setTimeout(() => {
            // Clear all localStorage data
            localStorage.clear();
            
            // Clear session data
            window.sessionData = {
                currentUser: null,
                activeSessions: {},
                pendingRequests: {},
                notifications: []
            };
            
            window.dashboardState = {
                isMobile: false,
                sidebarOpen: false,
                notifications: [],
                sessionRequests: [],
                activeSessions: []
            };
            
            // Redirect to home page
            window.location.href = 'index.html';
        }, 1000);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            confirmModal.style.animation = 'slideInUp 0.6s ease-out reverse';
            setTimeout(() => {
                confirmModal.remove();
                document.body.style.overflow = 'auto';
            }, 300);
        }
    });
}

// Show alert function for dashboard
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) existingAlert.remove();

    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="alert-close"><i class="fas fa-times"></i></button>
        </div>
    `;

    // Style the alert
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 20px 25px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 4000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        backdrop-filter: blur(10px);
    `;

    const alertContent = alert.querySelector('.alert-content');
    alertContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 15px;
    `;

    const alertClose = alert.querySelector('.alert-close');
    alertClose.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        margin-left: 20px;
        opacity: 0.8;
        transition: opacity 0.3s;
    `;

    alertClose.addEventListener('click', () => {
        alert.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => alert.remove(), 300);
    });

    document.body.appendChild(alert);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}