// Listen for messages from popup  
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    // Check if message is to get localStorage data
    if (request.getLocalStorage) {
        // Send localStorage data to popup
        console.log(localStorage)
        sendResponse({ localStorageData: localStorage });
        // chrome.storage.sync.get("username", function (data) {
        //     const username = data.username;
        //     chrome.runtime.sendMessage({ syncStorageData: { username: username } });
        // });

    }

    // Check if message is to set localStorage data 
    if (request.setLocalStorage) {
        // Set localStorage with data from popup

        // chrome.storage.local.set({ username: "kokokokok" }, function () {
        //     console.log("username set in sync storage");
        // });

        for (let key in request.setLocalStorage) {
            // chrome.storage.local.get(['username'], function (result) {
            //     console.log('Value retrieved from localStorage across tabs:', result.key);
            // });
            localStorage.setItem(key, request.setLocalStorage[key]);
        }
    }

});
// alert("we are fetching userdata from opentune.ai")
console.log("loaded new")
