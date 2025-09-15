// Enhanced badge system that works better with App Creator 24 and web wrappers

export const updateAppBadge = (count: number) => {
  console.log('🔔 updateAppBadge called with count:', count);
  
  // Method 1: Try native Badge API (works in some browsers/apps)
  if ('setAppBadge' in navigator) {
    try {
      if (count > 0) {
        navigator.setAppBadge(count);
        console.log('✅ Native badge set:', count);
      } else {
        navigator.clearAppBadge();
        console.log('✅ Native badge cleared');
      }
    } catch (error) {
      console.log('❌ Badge API not supported:', error);
    }
  } else {
    console.log('❌ Badge API not available');
  }

  // Method 2: Update document title (works everywhere)
  updateDocumentTitle(count);

  // Method 3: Update favicon (works everywhere)
  updateFaviconBadge(count);

  // Method 4: Send message to parent window (for App Creator 24)
  if (window.parent !== window) {
    try {
      window.parent.postMessage({
        type: 'BADGE_UPDATE',
        count: count
      }, '*');
      console.log('✅ Parent window notified with count:', count);
    } catch (error) {
      console.log('❌ Could not send badge update to parent:', error);
    }
  } else {
    console.log('❌ No parent window to notify');
  }

  // Method 5: Store in localStorage for persistence
  localStorage.setItem('app_badge_count', count.toString());
  console.log('✅ Badge count stored in localStorage:', count);
};

export const updateDocumentTitle = (count: number) => {
  const baseTitle = 'Chyme';
  if (count === 0) {
    document.title = baseTitle;
    console.log('✅ Document title cleared:', baseTitle);
  } else {
    document.title = `(${count}) ${baseTitle}`;
    console.log('✅ Document title updated:', `(${count}) ${baseTitle}`);
  }
};

export const updateFaviconBadge = (count: number) => {
  console.log('🔔 updateFaviconBadge called with count:', count);
  
  if (count === 0) {
    // Reset to original favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = '/favicon.ico';
      console.log('✅ Favicon reset to original');
    }
    return;
  }

  // Create canvas to draw favicon with badge
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = 32;
  canvas.height = 32;

  // Load original favicon
  const img = new Image();
  img.onload = () => {
    // Draw original favicon
    ctx.drawImage(img, 0, 0, 32, 32);

    // Draw badge circle
    const badgeSize = 12;
    const badgeX = 32 - badgeSize - 2;
    const badgeY = 2;

    // Badge background (red circle)
    ctx.fillStyle = '#ef4444'; // red-500
    ctx.beginPath();
    ctx.arc(badgeX + badgeSize/2, badgeY + badgeSize/2, badgeSize/2, 0, 2 * Math.PI);
    ctx.fill();

    // Badge text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const badgeText = count > 99 ? '99+' : count.toString();
    ctx.fillText(badgeText, badgeX + badgeSize/2, badgeY + badgeSize/2);

    // Update favicon
    const dataURL = canvas.toDataURL('image/png');
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = dataURL;
      console.log('✅ Favicon updated with badge:', count);
    } else {
      // Create new favicon link if it doesn't exist
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = dataURL;
      document.head.appendChild(link);
      console.log('✅ New favicon created with badge:', count);
    }
  };

  img.src = '/favicon.ico';
};

// Initialize badge from localStorage on page load
export const initializeBadge = () => {
  console.log('🔔 Initializing badge from localStorage...');
  const storedCount = localStorage.getItem('app_badge_count');
  if (storedCount) {
    const count = parseInt(storedCount, 10);
    if (!isNaN(count)) {
      console.log('✅ Restoring badge count from localStorage:', count);
      updateAppBadge(count);
    } else {
      console.log('❌ Invalid badge count in localStorage:', storedCount);
    }
  } else {
    console.log('❌ No badge count found in localStorage');
  }
};

// Test function to manually set badge (for debugging)
export const testBadge = (count: number) => {
  console.log('🧪 Testing badge with count:', count);
  updateAppBadge(count);
};
