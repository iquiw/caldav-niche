import test from 'ava';

import { MkCalendarXml, PropFindXml } from '../lib/xmldata.js';

test('mkcalendar XML without options', t => {
  let expected = '<?xml version="1.0" encoding="utf-8"?>'
      + '<C:mkcalendar xmlns="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">'
      + '<set><prop><resourcetype><collection/><C:calendar/></resourcetype>'
      + '<displayname>foo</displayname></prop></set>'
      + '</C:mkcalendar>';
  let actual = new MkCalendarXml('foo').toXml();
  t.is(actual, expected);
});

test('mkcalendar XML with description', t => {
  let expected = '<?xml version="1.0" encoding="utf-8"?>'
      + '<C:mkcalendar xmlns="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">'
      + '<set><prop><resourcetype><collection/><C:calendar/></resourcetype>'
      + '<displayname>foo</displayname>'
      + '<C:calendar-description>bar</C:calendar-description></prop></set>'
      + '</C:mkcalendar>';
  let actual = new MkCalendarXml('foo', { description: 'bar' }).toXml();
  t.is(actual, expected);
});

test('propfind XML with allprop property', t => {
  let expected = '<?xml version="1.0" encoding="utf-8"?>'
      + '<propfind xmlns="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">'
      + '<allprop/>'
      + '</propfind>';
  let actual = new PropFindXml('allprop').toXml();
  t.is(actual, expected);
});

test('propfind XML with non allprop property', t => {
  let expected = '<?xml version="1.0" encoding="utf-8"?>'
      + '<propfind xmlns="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">'
      + '<prop><C:calendar-home-set/></prop>'
      + '</propfind>';
  let actual = new PropFindXml('C:calendar-home-set').toXml();
  t.is(actual, expected);
});
