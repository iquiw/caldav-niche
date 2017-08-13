import test from 'ava';

import { MkCalendarXml } from '../lib/xmldata.js';

test(t => {
  let xml = new MkCalendarXml('foo').toXml();
  t.is(xml, '<?xml version="1.0" encoding="utf-8"?>'
       + '<C:mkcalendar xmlns="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">'
       + '<set><resourcetype><collection/><C:calendar/></resourcetype>'
       + '<prop><displayname>foo</displayname></prop></set>'
       + '</C:mkcalendar>');
});
