const palette = [0x006099, 0xFF3C6E, 0xFF5722, 0xFFCA2C, 0x26C6DA, 0x03A9F4];
const disabledPalette = [0x26C6DA];

const disabledParticles = 0;

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

const removeCookies = cookies => cookies.forEach((c) => {
  chrome.cookies.remove({ url: `http://${c.domain}${c.path}`, name: c.name });
  chrome.cookies.remove({ url: `https://${c.domain}${c.path}`, name: c.name });
});

const tween = (obj) => new TWEEN.Tween(obj);
