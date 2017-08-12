const xml = require('xml');

class MkCalendarXml {
  constructor(name) {
    this.name = name;
  }
  toXml() {
    return xml({
      'C:mkcalendar': [{
        _attr: {
          'xmlns': 'DAV:',
          'xmlns:C': 'urn:ietf:params:xml:ns:caldav'
        }
      }, {
        set: [{
          resourcetype: [{ collection: null }, { 'C:calendar': null }]
        }, {
          prop: [{
            displayname: [this.name]
          }]
        }]
      }]
    }, { declaration: { encoding: 'utf-8' }});
  }
}

module.exports = {
  MkCalendarXml
};
