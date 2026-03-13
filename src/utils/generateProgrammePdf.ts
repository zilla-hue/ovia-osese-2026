/**
 * Generates a printable programme page and triggers the browser's
 * Save-as-PDF / Print dialog.  Zero external dependencies.
 */

const PROGRAMME_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Ovia Osese 2026 – Festival Programme</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #1c1917; line-height: 1.5; }

  .header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 3px double #7f1d1d; }
  .header h1 { font-size: 28px; letter-spacing: 2px; margin-bottom: 4px; color: #7f1d1d; }
  .header .theme { font-style: italic; font-size: 14px; color: #44403c; margin-bottom: 2px; }
  .header .dates { font-size: 13px; color: #78716c; }

  .intro { text-align: center; font-size: 12px; color: #44403c; margin-bottom: 20px; max-width: 520px; margin-left: auto; margin-right: auto; }

  .day { page-break-inside: avoid; margin-bottom: 18px; }
  .day-header { background: #7f1d1d; color: #fff; padding: 8px 14px; font-size: 15px; font-weight: bold; letter-spacing: 0.5px; }
  .day-header span { font-weight: normal; font-size: 12px; opacity: 0.85; margin-left: 8px; }

  .period { margin: 8px 0 4px 14px; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #78716c; font-weight: bold; }

  .event-row { display: flex; justify-content: space-between; padding: 3px 14px 3px 28px; font-size: 13px; }
  .event-row .name { flex: 1; }
  .event-row .time { color: #78716c; text-align: right; min-width: 100px; }
  .event-row .note { color: #78716c; font-style: italic; text-align: right; min-width: 100px; }

  .closing { text-align: center; margin-top: 28px; padding-top: 16px; border-top: 2px solid #d6d3d1; font-size: 12px; color: #44403c; }
  .closing .signed { font-weight: bold; color: #1c1917; margin-top: 10px; }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>

<div class="header">
  <h1>OVIA OSESE 2026</h1>
  <div class="theme">"Living the Legacy: A Rich Celebration of Tradition and Identity"</div>
  <div class="dates">April 12 – April 19, 2026 · Ogori, Kogi State, Nigeria</div>
</div>

<div class="intro">
  The Festivals and Events Sub-Committee of the Ogori Descendants Union is pleased to announce
  the schedule of events for the 2026 Ovia Osese Festival.
</div>

<!-- Sunday 12th -->
<div class="day">
  <div class="day-header">SUNDAY 12TH APRIL, 2026</div>
  <div class="period">Evening</div>
  <div class="event-row"><span class="name">Praise Night</span><span class="time">7 pm</span></div>
</div>

<!-- Monday 13th -->
<div class="day">
  <div class="day-header">MONDAY 13TH APRIL, 2026</div>
  <div class="period">Morning</div>
  <div class="event-row"><span class="name">Cleaning (OSA)</span><span class="time"></span></div>
  <div class="period">Afternoon</div>
  <div class="event-row"><span class="name">Board Games</span><span class="time">3 pm</span></div>
  <div class="period">Evening</div>
  <div class="event-row"><span class="name">Road Show (OSA)</span><span class="time">4:30 pm</span></div>
  <div class="event-row"><span class="name">Local Games</span><span class="time">5 pm</span></div>
</div>

<!-- Tuesday 14th -->
<div class="day">
  <div class="day-header">TUESDAY 14TH APRIL, 2026</div>
  <div class="period">Morning</div>
  <div class="event-row"><span class="name">Senior Citizen Jogging</span><span class="time">6 am</span></div>
  <div class="event-row"><span class="name">Quiz and Debates</span><span class="time">8:30 am</span></div>
  <div class="period">Afternoon</div>
  <div class="event-row"><span class="name">Volleyball Finals</span><span class="time">3:30 pm</span></div>
</div>

<!-- Wednesday 15th -->
<div class="day">
  <div class="day-header">WEDNESDAY 15TH APRIL, 2026</div>
  <div class="period">Morning</div>
  <div class="event-row"><span class="name">Marathon</span><span class="time">6 am</span></div>
  <div class="period">Afternoon</div>
  <div class="event-row"><span class="name">Cooking Competition</span><span class="time">3 pm</span></div>
  <div class="event-row"><span class="name">Oko Language Competition</span><span class="time">4 pm</span></div>
  <div class="period">Evening</div>
  <div class="event-row"><span class="name">Entertainment Night</span><span class="time">5 pm</span></div>
</div>

<!-- Thursday 16th -->
<div class="day">
  <div class="day-header">THURSDAY 16TH APRIL, 2026</div>
  <div class="period">Morning</div>
  <div class="event-row"><span class="name">Time With Ivia (Talk Show)</span><span class="time">10 am</span></div>
  <div class="period">Afternoon</div>
  <div class="event-row"><span class="name">Football Finals</span><span class="time">4 pm</span></div>
  <div class="period">Evening</div>
  <div class="event-row"><span class="name">Eregba Night</span><span class="time">8 pm</span></div>
</div>

<!-- Friday 17th -->
<div class="day">
  <div class="day-header">FRIDAY 17TH APRIL, 2026</div>
  <div class="period">Morning</div>
  <div class="event-row"><span class="name">Carnival</span><span class="time">6 am</span></div>
  <div class="event-row"><span class="name">TITI OAKS Foundation Outreach</span><span class="note">Immediately after Carnival</span></div>
  <div class="period">Afternoon</div>
  <div class="event-row"><span class="name">Mrs. Aiso's Medical Outreach for Girls</span><span class="time">3:30 pm</span></div>
  <div class="period">Evening</div>
  <div class="event-row"><span class="name">Miss Ogori</span><span class="time">5 pm</span></div>
  <div class="event-row"><span class="name">Gala Night</span><span class="time">8 pm</span></div>
</div>

<!-- Saturday 18th -->
<div class="day">
  <div class="day-header">SATURDAY 18TH APRIL, 2026</div>
  <div class="event-row"><span class="name">Grand Finale</span><span class="time">10 am</span></div>
</div>

<!-- Sunday 19th -->
<div class="day">
  <div class="day-header">SUNDAY 19TH APRIL, 2026</div>
  <div class="event-row"><span class="name">Thanksgiving Services at various Churches</span><span class="time"></span></div>
</div>

<div class="closing">
  <p>We wish everyone a memorable festival and pray for a safe journey<br/>to all who will travel from all parts of the world to celebrate.</p>
  <p class="signed">
    Signed:<br/>
    Festivals and Events Sub-Committee<br/>
    Ogori Cultural Renaissance Committee
  </p>
</div>

</body>
</html>`;

export function downloadProgrammePdf() {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow pop-ups to download the programme.");
    return;
  }
  printWindow.document.write(PROGRAMME_HTML);
  printWindow.document.close();

  // Wait for content to render, then trigger print (Save as PDF)
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
  // Fallback if onload already fired
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 500);
}
