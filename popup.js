// Get the disable button
const disableButton = document.getElementById('disable-button');

// Get the current tab's URL
browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  const url = new URL(tabs[0].url);
  const domain = url.hostname;
  
  // Get the list of disabled domains from storage
  browser.storage.local.get(['disabledDomains'], function(result) {
    const disabledDomains = result.disabledDomains || [];
    
    // Set the state of the disable button based on whether the domain is disabled
    disableButton.textContent = disabledDomains.includes(domain) ? 'Enable for this page' : 'Disable for this page';
    
    // Handle the click event for the disable button
    disableButton.addEventListener('click', function() {
      if (disabledDomains.includes(domain)) {
        // Remove the domain from the disabled list
        const index = disabledDomains.indexOf(domain);
        if (index !== -1) {
          disabledDomains.splice(index, 1);
        }
        disableButton.textContent = 'Disable for this page';
      } else {
        // Add the domain to the disabled list
        disabledDomains.push(domain);
        disableButton.textContent = 'Enable for this page';
      }
      
      // Save the updated disabled domains list to storage
      browser.storage.local.set({disabledDomains: disabledDomains});
      
      // Reload the current tab to reflect the updated state
      browser.tabs.reload();
    });
    
    // Get the current tab's ID
    const tabId = tabs[0].id;
    
    // Check whether the extension is enabled for the current tab
    browser.browserAction.isEnabled({ tabId: tabId }, function(enabled) {
      if (enabled) {
        // Apply the dark mode to the web page
        applyDarkMode();
      }
    });

    // Listen for changes to the extension's enabled state
    browser.browserAction.onClicked.addListener(function(tab) {
      // Get the current tab's ID
      const tabId = tab.id;
      
      // Toggle the extension's enabled state
      browser.browserAction.isEnabled({ tabId: tabId }, function(enabled) {
        if (enabled) {
          // Remove the dark mode from the web page
          removeDarkMode();
          
          // Disable the extension for the current tab
          browser.browserAction.disable({ tabId: tabId });
        } else {
          // Apply the dark mode to the web page
          applyDarkMode();
          
          // Enable the extension for the current tab
          browser.browserAction.enable({ tabId: tabId });
        }
      });
    });
  });
});

// Apply the dark mode to the web page
function applyDarkMode() {
  // Add a dark mode class to the body element
  document.body.classList.add('dark-mode');
}

// Remove the dark mode from the web page
function removeDarkMode() {
  // Remove the dark mode class from the body element
  document.body.classList.remove('dark-mode');
}
