import Ember from 'ember';

export default function(/* container, app */) {
  /**
    The list of browsers that are automatically identified.

    @static
    @constant
  */
  Ember.BROWSER = {
    android: 'android',
    blackberry: 'blackberry',
    chrome: 'chrome',
    firefox: 'firefox',
    ie: 'ie',
    opera: 'opera',
    safari: 'safari',
    unknown: 'unknown'
  };

  /**
    The list of devices that are automatically identified.

    @static
    @constant
  */
  Ember.DEVICE = {
    android: 'android',
    blackberry: 'blackberry',
    desktop: 'desktop',
    ipad: 'ipad',
    iphone: 'iphone',
    ipod: 'ipod',
    mobile: 'mobile'
  };

  /**
    The list of browser engines that are automatically identified.

    @static
    @constant
  */
  Ember.ENGINE = {
    gecko: 'gecko',
    opera: 'opera',
    presto: 'presto',
    trident: 'trident',
    webkit: 'webkit'
  };

  /**
    The list of operating systems that are automatically identified.

    @static
    @constant
  */
  Ember.OS = {
    android: 'android',
    blackberry: 'blackberry',
    ios: 'ios',
    linux: 'linux',
    mac: 'mac',
    win: 'windows'
  };


  /**
    Detects browser properties based on the given userAgent and language.

    @private
  */
  Ember.detectBrowser = function(userAgent, language) {
    var browser = {},
        device,
        engineAndVersion,
        isIOSDevice,
        conExp = '(?:[\\/:\\::\\s:;])', // Match the connecting character
        numExp = '(\\S+[^\\s:;:\\)]|)', // Match the "number"
        nameAndVersion,
        osAndVersion,
        override;

    // Use the current values if none are provided.
    userAgent = (userAgent || navigator.userAgent).toLowerCase();
    language = language || navigator.language || navigator.browserLanguage;

    // Calculations to determine the device.  See Ember.DEVICE.
    device =
      userAgent.match( new RegExp('(android|ipad|iphone|ipod|blackberry)') ) ||
      userAgent.match( new RegExp('(mobile)') ) ||
      ['', Ember.DEVICE.desktop];

    /**
      @name Ember.browser.device
      @type {Ember.DEVICE}
    */
    browser.device = device[1];


    // It simplifies further matching by recognizing this group of devices.
    isIOSDevice =
      browser.device === Ember.DEVICE.ipad ||
      browser.device === Ember.DEVICE.iphone ||
      browser.device === Ember.DEVICE.ipod;


    // Calculations to determine the name and version.  See Ember.BROWSER.

    nameAndVersion =
      // Match the specific names first, avoiding commonly spoofed browsers.
      userAgent.match( new RegExp('(opera|chrome|firefox|android|blackberry)' + conExp + numExp) ) ||
      userAgent.match( new RegExp('(ie|safari)' + conExp + numExp) ) ||
      ['', Ember.BROWSER.unknown, '0'];

    // If the device is an iOS device, use Ember.BROWSER.safari for browser.name.
    if (isIOSDevice) { nameAndVersion[1] = Ember.BROWSER.safari; }

    // If a `Version` number is found, use that over the `Name` number
    override = userAgent.match( new RegExp('(version)' + conExp + numExp) );
    if (override) { nameAndVersion[2] = override[2]; }
    // If there is no `Version` in Safari, don't use the Safari number since it is
    // the Webkit number.
    else if (nameAndVersion[1] === Ember.BROWSER.safari) { nameAndVersion[2] = '0'; }


    /**
      @name Ember.browser.name
      @type {Ember.BROWSER}
    */
    browser.name = nameAndVersion[1];

    /**
      @name Ember.browser.version
      @type String
    */
    browser.version = nameAndVersion[2];


    // Calculations to determine the engine and version.  See Ember.ENGINE.
    engineAndVersion =
      // Match the specific engines first, avoiding commonly spoofed browsers.
      userAgent.match( new RegExp('(presto)' + conExp + numExp) ) ||
      userAgent.match( new RegExp('(opera|trident|webkit|gecko)' + conExp + numExp) ) ||
      ['', Ember.BROWSER.unknown, '0'];

    // If the browser is Ember.BROWSER.ie, use Ember.ENGINE.trident.
    override = browser.name === Ember.BROWSER.ie ? Ember.ENGINE.trident : false;
    if (override) { engineAndVersion[1] = override; }

    // If the engineVersion is unknown and the browser is Ember.BROWSER.ie, use
    // browser.version for browser.engineVersion.
    override = browser.name === Ember.BROWSER.ie && engineAndVersion[2] === '0';
    if (override) { engineAndVersion[2] = browser.version; }

    // If a `rv` number is found, use that over the engine number.
    override = userAgent.match( new RegExp('(rv)' + conExp + numExp) );
    if (override) { engineAndVersion[2] = override[2]; }


    /**
      @name Ember.browser.engine
      @type {Ember.ENGINE}
      @type {Ember.BROWSER.unknown}
    */
    browser.engine = engineAndVersion[1];

    /**
      @name Ember.browser.engineVersion
      @type String
    */
    browser.engineVersion = engineAndVersion[2];


    // If we don't know the name of the browser, use the name of the engine.
    if (browser.name === Ember.BROWSER.unknown) { browser.name = browser.engine; }

    // Calculations to determine the os and version.  See Ember.OS.
    osAndVersion =
      // Match the specific names first, avoiding commonly spoofed os's.
      userAgent.match( new RegExp('(blackberry)') ) ||
      userAgent.match( new RegExp('(android|iphone(?: os)|windows(?: nt))' + conExp + numExp) ) ||
      userAgent.match( new RegExp('(os|mac(?: os)(?: x))' + conExp + numExp) ) ||
      userAgent.match( new RegExp('(linux)') ) ||
      [null, Ember.BROWSER.unknown, '0'];

    // Normalize the os name.
    if (isIOSDevice) { osAndVersion[1] = Ember.OS.ios; }
    else if (osAndVersion[1] === 'mac os x' || osAndVersion[1] === 'mac os') { osAndVersion[1] = Ember.OS.mac; }
    else if (osAndVersion[1] === 'windows nt') { osAndVersion[1] = Ember.OS.win; }

    // Normalize the os version.
    osAndVersion[2] = osAndVersion[2] ? osAndVersion[2].replace(/_/g, '.') : '0';


    /**
      @name Ember.browser.os
      @type {Ember.OS}
      @type {Ember.BROWSER.unknown}
    */
    browser.os = osAndVersion[1];

    /**
      @name Ember.browser.osVersion
      @type String
    */
    browser.osVersion = osAndVersion[2];


    // The following long list of properties have all been deprecated.  While they
    // are a bit less verbose then the above constants, they lack standardization
    // and can be prone to failure.  Rather than continuing to expand this list
    // with more and more one-off comparisons, which often muddle the line between
    // the browser, the engine, the os and the device, it seems more practical to
    // only maintain the 7 identifiable properties listed above:  device, name,
    // version, os, osVersion, engine and engineVersion.

    /** @deprecated Since version 1.7. Use browser.os === Ember.OS.windows.
      @name Ember.browser.isWindows
      @type Boolean
    */
    browser.windows = browser.isWindows = browser.os === Ember.OS.windows;

    /** @deprecated Since version 1.7. Use browser.os === Ember.OS.mac.
      @name Ember.browser.isMac
      @type Boolean
    */
    browser.mac = browser.isMac = browser.os === Ember.OS.mac;

    /** @deprecated Since version 1.7. Use browser.os === Ember.OS.mac && browser.compare(browser.osVersion, '10.7') == 0
      @name Ember.browser.isLion
      @type Boolean
    */
    browser.lion = browser.isLion = !!(/mac os x 10_7/.test(userAgent) && !/like mac os x 10_7/.test(userAgent));

    /** @deprecated Since version 1.7. Use browser.device === Ember.DEVICE.iphone.
      @name Ember.browser.isiPhone
      @type Boolean
    */
    browser.iPhone = browser.isiPhone = browser.device === Ember.DEVICE.iphone;

    /** @deprecated Since version 1.7. Use browser.device === Ember.DEVICE.ipod.
      @name Ember.browser.isiPod
      @type Boolean
    */
    browser.iPod = browser.isiPod = browser.device === Ember.DEVICE.ipod;

    /** @deprecated Since version 1.7. Use browser.device === Ember.DEVICE.ipad.
      @name Ember.browser.isiPad
      @type Boolean
    */
    browser.iPad = browser.isiPad = browser.device === Ember.DEVICE.ipad;

    /** @deprecated Since version 1.7. Use browser.os === Ember.OS.ios.
      @name Ember.browser.isiOS
      @type Boolean
    */
    browser.iOS = browser.isiOS = browser.iPhone || browser.iPod || browser.iPad;

    /** @deprecated Since version 1.7. Use browser.os === Ember.OS.android or browser.name === Ember.BROWSER.android or browser.device === Ember.DEVICE.android.
      @name Ember.browser.isAndroid
      @type Boolean
    */
    browser.android = browser.isAndroid = browser.os === Ember.OS.android;

    /** @deprecated Since version 1.7. Use browser.version or browser.engineVersion.
      @name Ember.browser.opera
      @type String
    */
    browser.opera = browser.name === Ember.BROWSER.opera ? browser.version : '0';

    /** @deprecated Since version 1.7. Use browser.name === Ember.BROWSER.opera.
      @name Ember.browser.isOpera
      @type Boolean
    */
    browser.isOpera = browser.name === Ember.BROWSER.opera;

    /** @deprecated Since version 1.7. Use browser.version or browser.engineVersion.
      @name Ember.browser.msie
      @type String
    */
    browser.msie = browser.name === Ember.BROWSER.ie ? browser.version : '0';

    /** @deprecated Since version 1.7. Use browser.engine === Ember.ENGINE.trident.
      @name Ember.browser.isIE
      @type Boolean
    */
    browser.isIE = browser.engine === Ember.ENGINE.trident;

    /** @deprecated Since version 1.7. Use browser.compare(browser.version, '8') <= 0.
      @name Ember.browser.isIE8OrLower
      @type Boolean
    */
    browser.isIE8OrLower = browser.name === Ember.BROWSER.ie && browser.version <= 8;

    /** @deprecated Since version 1.7. Use browser.version or browser.engineVersion.
      @name Ember.browser.mozilla
      @type String
    */
    browser.mozilla = browser.engine === Ember.ENGINE.gecko ? browser.version : '0';

    /** @deprecated Since version 1.7. Use browser.name === Ember.BROWSER.firefox or browser.engine === Ember.ENGINE.gecko.
      @name Ember.browser.isMozilla
      @type Boolean
    */
    browser.isMozilla = browser.engine === Ember.ENGINE.gecko;

    /** @deprecated Since version 1.7. Use browser.engineVersion.
      @name Ember.browser.webkit
      @type String
    */
    browser.webkit = browser.engine === Ember.ENGINE.webkit ? browser.engineVersion : '0';

    /** @deprecated Since version 1.7. Use browser.engine === Ember.ENGINE.webkit.
      @name Ember.browser.isWebkit
      @type Boolean
    */
    browser.isWebkit = browser.engine === Ember.ENGINE.webkit;

    /** @deprecated Since version 1.7. Use browser.version.
      @name Ember.browser.chrome
      @type String
    */
    browser.chrome = browser.name === Ember.BROWSER.chrome ? browser.version : '0';

    /** @deprecated Since version 1.7. Use browser.name === Ember.BROWSER.chrome.
      @name Ember.browser.iEmberhrome
      @type Boolean
    */
    browser.iEmberhrome = browser.name === Ember.BROWSER.chrome;

    /** @deprecated Since version 1.7. Use browser.version.
      @name Ember.browser.mobileSafari
      @type String
    */
    browser.mobileSafari = browser.os === Ember.OS.ios ? browser.version : '0';

    /** @deprecated Since version 1.7. Use browser.name === Ember.BROWSER.safari && browser.os === Ember.OS.ios
      @name Ember.browser.isMobileSafari
      @type Boolean
    */
    browser.isMobileSafari = browser.name === Ember.BROWSER.safari && browser.isiOS;

    /** @deprecated Since version 1.7. Use browser.version.
      @name Ember.browser.iPadSafari
      @type String
    */
    browser.iPadSafari = browser.device === Ember.DEVICE.ipad && browser.name === Ember.BROWSER.safari ?
      browser.version : 0;

    /** @deprecated Since version 1.7. Use browser.device === Ember.DEVICE.ipad && browser.name === Ember.BROWSER.safari
      @name Ember.browser.isiPadSafari
      @type Boolean
    */
    browser.isiPadSafari = browser.device === Ember.DEVICE.ipad && browser.name === Ember.BROWSER.safari;

    /** @deprecated Since version 1.7. Use browser.version.
      @name Ember.browser.iPhoneSafari
      @type String
    */
    browser.iPhoneSafari = browser.device === Ember.DEVICE.iphone && browser.name === Ember.BROWSER.safari ?
      browser.version : 0;

    /** @deprecated Since version 1.7. Use browser.device === Ember.DEVICE.iphone && browser.name === Ember.BROWSER.safari
      @name Ember.browser.isiPhoneSafari
      @type Boolean
    */
    browser.isiPhoneSafari = browser.device === Ember.DEVICE.iphone && browser.name === Ember.BROWSER.safari;

    /** @deprecated Since version 1.7. Use browser.version.
      @name Ember.browser.iPodSafari
      @type String
    */
    browser.iPodSafari = browser.device === Ember.DEVICE.ipod && browser.name === Ember.BROWSER.safari ?
      browser.version : 0;

    /** @deprecated Since version 1.7. Use browser.device === Ember.DEVICE.ipod && browser.name === Ember.BROWSER.safari
      @name Ember.browser.isiPodSafari
      @type Boolean
    */
    browser.isiPodSafari = browser.device === Ember.DEVICE.ipod && browser.name === Ember.BROWSER.safari;

    /** @deprecated Since version 1.7. Use Ember.platform.standalone.
      @name Ember.browser.isiOSHomeEmberreen
      @type Boolean
    */
    browser.isiOSHomeEmberreen = browser.isMobileSafari && !(/apple.*mobile.*safari/.test(userAgent));

    /** @deprecated Since version 1.7. Use browser.version.
      @name Ember.browser.safari
      @type String
    */
    browser.safari = browser.name === Ember.BROWSER.safari && browser.os === Ember.OS.mac ?
      browser.version : 0;

    /** @deprecated Since version 1.7. Use browser.name === Ember.BROWSER.safari && browser.os === Ember.OS.mac.
      @name Ember.browser.isSafari
      @type Boolean
    */
    browser.isSafari = browser.name === Ember.BROWSER.safari && browser.os === Ember.OS.mac;

    /**
      @name Ember.browser.language
      @type String
    */
    browser.language = language.split('-', 1)[0];

    /**
      @name Ember.browser.countryCode
      @type String
    */
    browser.countryCode = language.split('-')[1] ? language.split('-')[1].toLowerCase() : undefined;

    /** @deprecated Since version 1.7. Use browser.name.  See Ember.BROWSER for possible values.
      Possible values:

        - 'ie'
        - 'mozilla'
        - 'chrome'
        - 'safari'
        - 'opera'
        - 'mobile-safari'
        - 'unknown'

      @name Ember.browser.current
      @type String
      @default 'unknown'
    */
    browser.current = browser.name;

    return browser;
  };

  Ember.browser = Ember.detectBrowser();
}
