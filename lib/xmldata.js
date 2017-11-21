const xmlbuilder = require('xmlbuilder');

/**
 * Class that represents mkcalendar XML.
 */
class MkCalendarXml {
  /**
   * Creates MkCalendarXml with display name and options.
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
   * Converts to XML string.
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

/**
 * Class that represents propfind XML.
 */
class PropFindXml {
  /**
   * Creates PropFindXml with prop element.
   *
   * @param {string} prop - Property to be found.
   */
  constructor(prop) {
    this.prop = prop;
  }

  /**
   * Converts to XML string.
   *
   * @return {string} propfind XML data.
   */
  toXml() {
    return xmlbuilder
      .create('propfind', { version: '1.0', encoding: 'utf-8' })
      .att('xmlns', 'DAV:')
      .att('xmlns:C', 'urn:ietf:params:xml:ns:caldav')
      .ele(this.prop)
      .end();
  }
}

module.exports = {
  MkCalendarXml,
  PropFindXml
};
