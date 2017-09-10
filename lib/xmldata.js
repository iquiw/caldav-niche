const xmlbuilder = require('xmlbuilder');

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
    let prop = xmlbuilder
        .create('C:mkcalendar', { version: '1.0', encoding: 'utf-8' })
        .att('xmlns', 'DAV:')
        .att('xmlns:C', 'urn:ietf:params:xml:ns:caldav')
        .ele('set').ele('prop');

    prop.ele('resourcetype').ele('collection').up().ele('C:calendar');
    prop.ele('displayname', this.name);

    if (this.description) {
      prop.ele('C:calendar-description', this.description);
    }
    return prop.end();
  }
}

module.exports = {
  MkCalendarXml
};
