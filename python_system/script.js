// Boarding House Management System
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const adminLoginForm = document.getElementById('admin-login-form');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const showAdminLoginLink = document.getElementById('show-admin-login');
    const showUserLoginLink = document.getElementById('show-user-login');

    // Admin credentials
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';

    // Room data with inventory
    const rooms = [
        {
            id: '101',
            name: 'Room 101',
            type: 'Single Bed',
            amenities: ['WiFi', 'Shared Bathroom'],
            price: 2500,
            status: 'available',
            inventory: {
                bed: '1 Single Bed',
                mattress: 'Memory Foam Mattress',
                pillows: '2 Pillows',
                blankets: '2 Blankets',
                towels: '4 Bath Towels',
                toiletries: 'Basic Set',
                furniture: 'Desk, Chair, Wardrobe'
            }
        },
        {
            id: '102',
            name: 'Room 102',
            type: 'Double Bed',
            amenities: ['Air Conditioning', 'WiFi', 'Private Bathroom'],
            price: 3200,
            status: 'available',
            inventory: {
                bed: '1 Double Bed',
                mattress: 'Orthopedic Mattress',
                pillows: '4 Pillows',
                blankets: '3 Blankets',
                towels: '6 Bath Towels',
                toiletries: 'Premium Set',
                furniture: 'Desk, Chair, Wardrobe, TV Stand'
            }
        },
        {
            id: '103',
            name: 'Room 103',
            type: 'Single Bed',
            amenities: ['Fan', 'WiFi', 'Shared Bathroom'],
            price: 1800,
            status: 'available',
            inventory: {
                bed: '1 Single Bed',
                mattress: 'Standard Mattress',
                pillows: '2 Pillows',
                blankets: '1 Blanket',
                towels: '2 Bath Towels',
                toiletries: 'Basic Set',
                furniture: 'Desk, Chair'
            }
        },
        {
            id: '104',
            name: 'Room 104',
            type: 'Double Bed',
            amenities: ['Air Conditioning', 'WiFi', 'Private Bathroom', 'Kitchen Access'],
            price: 4500,
            status: 'available',
            inventory: {
                bed: '1 Queen Bed',
                mattress: 'Luxury Mattress',
                pillows: '4 Premium Pillows',
                blankets: '4 Blankets',
                towels: '8 Bath Towels',
                toiletries: 'Deluxe Set',
                furniture: 'Desk, Chair, Wardrobe, Kitchenette, TV Stand'
            }
        },
        {
            id: '105',
            name: 'Room 105',
            type: 'Single Bed',
            amenities: ['Air Conditioning', 'WiFi', 'Shared Bathroom'],
            price: 2800,
            status: 'available',
            inventory: {
                bed: '1 Single Bed',
                mattress: 'Memory Foam Mattress',
                pillows: '2 Pillows',
                blankets: '2 Blankets',
                towels: '4 Bath Towels',
                toiletries: 'Basic Set',
                furniture: 'Desk, Chair, Wardrobe'
            }
        },
        {
            id: '106',
            name: 'Room 106',
            type: 'Double Bed',
            amenities: ['Air Conditioning', 'WiFi', 'Private Bathroom'],
            price: 3500,
            status: 'available',
            inventory: {
                bed: '1 Double Bed',
                mattress: 'Orthopedic Mattress',
                pillows: '4 Pillows',
                blankets: '3 Blankets',
                towels: '6 Bath Towels',
                toiletries: 'Premium Set',
                furniture: 'Desk, Chair, Wardrobe, TV Stand'
            }
        }
    ];

    // Initialize users from localStorage
    let users = JSON.parse(localStorage.getItem('boardingHouseUsers')) || [];

    // Form toggle functionality
    showSignupLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        adminLoginForm.style.display = 'none';
    });

    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        adminLoginForm.style.display = 'none';
    });

    showAdminLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        adminLoginForm.style.display = 'block';
    });

    showUserLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        adminLoginForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Create room selection interface
    const roomInterface = document.createElement('div');
    roomInterface.id = 'room-selection-interface';
    roomInterface.innerHTML = `
        <div class="room-container">
            <div class="header-section">
                <div class="user-welcome">
                    <h2>Welcome, <span id="user-name"></span>!</h2>
                    <p>Browse available rooms below</p>
                </div>
                <div class="header-buttons">
                    <button class="view-bookings-btn" id="view-bookings-btn">📋 My Bookings</button>
                    <button class="logout-btn" id="logout-btn">🚪 Logout</button>
                </div>
            </div>
            <div class="room-grid" id="room-grid"></div>
        </div>
    `;
    roomInterface.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 20px;
    `;
    document.body.appendChild(roomInterface);

    // Create bookings modal
    const bookingsModal = document.createElement('div');
    bookingsModal.id = 'bookings-modal';
    bookingsModal.innerHTML = `
        <div class="bookings-content">
            <h2>📖 My Bookings</h2>
            <div id="bookings-list"></div>
            <button class="modal-close-btn" id="close-bookings-btn">Close</button>
        </div>
    `;
    document.body.appendChild(bookingsModal);

    // Create admin dashboard
    const adminInterface = document.createElement('div');
    adminInterface.id = 'admin-interface';
    adminInterface.innerHTML = `
        <div class="admin-container">
            <div class="admin-header">
                <h1>🔐 Admin Dashboard</h1>
                <button id="admin-logout-btn" class="admin-logout">🚪 Logout</button>
            </div>
            <div class="admin-content">
                <div class="admin-section">
                    <h2>👥 Registered Users</h2>
                    <div id="users-list" class="users-list"></div>
                </div>
                <div class="admin-section">
                    <h2>📋 All Bookings</h2>
                    <div id="all-bookings-list" class="bookings-list"></div>
                </div>
            </div>
        </div>
    `;
    adminInterface.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 20px;
    `;
    document.body.appendChild(adminInterface);

    // Create email modal
    const emailModal = document.createElement('div');
    emailModal.id = 'email-modal';
    emailModal.innerHTML = `
        <div class="email-content">
            <h2>✉️ Send Email</h2>
            <form id="email-form">
                <label for="email-to">To:</label>
                <input type="text" id="email-to" readonly>
                
                <label for="email-subject">Subject:</label>
                <input type="text" id="email-subject" placeholder="Enter subject" required>
                
                <label for="email-message">Message:</label>
                <textarea id="email-message" placeholder="Type your message here..." required style="width: 100%; height: 200px; padding: 10px; border: 2px solid #e1e5e9; border-radius: 8px; font-family: Arial, sans-serif; font-size: 1em;"></textarea>
                
                <div class="email-actions">
                    <button type="submit" class="send-email-btn">📧 Send Email</button>
                    <button type="button" class="cancel-email-btn" id="cancel-email-btn">Cancel</button>
                </div>
            </form>
        </div>
    `;
    emailModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        backdrop-filter: blur(5px);
    `;
    document.body.appendChild(emailModal);

    // Signup form handler
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fullname = document.getElementById('signup-fullname').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const username = document.getElementById('signup-username').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        // Validation
        if (!fullname || !email || !username || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        // Check if username already exists
        if (users.some(user => user.username === username)) {
            alert('Username already exists. Please choose a different username.');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            fullname,
            email,
            username,
            password,
            createdAt: new Date().toISOString(),
            bookings: []
        };

        users.push(newUser);
        localStorage.setItem('boardingHouseUsers', JSON.stringify(users));

        alert('Account created successfully! Please login with your credentials.');
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';

        // Clear signup form
        signupForm.reset();
    });

    // Login form handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        // Find user
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            alert('Invalid username or password.');
            return;
        }

        // Store current user
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Show room interface
        showRoomInterface(user);
        loginForm.style.display = 'none';
        roomInterface.style.display = 'flex';

        // Clear login form
        loginForm.reset();
    });

    // Admin login form handler
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('admin-username').value.trim();
        const password = document.getElementById('admin-password').value;

        // Check admin credentials
        if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
            alert('Invalid admin credentials.');
            return;
        }

        // Show admin interface
        showAdminDashboard();
        adminLoginForm.style.display = 'none';
        adminInterface.style.display = 'flex';

        // Clear form
        adminLoginForm.reset();
    });

    // Show room interface
    function showRoomInterface(user) {
        document.getElementById('user-name').textContent = user.fullname;
        const roomGrid = document.getElementById('room-grid');
        roomGrid.innerHTML = '';

        rooms.forEach(room => {
            // Check if room is already booked
            let isBooked = false;
            users.forEach(u => {
                if (u.bookings.some(booking => booking.roomId === room.id)) {
                    isBooked = true;
                }
            });

            // Update room status based on actual bookings
            const roomStatus = isBooked ? 'occupied' : 'available';

            const roomCard = document.createElement('div');
            roomCard.className = `room-card ${roomStatus}`;
            roomCard.setAttribute('data-room', room.id);
            
            // Display inventory items preview
            const inventoryPreview = Object.entries(room.inventory)
                .slice(0, 3)
                .map(([key, val]) => `• ${val}`)
                .join('<br>');

            roomCard.innerHTML = `
                <div>
                    <h3>${room.name}</h3>
                    <p class="room-type">${room.type}</p>
                    <div class="amenities">
                        <strong>Amenities:</strong>
                        ${room.amenities.map(a => `• ${a}`).join('<br>')}
                    </div>
                    <div class="amenities">
                        <strong>Included:</strong>
                        ${inventoryPreview}
                    </div>
                </div>
                <div>
                    <p class="price">₱${room.price.toLocaleString()}/month</p>
                    <button class="book-btn" ${roomStatus === 'occupied' ? 'disabled' : ''}>
                        ${roomStatus === 'occupied' ? '❌ Occupied' : '✓ Book Now'}
                    </button>
                </div>
            `;

            if (roomStatus === 'available') {
                roomCard.addEventListener('click', () => bookRoom(room));
            }

            roomGrid.appendChild(roomCard);
        });
    }

    // Book room function
    function bookRoom(room) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // Check if room is already occupied
        let isOccupied = false;
        users.forEach(user => {
            if (user.bookings.some(booking => booking.roomId === room.id)) {
                isOccupied = true;
            }
        });

        if (isOccupied) {
            alert(`❌ Sorry! ${room.name} is already booked by another user.\n\nPlease choose a different room.`);
            return;
        }

        // Check if user already booked this room
        if (currentUser.bookings.some(booking => booking.roomId === room.id)) {
            alert(`❌ You have already booked ${room.name}!`);
            return;
        }

        const confirmation = confirm(
            `Book ${room.name}?\n\nType: ${room.type}\nPrice: ₱${room.price.toLocaleString()}/month\n\nClick OK to confirm.`
        );

        if (!confirmation) return;

        // Update user's bookings
        currentUser.bookings.push({
            roomId: room.id,
            roomName: room.name,
            price: room.price,
            bookedAt: new Date().toISOString()
        });

        // Update users array
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        users[userIndex] = currentUser;
        localStorage.setItem('boardingHouseUsers', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Mark room as occupied
        room.status = 'occupied';

        alert(`✅ Room ${room.name} booked successfully!\n\nPrice: ₱${room.price.toLocaleString()}/month\nWelcome!`);
        showRoomInterface(currentUser);
    }

    // Show admin dashboard
    function showAdminDashboard() {
        const usersList = document.getElementById('users-list');
        const allBookingsList = document.getElementById('all-bookings-list');

        // Display registered users
        if (users.length === 0) {
            usersList.innerHTML = '<p style="color: #666; text-align: center;">No users registered yet.</p>';
        } else {
            usersList.innerHTML = users.map(user => `
                <div class="user-card">
                    <h3>${user.fullname}</h3>
                    <p><strong>Username:</strong> ${user.username}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Member Since:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
                    <p><strong>Total Bookings:</strong> ${user.bookings.length}</p>
                    <button class="contact-user-btn" data-email="${user.email}" data-name="${user.fullname}">📧 Send Email</button>
                </div>
            `).join('');

            // Add email button listeners for users
            document.querySelectorAll('.contact-user-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const email = this.getAttribute('data-email');
                    const name = this.getAttribute('data-name');
                    showEmailModal(email, name);
                });
            });
        }

        // Display all bookings
        let allBookings = [];
        users.forEach(user => {
            user.bookings.forEach(booking => {
                allBookings.push({
                    userName: user.fullname,
                    userEmail: user.email,
                    roomName: booking.roomName,
                    price: booking.price,
                    bookedAt: booking.bookedAt
                });
            });
        });

        if (allBookings.length === 0) {
            allBookingsList.innerHTML = '<p style="color: #666; text-align: center;">No bookings yet.</p>';
        } else {
            allBookingsList.innerHTML = allBookings.map(booking => `
                <div class="booking-card">
                    <h4>${booking.roomName}</h4>
                    <p><strong>Booked by:</strong> ${booking.userName}</p>
                    <p><strong>Email:</strong> ${booking.userEmail}</p>
                    <p><strong>Price:</strong> ₱${booking.price.toLocaleString()}/month</p>
                    <p><strong>Booking Date:</strong> ${new Date(booking.bookedAt).toLocaleDateString()}</p>
                    <button class="contact-booking-btn" data-email="${booking.userEmail}" data-name="${booking.userName}" data-room="${booking.roomName}">📧 Send Email to ${booking.userName.split(' ')[0]}</button>
                </div>
            `).join('');

            // Add email button listeners for bookings
            document.querySelectorAll('.contact-booking-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const email = this.getAttribute('data-email');
                    const name = this.getAttribute('data-name');
                    const room = this.getAttribute('data-room');
                    showEmailModal(email, name, room);
                });
            });
        }
    }

    // Show email modal
    function showEmailModal(email, name, room = '') {
        document.getElementById('email-to').value = `${name} <${email}>`;
        document.getElementById('email-subject').value = room ? `Regarding Your ${room} Booking` : `Message for ${name}`;
        document.getElementById('email-message').value = '';
        emailModal.style.display = 'flex';

        // Store current recipient for sending
        emailModal.dataset.recipientEmail = email;
        emailModal.dataset.recipientName = name;
    }

    // Handle email form submission
    document.getElementById('email-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const subject = document.getElementById('email-subject').value.trim();
        const message = document.getElementById('email-message').value.trim();
        const recipientEmail = emailModal.dataset.recipientEmail;
        const recipientName = emailModal.dataset.recipientName;

        if (!subject || !message) {
            alert('Please fill in subject and message.');
            return;
        }

        // Store email in localStorage (simulated sent emails)
        let sentEmails = JSON.parse(localStorage.getItem('sentEmails')) || [];
        sentEmails.push({
            to: recipientEmail,
            toName: recipientName,
            subject: subject,
            message: message,
            sentAt: new Date().toISOString()
        });
        localStorage.setItem('sentEmails', JSON.stringify(sentEmails));

        alert(`✅ Email sent to ${recipientName} (${recipientEmail})\n\nSubject: ${subject}`);
        emailModal.style.display = 'none';
    });

    // Close email modal
    document.getElementById('cancel-email-btn').addEventListener('click', function() {
        emailModal.style.display = 'none';
    });

    // Close modal when clicking outside
    emailModal.addEventListener('click', function(e) {
        if (e.target === emailModal) {
            emailModal.style.display = 'none';
        }
    });

    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        roomInterface.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Admin logout functionality
    document.getElementById('admin-logout-btn').addEventListener('click', function() {
        adminInterface.style.display = 'none';
        adminLoginForm.style.display = 'none';
        loginForm.style.display = 'block';
        adminLoginForm.reset();
    });

    // View bookings functionality
    document.getElementById('view-bookings-btn').addEventListener('click', function() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const bookingsList = document.getElementById('bookings-list');

        if (currentUser.bookings.length === 0) {
            bookingsList.innerHTML = '<div class="no-bookings"><p>You have no bookings yet. Browse rooms and book one!</p></div>';
        } else {
            bookingsList.innerHTML = currentUser.bookings.map((booking, index) => `
                <div class="booking-item">
                    <div class="booking-header">
                        <div>
                            <h3>${booking.roomName}</h3>
                            <p><strong>Monthly Rate:</strong> <span class="price">₱${booking.price.toLocaleString()}</span></p>
                            <p><strong>Booked on:</strong> ${new Date(booking.bookedAt).toLocaleDateString()}</p>
                        </div>
                        <button class="cancel-booking-btn" data-booking-index="${index}">❌ Cancel</button>
                    </div>
                </div>
            `).join('');

            // Add cancel booking listeners
            document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const bookingIndex = parseInt(this.getAttribute('data-booking-index'));
                    cancelBooking(bookingIndex);
                });
            });
        }

        bookingsModal.style.display = 'flex';
    });

    // Cancel booking function
    function cancelBooking(bookingIndex) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const booking = currentUser.bookings[bookingIndex];

        const confirmation = confirm(
            `Cancel booking for ${booking.roomName}?\n\nYou will lose this reservation.\n\nClick OK to confirm cancellation.`
        );

        if (!confirmation) return;

        // Find the room and mark it as available
        const room = rooms.find(r => r.id === booking.roomId);
        if (room) {
            room.status = 'available';
        }

        // Remove booking from user
        currentUser.bookings.splice(bookingIndex, 1);

        // Update localStorage
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        users[userIndex] = currentUser;
        localStorage.setItem('boardingHouseUsers', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        alert(`✅ Booking for ${booking.roomName} has been canceled!\n\nThe room is now available for booking again.`);

        // Close bookings modal
        bookingsModal.style.display = 'none';

        // Refresh room interface to show the room as available again
        showRoomInterface(currentUser);
    }

    // Close bookings modal
    document.getElementById('close-bookings-btn').addEventListener('click', function() {
        bookingsModal.style.display = 'none';
    });

    // Close modal when clicking outside
    bookingsModal.addEventListener('click', function(e) {
        if (e.target === bookingsModal) {
            bookingsModal.style.display = 'none';
        }
    });

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
});