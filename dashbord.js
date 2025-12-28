// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle for dashboard
    const dashboardMenuToggle = document.createElement('button');
    dashboardMenuToggle.className = 'dashboard-menu-toggle';
    dashboardMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(dashboardMenuToggle);
    
    const sidebar = document.querySelector('.sidebar');
    
    if (dashboardMenuToggle && sidebar) {
        dashboardMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            dashboardMenuToggle.innerHTML = sidebar.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !dashboardMenuToggle.contains(e.target) && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    dashboardMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    }
    
    // Check login state
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');
    
    if (!isLoggedIn) {
        // Redirect to appropriate login page based on current page
        const currentPage = window.location.pathname;
        if (currentPage.includes('dashboard')) {
            if (currentPage.includes('junior')) {
                window.location.href = 'junior-login.html';
            } else if (currentPage.includes('senior')) {
                window.location.href = 'senior-login.html';
            }
        }
    } else {
        // Update user info if available
        const userName = localStorage.getItem('userName');
        const userInfoElements = document.querySelectorAll('.user-details h4');
        userInfoElements.forEach(el => {
            if (userName && el.textContent.includes('Welcome') === false) {
                el.textContent = userName;
            }
        });
    }
    
    // Find Expert button
    const findExpertBtn = document.getElementById('findExpertBtn');
    if (findExpertBtn) {
        findExpertBtn.addEventListener('click', function() {
            // Create search modal
            const searchModal = document.createElement('div');
            searchModal.className = 'modal';
            searchModal.innerHTML = `
                <div class="modal-content" style="max-width: 600px;">
                    <span class="close-modal">&times;</span>
                    <h2>Find Expert</h2>
                    <div style="margin: 20px 0;">
                        <input type="text" placeholder="Search by skill, industry, or name..." style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 5px;">
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0;">
                        <button class="btn btn-outline" onclick="filterExperts('business')">Business</button>
                        <button class="btn btn-outline" onclick="filterExperts('technology')">Technology</button>
                        <button class="btn btn-outline" onclick="filterExperts('finance')">Finance</button>
                        <button class="btn btn-outline" onclick="filterExperts('marketing')">Marketing</button>
                    </div>
                    <div id="searchResults" style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                        <p>Search results will appear here...</p>
                    </div>
                </div>
            `;
            
            document.body.appendChild(searchModal);
            searchModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Close modal functionality
            const closeBtn = searchModal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                searchModal.remove();
                document.body.style.overflow = 'auto';
            });
            
            window.addEventListener('click', (e) => {
                if (e.target === searchModal) {
                    searchModal.remove();
                    document.body.style.overflow = 'auto';
                }
            });
        });
    }
    
    // Availability toggle
    const availabilityToggle = document.querySelector('.switch input');
    if (availabilityToggle) {
        const statusElement = document.querySelector('.status');
        
        availabilityToggle.addEventListener('change', function() {
            if (statusElement) {
                if (this.checked) {
                    statusElement.textContent = '● Available';
                    statusElement.className = 'status active';
                    localStorage.setItem('availability', 'available');
                } else {
                    statusElement.textContent = '● Busy';
                    statusElement.className = 'status busy';
                    localStorage.setItem('availability', 'busy');
                }
            }
        });
        
        // Load saved availability state
        const savedAvailability = localStorage.getItem('availability');
        if (savedAvailability === 'busy') {
            availabilityToggle.checked = false;
            if (statusElement) {
                statusElement.textContent = '● Busy';
                statusElement.className = 'status busy';
            }
        }
    }
    
    // Session action buttons
    document.querySelectorAll('.session-actions button, .schedule-actions button, .request-actions button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.textContent.trim();
            const card = this.closest('.session-card, .schedule-item, .request-card');
            
            if (action === 'Start') {
                alert('Starting video session...');
                this.textContent = 'In Progress';
                this.disabled = true;
                this.classList.remove('btn-secondary');
                this.classList.add('btn-primary');
                
                // Simulate session ending after 5 seconds
                setTimeout(() => {
                    if (card) {
                        card.style.opacity = '0.5';
                        card.querySelector('button').textContent = 'Completed';
                        card.querySelector('button').disabled = true;
                        setTimeout(() => {
                            if (card) card.style.display = 'none';
                        }, 2000);
                    }
                }, 5000);
            } else if (action === 'Join Now') {
                alert('Joining session... Opening video call interface.');
                // In real implementation, this would connect to video call
            } else if (action === 'Accept') {
                if (card) {
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        alert('Session request accepted! The junior has been notified.');
                        card.style.display = 'none';
                    }, 300);
                }
            } else if (action === 'Decline') {
                if (confirm('Are you sure you want to decline this request?')) {
                    if (card) {
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            } else if (action === 'Details') {
                alert('Showing session details...');
            } else if (action === 'Reschedule') {
                const newTime = prompt('Enter new time for the session (e.g., Tomorrow, 2:00 PM):');
                if (newTime) {
                    const timeElement = card.querySelector('.session-time p:first-child');
                    if (timeElement) {
                        timeElement.innerHTML = `<i class="fas fa-calendar"></i> ${newTime}`;
                        alert('Session rescheduled successfully!');
                    }
                }
            }
        });
    });
    
    // Book Session buttons
    document.querySelectorAll('.btn-block').forEach(button => {
        if (button.textContent.includes('Book Session')) {
            button.addEventListener('click', function() {
                const expertCard = this.closest('.expert-card');
                const expertName = expertCard ? expertCard.querySelector('h4').textContent : 'Expert';
                
                // Create booking modal
                const bookingModal = document.createElement('div');
                bookingModal.className = 'modal';
                bookingModal.innerHTML = `
                    <div class="modal-content" style="max-width: 500px;">
                        <span class="close-modal">&times;</span>
                        <h2>Book Session with ${expertName}</h2>
                        <form id="bookingForm" style="margin-top: 20px;">
                            <div class="form-group">
                                <label>Session Topic</label>
                                <input type="text" placeholder="What would you like to discuss?" required>
                            </div>
                            <div class="form-group">
                                <label>Date</label>
                                <input type="date" required>
                            </div>
                            <div class="form-group">
                                <label>Time</label>
                                <input type="time" required>
                            </div>
                            <div class="form-group">
                                <label>Duration</label>
                                <select required>
                                    <option value="">Select duration</option>
                                    <option value="30">30 minutes</option>
                                    <option value="60">60 minutes</option>
                                    <option value="90">90 minutes</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Confirm Booking</button>
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
                
                // Close modal functionality
                const closeBtn = bookingModal.querySelector('.close-modal');
                closeBtn.addEventListener('click', () => {
                    bookingModal.remove();
                    document.body.style.overflow = 'auto';
                });
                
                window.addEventListener('click', (e) => {
                    if (e.target === bookingModal) {
                        bookingModal.remove();
                        document.body.style.overflow = 'auto';
                    }
                });
                
                // Handle booking form submission
                const bookingForm = bookingModal.querySelector('#bookingForm');
                if (bookingForm) {
                    bookingForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        alert('Booking confirmed! The expert will review your request.');
                        bookingModal.remove();
                        document.body.style.overflow = 'auto';
                    });
                }
            });
        }
    });
    
    // Category search
    window.searchCategory = function(category) {
        const categoryNames = {
            'business': 'Business Strategy',
            'technology': 'Technology',
            'finance': 'Finance & Legal',
            'marketing': 'Marketing',
            'career': 'Career Guidance'
        };
        
        alert(`Searching for experts in ${categoryNames[category] || category} category...`);
        // In real implementation, this would filter experts by category
    };
    
    // Notification bell
    const notificationBell = document.querySelector('.notification');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            // Create notifications modal
            const notificationsModal = document.createElement('div');
            notificationsModal.className = 'modal';
            notificationsModal.innerHTML = `
                <div class="modal-content" style="max-width: 400px;">
                    <span class="close-modal">&times;</span>
                    <h2>Notifications</h2>
                    <div style="margin-top: 20px;">
                        <div style="padding: 15px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-calendar-check" style="color: #3498db;"></i>
                            <div>
                                <strong>New session request</strong>
                                <p style="margin: 5px 0 0; color: #666; font-size: 0.9rem;">From Amit Verma</p>
                            </div>
                        </div>
                        <div style="padding: 15px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-money-bill-wave" style="color: #2ecc71;"></i>
                            <div>
                                <strong>Payment received</strong>
                                <p style="margin: 5px 0 0; color: #666; font-size: 0.9rem;">₹3,000 from Priya Patel</p>
                            </div>
                        </div>
                        <div style="padding: 15px; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-comment" style="color: #9b59b6;"></i>
                            <div>
                                <strong>New message</strong>
                                <p style="margin: 5px 0 0; color: #666; font-size: 0.9rem;">From Rahul Sharma</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(notificationsModal);
            notificationsModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Reset badge
            const badge = this.querySelector('.badge');
            if (badge) badge.style.display = 'none';
            
            // Close modal functionality
            const closeBtn = notificationsModal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                notificationsModal.remove();
                document.body.style.overflow = 'auto';
            });
            
            window.addEventListener('click', (e) => {
                if (e.target === notificationsModal) {
                    notificationsModal.remove();
                    document.body.style.overflow = 'auto';
                }
            });
        });
    }
    
    // Logout functionality
    const logoutLinks = document.querySelectorAll('.logout');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                // Clear login state
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userType');
                localStorage.removeItem('userName');
                localStorage.removeItem('availability');
                
                // Redirect to home page
                window.location.href = 'index.html';
            }
        });
    });
    
    // Mark notifications as read
    document.addEventListener('click', function(e) {
        if (notificationBell && !notificationBell.contains(e.target)) {
            const badge = document.querySelector('.badge');
            if (badge && parseInt(badge.textContent) > 0) {
                // Simulate marking notifications as read after some time
                setTimeout(() => {
                    badge.style.display = 'none';
                }, 5000);
            }
        }
    });
    
    // Auto-refresh dashboard data (simulated)
    function refreshDashboardData() {
        // In real implementation, this would fetch new data from API
        console.log('Refreshing dashboard data...');
    }
    
    // Refresh every 30 seconds
    setInterval(refreshDashboardData, 30000);
    
    // Initialize data tables sorting
    const dataTables = document.querySelectorAll('.data-table');
    dataTables.forEach(table => {
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                alert(`Sorting by ${header.textContent}`);
                // In real implementation, this would sort the table
            });
        });
    });
});