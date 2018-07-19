chrome.browserAction.onClicked.addListener(() => {
  let cookies;
  chrome.cookies.getAll({}, (c) => {
    cookies = c.toString();
  });
  chrome.tabs.create({ 'url': chrome.extension.getURL('vis.html') })
});
