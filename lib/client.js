const Promise = require('bluebird');
const ICAL    = require('ical.js');
const sax     = require('sax');

const CalDAV = require('./caldav');

/**
 * Parser class to parse XML that contains <C:calendar-data> element.
 */
class CalendarDataXmlParser {
  /**
   * Initializes parser.
   */
  constructor() {
    this.parser = sax.parser(true, { xmlns: true });

    this.parser.onopentag = node => {
      if (node.local === 'calendar-data' && node.uri === 'urn:ietf:params:xml:ns:caldav') {
        this.calendarDataTag = node.name;
      }
    };
    this.parser.onclosetag = name => {
      if (this.calendarDataTag && this.calendarDataTag == name) {
        this.calendarDataTag = null;
      }
    };
    this.parser.ontext = text => {
      if (this.calendarDataTag) {
        this.calendarData.push(text);
      }
    };
  }

  /**
   * Parses XML string to extract VCALENDAR string.
   *
   * @async
   * @param {string} - XML data that contains <C:calendar-data> element.
   * @return {Promise} - Promise to be resolved to VCALENDAR string.
   */
  parse(xml) {
    this.calendarData = [];
    this.calendarDataTag = null;

    return new Promise((resolve, reject) => {
      this.parser.onend = () => {
        resolve(this.calendarData);
      };
      this.parser.write(xml).end();
    });
  }
}

/**
 * CalDAV convenient client interface.
 */
class Client {
  /**
   * Creates CalDAV convenient client with base URL and optional authentication info.
   *
   * @param {string} baseUrl - Base URL of CalDAV server.
   * @param {Object} [options] - Options to HTTP(S) connection.
   * @param {string} [options.user] - Username of HTTP authentication.
   * @param {string} [options.pass] - Password of HTTP authentication.
   * @param {string} [options.cacert] - CA certifcate path.
   */
  constructor(baseUrl, options) {
    this.caldav = new CalDAV(baseUrl, options);
  }

  /**
   * Imports ICS data.
   *
   * @async
   * @param {string} path - Calendar path component  relative to `baseUrl`.
   * @param {string} icsdata - ICS data to be imported.
   * @return {Request[]} Array of superagent's `Request` objects.
   */
  icsImport(path, icsdata) {
    let jcal = ICAL.parse(icsdata);
    let vcal = new ICAL.Component(jcal);
    let comps = vcal.getAllSubcomponents('vevent');

    return Promise.mapSeries(comps, (comp) => {
      vcal.removeAllSubcomponents('vevent');
      vcal.addSubcomponent(comp);
      let uid = comp.getFirstProperty('uid').getFirstValue();
      return this.create(`${path}/${uid}`, vcal.toString(), true);
    });
  }

  /**
   * Reports Calendar events with filtering.
   *
   * @param {string} path - Calendar path component  relative to `baseUrl`.
   * @param {Object} filter - Filter object.
   * @param {string} filter.start - Start date in format 'yyyyMMddTHHmmssZ'.
   * @param {string} filter.end - End date in format 'yyyyMMddTHHmmssZ'.
   * @return {Object} Calendar events as jCAL Component.
   */
  report(path, filter) {
    return this.caldav.report(path, filter)
      .then(rsp => {
        let xmlParser = new CalendarDataXmlParser();
        return xmlParser.parse(rsp.res.text);
      }).then(icss => {
        let vcals = [];
        for (let ics of icss) {
          let jcal = ICAL.parse(ics);
          vcals.push(new ICAL.Component(jcal));
        }
        return vcals;
      });
  }
}

Client.CalendarDataXmlParser = CalendarDataXmlParser;

module.exports = Client;
