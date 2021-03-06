<script type="application/javascript" nonce="<%= PageNonce %>">
//The following code allows you to insert custom HTML into the Laserfiche WebLink 10.2 Welcome.aspx file.
//You append to insert after or prepend to insert before any html element. #SearchFormDiv can also be changed to match the element id you wish to use.
function waitForElement(selector) {
  return new Promise(function(resolve, reject) {
    var element = document.querySelector(selector);

    if(element) {
      resolve(element);
      return;
    }

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        var nodes = Array.from(mutation.addedNodes);
        for(var node of nodes) {
          if(node.matches && node.matches(selector)) {
            observer.disconnect();
            resolve(node);
            return;
          }
        };
      });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
}	

waitForElement("#SearchFormDiv").then(function(element) {
	$('#SearchFormDiv').append('<div></div>');
});

</script>
