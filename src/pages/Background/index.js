chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Do something with active tab
});

chrome.storage.local.get('theme', (result) => {
    // Do something with local storage
});