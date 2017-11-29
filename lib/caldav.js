const fs = require('fs');

const request = require('superagent');

const { MkCalendarXml, PropFindXml, CalendarQueryXml } = require('./xmldata');

/**
 * CalDAV low-level client interface.
 */
class CalDAV {
  /**
   * Creates CalDAV low-level client with base URL and optional authentication info.
   *
   * @param {string} baseUrl - Base URL of CalDAV server.
   * @param {Object} [options] - Options to HTTP(S) connection.
   * @param {string} [options.user] - Username of HTTP authentication.
   * @param {string} [options.pass] - Password of HTTP authentication.
   * @param {string} [options.cacert] - CA certifcate path.
   */
  constructor(baseUrl, options) {
    Object.assign(this, {
      baseUrl,
      user: options.user,
      pass: options.pass
    });
    if (options.cacert) {
      this.ca = fs.readFileSync(options.cacert);
    }
  }

  /**
   * Creates Calendar resource with name and optional description.
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
    return this._request('MKCOL', path)
      .set('Content-Type', 'text/xml; charset="utf-8"')
      .send(xml);
  }

  /**
   * Deletes Calendar resource specified by path.
   *
   * @async
   * @param {string} path - Calendar path component relative to `baseUrl`.
   * @return {Request} Superagent's `Request` object.
   */
  delete(path) {
    return this._request('DELETE', path);
  }

  /**
   * Creates Calendar object resource.
   *
   * @async
   * @param {string} path - Calendar path component relative to `baseUrl`.
   * @param {string} caldata - VCALENDAR data.
   * @param {boolean} [overwrite] - Whether to overwrite existent resource.
   * @return {Request} Superagent's `Request` object.
   */
  create(path, caldata, overwrite) {
    let req = this._request('PUT', path)
        .set('Content-Type', 'text/calendar; charset="utf-8"');
    if (!overwrite) {
      req.set('If-None-Match', '*');
    }
    return req.send(caldata);
  }

  /**
   * Updates Calendar object resource matched with the Etag.
   *
   * @async
   * @param {string} path - Calendar path component relative to `baseUrl`.
   * @param {string} caldata - VCALENDAR data.
   * @param {boolean} etag - Etag string.
   * @return {Request} Superagent's `Request` object.
   */
  update(path, caldata, etag) {
    return this._request('PUT', path)
      .set('Content-Type', 'text/calendar; charset="utf-8"')
      .set('If-Match', etag)
      .send(caldata);
  }

  /**
   * Finds Calendar property.
   *
   * @async
   * @param {string} path - Calendar path component  relative to `baseUrl`.
   * @param {string} prop - Property element to be found.
   * @return {Request} Superagent's `Request` object.
   */
  propfind(path, prop) {
    let xml = new PropFindXml(prop).toXml();
    return this._request('PROPFIND', path)
      .set('Content-Type', 'text/xml; charset="utf-8"')
      .send(xml);
  }

  /**
   * Reports Calendar events with filtering.
   *
   * @param {string} path - Calendar path component  relative to `baseUrl`.
   * @param {Object} filter - Filter object.
   * @param {string} filter.start - Start date in format 'yyyyMMddTHHmmssZ'.
   * @param {string} filter.end - End date in format 'yyyyMMddTHHmmssZ'.
   * @return {Request} Superagent's `Request` object.
   */
  report(path, filter) {
    let xml = new CalendarQueryXml(filter).toXml();
    return this._request('REPORT', path)
      .set('Content-Type', 'text/xml; charset="utf-8"')
      .set('Depth', '1')
      .send(xml);
  }

  _request(method, path) {
    let req = request(method, `${this.baseUrl}${path}`);
    if (this.user && this.pass) {
      req.auth(this.user, this.pass);
    }
    if (this.ca) {
      req.ca(this.ca);
    }
    return req;
  }
}

module.exports = CalDAV;
