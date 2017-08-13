import test from 'ava';

import { MkCalendarXml } from '../lib/xmldata.js';

test(t => {
  let expected = '<?xml version="1.0" encoding="utf-8"?>'
      + '<C:mkcalendar xmlns="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">'
      + '<set><prop><resourcetype><collection/><C:calendar/></resourcetype>'
      + '<displayname>foo</displayname></prop></set>'
      + '</C:mkcalendar>';
  let actual = new MkCalendarXml('foo').toXml();
  t.is(actual, expected);
});
