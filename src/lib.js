const palette = [0x069CF6, 0xFC5F02, 0xF1C917, 0x20E045, 0xF82D04, 0x63419D];

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
