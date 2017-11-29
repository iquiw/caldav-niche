import test from 'ava';

import Client from '../lib/client.js';

test('Parse XML with <C:calendar-data>', async t => {
  let xml = `
<?xml version="1.0"?>
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
  let vcal = await parser.parse(xml);
  t.is(vcal, `BEGIN:VCALENDAR
TEST
END:VCALENDAR
`);
});
