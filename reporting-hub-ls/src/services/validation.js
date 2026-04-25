export function validateAssignment(payload, existingAssignments = []) {
  const errors = {};

  if (!payload.courseId) errors.courseId = 'Choose a course';
  if (!payload.classId) errors.classId = 'Choose a class';
  if (!payload.lecturerId) errors.lecturerId = 'Choose a lecturer';
  if (!payload.day) errors.day = 'Choose a day';
  if (!payload.time) errors.time = 'Choose a time';
  if (!payload.venue?.trim()) errors.venue = 'Enter a venue';

  const conflict = existingAssignments.find(item =>
    item.classId === payload.classId &&
    item.day === payload.day &&
    item.time === payload.time &&
    item.id !== payload.id
  );

  if (conflict) {
    errors.schedule = 'This class already has a lecture at that time';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateReportForm(form) {
  const errors = {};

  if (!form.facultyName?.trim()) errors.facultyName = 'Faculty is required';
  if (!form.className?.trim()) errors.className = 'Class is required';
  if (!form.week?.trim()) errors.week = 'Week is required';
  if (!form.dateOfLecture?.trim()) errors.dateOfLecture = 'Date is required';
  if (!form.courseName?.trim()) errors.courseName = 'Course name is required';
  if (!form.courseCode?.trim()) errors.courseCode = 'Course code is required';
  if (!form.lecturerName?.trim()) errors.lecturerName = 'Lecturer is required';
  if (!form.venue?.trim()) errors.venue = 'Venue is required';
  if (!form.scheduledTime?.trim()) errors.scheduledTime = 'Time is required';
  if (!form.topicTaught?.trim()) errors.topicTaught = 'Topic is required';
  if (!form.learningOutcomes?.trim()) errors.learningOutcomes = 'Learning outcomes are required';
  if (!form.recommendations?.trim()) errors.recommendations = 'Recommendations are required';

  const present = Number(form.studentsPresent);
  const registered = Number(form.registeredStudents);

  if (!String(form.studentsPresent ?? '').trim()) {
    errors.studentsPresent = 'Students present is required';
  } else if (Number.isNaN(present) || present < 0) {
    errors.studentsPresent = 'Enter a valid number';
  }

  if (!String(form.registeredStudents ?? '').trim()) {
    errors.registeredStudents = 'Registered students is required';
  } else if (Number.isNaN(registered) || registered <= 0) {
    errors.registeredStudents = 'Enter a valid class total';
  }

  if (!errors.studentsPresent && !errors.registeredStudents && present > registered) {
    errors.studentsPresent = 'Present students cannot be more than registered students';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCourse(payload, existingCourses = []) {
  const errors = {};
  const code = payload.code?.trim().toUpperCase() || '';
  const name = payload.name?.trim() || '';

  if (!code) errors.code = 'Course code is required';
  if (!name) errors.name = 'Course name is required';
  if (!payload.faculty) errors.faculty = 'Faculty is required';

  const duplicate = existingCourses.find(item =>
    item.code?.trim()?.toUpperCase?.() === code && item.id !== payload.id
  );

  if (duplicate) {
    errors.code = 'Course code already exists';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    normalized: {
      ...payload,
      code,
      name,
    },
  };
}

export function validateRating(payload) {
  const errors = {};

  if (!payload.lecturerId) errors.lecturerId = 'Lecturer is required';
  if (!payload.studentId) errors.studentId = 'Student is required';

  const rating = Number(payload.rating);
  if (!rating || Number.isNaN(rating) || rating < 1 || rating > 5) {
    errors.rating = 'Rating must be between 1 and 5';
  }

  if ((payload.comment || '').length > 300) {
    errors.comment = 'Comment is too long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
