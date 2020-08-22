// chrome.runtime.onMessage.addListener(function (message) {
//     // console.log(message)
// });

// chrome.omnibox.onInputChanged.addListener((input) => {
// });

// chrome.omnibox.onInputStarted.addListener(function (event) {
// });

chrome.omnibox.onInputEntered.addListener(function (text) {
    const url = `https://nim-lang.org/docs/lib.html#search=${text}`;
    console.log("nim extension background script just recieved text ${text} and is redirecting the current tab to: ${url}");
    chrome.tabs.update({ url: url });
});