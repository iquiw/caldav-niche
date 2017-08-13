const request = require('superagent');

const { MkCalendarXml } = require('./xmldata');

class CalDAV {
  constructor(baseUrl, user, pass) {
    this.baseUrl = baseUrl;
    this.auth = { user, pass };
  }

  mkcalendar(path, name, options) {
    let xml = new MkCalendarXml(name, options).toXml();
    return this.request('MKCALENDAR', path).send(xml);
  }

  request(method, path) {
    return request(method, `${this.baseUrl}${path}/`)
      .set('Content-Type', 'text/xml; charset="utf-8"')
      .auth(this.auth.user, this.auth.pass);
  }
}

module.exports = CalDAV;
