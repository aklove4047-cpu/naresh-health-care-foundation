// Main Application Logic for Naresh All-in-One Platform

let currentActiveCourse = null;
let currentActiveInstitution = "foundation";

document.addEventListener("DOMContentLoaded", function() {
  initApp();
});

function initApp() {
  renderInstitutionsOverview();
  renderDoctorsList();
  renderCoursesList();
  updateBookingDoctorList();
  initBookingDate();
  updateLiveIdCardPreview();
  renderStudentPortalCourses();
}

// ================= NAVIGATION =================
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".page-view").forEach(el => el.style.display = "none");
  
  // Show target section
  const target = document.getElementById("section-" + sectionId);
  if (target) {
    target.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Update nav link active state
  document.querySelectorAll(".nav-links a").forEach(a => a.classList.remove("active"));
  const navLink = document.getElementById("nav-" + sectionId);
  if (navLink) navLink.classList.add("active");

  // Specific triggers
  if (sectionId === "institutions") {
    renderInstitutionDetail(currentActiveInstitution);
  }
}

// ================= INSTITUTIONS =================
function filterInstitutionView(instId) {
  currentActiveInstitution = instId;

  // Update pills
  document.querySelectorAll(".inst-pill-btn").forEach((btn, idx) => {
    const ids = ["foundation", "eclinic", "chc_fac", "fac"];
    if (ids[idx] === instId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Switch to institutions page
  showSection("institutions");
  renderInstitutionDetail(instId);
}

function renderInstitutionsOverview() {
  const container = document.getElementById("institutionsCardsContainer");
  if (!container) return;

  const list = NareshData.get("institutions");
  container.innerHTML = list.map(inst => `
    <div class="inst-card">
      <span class="badge badge-primary" style="margin-bottom:0.75rem; width:fit-content;">${inst.badge}</span>
      <h3>${inst.shortName}</h3>
      <p style="font-size:0.85rem; color:var(--text-muted);">${inst.tagline}</p>
      
      <div style="font-size:0.82rem; margin-bottom:1.25rem;">
        <span style="color:var(--secondary); font-weight:600;">📍 Address:</span>
        <div style="color:var(--text-muted);">${inst.address.substring(0, 50)}...</div>
      </div>

      <button class="btn btn-outline btn-sm" onclick="filterInstitutionView('${inst.id}')">
        View Full Profile &rarr;
      </button>
    </div>
  `).join("");
}

function renderInstitutionDetail(instId) {
  const list = NareshData.get("institutions");
  const inst = list.find(i => i.id === instId) || list[0];

  document.getElementById("institutionDetailTitle").innerText = inst.name;
  document.getElementById("institutionDetailSubtitle").innerText = inst.tagline;

  let extraHtml = "";
  if (inst.initiatives) {
    extraHtml = `
      <div style="margin-top:2rem;">
        <h3 style="font-size:1.35rem; margin-bottom:1rem;">Key Community Initiatives & Health Camps</h3>
        <div class="grid-3">
          ${inst.initiatives.map(ini => `
            <div style="background:#ffffff; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.5rem;">
              <span class="badge badge-success" style="margin-bottom:0.5rem;">${ini.status}</span>
              <h4 style="font-size:1.1rem; margin-bottom:0.4rem;">${ini.title}</h4>
              <p style="font-size:0.85rem; margin-bottom:0.75rem;">${ini.desc}</p>
              <div style="font-size:0.8rem; font-weight:700; color:var(--primary);">🎯 Beneficiaries: ${ini.beneficiaries}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  if (inst.services) {
    extraHtml = `
      <div style="margin-top:2rem;">
        <h3 style="font-size:1.35rem; margin-bottom:1rem;">Available Diagnostic & Clinical Services</h3>
        <div class="grid-2">
          ${inst.services.map(srv => `
            <div style="background:#ffffff; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem; display:flex; align-items:center; gap:0.75rem;">
              <div style="width:36px; height:36px; border-radius:50%; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                ✓
              </div>
              <div style="font-size:0.95rem; font-weight:600; color:var(--secondary);">${srv}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  const detailBox = document.getElementById("institutionDetailedContent");
  detailBox.innerHTML = `
    <div style="background:#ffffff; border:1px solid var(--border-color); border-radius:var(--radius-xl); padding:2.5rem; box-shadow:var(--shadow-sm); margin-bottom:2rem;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
        <div>
          <span class="badge badge-primary">${inst.badge}</span>
          <h2 style="font-size:1.75rem; margin-top:0.5rem; color:var(--secondary);">${inst.name}</h2>
          <p style="font-size:1rem; color:var(--primary-dark); font-weight:600;">${inst.tagline}</p>
        </div>
        <div>
          <button class="btn btn-primary" onclick="showBookingForInstitution('${inst.id}')">
            Book Appointment at this Center &rarr;
          </button>
        </div>
      </div>

      <p style="font-size:1.05rem; line-height:1.7; color:#334155; margin-bottom:2rem;">
        ${inst.description}
      </p>

      <div class="grid-3" style="background:var(--bg-subtle); padding:1.5rem; border-radius:var(--radius-lg); margin-bottom:1.5rem;">
        <div>
          <strong style="display:block; font-size:0.82rem; color:var(--text-muted); text-transform:uppercase;">📍 Location</strong>
          <span style="font-size:0.92rem; color:var(--secondary); font-weight:500;">${inst.address}</span>
        </div>
        <div>
          <strong style="display:block; font-size:0.82rem; color:var(--text-muted); text-transform:uppercase;">📞 Contact Hotline</strong>
          <span style="font-size:0.92rem; color:var(--secondary); font-weight:500;">${inst.phone}</span>
        </div>
        <div>
          <strong style="display:block; font-size:0.82rem; color:var(--text-muted); text-transform:uppercase;">⏰ Operating Timings</strong>
          <span style="font-size:0.92rem; color:var(--secondary); font-weight:500;">${inst.timings || "Mon - Sat: 09:00 AM - 07:00 PM"}</span>
        </div>
      </div>

      ${inst.highlights ? `
        <div style="margin-top:1.5rem;">
          <h4 style="font-size:1.1rem; margin-bottom:0.75rem;">Key Institutional Accreditations & Milestones</h4>
          <ul style="list-style:none; display:flex; flex-direction:column; gap:0.5rem;">
            ${inst.highlights.map(hl => `
              <li style="display:flex; align-items:center; gap:0.5rem; font-size:0.92rem; color:#475569;">
                <span style="color:var(--primary); font-weight:800;">✓</span> ${hl}
              </li>
            `).join("")}
          </ul>
        </div>
      ` : ""}
    </div>

    ${extraHtml}
  `;
}

// ================= DOCTORS DIRECTORY =================
function renderDoctorsList() {
  const container = document.getElementById("doctorsGridContainer");
  if (!container) return;

  const clinicFilter = document.getElementById("docFilterClinic")?.value || "all";
  const specFilter = document.getElementById("docFilterSpecialty")?.value || "all";

  let doctors = NareshData.get("doctors");

  if (clinicFilter !== "all") {
    doctors = doctors.filter(d => d.clinics.includes(clinicFilter));
  }
  if (specFilter !== "all") {
    doctors = doctors.filter(d => d.specialty.toLowerCase().includes(specFilter.toLowerCase()));
  }

  const countBadge = document.getElementById("docCountBadge");
  if (countBadge) countBadge.innerText = `Showing ${doctors.length} Specialist${doctors.length === 1 ? '' : 's'}`;

  if (doctors.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-muted);">No doctors matching the selected filters.</div>`;
    return;
  }

  container.innerHTML = doctors.map(doc => {
    const initials = doc.name.replace("Dr. ", "").split(" ").map(n => n[0]).join("");
    return `
      <div class="doctor-card">
        <div class="doctor-header">
          <div class="doctor-avatar">${initials}</div>
          <div class="doctor-info">
            <h4>${doc.name}</h4>
            <div class="specialty">${doc.specialty}</div>
            <div class="qual">${doc.qualifications}</div>
          </div>
        </div>

        <div class="doctor-body">
          <div class="doctor-meta-row">
            <span class="label">Experience:</span>
            <span class="val">${doc.experience}</span>
          </div>
          <div class="doctor-meta-row">
            <span class="label">Languages:</span>
            <span class="val">${doc.languages.join(", ")}</span>
          </div>
          <div class="doctor-meta-row">
            <span class="label">OPD Days:</span>
            <span class="val">${doc.availableDays.join(", ")}</span>
          </div>
          <p class="doctor-bio">${doc.bio}</p>
        </div>

        <div class="doctor-footer">
          <div>
            <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Consultation Fee</span>
            <span style="font-weight:800; font-size:1.05rem; color:var(--secondary);">${doc.fee}</span>
          </div>
          <button class="btn btn-primary btn-sm" onclick="bookDoctorDirectly('${doc.id}')">
            Book Appointment
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function bookDoctorDirectly(doctorId) {
  const doctors = NareshData.get("doctors");
  const doc = doctors.find(d => d.id === doctorId);
  if (!doc) return;

  showSection("booking");
  
  const clinicSelect = document.getElementById("bookClinicSelect");
  if (clinicSelect && doc.clinics.length > 0) {
    clinicSelect.value = doc.clinics[0];
  }
  updateBookingDoctorList();

  const doctorSelect = document.getElementById("bookDoctorSelect");
  if (doctorSelect) {
    doctorSelect.value = doc.id;
    updateBookingSlots();
  }
}

function showBookingForInstitution(instId) {
  showSection("booking");
  const clinicSelect = document.getElementById("bookClinicSelect");
  if (clinicSelect) {
    clinicSelect.value = instId;
    updateBookingDoctorList();
  }
}

// ================= APPOINTMENT BOOKING WIZARD =================
function initBookingDate() {
  const dateInput = document.getElementById("bookDate");
  if (dateInput) {
    const today = new Date();
    today.setDate(today.getDate() + 1); // default tomorrow
    dateInput.value = today.toISOString().split("T")[0];
    dateInput.min = new Date().toISOString().split("T")[0];
  }
}

function updateBookingDoctorList() {
  const instId = document.getElementById("bookClinicSelect").value;
  const doctors = NareshData.get("doctors");
  const filtered = doctors.filter(d => d.clinics.includes(instId));

  const select = document.getElementById("bookDoctorSelect");
  if (!select) return;

  if (filtered.length === 0) {
    select.innerHTML = `<option value="">No doctor available for this center</option>`;
  } else {
    select.innerHTML = filtered.map(d => `<option value="${d.id}">${d.name} (${d.specialty})</option>`).join("");
  }

  updateBookingSlots();
}

function updateBookingSlots() {
  const docId = document.getElementById("bookDoctorSelect")?.value;
  const doctors = NareshData.get("doctors");
  const doc = doctors.find(d => d.id === docId);

  const preview = document.getElementById("bookingDoctorPreview");
  const slotsContainer = document.getElementById("bookingSlotsContainer");
  
  if (!doc) {
    if (preview) preview.innerHTML = `<span style="color:var(--text-muted);">Please select a doctor.</span>`;
    if (slotsContainer) slotsContainer.innerHTML = "";
    return;
  }

  if (preview) {
    preview.innerHTML = `
      <div style="width:48px; height:48px; border-radius:50%; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1.1rem; flex-shrink:0;">
        ${doc.name.replace("Dr. ", "").split(" ").map(n => n[0]).join("")}
      </div>
      <div>
        <h4 style="font-size:1rem; margin-bottom:2px;">${doc.name}</h4>
        <div style="font-size:0.8rem; color:var(--primary-dark); font-weight:600;">${doc.specialty} | ${doc.qualifications}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">Consultation Fee: <strong>${doc.fee}</strong> | Available: ${doc.availableDays.join(", ")}</div>
      </div>
    `;
  }

  if (slotsContainer) {
    slotsContainer.innerHTML = doc.slots.map((slot, idx) => `
      <button type="button" class="time-slot-btn ${idx === 0 ? 'selected' : ''}" onclick="selectTimeSlot(this, '${slot}')">
        ${slot}
      </button>
    `).join("");

    const hiddenSlot = document.getElementById("selectedTimeSlot");
    if (hiddenSlot) hiddenSlot.value = doc.slots[0] || "";
  }
}

function selectTimeSlot(btn, slot) {
  document.querySelectorAll(".time-slot-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  document.getElementById("selectedTimeSlot").value = slot;
}

function goToBookingStep(stepNum) {
  // Validate Step 1
  if (stepNum === 2) {
    const docId = document.getElementById("bookDoctorSelect")?.value;
    if (!docId) {
      showToast("Please select a doctor to continue", "error");
      return;
    }
  }

  // Validate Step 2
  if (stepNum === 3) {
    const slot = document.getElementById("selectedTimeSlot")?.value;
    const date = document.getElementById("bookDate")?.value;
    if (!date) {
      showToast("Please choose a consultation date", "error");
      return;
    }
    if (!slot) {
      showToast("Please select an available consultation time slot", "error");
      return;
    }
  }

  // Show/Hide steps
  for (let i = 1; i <= 3; i++) {
    const stepEl = document.getElementById("wizard-step-" + i);
    const tabEl = document.getElementById("wizard-tab-" + i);
    if (stepEl) stepEl.style.display = i === stepNum ? "block" : "none";
    if (tabEl) {
      if (i === stepNum) {
        tabEl.classList.add("active");
      } else if (i < stepNum) {
        tabEl.classList.add("completed");
        tabEl.classList.remove("active");
      } else {
        tabEl.classList.remove("active", "completed");
      }
    }
  }
}

function submitAppointmentBooking() {
  const patientName = document.getElementById("patientName")?.value.trim();
  const patientPhone = document.getElementById("patientPhone")?.value.trim();
  const patientEmail = document.getElementById("patientEmail")?.value.trim();
  const patientReason = document.getElementById("patientReason")?.value.trim();
  const date = document.getElementById("bookDate")?.value;
  const slot = document.getElementById("selectedTimeSlot")?.value;
  const clinicId = document.getElementById("bookClinicSelect")?.value;
  const doctorId = document.getElementById("bookDoctorSelect")?.value;

  if (!patientName || !patientPhone || !patientReason) {
    showToast("Please fill in patient name, phone, and reason for visit.", "error");
    return;
  }

  const institutions = NareshData.get("institutions");
  const doctors = NareshData.get("doctors");
  const inst = institutions.find(i => i.id === clinicId);
  const doc = doctors.find(d => d.id === doctorId);

  const token = "APT-2026-" + Math.floor(1000 + Math.random() * 9000);

  const newAppointment = {
    id: token,
    patientName: patientName,
    patientPhone: patientPhone,
    patientEmail: patientEmail,
    institutionId: clinicId,
    institutionName: inst ? inst.name : "Naresh Clinic",
    doctorId: doctorId,
    doctorName: doc ? doc.name : "Consultant Physician",
    date: date,
    slot: slot,
    reason: patientReason,
    status: "Requested",
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
  };

  const appointments = NareshData.get("appointments");
  appointments.unshift(newAppointment);
  NareshData.set("appointments", appointments);

  // Show Success Screen
  document.getElementById("wizard-step-1").style.display = "none";
  document.getElementById("wizard-step-2").style.display = "none";
  document.getElementById("wizard-step-3").style.display = "none";
  document.getElementById("wizard-success-screen").style.display = "block";

  document.getElementById("successBookingToken").innerText = token;
  document.getElementById("bookingSummaryCard").innerHTML = `
    <div style="font-size:0.95rem; margin-bottom:0.75rem;"><strong>Patient:</strong> ${patientName} (${patientPhone})</div>
    <div style="font-size:0.95rem; margin-bottom:0.75rem;"><strong>Doctor:</strong> ${newAppointment.doctorName}</div>
    <div style="font-size:0.95rem; margin-bottom:0.75rem;"><strong>Center:</strong> ${newAppointment.institutionName}</div>
    <div style="font-size:0.95rem; margin-bottom:0.75rem;"><strong>Date & Time:</strong> ${date} at ${slot}</div>
    <div style="font-size:0.85rem; color:var(--text-muted);">Status: <span class="badge badge-warning">Requested (Under Review by Receptionist)</span></div>
  `;

  showToast(`Appointment request ${token} submitted successfully!`, "success");
}

function resetBookingWizard() {
  document.getElementById("wizard-success-screen").style.display = "none";
  goToBookingStep(1);
  document.getElementById("patientName").value = "";
  document.getElementById("patientPhone").value = "";
  document.getElementById("patientEmail").value = "";
  document.getElementById("patientReason").value = "";
}

// ================= E-LEARNING & COURSES =================
function renderCoursesList(filterCategory = "all") {
  const container = document.getElementById("coursesGridContainer");
  if (!container) return;

  let courses = NareshData.get("courses");
  if (filterCategory !== "all") {
    courses = courses.filter(c => c.category === filterCategory);
  }

  container.innerHTML = courses.map(crs => `
    <div class="course-card">
      <div class="course-thumb">
        <img src="${crs.thumbnail}" alt="${crs.title}">
        <div class="course-badge-overlay">${crs.badge}</div>
      </div>
      <div class="course-content">
        <div class="course-category">${crs.category} • ${crs.code}</div>
        <h3>${crs.title}</h3>
        <p>${crs.overview}</p>
        <div class="course-meta">
          <span>⏱️ ${crs.duration}</span>
          <span>📚 ${crs.lessonsCount} Modules</span>
          <span>🌐 ${crs.language}</span>
        </div>
        <div class="course-footer">
          <div class="course-price ${crs.fee === 0 ? 'free' : ''}">
            ${crs.fee === 0 ? 'FREE' : '₹' + crs.fee}
          </div>
          <button class="btn btn-primary btn-sm" onclick="openCoursePlayer('${crs.id}')">
            Start Learning &rarr;
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

function filterCoursesCategory(category, btn) {
  const buttons = btn.parentElement.querySelectorAll(".btn");
  buttons.forEach(b => {
    b.classList.remove("btn-primary");
    b.classList.add("btn-outline");
  });
  btn.classList.remove("btn-outline");
  btn.classList.add("btn-primary");

  renderCoursesList(category);
}

function openCoursePlayer(courseId) {
  const courses = NareshData.get("courses");
  const course = courses.find(c => c.id === courseId);
  if (!course) return;

  currentActiveCourse = course;

  document.getElementById("playerModalCategory").innerText = course.category;
  document.getElementById("playerModalTitle").innerText = course.title;

  // Render syllabus
  const syllabusList = document.getElementById("playerSyllabusList");
  if (syllabusList) {
    syllabusList.innerHTML = course.syllabus.map((s, idx) => `
      <div style="background:#ffffff; border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.75rem 1rem; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="selectLessonModule(${idx})">
        <div style="display:flex; align-items:center; gap:0.65rem;">
          <span style="width:24px; height:24px; border-radius:50%; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700;">${idx + 1}</span>
          <span style="font-weight:600; font-size:0.88rem; color:var(--secondary);">${s.title}</span>
        </div>
        <span style="font-size:0.75rem; color:var(--text-muted);">${s.time}</span>
      </div>
    `).join("");
  }

  // Render Quiz questions
  renderQuizQuestions(course);

  switchPlayerTab("lessons");
  openModal("coursePlayerModal");
}

function switchPlayerTab(tab) {
  const lessonsTab = document.getElementById("playerTabLessons");
  const quizTab = document.getElementById("playerTabQuiz");
  const btnLessons = document.getElementById("btnTabLessons");
  const btnQuiz = document.getElementById("btnTabQuiz");

  if (tab === "lessons") {
    lessonsTab.style.display = "block";
    quizTab.style.display = "none";
    btnLessons.classList.add("active");
    btnQuiz.classList.remove("active");
  } else {
    lessonsTab.style.display = "none";
    quizTab.style.display = "block";
    btnLessons.classList.remove("active");
    btnQuiz.classList.add("active");
  }
}

function selectLessonModule(index) {
  if (!currentActiveCourse) return;
  const mod = currentActiveCourse.syllabus[index];
  document.getElementById("currentLessonVideoTitle").innerText = mod.title;
  showToast(`Loaded lesson: ${mod.title}`, "info");
}

function playSimulatedLesson() {
  showToast("Playing interactive lecture & live medical demonstration...", "success");
}

function renderQuizQuestions(course) {
  const container = document.getElementById("quizQuestionsContainer");
  if (!container || !course.quiz) return;

  container.innerHTML = course.quiz.map((q, qIdx) => `
    <div class="quiz-question-box">
      <div class="quiz-question-title">Q${qIdx + 1}. ${q.question}</div>
      <div>
        ${q.options.map((opt, optIdx) => `
          <label class="quiz-option" id="opt_${q.id}_${optIdx}">
            <input type="radio" name="question_${q.id}" value="${optIdx}">
            <span>${opt}</span>
          </label>
        `).join("")}
      </div>
    </div>
  `).join("");

  document.getElementById("quizResultBox").style.display = "none";
  document.getElementById("quizActionButtons").style.display = "flex";
}

function submitCourseQuiz() {
  if (!currentActiveCourse || !currentActiveCourse.quiz) return;

  const quiz = currentActiveCourse.quiz;
  let correctCount = 0;
  let answeredAll = true;

  quiz.forEach(q => {
    const selected = document.querySelector(`input[name="question_${q.id}"]:checked`);
    if (!selected) {
      answeredAll = false;
    } else if (parseInt(selected.value) === q.answerIndex) {
      correctCount++;
    }
  });

  if (!answeredAll) {
    showToast("Please answer all multiple-choice questions before evaluating.", "warning");
    return;
  }

  const scorePct = Math.round((correctCount / quiz.length) * 100);
  const passed = scorePct >= 80;
  const resultBox = document.getElementById("quizResultBox");

  resultBox.style.display = "block";
  document.getElementById("quizActionButtons").style.display = "none";

  if (passed) {
    const certId = "NCH-CERT-2026-" + Math.floor(1000 + Math.random() * 9000);
    resultBox.innerHTML = `
      <div style="font-size:2.5rem; margin-bottom:0.5rem;">🎉</div>
      <h3 style="color:var(--success); font-size:1.5rem; margin-bottom:0.5rem;">Congratulations! You Passed!</h3>
      <p style="font-size:1.1rem; margin-bottom:1rem;">Your Score: <strong>${scorePct}%</strong> (${correctCount} of ${quiz.length} correct)</p>
      <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1.5rem;">
        You have satisfied all performance and learning criteria for <strong>${currentActiveCourse.title}</strong>.
      </p>
      <button class="btn btn-primary btn-lg" onclick="openCertificateModal('${currentActiveCourse.title}', '${certId}')">
        📜 View & Download Certificate
      </button>
    `;
    showToast("Exam Passed! Certificate unlocked.", "success");
  } else {
    resultBox.innerHTML = `
      <div style="font-size:2.5rem; margin-bottom:0.5rem;">⚠️</div>
      <h3 style="color:var(--danger); font-size:1.5rem; margin-bottom:0.5rem;">Passing Score: 80% (You scored ${scorePct}%)</h3>
      <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1.5rem;">
        Review the lesson videos and medical guides, then try the assessment again.
      </p>
      <button class="btn btn-outline" onclick="renderQuizQuestions(currentActiveCourse)">
        🔄 Retake Quiz
      </button>
    `;
    showToast("Score below pass mark. Please review lessons and retry.", "warning");
  }
}

function openCertificateModal(courseTitle, certId) {
  courseTitle = courseTitle || (currentActiveCourse ? currentActiveCourse.title : "Certified Emergency First Aid & CPR Responder");
  certId = certId || ("NCH-CERT-2026-" + Math.floor(1000 + Math.random() * 9000));
  
  const courseTitleEl = document.getElementById("certCourseTitle");
  const certIdEl = document.getElementById("certIdNumber");
  const issueDateEl = document.getElementById("certIssueDate");
  
  if (courseTitleEl) courseTitleEl.innerText = courseTitle;
  if (certIdEl) certIdEl.innerText = certId;
  if (issueDateEl) issueDateEl.innerText = new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' });
  
  openModal("certificateModal");
}

// ================= MEMBERSHIP =================
function handleMembershipSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("mbrName").value.trim();
  const phone = document.getElementById("mbrPhone").value.trim();
  const email = document.getElementById("mbrEmail").value.trim();
  const category = document.getElementById("mbrCategory").value;
  const blood = document.getElementById("mbrBloodGroup").value;
  const gender = document.getElementById("mbrGender").value;
  const address = document.getElementById("mbrAddress").value.trim();

  const memberId = "MBR-2026-" + Math.floor(500 + Math.random() * 500);

  const newMember = {
    id: memberId,
    name: name,
    phone: phone,
    email: email,
    gender: gender,
    bloodGroup: blood,
    category: category,
    address: address,
    status: "Approved",
    appliedDate: new Date().toISOString().split("T")[0],
    approvedDate: new Date().toISOString().split("T")[0],
    idCardIssued: true
  };

  const members = NareshData.get("members");
  members.unshift(newMember);
  NareshData.set("members", members);

  updateLiveIdCardPreview(newMember);
  showToast(`Membership application submitted! ID card generated: ${memberId}`, "success");
}

function updateLiveIdCardPreview(memberData = null) {
  const name = memberData ? memberData.name : (document.getElementById("mbrName")?.value || "Sandeep Kumar");
  const category = memberData ? memberData.category : (document.getElementById("mbrCategory")?.value || "Health Volunteer");
  const blood = memberData ? memberData.bloodGroup : (document.getElementById("mbrBloodGroup")?.value || "O+");
  const id = memberData ? memberData.id : "NCH-MBR-2026-501";

  const cardName = document.getElementById("cardPreviewName");
  const cardCat = document.getElementById("cardPreviewCategory");
  const cardBlood = document.getElementById("cardPreviewBlood");
  const cardId = document.getElementById("cardPreviewId");

  if (cardName) cardName.innerText = name || "Your Name";
  if (cardCat) cardCat.innerText = category;
  if (cardBlood) cardBlood.innerText = blood;
  if (cardId) cardId.innerText = id;
}

// ================= DONATIONS =================
function setDonationAmount(amt, btn) {
  document.querySelectorAll("#donationModal .btn-outline").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("customDonationAmount").value = amt;
}

function processDonation() {
  const amt = parseInt(document.getElementById("customDonationAmount").value);
  const donorName = document.getElementById("donorName").value.trim();
  const donorPhone = document.getElementById("donorPhone").value.trim();
  const donorEmail = document.getElementById("donorEmail").value.trim();
  const cause = document.getElementById("donationCause").value;
  const pan = document.getElementById("donorPan")?.value.trim() || "NOT PROVIDED";

  if (!amt || amt < 50 || !donorName || !donorPhone || !donorEmail) {
    showToast("Please enter a valid amount (min ₹50), name, phone and email.", "error");
    return;
  }

  const receiptNo = "REC-NCH-2026-" + Math.floor(100 + Math.random() * 900);
  const newDonation = {
    id: "DON-2026-" + Math.floor(1000 + Math.random() * 9000),
    donorName: donorName,
    donorPhone: donorPhone,
    donorEmail: donorEmail,
    amount: amt,
    purpose: cause,
    paymentMode: "UPI / Net Banking",
    status: "Completed",
    date: new Date().toISOString().split("T")[0],
    receiptNo: receiptNo
  };

  const donations = NareshData.get("donations");
  donations.unshift(newDonation);
  NareshData.set("donations", donations);

  // Populate receipt modal
  document.getElementById("receiptNumberText").innerText = "Receipt: " + receiptNo;
  document.getElementById("receiptDonorName").innerText = donorName;
  document.getElementById("receiptPhone").innerText = donorPhone;
  document.getElementById("receiptEmail").innerText = donorEmail;
  document.getElementById("receiptPan").innerText = pan.toUpperCase();
  document.getElementById("receiptAmount").innerText = "₹" + amt.toLocaleString("en-IN");
  document.getElementById("receiptCause").innerText = cause;
  document.getElementById("receiptDate").innerText = new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' });

  closeModal("donationModal");
  openModal("donationReceiptModal");
  showToast(`Payment of ₹${amt} confirmed! Receipt generated.`, "success");
}

// ================= TRACK APPOINTMENT =================
function openTrackAppointmentModal() {
  openModal("trackAppointmentModal");
}

function searchAppointmentStatus() {
  const query = document.getElementById("trackQueryInput").value.trim().toLowerCase();
  const resultBox = document.getElementById("trackResultContainer");

  if (!query) {
    showToast("Please enter an appointment token or phone number.", "warning");
    return;
  }

  const appointments = NareshData.get("appointments");
  const found = appointments.filter(a => 
    a.id.toLowerCase().includes(query) || 
    (a.patientPhone && a.patientPhone.replace(/\s+/g, "").includes(query.replace(/\s+/g, "")))
  );

  resultBox.style.display = "block";

  if (found.length === 0) {
    resultBox.innerHTML = `
      <div style="background:#fee2e2; color:#b91c1c; padding:1rem; border-radius:var(--radius-sm); font-size:0.85rem;">
        No appointment found for "${query}". Please check the token ID or contact clinic reception.
      </div>
    `;
    return;
  }

  resultBox.innerHTML = found.map(a => `
    <div style="background:var(--bg-subtle); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:0.75rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
        <strong style="color:var(--primary); font-size:1.05rem;">${a.id}</strong>
        <span class="badge ${a.status === 'Confirmed' ? 'badge-success' : (a.status === 'Requested' ? 'badge-warning' : 'badge-secondary')}">${a.status}</span>
      </div>
      <div style="font-size:0.88rem; margin-bottom:0.25rem;"><strong>Patient:</strong> ${a.patientName}</div>
      <div style="font-size:0.88rem; margin-bottom:0.25rem;"><strong>Doctor:</strong> ${a.doctorName}</div>
      <div style="font-size:0.88rem; margin-bottom:0.25rem;"><strong>Center:</strong> ${a.institutionName}</div>
      <div style="font-size:0.85rem; color:var(--text-muted);"><strong>Schedule:</strong> ${a.date} at ${a.slot}</div>
    </div>
  `).join("");
}

// ================= STUDENT PORTAL =================
function openStudentPortalModal() {
  renderStudentPortalCourses();
  openModal("studentPortalModal");
}

function renderStudentPortalCourses() {
  const container = document.getElementById("studentCoursesList");
  if (!container) return;

  const studentState = NareshData.get("studentState");
  const courses = NareshData.get("courses");

  container.innerHTML = studentState.student.enrolledCourses.map(cId => {
    const crs = courses.find(c => c.id === cId);
    if (!crs) return "";
    const prog = studentState.student.progress[cId] || { completedLessons: [], passed: false };

    return `
      <div style="background:var(--bg-subtle); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.25rem; margin-bottom:1rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <div>
            <span class="badge badge-primary" style="margin-bottom:4px;">${crs.code}</span>
            <h4 style="font-size:1.05rem; color:var(--secondary);">${crs.title}</h4>
          </div>
          <span class="badge badge-success">Completed & Certified</span>
        </div>
        <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
          Instructor: ${crs.instructor} | Assessment Score: <strong>${prog.score || 100}%</strong>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-primary btn-sm" onclick="openCertificateModal('${crs.title}', '${prog.certificateId || 'NCH-CERT-2026-7842'}')">
            📜 View Certificate
          </button>
          <button class="btn btn-outline btn-sm" onclick="openCoursePlayer('${crs.id}')">
            Review Modules
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// ================= CONTACT FORM =================
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("contactName").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const center = document.getElementById("contactCenter").value;
  const msg = document.getElementById("contactMessage").value.trim();

  const newEnquiry = {
    id: "ENQ-" + Math.floor(100 + Math.random() * 900),
    name: name,
    phone: phone,
    email: email,
    center: center,
    subject: "Inquiry from website visitor",
    message: msg,
    status: "Pending",
    date: new Date().toISOString().replace("T", " ").substring(0, 16)
  };

  const enquiries = NareshData.get("enquiries");
  enquiries.unshift(newEnquiry);
  NareshData.set("enquiries", enquiries);

  document.getElementById("contactForm").reset();
  showToast("Your inquiry has been received. Our team will contact you shortly.", "success");
}

// ================= MODAL HELPERS =================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("active");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

function printElement(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const originalBody = document.body.innerHTML;
  const printContents = el.outerHTML;

  document.body.innerHTML = `<div id="printableArea" style="padding:2rem;">${printContents}</div>`;
  window.print();
  document.body.innerHTML = originalBody;
  // Reinitialize event listeners
  initApp();
}

// ================= TOASTS =================
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div style="font-size:1.1rem;">
      ${type === "success" ? "✓" : (type === "error" ? "⚠️" : "ℹ️")}
    </div>
    <div style="font-size:0.88rem; font-weight:500;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
