/**
 * Avatar utility functions
 * Provides functionality for user avatars, including fallback to initials
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all avatars
    initializeAvatars();
});

/**
 * Initialize all avatar images with error handling
 */
function initializeAvatars() {
    const avatarImages = document.querySelectorAll('.user-avatar');
    
    avatarImages.forEach(img => {
        // Set error handler for images
        img.addEventListener('error', handleAvatarError);
        
        // If image is already loaded but broken, trigger the error handler
        if (img.complete && img.naturalHeight === 0) {
            handleAvatarError.call(img);
        }
    });
}

/**
 * Handle avatar image loading errors by replacing with initials
 */
function handleAvatarError() {
    const img = this;
    const parent = img.parentElement;
    const username = getUsernameFromContext(parent) || '管理员';
    
    // Create initials avatar element
    const initialsAvatar = document.createElement('div');
    initialsAvatar.className = 'user-avatar avatar-initials';
    initialsAvatar.textContent = getInitials(username);
    
    // Replace the image with initials avatar
    parent.replaceChild(initialsAvatar, img);
}

/**
 * Get username from surrounding context
 * @param {HTMLElement} element - The parent element of the avatar
 * @returns {string|null} - The username or null if not found
 */
function getUsernameFromContext(element) {
    // Try to find username in nearby span
    const userInfoElement = element.closest('.user-info');
    if (userInfoElement) {
        const usernameSpan = userInfoElement.querySelector('span');
        if (usernameSpan) {
            return usernameSpan.textContent.trim();
        }
    }
    
    // If no username found, return null
    return null;
}

/**
 * Get initials from a name
 * @param {string} name - The full name
 * @returns {string} - The initials (up to 2 characters)
 */
function getInitials(name) {
    if (!name) return '?';
    
    // For Chinese names, take the first character
    if (/[\u4e00-\u9fa5]/.test(name)) {
        return name.charAt(0);
    }
    
    // For other names, take first letter of first and last name
    const parts = name.split(' ');
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Create a random avatar with specified initials and colors
 * @param {string} initials - The initials to display
 * @param {string} backgroundColor - The background color (hex or CSS color)
 * @param {string} textColor - The text color (hex or CSS color)
 * @returns {HTMLElement} - The avatar element
 */
function createRandomAvatar(initials = '?', backgroundColor = null, textColor = '#ffffff') {
    // Generate random background color if not provided
    if (!backgroundColor) {
        const colors = [
            '#4f46e5', '#4338ca', '#3730a3', '#6366f1', 
            '#8b5cf6', '#7c3aed', '#6d28d9', '#a855f7',
            '#ec4899', '#db2777', '#be185d', '#f43f5e'
        ];
        backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    }
    
    const avatar = document.createElement('div');
    avatar.className = 'user-avatar avatar-initials';
    avatar.style.backgroundColor = backgroundColor;
    avatar.style.color = textColor;
    avatar.textContent = initials;
    
    return avatar;
}

/**
 * Update user status indicator
 * @param {string} userId - The user ID
 * @param {string} status - The status ('online', 'away', 'busy', 'offline')
 */
function updateUserStatus(userId, status) {
    const validStatuses = ['online', 'away', 'busy', 'offline'];
    if (!validStatuses.includes(status)) {
        console.error('Invalid status:', status);
        return;
    }
    
    const userElements = document.querySelectorAll(`[data-user-id="${userId}"]`);
    userElements.forEach(element => {
        const statusIndicator = element.querySelector('.status-indicator');
        if (statusIndicator) {
            // Remove all status classes
            validStatuses.forEach(s => {
                statusIndicator.classList.remove(`status-${s}`);
            });
            
            // Add the new status class
            statusIndicator.classList.add(`status-${status}`);
        }
    });
}
