chrome.runtime.onMessage.addListener((function(o,e,a){if(o.getLocalStorage&&(console.log(localStorage),a({localStorageData:localStorage})),o.setLocalStorage)for(let e in o.setLocalStorage)localStorage.setItem(e,o.setLocalStorage[e])})),console.log("loaded new");