import test from 'ava';

import Client from '../lib/client.js';

test('Parse XML with <C:calendar-data>', async t => {
  let xml = `<?xml version="1.0"?>
<multistatus xmlns="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <response>
    <href>/admin/JapanHolidays.ics/ba42e657-76e9-4a6b-8c6c-6aec9d7c750f</href>
    <propstat>
      <prop>
        <C:calendar-data>BEGIN:VCALENDAR
TEST
END:VCALENDAR
</C:calendar-data>
      </prop>
      <status>HTTP/1.1 200 OK</status>
    </propstat>
  </response>
</multistatus>`;
  let parser = new Client.CalendarDataXmlParser();
  let vcals = await parser.parse(xml);
  t.is(vcals.length, 1);
  t.is(vcals[0], `BEGIN:VCALENDAR
TEST
END:VCALENDAR
`);
});

test('Parse XML without <C:calendar-data>', async t => {
  let xml = `<?xml version="1.0"?>
<multistatus xmlns="DAV:"/>
`;
  let parser = new Client.CalendarDataXmlParser();
  let vcals = await parser.parse(xml);
  t.is(vcals.length, 0);
});

test('Parse XML with multiple responses', async t => {
  let xml = `<?xml version='1.0' encoding='utf-8'?>
<multistatus xmlns="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav"><response><href>/radicale/admin/JapanHolidays.ics/161b6a9a-8a74-48d1-a4a2-b094dc0d4691</href><propstat><prop><C:calendar-data>BEGIN:VCALENDAR
TEST1
END:VCALENDAR
</C:calendar-data></prop><status>HTTP/1.1 200 OK</status></propstat></response><response><href>/radicale/admin/JapanHolidays.ics/eb834caf-2a68-4981-9336-92d2f7146ece</href><propstat><prop><C:calendar-data>BEGIN:VCALENDAR
TEST2
END:VCALENDAR
</C:calendar-data></prop><status>HTTP/1.1 200 OK</status></propstat></response></multistatus>
`;

  let parser = new Client.CalendarDataXmlParser();
  let vcals = await parser.parse(xml);
  t.is(vcals.length, 2);
  t.is(vcals[0], `BEGIN:VCALENDAR
TEST1
END:VCALENDAR
`);
  t.is(vcals[1], `BEGIN:VCALENDAR
TEST2
END:VCALENDAR
`);
});
