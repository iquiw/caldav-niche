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
    let propfind = xmlbuilder
        .create('propfind', { version: '1.0', encoding: 'utf-8' })
        .att('xmlns', 'DAV:')
        .att('xmlns:C', 'urn:ietf:params:xml:ns:caldav');

    if (this.prop === 'allprop') {
      propfind.ele(this.prop);
    } else {
      propfind.ele('prop').ele(this.prop);
    }
    return propfind.end();
  }
}

/**
 * Class that represents calendar-query XML.
 */
class CalendarQueryXml {
  /**
   * Creates CalendarQueryXml with filter object.
   *
   * @param {Object} filter - Filter object.
   * @param {string} filter.start - Start date in format 'yyyyMMddTHHmmssZ'.
   * @param {string} filter.end - End date in format 'yyyyMMddTHHmmssZ'.
   */
  constructor(filter) {
    this.filter = filter;
  }

  /**
   * Converts to XML string.
   *
   * @return {string} calendar-query XML data.
   */
  toXml() {
    let query = xmlbuilder
        .create('C:calendar-query', { version: '1.0', encoding: 'utf-8' })
        .att('xmlns', 'DAV:')
        .att('xmlns:C', 'urn:ietf:params:xml:ns:caldav')
        .ele('prop')
        .ele('C:calendar-data')
        .ele('C:limit-recurrence-set').att('start', this.filter.start).att('end', this.filter.end)
        .up().up().up()
        .ele('C:filter')
        .ele('C:comp-filter').att('name', 'VCALENDAR')
        .ele('C:comp-filter').att('name', 'VEVENT')
        .ele('C:time-range').att('start', this.filter.start).att('end', this.filter.end);
    return query.end();
  }
}

module.exports = {
  MkCalendarXml,
  PropFindXml,
  CalendarQueryXml
};
