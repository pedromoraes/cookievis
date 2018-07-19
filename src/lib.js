const getData = () => new Promise((resolve, reject) => {
  const consolidated = {};
  chrome.cookies.getAll({}, (cookies) => {
    const total = cookies.length;
    let domains = cookies.map(c => {
      let parts = c.domain.toLowerCase()
        .split('.')
        .filter(p => p !== 'www');
      let short = _.compact(parts).join('.');
      !consolidated[short] && (consolidated[short] = []);
      consolidated[short].push(c);
      return short;
    });
    domains = _.uniq(domains);
    domains.sort();
    resolve({ domains, consolidated, total });
  });
});
