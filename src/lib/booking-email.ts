type BookingConfirmationEmailArgs = {
  clientName: string
  serviceTitle: string
  bookingDate: string
  startTime: string
  endTime: string
  googleCalendarUrl: string
  timeZone: string
}

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[character] || character,
  )

const formatBookingDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number)
  const parsedDate = new Date(Date.UTC(year, month - 1, day))

  if (Number.isNaN(parsedDate.getTime())) return date

  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsedDate)
}

export function createBookingConfirmationEmail({
  clientName,
  serviceTitle,
  bookingDate,
  startTime,
  endTime,
  googleCalendarUrl,
  timeZone,
}: BookingConfirmationEmailArgs) {
  const formattedDate = formatBookingDate(bookingDate)
  const safeName = escapeHtml(clientName)
  const safeServiceTitle = escapeHtml(serviceTitle)
  const safeDate = escapeHtml(formattedDate)
  const safeStartTime = escapeHtml(startTime)
  const safeEndTime = escapeHtml(endTime)
  const safeTimeZone = escapeHtml(timeZone)
  const safeGoogleCalendarUrl = escapeHtml(googleCalendarUrl)

  return {
    subject: `Your Nutrihome consultation is confirmed: ${serviceTitle}`,
    text: [
      `Hi ${clientName},`,
      '',
      'Your consultation with Bidisha is confirmed.',
      '',
      `Service: ${serviceTitle}`,
      `Date: ${formattedDate}`,
      `Time: ${startTime}–${endTime} (${timeZone})`,
      '',
      `Add to Google Calendar: ${googleCalendarUrl}`,
      '',
      'If you need to make a change, reply to this email.',
      '',
      'Nutrihome',
    ].join('\n'),
    html: `
      <!doctype html>
      <html lang="en">
        <body style="margin:0;background:#f7f3e9;color:#19332a;font-family:Arial,sans-serif;">
          <div style="padding:32px 16px;">
            <div style="max-width:600px;margin:0 auto;background:#fffdf7;border:1px solid #d9d5c9;border-radius:16px;overflow:hidden;">
              <div style="padding:24px 28px;background:#19332a;color:#ffffff;">
                <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;opacity:.8;">Nutrihome</div>
                <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:28px;line-height:1.2;">Your consultation is confirmed</h1>
              </div>
              <div style="padding:28px;">
                <p style="margin:0 0 18px;font-size:16px;line-height:1.6;">Hi ${safeName},</p>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">Your consultation with Bidisha has been booked. Here are the details:</p>
                <div style="padding:20px;background:#eef3d1;border:1px solid #c6d56d;border-radius:12px;">
                  <div style="margin-bottom:14px;font-size:18px;font-weight:700;">${safeServiceTitle}</div>
                  <div style="margin-bottom:8px;"><strong>Date:</strong> ${safeDate}</div>
                  <div><strong>Time:</strong> ${safeStartTime}&ndash;${safeEndTime} (${safeTimeZone})</div>
                </div>
                <p style="margin:24px 0;">
                  <a href="${safeGoogleCalendarUrl}" style="display:inline-block;padding:13px 20px;background:#19332a;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:700;">Add to Google Calendar</a>
                </p>
                <p style="margin:0;font-size:14px;line-height:1.6;color:#496158;">An iCalendar file is attached for Apple Calendar, Outlook, and other calendar apps. If you need to make a change, reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `.trim(),
  }
}
