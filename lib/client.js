const request = require('superagent');

const { MkCalendarXml } = require('./xmldata');

class CalDAV {
  constructor(baseUrl, user, pass) {
    this.baseUrl = baseUrl;
    if (user && pass) {
      this.auth = { user, pass };
    }
  }

  mkcalendar(path, name, options) {
    let xml = new MkCalendarXml(name, options).toXml();
    return this._request('MKCALENDAR', path)
      .set('Content-Type', 'text/xml; charset="utf-8"')
      .send(xml);
  }

  delete(path) {
    return this._request('DELETE', path);
  }

  _request(method, path) {
    let req = request(method, `${this.baseUrl}${path}`);
    if (this.auth) {
      req.auth(this.auth.user, this.auth.pass);
    }
    return req;
  }
}

module.exports = CalDAV;
