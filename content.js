function getObjectForURLHashValues()  {
  // This is from:
  // https://stackoverflow.com/questions/23699666/javascript-get-and-set-url-hash-parameters
  var hash = window.location.hash.substr(1);

  var result = hash.split('&').reduce(function (result, item) {
      var parts = item.split('=');
      result[parts[0]] = parts[1];
      return result;
  }, {});

  return result;
}


console.log('nim extension content script loaded.');

function run() {
  console.log('nim extensino content script can see the DOM is loaded');


  // Don't actually start this whole process if the search  hash is not in the URL
  const hashKeyValueObject = getObjectForURLHashValues();
  if ("search" in hashKeyValueObject) {
    // var actualCode = `chrome.tabs.sendMessage(tabId, { source: window.search.toString() }, (resp) => { console.log('Recieved response', resp); });`  
    var actualCode = `window.postMessage({ type: "FROM_NIM_DOCS", source: window.search.toString() }, "*");`;
    
    // This code injection is from:
    // https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script
    document.documentElement.setAttribute('onreset', actualCode);
    document.documentElement.dispatchEvent(new CustomEvent('reset'));
    document.documentElement.removeAttribute('onreset');

    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
  }
}

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',run);
} else {
    run();
}

window.addEventListener("message", function(event) {
  if (event.source != window)
      return;

  if (event.data.type && (event.data.type == "FROM_NIM_DOCS")) {
      console.log('nim extension content script recieved a message from the page.');
      console.log(`nim documentation is using the following function to search: event.data.source`);

      const searchFunctionSource = event.data.source;
      const doSearchWithParens = searchFunctionSource.match(/dosearch_[a-zA-Z0-9_-]*\(+/g)[0];
      const doSearchunctionName = doSearchWithParens.substring(0, doSearchWithParens.length-1);

      const replaceFunctionWithParens = searchFunctionSource.match(/replace_by_id_[a-zA-Z0-9_-]*\(+/g)[0];
      const replaceFunctionName = replaceFunctionWithParens.substring(0, replaceFunctionWithParens.length-1);

      const hashKeyValueObject = getObjectForURLHashValues();
      console.log(hashKeyValueObject)

      const searchStringFromURL = hashKeyValueObject.search;

      // Now i just need to inject a call to:
      // replace_by_id_10926172("tocRoot", dosearch_11005547(searchStringFromURL));
      var actualCode = `${replaceFunctionName}("tocRoot", ${doSearchunctionName}("${searchStringFromURL}"))`;

      console.log(`nim extension content script is injecting JS to perform search operation for term ${searchStringFromURL}:`, actualCode);
    
      var script = document.createElement('script');
      script.textContent = actualCode;
      (document.head||document.documentElement).appendChild(script);
      script.remove();
  }
});
