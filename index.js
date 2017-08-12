const xml     = require('xml');
const request = require('superagent');

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

class CalDAV {
  constructor(baseUrl, user, pass) {
    this.baseUrl = baseUrl;
    this.auth = { user, pass };
  }

  mkcalendar(path, name) {
    let xml = new MkCalendarXml(name).toXml();
    return this.request('MKCALENDAR', path).send(xml);
  }

  search() {
  }

  request(method, path) {
    return request(method, `${this.baseUrl}${path}/`)
      .set('Content-Type', 'text/xml; charset="utf-8"')
      .auth(this.auth.user, this.auth.pass);
  }
}
