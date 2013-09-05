"use strict";
/*global alert: true, console: true, warn: true, ODSA */

(function ($) {
  /**
   * Stores the module name so we don't have to look it up every time
   * Must be set here, if placed in document.ready() AV initialize()
   * methods will run before it and moduleName will not be initialized
   *
   * Unlike referencing ODSA.SETTINGS.MODULE_NAME, code referencing moduleName
   * will not be affected if ODSA.SETTINGS.MODULE_NAME is changed (including at runtime)
   */
  var moduleName = '';

  /**
   * Local settings object that makes it easier to access ODSA.SETTINGS and allow better minification
   */
  var settings;

  /**
   * A unique instance identifier, used to group interaction events from a single instance
   */
  var uiid = +new Date();

  // Define the console object if it doesn't exist to support IE without developer tools
  if (!(window.console && console.log)) {
    console = {
      log: function () {},
      debug: function () {},
      info: function () {},
      warn: function () {},
      error: function () {}
    };
  }


  //*****************************************************************************
  //***********                   Utility Functions                   ***********
  //*****************************************************************************
  /**
   * Extracts, decodes and returns the given parameter from the URL
   *   - Based on http://stackoverflow.com/questions/1403888/get-url-parameter-with-jquery
   */
  function getURLParam(name) {
    var param = new RegExp('[?|&]' + name + '=' + '(.+?)(&|$)').exec(location.href);
    return (param) ? decodeURIComponent(param[1]) : "";
  }

  // Load necessary settings on embedded pages from the URL
  if (typeof ODSA === "undefined") {
    var odsaSettings = {};
    odsaSettings.BOOK_NAME = getURLParam('bookName');
    odsaSettings.SERVER_URL = getURLParam('serverURL');
    odsaSettings.MODULE_ORIGIN = getURLParam('moduleOrigin');
    odsaSettings.MODULE_NAME = getURLParam('module');

    // If MODULE_ORIGIN is not specified, assume they are on the same domain
    if (odsaSettings.MODULE_ORIGIN === '') {
      odsaSettings.MODULE_ORIGIN = location.protocol + '//' + location.host;
    }

    window.ODSA = {};
    window.ODSA.SETTINGS = odsaSettings;
  }

  settings = ODSA.SETTINGS;

  // Provide a warning if HTTPS is not used for communication with the backend
  if (settings.SERVER_URL !== '' && !settings.SERVER_URL.match(/^https:/)) {
    console.warn('Backend communication should use HTTPS');
  }

  /**
   * Constant storing the name of the AV on which ODSA.js is loaded
   * If ODSA.js is loaded on a module page, this value will remain ""
   * Otherwise, if loaded on an AV page, this value will be initialized in opendsaAV.js
   */
  settings.AV_NAME = '';

  /**
   * Returns true if localStorage.DEBUG_MODE is set to true
   */
  function inDebugMode() {
    return localStorage.DEBUG_MODE === 'true';
  }

  /**
   * Returns correct type information.  Bypasses broken behavior of 'typeof'.
   * `typeof` should be avoided at all costs (unless checking if a var is defined).
   *
   * Based on 'is' from: http://bonsaiden.github.com/JavaScript-Garden/
   * See https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/ for more information
   */
  function getType(obj) {
    if (typeof obj !== "undefined") {
      // Parse the type from the Object toString output
      return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    }
    return "undefined";
  }

  /**
   * Returns a SHA1 hash of the book URL as a unique identifier
   */
  function getBookID() {
    var loc = location.href;
    // Parses the base URL for the book
    // TODO: Needs to eliminate the protocol so that the book is considered the same regardless of using HTTP or HTTPS
    // Switch '0' for loc.indexOf(':') + 3
    loc = loc.substring(0, loc.lastIndexOf('/') + 1);
    return Sha1.hash(loc);
  }

  function getUsername() {
    if (localStorage.session) {
      var session = JSON.parse(localStorage.session);
      return session.username;
    }
    return "guest";
  }

  function getSessionKey() {
    if (localStorage.session) {
      var session = JSON.parse(localStorage.session);
      return session.key;
    }
    return "";
  }

  /**
   * Returns whether or not a user is currently logged in
   */
  function userLoggedIn() {
    return localStorage.session;
  }

  /**
   * Returns true if system is configured to use a metrics collection server
   */
  function serverEnabled() {
    return (settings.SERVER_URL !== "");
  }

  /**
   * Rounds the given number to a max of 2 decimal places
   */
  function roundPercent(number) {
    return Math.round(number * 100) / 100;
  }

  /**
   * Returns true if the given element is a JSAV managed control
   * Relies on JSAV controls being in a container with a class that matches '.*jsav\w*control.*'
   * include "jsavexercisecontrols" and "jsavcontrols"
   */
  function isJSAVControl(item) {
  /*jslint regexp: true */
    return (item && item.parentElement && item.parentElement.className.match(/.*jsav\w*control.*/) !== null);
  }

  /**
   * Returns the given data as a JSON object
   * If given a string, converts it to JSON
   * If given a JSON object, does nothing
   */
  function getJSON(data) {
    if (inDebugMode()) {
      console.group('getJSON()');
      console.debug(JSON.stringify(data));
    }

    if (typeof data === 'undefined') {
      if (inDebugMode()) {
        console.warn("getJSON() error: data is undefined");
        console.groupEnd();
      }
      return {};
    }

    if (getType(data) === "string") {
      data = jQuery.parseJSON(data);
    }

    if (inDebugMode()) {
      console.groupEnd();
    }

    return data;
  }

  //*****************************************************************************
  //***********                   Logging Functions                   ***********
  //*****************************************************************************

  /**
   * Checks the given JSON object to ensure it has the correct fields
   *     data - a JSON object representing an event
   */
  function isValidEvent(data) {
    // If av and uiid are not provided, give them default values
    if (typeof data.av === "undefined") {
      data.av = '';
    }
    if (typeof data.uiid === "undefined") {
      data.uiid = uiid;
    }

    var missingFields = [];

    if (typeof data.type === "undefined") {
      missingFields.push('type');
    }
    if (typeof data.desc === "undefined") {
      missingFields.push('desc');
    }

    if (missingFields.length === 1) {
      console.warn("Invalid event, '" + missingFields[0] + "' is undefined");
      console.log(data);
      return false;
    } else if (missingFields.length > 1) {
      console.warn("Invalid event, '" + missingFields.join(', ') + "' are undefined");
      console.log(data);
      return false;
    }

    return true;
  }

  /**
   * Appends the given data to the event log
   * 'module_name' and 'tstamp' will be appended automatically by this function
   *
   *   data - A JSON string or object containing event data, must contain the following fields: 'av', 'type', 'desc', 'uiid'
   */
  function logEvent(data) {
    if (inDebugMode()) {
      console.group('logEvent(' + data + ')');
      console.debug(data);
    }

    if (serverEnabled()) {
      data = getJSON(data);

      // List of attributes the event data is required to have
      var reqAttrib = ['av', 'desc', 'module_name', 'steps_fixed', 'tstamp', 'type', 'uiid'];

      // Loop through all attributes and remove any unnecessary ones
      // (if the server will ignore them, no reason for us to store and send them)
      for (var prop in data) {
        if (data.hasOwnProperty(prop) && reqAttrib.indexOf(prop) === -1) {
          // Data has a property that the server will ignore, discard it
          if (inDebugMode()) {
            console.warn('Discarding property: ' + prop);
          }
          delete data.prop;
        }
      }

      // Ensure given JSON data is a valid event
      if (!isValidEvent(data)) {
        console.warn('logEvent() error: Invalid event');
        console.log(data);

        if (inDebugMode()) {
          console.groupEnd();
        }
        return;
      }

      // Don't log events without either an AV name or a module name
      // Getting duplicates of some events where one is missing both
      // Currently all legitimate events should have one or the other
      if (data.av === "" && moduleName === "") {
        if (inDebugMode()) {
          console.warn('Exercise name and moduleName cannot both be ""');
          console.groupEnd();
        }

        return;
      }

      data.module = moduleName;
      // Store username and book ID with each event because all events will be grouped together, allowing any user to submit everyone's events to ensure we collect as much data as possible
      data.user = getUsername();  // TODO: Work with Eric to make sure the server recognizes the "guest" user
      data.book = getBookID();

      // Add a timestamp to the data
      if (data.tstamp) {
        // Convert existing JSAV timestamp from ISO format to milliseconds
        data.tstamp = new Date(data.tstamp).getTime();
      } else {
        data.tstamp = (new Date()).getTime();
      }

      // Convert the description field into a string so the server can handle it properly
      data.desc = JSON.stringify(data.desc); // TODO: Find out if the server can handle it as a JSON object rather than requiring a string

      // Store the event in localStorage
      // The random number is used to reduce the likelihood of collisions where multiple events get logged at the same time
      var rand = Math.floor(Math.random() * 101);
      localStorage[['event', data.tstamp, rand].join('-')] = JSON.stringify(data);
    }

    if (inDebugMode()) {
      console.groupEnd();
    }
  }

  /**
   * Logs a custom user interaction
   *     type - String identifying the type of action
   *     desc - Human-readable string describing the action
   *     exerName - Name of the exercise with which the action is associated
   *     eventUiid - A value that identifies a unique exercise instance, used to tie exercise events to a specific instance
   */
  function logUserAction(type, desc, exerName, eventUiid) {
    exerName = (exerName) ? exerName : settings.AV_NAME;
    eventUiid = (eventUiid) ? eventUiid : uiid;

    if (inDebugMode()) {
      console.group('logUserAction(' + type + ', ' + desc + ', ' + exerName + ', ' + eventUiid + ')');
    }

    if (serverEnabled()) {
      var eventData = {};
      eventData.type = type;
      eventData.desc = {'msg': desc};
      eventData.av = exerName;
      eventData.uiid = eventUiid;
      logEvent(eventData);
    }

    if (inDebugMode()) {
      console.groupEnd();
    }
  }

  /**
   * Sends the event data logged in localStorage to the server
   */
  function sendEventData() {
    if (inDebugMode()) {
      console.group('sendEventData()');
    }

    if (serverEnabled()) {
      var sessionKey = getSessionKey(),
          tstamp = (new Date()).getTime(),
          keysToPurge = [],
          eventList = [];

      // Loop through localStorage looking for any events that occurred before tstamp
      for (var key in localStorage) {
        // indexOf is used rather than startsWith because startsWith isn't supported in Chrome
        if (key.indexOf('event-') === 0 && parseInt(key.split('-')[1], 10) < tstamp) {
          // Keep track of which objects to remove if the AJAX message is successful
          keysToPurge.push(key);
          eventList.push(getJSON(localStorage[key]));
        }
      }

      // TODO: What about if the AJAX communication is successful, but the user closes the browser before the response returns and the values are removed - they will still be in local storage and they will be sent again

      // Return if there is no data to send
      if (eventList.length === 0) {
        if (inDebugMode()) {
          console.debug('No event data to send');
          console.groupEnd();
        }
        return true;
      }

      if (inDebugMode()) {
        console.debug('Sending eventList:');
        console.debug(JSON.stringify(eventList));
        console.debug('Sending keysToPurge:');
        console.debug(JSON.stringify(keysToPurge));
      }

      // Send the data to the server
      jQuery.ajax({
        url:   settings.SERVER_URL + "/api/v1/user/exercise/avbutton/",
        type:  "POST",
        data: JSON.stringify(eventList),  // TODO: Work with Eric to get the server to accept the new format
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        xhrFields: {withCredentials: true},
        success: function (data) {
          data = getJSON(data);

          if (!data.success) {
            console.group('Event data rejected by server');
            console.debug(JSON.stringify(eventList));
            console.groupEnd();
          }

          // Client successfully contacted the server, data was either successfully stored or rejected for being invalid, either way remove the events that were sent from localStorage
          for (var i in keysToPurge) {
            if (keysToPurge.hasOwnProperty(i)) {
              localStorage.removeItem(keysToPurge[i]);
            }
          }
        },
        error: function (data) {
          data = getJSON(data);

          if (data.status === 400) {
            // If status === 400 (Bad request) it means some of the data was rejected
            // by the server and that we should discard that data to prevent future failures
            console.group('Event data rejected by server');
            console.debug(JSON.stringify(eventList));
            console.groupEnd();

            for (var i in keysToPurge) {
              if (keysToPurge.hasOwnProperty(i)) {
                localStorage.removeItem(keysToPurge[i]);
              }
            }
          } else {
            if (data.status === 401) {
              // Trigger event which will cause the expired session to be handled appropriately
              $('body').trigger('odsa-session-expired', [sessionKey]);
            } else {
              console.group("Error sending event data");
              console.debug(data);
              console.groupEnd();
            }
          }
        }
      });
    }

    if (inDebugMode()) {
      console.groupEnd();
    }
  }

  /**
   * Default function to handle logging button clicks
   */
  function buttonLogger() {
    /*jslint validthis: true */
    if (serverEnabled()) {
      var type = "",
          desc = "";

      if (this.id !== "") {
        type = this.type + "-" + this.id;
      } else {
        type = this.type;
        console.warn(this.value + " button does not have an ID");
      }

      // TODO: Find a better way to get the description for a button
      if (this.hasAttribute('data-desc')) {
        desc = this.getAttribute('data-desc');
      } else if (this.value !== "") {
        desc = this.value;
      } else if (this.id !== "") {
        desc = this.id;
      } else if (this.name !== "") {
        desc = this.name;
      }

      logUserAction(type, desc);
    }
  }

  /**
   * Default function to handle logging hyperlink clicks
   */
  function linkLogger() {
  /*jslint validthis: true */
    if (serverEnabled()) {

      var type = "",
          desc = {href: this.href, text: $(this).html};

      if (settings.AV_NAME === "" && this.form) {
        settings.AV_NAME = this.form.id;
      }

      if (this.id !== "") {
        type = "hyperlink-" + this.id;
      } else {
        type = "hyperlink";
        console.warn("Link (" + this.href + ") does not have an ID");
      }

      // TODO: Find a better way to log links
      logUserAction(type, desc);
    }
  }


  //*****************************************************************************
  //***********            Runs When Page Finishes Loading            ***********
  //*****************************************************************************

  $(document).ready(function () {
    // Must be initialized here because ODSA.SETTINGS.MODULE_NAME is contained within the HTML of the page
    moduleName = settings.MODULE_NAME;

    //Make sure localStorage is enabled
    var localStorageEnabled = function () {
      var enabled, uid = +new Date();
      try {
        localStorage[uid] = uid;
        enabled = (localStorage[uid] === uid);
        localStorage.removeItem(uid);
        return enabled;
      }
      catch (e) {
        return false;
      }
    };

    if (!localStorageEnabled) {
      if (jQuery) {
        warn("You must enable DOM storage in your browser.", false);
      }
      return;
    }

    // Add buttonLogger to all buttons on the page
    $(':button').each(function (index, item) {
      // Don't attach handler to JSAV managed controls in order to prevent double logging
      if (!isJSAVControl(item)) {
        $(item).click(buttonLogger);
      }
    });

    // Add linkLogger to all links on the page
    $('a').each(function (index, item) {
      // Don't attach handler to JSAV managed controls in order to prevent double logging
      if (!isJSAVControl(item) && $(item).attr("id") !== "logon" && $(item).attr("class") !== "close") {
        $(item).click(linkLogger);
      }
    });
  });

  //*****************************************************************************
  //***********            Creates global ODSA.UTILS object           ***********
  //*****************************************************************************

  // Add publically available functions to a globally accessible ODSA.UTILS object
  var odsaUtils = {};

  odsaUtils.serverEnabled = serverEnabled;
  odsaUtils.inDebugMode = inDebugMode;
  odsaUtils.getBookID = getBookID;
  odsaUtils.getUsername = getUsername;
  odsaUtils.getSessionKey = getSessionKey;
  odsaUtils.userLoggedIn = userLoggedIn;
  odsaUtils.getJSON = getJSON;
  odsaUtils.logUserAction = logUserAction;
  odsaUtils.logEvent = logEvent;
  odsaUtils.sendEventData = sendEventData;
  odsaUtils.roundPercent = roundPercent;
  odsaUtils.getType = getType;
  window.ODSA.UTILS = odsaUtils;


  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
  /*  SHA-1 implementation in JavaScript | (c) Chris Veness 2002-2010 | www.movable-type.co.uk      */
  /*   - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                             */
  /*         http://csrc.nist.gov/groups/ST/toolkit/examples.html                                   */
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

  var Sha1 = {};  // Sha1 namespace

  /**
   * Generates SHA-1 hash of string
   *
   * @param {String} msg                String to be hashed
   * @param {Boolean} [utf8encode=true] Encode msg as UTF-8 before generating hash
   * @returns {String}                  Hash of msg as hex character string
   */
  Sha1.hash = function (msg, utf8encode) {
    /*jslint bitwise: true */
    utf8encode = (typeof utf8encode === 'undefined') ? true : utf8encode;

    // convert string to UTF-8, as SHA only deals with byte-streams
    if (utf8encode) { msg = Utf8.encode(msg); }

    // constants [section 4.2.1]
    var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];

    // PREPROCESSING

    msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [section 5.1.1]

    // convert string msg into 512-bit/16-integer blocks arrays of ints [section 5.2.1]
    var l = msg.length / 4 + 2;  // length (in 32-bit integers) of msg + '1' + appended length
    var N = Math.ceil(l / 16);   // number of 16-integer-blocks required to hold 'l' ints
    var M = new Array(N);

    for (var i = 0; i < N; i++) {
      M[i] = new Array(16);
      for (var j = 0; j < 16; j++) {  // encode 4 chars per integer, big-endian encoding
        M[i][j] = (msg.charCodeAt(i * 64 + j * 4) << 24) | (msg.charCodeAt(i * 64 + j * 4 + 1) << 16) |
          (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) | (msg.charCodeAt(i * 64 + j * 4 + 3));
      } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
    }
    // add length (in bits) into final pair of 32-bit integers (big-endian) [section 5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    M[N - 1][14] = ((msg.length - 1) * 8) / Math.pow(2, 32);
    M[N - 1][14] = Math.floor(M[N - 1][14]);
    M[N - 1][15] = ((msg.length - 1) * 8) & 0xffffffff;

    // set initial hash value [section 5.3.1]
    var H0 = 0x67452301;
    var H1 = 0xefcdab89;
    var H2 = 0x98badcfe;
    var H3 = 0x10325476;
    var H4 = 0xc3d2e1f0;

    // HASH COMPUTATION [section 6.1.2]

    var W = new Array(80);
    var a,
        b,
        c,
        d,
        e;

    for (i = 0; i < N; i++) {
      // 1 - prepare message schedule 'W'
      for (var t = 0; t < 16; t++) { W[t] = M[i][t]; }
      for (t = 16; t < 80; t++) { W[t] = Sha1.ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1); }

      // 2 - initialise five working variables a, b, c, d, e with previous hash value
      a = H0;
      b = H1;
      c = H2;
      d = H3;
      e = H4;

      // 3 - main loop
      for (t = 0; t < 80; t++) {
        var s = Math.floor(t / 20); // seq for blocks of 'f' functions and 'K' constants
        var T = (Sha1.ROTL(a, 5) + Sha1.f(s, b, c, d) + e + K[s] + W[t]) & 0xffffffff;
        e = d;
        d = c;
        c = Sha1.ROTL(b, 30);
        b = a;
        a = T;
      }

      // 4 - compute the new intermediate hash value
      H0 = (H0 + a) & 0xffffffff;  // note 'addition modulo 2^32'
      H1 = (H1 + b) & 0xffffffff;
      H2 = (H2 + c) & 0xffffffff;
      H3 = (H3 + d) & 0xffffffff;
      H4 = (H4 + e) & 0xffffffff;
    }

    return Sha1.toHexStr(H0) + Sha1.toHexStr(H1) +
      Sha1.toHexStr(H2) + Sha1.toHexStr(H3) + Sha1.toHexStr(H4);
  };

  //
  // function 'f' [section 4.1.1]
  //
  Sha1.f = function (s, x, y, z)  {
    /*jslint bitwise: true */
    switch (s) {
    case 0:
      return (x & y) ^ (~x & z);           // Ch()
    case 1:
      return x ^ y ^ z;                    // Parity()
    case 2:
      return (x & y) ^ (x & z) ^ (y & z);  // Maj()
    case 3:
      return x ^ y ^ z;                    // Parity()
    }
  };

  //
  // rotate left (circular left shift) value x by n positions [section 3.2.5]
  //
  Sha1.ROTL = function (x, n) {
    /*jslint bitwise: true */
    return (x << n) | (x >>> (32 - n));
  };

  //
  // hexadecimal representation of a number
  //   (note toString(16) is implementation-dependant, and
  //   in IE returns signed numbers when used on full words)
  //
  Sha1.toHexStr = function (n) {
    /*jslint bitwise: true */
    var s = "", v;
    for (var i = 7; i >= 0; i--) { v = (n >>> (i * 4)) & 0xf; s += v.toString(16); }
    return s;
  };


  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
  /*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
  /*              single-byte character encoding (c) Chris Veness 2002-2010                         */
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

  var Utf8 = {};  // Utf8 namespace

  /**
   * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
   * (BMP / basic multilingual plane only)
   *
   * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
   *
   * @param {String} strUni Unicode string to be encoded as UTF-8
   * @returns {String} encoded string
   */
  Utf8.encode = function (strUni) {
    /*jslint bitwise: true */
    // use regular expressions & String.replace callback function for better efficiency
    // than procedural approaches
    var strUtf = strUni.replace(
        /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
        function (c) {
          var cc = c.charCodeAt(0);
          return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
        }
      );
    strUtf = strUtf.replace(
        /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
        function (c) {
          var cc = c.charCodeAt(0);
          return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
        }
      );
    return strUtf;
  };

  /**
   * Decode utf-8 encoded string back into multi-byte Unicode characters
   *
   * @param {String} strUtf UTF-8 string to be decoded back to Unicode
   * @returns {String} decoded string
   */
  Utf8.decode = function (strUtf) {
    /*jslint bitwise: true */
    // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
    var strUni = strUtf.replace(
        /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
        function (c) {  // (note parentheses for precence)
          var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
          return String.fromCharCode(cc);
        }
      );
    strUni = strUni.replace(
        /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
        function (c) {  // (note parentheses for precence)
          var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
          return String.fromCharCode(cc);
        }
      );
    return strUni;
  };

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
}(jQuery));
