const xml = require('xml');

/**
 * Class that represents mkcalendar XML.
 */
class MkCalendarXml {
  /**
   * Create MkCalendarXml with display name and options.
   *
   * @param {string} name - Display name of the calendar.
   * @param {Object} [options] - Optional data of mkcalendar.
   * @param {string} [options.description] - Description of the calendar.
   */
  constructor(name, options) {
    Object.assign(this, {
      name
    }, options);
  }

  /**
   * Convert to XML string.
   *
   * @return {string} mkcalendar XML data.
   */
  toXml() {
    let _attr = {
      'xmlns': 'DAV:',
      'xmlns:C': 'urn:ietf:params:xml:ns:caldav'
    };
    let set = [{
      prop: [{
        resourcetype: [{ collection: null }, { 'C:calendar': null }]
      }, {
        displayname: [this.name]
      }]
    }];
    if (this.description) {
      set[0].prop.push({ 'C:calendar-description': this.description });
    }
    return xml({ 'C:mkcalendar': [ { _attr: _attr }, { set: set } ] },
               { declaration: { encoding: 'utf-8'} });
  }
}

module.exports = {
  MkCalendarXml
};
