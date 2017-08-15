const request = require('superagent');

const { MkCalendarXml } = require('./xmldata');

/**
 * CalDAV client interface.
 */
class CalDAV {
  /**
   * Create CalDAV client with base URL and optional authentication info.
   *
   * @param {string} baseUrl - Base URL of CalDAV server.
   * @param {string} [user] - Username of HTTP authentication.
   * @param {string} [pass] - Password of HTTP authentication.
   */
  constructor(baseUrl, user, pass) {
    this.baseUrl = baseUrl;
    if (user && pass) {
      this.auth = { user, pass };
    }
  }

  /**
   * Create Calendar resource with name and optional description.
   *
   * @async
   * @param {string} path - Calendar path component relative to `baseUrl`.
   * @param {string} name - Calendar name.
   * @param {Object} [options] - Options for Calendar creation.
   * @param {string} [options.description] - Calendar description.
   * @return {Request} Superagent's `Request` object.
   */
  mkcalendar(path, name, options) {
    let xml = new MkCalendarXml(name, options).toXml();
    return this._request('MKCALENDAR', path)
      .set('Content-Type', 'text/xml; charset="utf-8"')
      .send(xml);
  }

  /**
   * Delete Calendar resource specified by path.
   *
   * @async
   * @param {string} path - Calendar path component relative to `baseUrl`.
   * @return {Request} Superagent's `Request` object.
   */
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
