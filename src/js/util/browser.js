function getInternetExplorerVersion() {
  let rv = false;

  if (navigator.appName === 'Microsoft Internet Explorer') {
    const ua = navigator.userAgent;
    const re = new RegExp('MSIE ([0-9]{1,}[.0-9]{0,})');

    if (re.exec(ua) != null) {
      rv = parseFloat(RegExp.$1);
    }
  } else if (navigator.appName === 'Netscape') {
    const ua = navigator.userAgent;
    const re = new RegExp('Trident/.*rv:([0-9]{1,}[.0-9]{0,})');

    if (re.exec(ua) != null) {
      rv = parseFloat(RegExp.$1);
    }
  }
  return rv;
}

function getAndroidVersion(ua) {
  // eslint-disable-next-line no-param-reassign
  ua = (ua || navigator.userAgent).toLowerCase();
  const match = ua.match(/android\s([0-9.]*)/i);
  return match ? match[1] : undefined;
}

const browser = {
  isOpera: window.opera && window.opera.buildNumber,
  isOperaMini: Object.prototype.toString.call(window.operamini) === '[object OperaMini]',
  isAndroid: getAndroidVersion(),
  isIE: getInternetExplorerVersion(),
  isiOS: navigator.userAgent.match(/(iPad|iPhone|iPod)/g),
  isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
};

export default browser;
