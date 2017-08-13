const xml = require('xml');

class MkCalendarXml {
  constructor(name, options) {
    Object.assign(this, {
      name
    }, options);
  }

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
