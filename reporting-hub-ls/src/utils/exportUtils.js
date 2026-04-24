import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

//this turns the rows into csv text
export function toCSV(rows, columns) {
  if (!rows || rows.length === 0) return '';
  const header = columns.map(c => `"${c.label}"`).join(',');
  const body = rows.map(row =>
    columns.map(c => {
      const val = row[c.key] ?? '';
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',')
  ).join('\n');
  return `${header}\n${body}`;
}

function writeTextFile(name, content) {
  const file = new File(Paths.cache, name);
  file.create({ overwrite: true, intermediates: true });
  file.write(content);
  return file;
}

//this saves the csv and opens share
export async function exportCSV(rows, columns, filename = 'export') {
  try {
    const csv = toCSV(rows, columns);
    const file = writeTextFile(`${filename}_${Date.now()}.csv`, csv);
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'text/csv',
        dialogTitle: `Export ${filename}`,
        UTI: 'public.comma-separated-values-text',
      });
    }
    return { success: true, path: file.uri };
  } catch (err) {
    return { success: false, error: err?.message || 'Could not export CSV.' };
  }
}

function toExcelHtml(rows, columns, title = 'Export') {
  const header = columns.map(column => `<th>${column.label}</th>`).join('');
  const body = rows.map(row => (
    `<tr>${columns.map(column => `<td>${String(row[column.key] ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`).join('')}</tr>`
  )).join('');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-family: Arial, sans-serif; font-size: 12px; }
      th { background: #e2e8f0; font-weight: 700; }
      h1 { font-family: Arial, sans-serif; font-size: 18px; color: #0f172a; }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <table>
      <thead><tr>${header}</tr></thead>
      <tbody>${body}</tbody>
    </table>
  </body>
</html>`;
}

export async function exportExcel(rows, columns, filename = 'export', title = 'Export') {
  try {
    const html = toExcelHtml(rows, columns, title);
    const file = writeTextFile(`${filename}_${Date.now()}.xls`, html);
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/vnd.ms-excel',
        dialogTitle: `Export ${filename}`,
      });
    }
    return { success: true, path: file.uri };
  } catch (err) {
    return { success: false, error: err?.message || 'Could not export the report file.' };
  }
}

//columns for exports

export const REPORT_COLUMNS = [
  { key: 'facultyName',        label: 'Faculty Name' },
  { key: 'className',          label: 'Class Name' },
  { key: 'week',               label: 'Week of Reporting' },
  { key: 'dateOfLecture',      label: 'Date of Lecture' },
  { key: 'courseName',         label: 'Course Name' },
  { key: 'courseCode',         label: 'Course Code' },
  { key: 'lecturerName',       label: "Lecturer's Name" },
  { key: 'studentsPresent',    label: 'Students Present' },
  { key: 'registeredStudents', label: 'Registered Students' },
  { key: 'venue',              label: 'Venue' },
  { key: 'scheduledTime',      label: 'Scheduled Time' },
  { key: 'topicTaught',        label: 'Topic Taught' },
  { key: 'learningOutcomes',   label: 'Learning Outcomes' },
  { key: 'recommendations',    label: 'Recommendations' },
  { key: 'status',             label: 'Status' },
  { key: 'prlFeedback',        label: 'PRL Feedback' },
  { key: 'createdAt',          label: 'Submitted At' },
];

export const ATTENDANCE_COLUMNS = [
  { key: 'className',          label: 'Class' },
  { key: 'courseName',         label: 'Course' },
  { key: 'dateOfLecture',      label: 'Date' },
  { key: 'week',               label: 'Week' },
  { key: 'studentsPresent',    label: 'Present' },
  { key: 'registeredStudents', label: 'Registered' },
  { key: 'attendanceRate',     label: 'Attendance Rate (%)' },
  { key: 'lecturerName',       label: 'Lecturer' },
];

export const STAFF_COLUMNS = [
  { key: 'name',    label: 'Name' },
  { key: 'role',    label: 'Role' },
  { key: 'faculty', label: 'Faculty' },
  { key: 'email',   label: 'Email' },
];
