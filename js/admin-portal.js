/**
 * =========================================================
 * NARESH HEALTHCARE PLATFORM - ADVANCED ADMIN PORTAL JS
 * Enterprise-grade CRUD, real-time sync with localStorage,
 * and comprehensive administrative control.
 * =========================================================
 */

let currentAdminUser = {
  name: "Dr. Arvind Naresh",
  role: "Chief Administrator",
  email: "admin@nareshhealthcare.org"
};

// Check authentication on load
document.addEventListener("DOMContentLoaded", function () {
  checkAuthStatus();
  startLiveClock();
  initAdminDashboard();
});

function checkAuthStatus() {
  const isAuth = sessionStorage.getItem("naresh_admin_logged_in");
  const loginOverlay = document.getElementById("adminLoginOverlay");
  if (!isAuth || isAuth !== "true") {
    if (loginOverlay) loginOverlay.style.display = "flex";
  } else {
    if (loginOverlay) loginOverlay.style.display = "none";
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const user = document.getElementById("adminLoginUsername").value.trim().toLowerCase();
  const pass = document.getElementById("adminLoginPassword").value.trim();

  // Retrieve custom saved credentials if changed, or use new official defaults
  const customAuth = NareshData.get("adminAuth") || {
    email: "nareshhealthcare.admin@gmail.com",
    pass: "Naresh@Admin2026"
  };

  const isValidUser = (
    user === customAuth.email.toLowerCase() ||
    user === "admin" ||
    user === "admin@nareshhealthcare.org" ||
    user === "nareshhealthcare.admin@gmail.com"
  );

  const isValidPass = (
    pass === customAuth.pass ||
    pass === "Naresh@Admin2026" ||
    pass === "Naresh@2026"
  );

  if (isValidUser && isValidPass) {
    sessionStorage.setItem("naresh_admin_logged_in", "true");
    document.getElementById("adminLoginOverlay").style.display = "none";
    showToast("Welcome back, Administrator! Login successful.", "success");
    initAdminDashboard();
  } else {
    showToast("Invalid credentials! Please enter correct Email & Password.", "error");
  }
}

function handleAdminLogout() {
  if (confirm("Are you sure you want to log out of the Admin Portal?")) {
    sessionStorage.removeItem("naresh_admin_logged_in");
    document.getElementById("adminLoginOverlay").style.display = "flex";
    showToast("You have been logged out safely.", "info");
  }
}

function startLiveClock() {
  const clockEl = document.getElementById("adminLiveClock");
  function update() {
    if (clockEl) {
      const now = new Date();
      clockEl.innerText = now.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    }
  }
  update();
  setInterval(update, 1000);
}

// ================= NAVIGATION =================
function switchPanel(panelId, btnElement) {
  // Update sidebar active buttons
  document.querySelectorAll(".nav-item-btn").forEach(btn => btn.classList.remove("active"));
  if (btnElement) {
    btnElement.classList.add("active");
  } else {
    const defaultBtn = document.querySelector(`.nav-item-btn[onclick*="${panelId}"]`);
    if (defaultBtn) defaultBtn.classList.add("active");
  }

  // Hide all panels, show target
  document.querySelectorAll(".admin-view-panel").forEach(p => p.classList.remove("active"));
  const target = document.getElementById("panel-" + panelId);
  if (target) target.classList.add("active");

  // Update Breadcrumb
  const breadcrumbEl = document.getElementById("activeBreadcrumbText");
  if (breadcrumbEl) {
    const titles = {
      overview: "Executive Dashboard",
      appointments: "Appointments & OPD Desk",
      doctors: "Doctor & Staff Directory",
      courses: "E-Learning & Certifications",
      donations: "Donations & 80G Receipts",
      members: "Membership & Volunteers",
      content: "Website Notices & Helplines",
      institutions: "Four Institutions Profile",
      franchise: "Franchise & Partner Network",
      inquiries: "Patient Inquiries & Feedback",
      settings: "Database & System Backups"
    };
    breadcrumbEl.innerText = titles[panelId] || "Dashboard";
  }

  // Refresh relevant data
  if (panelId === "overview") refreshOverviewMetrics();
  if (panelId === "appointments") renderAppointmentsAdmin();
  if (panelId === "doctors") renderDoctorsAdmin();
  if (panelId === "courses") renderCoursesAdmin();
  if (panelId === "donations") renderDonationsAdmin();
  if (panelId === "members") renderMembersAdmin();
  if (panelId === "franchise") renderFranchiseAdmin();
  if (panelId === "content") loadSiteSettingsForm();
  if (panelId === "institutions") loadInstitutionsAdmin();
  if (panelId === "inquiries") renderInquiriesAdmin();
  if (panelId === "settings") loadAdminCredentialsForm();

  // Mobile menu auto close
  const sidebar = document.getElementById("adminSidebar");
  if (sidebar && window.innerWidth <= 1024) {
    sidebar.classList.remove("open");
  }
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById("adminSidebar");
  if (sidebar) sidebar.classList.toggle("open");
}

// ================= INITIALIZE DASHBOARD =================
function initAdminDashboard() {
  refreshOverviewMetrics();
  renderAppointmentsAdmin();
  renderDoctorsAdmin();
  renderCoursesAdmin();
  renderDonationsAdmin();
  renderMembersAdmin();
  renderFranchiseAdmin();
  loadSiteSettingsForm();
  loadInstitutionsAdmin();
  renderInquiriesAdmin();
  loadAdminCredentialsForm();
}

// ================= OVERVIEW METRICS =================
function refreshOverviewMetrics() {
  const appointments = NareshData.get("appointments") || [];
  const doctors = NareshData.get("doctors") || [];
  const members = NareshData.get("members") || [];
  const donations = NareshData.get("donations") || [];
  const inquiries = NareshData.get("enquiries") || [];
  const courses = NareshData.get("courses") || [];
  const franchises = NareshData.get("franchises") || [];
  const frnApps = NareshData.get("franchiseApplications") || [];

  const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const activeMembers = members.filter(m => m.status === "Approved").length;
  const pendingInquiries = inquiries.filter(i => i.status !== "Replied").length;
  const pendingFrnApps = frnApps.filter(a => a.status === "New" || a.status === "Under Review").length;
  const confirmedApts = appointments.filter(a => a.status === "Confirmed" || a.status === "Requested").length;

  // Set card numbers
  setText("metricTotalApts", appointments.length);
  setText("metricActiveDoctors", doctors.length);
  setText("metricTotalDonations", "₹" + totalDonations.toLocaleString("en-IN"));
  setText("metricApprovedMembers", activeMembers);
  setText("metricPendingInquiries", pendingInquiries);
  setText("metricActiveCourses", courses.length);
  setText("metricFranchiseCentersOverview", franchises.length);

  // Update badge counts in sidebar
  setText("badgeAptCount", appointments.length);
  setText("badgeDocCount", doctors.length);
  setText("badgeMbrCount", members.length);
  setText("badgeDonCount", donations.length);
  setText("badgeInqCount", pendingInquiries);
  setText("badgeFrnAppCount", pendingFrnApps);

  // Render recent activity table
  renderRecentActivityTable(appointments.slice(-5).reverse());
}

function renderRecentActivityTable(recentApts) {
  const tbody = document.getElementById("recentAptsTbody");
  if (!tbody) return;

  if (recentApts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--adm-text-muted);">No recent appointments.</td></tr>`;
    return;
  }

  tbody.innerHTML = recentApts.map(apt => `
    <tr>
      <td><strong>${apt.id}</strong></td>
      <td>
        <div style="font-weight:600; color:#fff;">${apt.patientName}</div>
        <div style="font-size:0.75rem; color:var(--adm-text-secondary);">${apt.patientPhone}</div>
      </td>
      <td>${apt.institutionName}</td>
      <td>${apt.date} • <span style="font-size:0.75rem; color:var(--adm-text-muted);">${apt.slot}</span></td>
      <td>${getStatusBadge(apt.status)}</td>
    </tr>
  `).join("");
}

// ================= DOCTORS MANAGEMENT (CRUD) =================
function renderDoctorsAdmin() {
  const container = document.getElementById("adminDoctorCardsGrid");
  if (!container) return;

  const searchQuery = (document.getElementById("doctorSearchInput")?.value || "").toLowerCase();
  const clinicFilter = document.getElementById("doctorClinicFilter")?.value || "all";

  let doctors = NareshData.get("doctors") || [];

  if (clinicFilter !== "all") {
    doctors = doctors.filter(d => (d.clinics || []).includes(clinicFilter));
  }
  if (searchQuery) {
    doctors = doctors.filter(d =>
      d.name.toLowerCase().includes(searchQuery) ||
      d.specialty.toLowerCase().includes(searchQuery) ||
      d.qualifications.toLowerCase().includes(searchQuery)
    );
  }

  if (doctors.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; background:var(--adm-card); border-radius:var(--adm-radius); border:1px solid var(--adm-border); color:var(--adm-text-muted);">No doctors matching the current filter.</div>`;
    return;
  }

  container.innerHTML = doctors.map(doc => `
    <div class="doc-admin-card">
      <div>
        <div class="doc-header-row">
          <div class="doc-avatar-box">👨‍⚕️</div>
          <div>
            <h4 style="color:#fff; font-size:1.05rem;">${doc.name}</h4>
            <div style="font-size:0.8rem; color:var(--adm-primary); font-weight:500;">${doc.specialty}</div>
          </div>
        </div>
        <div style="font-size:0.8rem; color:var(--adm-text-secondary); margin-bottom:0.75rem;">
          <div>🎓 <strong>${doc.qualifications}</strong> (${doc.experience})</div>
          <div>💰 Fee: <strong>${doc.fee}</strong></div>
          <div>🗓️ Available: <strong>${(doc.availableDays || []).join(", ")}</strong></div>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:1rem;">
          ${(doc.clinics || []).map(c => `<span class="badge-chip chip-muted" style="font-size:0.68rem;">${getClinicName(c)}</span>`).join("")}
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--adm-border); padding-top:0.85rem;">
        <span class="badge-chip chip-success">● Active On Duty</span>
        <div style="display:flex; gap:0.4rem;">
          <button class="btn-adm btn-adm-outline btn-adm-sm" onclick="editDoctor('${doc.id}')">✏️ Edit</button>
          <button class="btn-adm btn-adm-danger btn-adm-sm" onclick="deleteDoctor('${doc.id}')">🗑️ Delete</button>
        </div>
      </div>
    </div>
  `).join("");
}

function openAddDoctorModal() {
  document.getElementById("doctorModalTitle").innerText = "Add New Medical Specialist";
  document.getElementById("doctorFormId").value = "";
  document.getElementById("docFormName").value = "";
  document.getElementById("docFormSpecialty").value = "";
  document.getElementById("docFormQualifications").value = "";
  document.getElementById("docFormExperience").value = "";
  document.getElementById("docFormFee").value = "₹250 (Foundation Subsidized)";
  document.getElementById("docFormDays").value = "Mon, Tue, Wed, Thu, Fri, Sat";
  document.getElementById("docFormSlots").value = "10:00 AM, 11:30 AM, 04:30 PM, 06:00 PM";
  document.getElementById("docFormBio").value = "";
  openAdmModal("doctorFormModal");
}

function editDoctor(docId) {
  const doctors = NareshData.get("doctors") || [];
  const doc = doctors.find(d => d.id === docId);
  if (!doc) return;

  document.getElementById("doctorModalTitle").innerText = "Edit Doctor: " + doc.name;
  document.getElementById("doctorFormId").value = doc.id;
  document.getElementById("docFormName").value = doc.name;
  document.getElementById("docFormSpecialty").value = doc.specialty;
  document.getElementById("docFormQualifications").value = doc.qualifications;
  document.getElementById("docFormExperience").value = doc.experience;
  document.getElementById("docFormFee").value = doc.fee;
  document.getElementById("docFormDays").value = (doc.availableDays || []).join(", ");
  document.getElementById("docFormSlots").value = (doc.slots || []).join(", ");
  document.getElementById("docFormBio").value = doc.bio || "";
  openAdmModal("doctorFormModal");
}

function saveDoctorForm(event) {
  event.preventDefault();
  const doctors = NareshData.get("doctors") || [];
  const docId = document.getElementById("doctorFormId").value;

  const docObj = {
    id: docId || "doc-" + Date.now(),
    name: document.getElementById("docFormName").value.trim(),
    title: document.getElementById("docFormSpecialty").value.trim() + " Specialist",
    specialty: document.getElementById("docFormSpecialty").value.trim(),
    qualifications: document.getElementById("docFormQualifications").value.trim(),
    experience: document.getElementById("docFormExperience").value.trim(),
    fee: document.getElementById("docFormFee").value.trim(),
    availableDays: document.getElementById("docFormDays").value.split(",").map(s => s.trim()),
    slots: document.getElementById("docFormSlots").value.split(",").map(s => s.trim()),
    clinics: Array.from(document.querySelectorAll("#docClinicCheckboxes input:checked")).map(cb => cb.value),
    bio: document.getElementById("docFormBio").value.trim(),
    rating: 4.9,
    reviewsCount: 150
  };

  if (docObj.clinics.length === 0) {
    docObj.clinics = ["foundation", "eclinic", "chc_fac"];
  }

  if (docId) {
    const idx = doctors.findIndex(d => d.id === docId);
    if (idx !== -1) doctors[idx] = { ...doctors[idx], ...docObj };
    showToast(`Updated doctor: ${docObj.name}`, "success");
  } else {
    doctors.push(docObj);
    showToast(`Added new doctor: ${docObj.name}`, "success");
  }

  NareshData.set("doctors", doctors);
  closeAdmModal("doctorFormModal");
  renderDoctorsAdmin();
  refreshOverviewMetrics();
}

function deleteDoctor(docId) {
  if (confirm("Are you sure you want to remove this doctor from active duty?")) {
    let doctors = NareshData.get("doctors") || [];
    doctors = doctors.filter(d => d.id !== docId);
    NareshData.set("doctors", doctors);
    showToast("Doctor removed successfully.", "info");
    renderDoctorsAdmin();
    refreshOverviewMetrics();
  }
}

// ================= APPOINTMENTS & OPD DESK =================
function renderAppointmentsAdmin() {
  const tbody = document.getElementById("adminAptTbody");
  if (!tbody) return;

  const statusFilter = document.getElementById("aptStatusFilter")?.value || "all";
  const clinicFilter = document.getElementById("aptClinicFilter")?.value || "all";
  const searchQuery = (document.getElementById("aptSearchInput")?.value || "").toLowerCase();

  let appointments = NareshData.get("appointments") || [];

  if (statusFilter !== "all") {
    appointments = appointments.filter(a => a.status === statusFilter);
  }
  if (clinicFilter !== "all") {
    appointments = appointments.filter(a => a.institutionId === clinicFilter);
  }
  if (searchQuery) {
    appointments = appointments.filter(a =>
      a.id.toLowerCase().includes(searchQuery) ||
      a.patientName.toLowerCase().includes(searchQuery) ||
      a.patientPhone.toLowerCase().includes(searchQuery)
    );
  }

  if (appointments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2.5rem; color:var(--adm-text-muted);">No appointments found for the selected filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = appointments.map(apt => `
    <tr>
      <td><strong>${apt.id}</strong></td>
      <td>
        <div style="font-weight:600; color:#fff;">${apt.patientName}</div>
        <div style="font-size:0.75rem; color:var(--adm-text-secondary);">${apt.patientPhone}</div>
        <div style="font-size:0.75rem; color:var(--adm-primary);">${apt.reason || 'General Consultation'}</div>
      </td>
      <td>${apt.institutionName}</td>
      <td>${apt.doctorName}</td>
      <td>
        <div>${apt.date}</div>
        <div style="font-size:0.75rem; color:var(--adm-text-muted);">${apt.slot}</div>
      </td>
      <td>${getStatusBadge(apt.status)}</td>
      <td>
        <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
          ${apt.status !== 'Confirmed' ? `
            <button class="btn-adm btn-adm-success btn-adm-sm" onclick="setAppointmentStatus('${apt.id}', 'Confirmed')">Confirm</button>
          ` : ""}
          ${apt.status !== 'Completed' ? `
            <button class="btn-adm btn-adm-primary btn-adm-sm" onclick="setAppointmentStatus('${apt.id}', 'Completed')">Complete</button>
          ` : ""}
          ${apt.status !== 'Cancelled' ? `
            <button class="btn-adm btn-adm-danger btn-adm-sm" onclick="setAppointmentStatus('${apt.id}', 'Cancelled')">Cancel</button>
          ` : ""}
          <button class="btn-adm btn-adm-outline btn-adm-sm" onclick="openWhatsAppPatient('${apt.patientPhone}', '${apt.patientName}', '${apt.id}')" title="Chat on WhatsApp">💬</button>
          <button class="btn-adm btn-adm-outline btn-adm-sm" onclick="printOpdSlip('${apt.id}')" title="Print OPD Slip">🖨️</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function setAppointmentStatus(aptId, newStatus) {
  const appointments = NareshData.get("appointments") || [];
  const apt = appointments.find(a => a.id === aptId);
  if (apt) {
    apt.status = newStatus;
    NareshData.set("appointments", appointments);
    renderAppointmentsAdmin();
    refreshOverviewMetrics();
    showToast(`Appointment ${aptId} marked as ${newStatus}`, "success");
  }
}

function openWalkinAppointmentModal() {
  const docSelect = document.getElementById("walkinDoctorSelect");
  const doctors = NareshData.get("doctors") || [];
  if (docSelect) {
    docSelect.innerHTML = doctors.map(d => `<option value="${d.name}">${d.name} (${d.specialty})</option>`).join("");
  }
  document.getElementById("walkinDate").value = new Date().toISOString().split("T")[0];
  openAdmModal("walkinAppointmentModal");
}

function saveWalkinAppointment(event) {
  event.preventDefault();
  const appointments = NareshData.get("appointments") || [];
  const newApt = {
    id: "APT-W-" + Math.floor(1000 + Math.random() * 9000),
    patientName: document.getElementById("walkinPatientName").value.trim(),
    patientPhone: document.getElementById("walkinPatientPhone").value.trim(),
    institutionId: document.getElementById("walkinClinicSelect").value,
    institutionName: getClinicName(document.getElementById("walkinClinicSelect").value),
    doctorName: document.getElementById("walkinDoctorSelect").value,
    date: document.getElementById("walkinDate").value,
    slot: document.getElementById("walkinSlot").value,
    reason: document.getElementById("walkinReason").value.trim() || "Walk-in OPD",
    status: "Confirmed",
    timestamp: new Date().toISOString()
  };

  appointments.unshift(newApt);
  NareshData.set("appointments", appointments);
  closeAdmModal("walkinAppointmentModal");
  renderAppointmentsAdmin();
  refreshOverviewMetrics();
  showToast(`Walk-in Token ${newApt.id} generated successfully!`, "success");
}

function printOpdSlip(aptId) {
  const appointments = NareshData.get("appointments") || [];
  const apt = appointments.find(a => a.id === aptId);
  if (!apt) return;

  const printArea = document.getElementById("printSlipContent");
  if (printArea) {
    printArea.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #000; max-width: 500px; margin: 0 auto; color: #000; background: #fff;">
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
          <h2 style="margin: 0; font-size: 18px;">NARESH HEALTHCARE ALL-IN-ONE PLATFORM</h2>
          <p style="margin: 3px 0; font-size: 12px;">Official Outpatient Department (OPD) Consultation Slip</p>
          <p style="margin: 0; font-size: 11px;">Helpline: +91 98765 43210 | 24/7 Rapid Care</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px;">
          <div><strong>Token ID:</strong> ${apt.id}</div>
          <div><strong>Date:</strong> ${apt.date} (${apt.slot})</div>
        </div>
        <table style="width: 100%; font-size: 13px; margin-bottom: 15px; border-collapse: collapse;">
          <tr><td style="padding: 4px 0;"><strong>Patient Name:</strong></td><td>${apt.patientName}</td></tr>
          <tr><td style="padding: 4px 0;"><strong>Phone:</strong></td><td>${apt.patientPhone}</td></tr>
          <tr><td style="padding: 4px 0;"><strong>Center:</strong></td><td>${apt.institutionName}</td></tr>
          <tr><td style="padding: 4px 0;"><strong>Doctor:</strong></td><td>${apt.doctorName}</td></tr>
          <tr><td style="padding: 4px 0;"><strong>Consultation Purpose:</strong></td><td>${apt.reason}</td></tr>
          <tr><td style="padding: 4px 0;"><strong>Current Status:</strong></td><td><strong>${apt.status}</strong></td></tr>
        </table>
        <div style="border-top: 1px dashed #000; padding-top: 25px; margin-top: 20px; display: flex; justify-content: space-between; font-size: 11px;">
          <div>Duty Medical Officer / Staff Signature</div>
          <div>Patient / Guardian Acknowledgement</div>
        </div>
      </div>
    `;
    window.print();
  }
}

function openWhatsAppPatient(phone, name, aptId) {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const msg = encodeURIComponent(`Hello ${name}, Greetings from Naresh Health Care Foundation. Your appointment token is ${aptId}. Please visit on your scheduled time.`);
  window.open(`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${msg}`, "_blank");
}

// ================= E-LEARNING COURSES =================
function renderCoursesAdmin() {
  const container = document.getElementById("adminCoursesGrid");
  if (!container) return;

  const courses = NareshData.get("courses") || [];
  container.innerHTML = courses.map(crs => `
    <div class="doc-admin-card">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span class="badge-chip chip-primary">${crs.code}</span>
          <span class="badge-chip chip-success">${crs.badge || 'Active'}</span>
        </div>
        <h4 style="color:#fff; font-size:1.05rem; margin-bottom:0.4rem;">${crs.title}</h4>
        <p style="font-size:0.8rem; color:var(--adm-text-secondary); margin-bottom:0.75rem; line-height:1.4;">
          ${crs.overview.substring(0, 110)}...
        </p>
        <div style="font-size:0.78rem; color:var(--adm-text-muted); margin-bottom:1rem;">
          <div>👨‍🏫 Instructor: <strong>${crs.instructor}</strong></div>
          <div>⏱️ Duration: <strong>${crs.duration}</strong> • 📚 <strong>${crs.lessonsCount} Modules</strong></div>
          <div>💵 Fee: <strong style="color:var(--adm-success);">${crs.fee === 0 ? 'Free Foundation Course' : '₹' + crs.fee}</strong></div>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--adm-border); padding-top:0.85rem;">
        <span style="font-size:0.75rem; color:var(--adm-text-muted);">Enrolled: 184 Students</span>
        <button class="btn-adm btn-adm-danger btn-adm-sm" onclick="deleteCourse('${crs.id}')">🗑️ Remove</button>
      </div>
    </div>
  `).join("");
}

function openAddCourseModal() {
  document.getElementById("courseFormCode").value = "HE-" + Math.floor(100 + Math.random() * 900);
  document.getElementById("courseFormTitle").value = "";
  document.getElementById("courseFormInstructor").value = "Dr. Arvind Naresh & Medical Faculty";
  document.getElementById("courseFormDuration").value = "3 Weeks (Self-Paced)";
  document.getElementById("courseFormLessons").value = "6";
  document.getElementById("courseFormFee").value = "0";
  document.getElementById("courseFormOverview").value = "";
  openAdmModal("courseFormModal");
}

function saveCourseForm(event) {
  event.preventDefault();
  const courses = NareshData.get("courses") || [];
  const newCourse = {
    id: "crs-" + Date.now(),
    code: document.getElementById("courseFormCode").value.trim(),
    title: document.getElementById("courseFormTitle").value.trim(),
    category: document.getElementById("courseFormCategory").value,
    badge: "Foundation Certified",
    instructor: document.getElementById("courseFormInstructor").value.trim(),
    duration: document.getElementById("courseFormDuration").value.trim(),
    lessonsCount: parseInt(document.getElementById("courseFormLessons").value) || 6,
    fee: parseInt(document.getElementById("courseFormFee").value) || 0,
    feeType: parseInt(document.getElementById("courseFormFee").value) === 0 ? "Free Foundation Course" : "Subsidized Fee",
    overview: document.getElementById("courseFormOverview").value.trim(),
    thumbnail: "assets/images/firstaid_training.jpg",
    syllabus: [
      { title: "Module 1: Foundational Clinical Concepts", time: "30 mins" },
      { title: "Module 2: Practical Patient Care Demonstration", time: "45 mins" },
      { title: "Module 3: Certification Exam & Assessment", time: "30 mins" }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the primary action in emergency life support?",
        options: ["Scene safety check", "Give water", "Move victim rapidly", "Wait"],
        answerIndex: 0
      }
    ]
  };

  courses.push(newCourse);
  NareshData.set("courses", courses);
  closeAdmModal("courseFormModal");
  renderCoursesAdmin();
  refreshOverviewMetrics();
  showToast(`Published new course: ${newCourse.title}`, "success");
}

function deleteCourse(courseId) {
  if (confirm("Are you sure you want to remove this course?")) {
    let courses = NareshData.get("courses") || [];
    courses = courses.filter(c => c.id !== courseId);
    NareshData.set("courses", courses);
    renderCoursesAdmin();
    refreshOverviewMetrics();
    showToast("Course removed successfully.", "info");
  }
}

// ================= DONATIONS & 80G RECEIPTS =================
function renderDonationsAdmin() {
  const tbody = document.getElementById("adminDonationsTbody");
  if (!tbody) return;

  const donations = NareshData.get("donations") || [];
  if (donations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--adm-text-muted);">No donations recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = donations.map(d => `
    <tr>
      <td><strong>${d.receiptNo}</strong></td>
      <td>
        <div style="font-weight:600; color:#fff;">${d.donorName}</div>
        <div style="font-size:0.75rem; color:var(--adm-text-secondary);">${d.donorPhone} • ${d.donorEmail}</div>
      </td>
      <td><strong style="color:var(--adm-success); font-size:1.05rem;">₹${(d.amount || 0).toLocaleString("en-IN")}</strong></td>
      <td>${d.purpose}</td>
      <td><span class="badge-chip chip-muted">${d.paymentMode}</span></td>
      <td>${d.date}</td>
      <td>
        <button class="btn-adm btn-adm-outline btn-adm-sm" onclick="print80GReceipt('${d.receiptNo}')">🖨️ 80G Receipt</button>
      </td>
    </tr>
  `).join("");
}

function openRecordDonationModal() {
  document.getElementById("donationFormReceiptNo").value = "NCH-80G-" + Math.floor(10000 + Math.random() * 90000);
  document.getElementById("donationFormDonorName").value = "";
  document.getElementById("donationFormPhone").value = "";
  document.getElementById("donationFormEmail").value = "";
  document.getElementById("donationFormAmount").value = "1000";
  document.getElementById("donationFormPan").value = "";
  openAdmModal("recordDonationModal");
}

function saveDonationForm(event) {
  event.preventDefault();
  const donations = NareshData.get("donations") || [];
  const newDonation = {
    receiptNo: document.getElementById("donationFormReceiptNo").value.trim(),
    donorName: document.getElementById("donationFormDonorName").value.trim(),
    donorPhone: document.getElementById("donationFormPhone").value.trim(),
    donorEmail: document.getElementById("donationFormEmail").value.trim(),
    amount: parseInt(document.getElementById("donationFormAmount").value) || 0,
    purpose: document.getElementById("donationFormPurpose").value,
    paymentMode: document.getElementById("donationFormMode").value,
    panNumber: document.getElementById("donationFormPan").value.trim() || "APPLIED FOR",
    date: new Date().toISOString().split("T")[0]
  };

  donations.unshift(newDonation);
  NareshData.set("donations", donations);
  closeAdmModal("recordDonationModal");
  renderDonationsAdmin();
  refreshOverviewMetrics();
  showToast(`Recorded ₹${newDonation.amount} donation from ${newDonation.donorName}!`, "success");
}

function print80GReceipt(receiptNo) {
  const donations = NareshData.get("donations") || [];
  const d = donations.find(don => don.receiptNo === receiptNo);
  if (!d) return;

  const printArea = document.getElementById("printSlipContent");
  if (printArea) {
    printArea.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 25px; border: 2px solid #000; max-width: 600px; margin: 0 auto; color: #000; background: #fff;">
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 15px;">
          <h2 style="margin: 0; font-size: 20px;">NARESH COMMUNITY HEALTH CARE & SKILL EMPOWERMENT INDIA FOUNDATION</h2>
          <p style="margin: 3px 0; font-size: 12px;">Registered Non-Profit Society | Tax Exemption Under Section 80G of Income Tax Act</p>
          <p style="margin: 0; font-size: 11px;">Headquarters: Civil Lines Road, Near Medical College, UP - 202001</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 13px;">
          <div><strong>80G Receipt No:</strong> ${d.receiptNo}</div>
          <div><strong>Date:</strong> ${d.date}</div>
        </div>
        <table style="width: 100%; font-size: 13px; margin-bottom: 20px; border-collapse: collapse;">
          <tr><td style="padding: 5px 0;"><strong>Received with thanks from:</strong></td><td><strong>${d.donorName}</strong></td></tr>
          <tr><td style="padding: 5px 0;"><strong>Donor Phone / Email:</strong></td><td>${d.donorPhone} | ${d.donorEmail}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>Donor PAN Card No:</strong></td><td>${d.panNumber || 'EXEMPT'}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>Sum of Amount:</strong></td><td><strong style="font-size:16px;">₹${(d.amount || 0).toLocaleString("en-IN")}</strong></td></tr>
          <tr><td style="padding: 5px 0;"><strong>Donation Purpose:</strong></td><td>${d.purpose}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>Payment Instrument:</strong></td><td>${d.paymentMode}</td></tr>
        </table>
        <div style="font-size: 11px; color: #555; margin-bottom: 25px;">
          <em>*This is an official computer-generated 80G charitable receipt qualifying for 50% income tax deduction under section 80G of the Indian Income Tax Act 1961.</em>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; border-top: 1px solid #000; padding-top: 25px;">
          <div>Authorized Finance Officer</div>
          <div>Managing Trustee Signature</div>
        </div>
      </div>
    `;
    window.print();
  }
}

// ================= MEMBERSHIP & VOLUNTEERS =================
function renderMembersAdmin() {
  const tbody = document.getElementById("adminMembersTbody");
  if (!tbody) return;

  const filter = document.getElementById("memberFilterStatus")?.value || "all";
  let members = NareshData.get("members") || [];

  if (filter !== "all") {
    members = members.filter(m => m.status === filter);
  }

  if (members.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--adm-text-muted);">No membership records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = members.map(m => `
    <tr>
      <td><strong>${m.id}</strong></td>
      <td>
        <div style="font-weight:600; color:#fff;">${m.name}</div>
        <div style="font-size:0.75rem; color:var(--adm-text-secondary);">${m.gender || 'Not specified'}</div>
      </td>
      <td>
        <div>${m.phone}</div>
        <div style="font-size:0.75rem; color:var(--adm-text-secondary);">${m.email}</div>
      </td>
      <td><span class="badge-chip chip-primary">${m.category}</span></td>
      <td><strong>${m.bloodGroup || 'O+'}</strong></td>
      <td>${getStatusBadge(m.status)}</td>
      <td>
        <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
          ${m.status !== 'Approved' ? `
            <button class="btn-adm btn-adm-success btn-adm-sm" onclick="setMemberStatus('${m.id}', 'Approved')">Approve</button>
          ` : `
            <button class="btn-adm btn-adm-outline btn-adm-sm" onclick="printMemberIdCard('${m.id}')">🪪 Print ID</button>
          `}
          ${m.status !== 'Rejected' ? `
            <button class="btn-adm btn-adm-danger btn-adm-sm" onclick="setMemberStatus('${m.id}', 'Rejected')">Reject</button>
          ` : ""}
        </div>
      </td>
    </tr>
  `).join("");
}

function setMemberStatus(memberId, status) {
  const members = NareshData.get("members") || [];
  const m = members.find(mbr => mbr.id === memberId);
  if (m) {
    m.status = status;
    if (status === "Approved") {
      m.approvedDate = new Date().toISOString().split("T")[0];
      m.idCardIssued = true;
    }
    NareshData.set("members", members);
    renderMembersAdmin();
    refreshOverviewMetrics();
    showToast(`Member application ${memberId} is now ${status}`, "success");
  }
}

function printMemberIdCard(memberId) {
  const members = NareshData.get("members") || [];
  const m = members.find(mbr => mbr.id === memberId);
  if (!m) return;

  const printArea = document.getElementById("printSlipContent");
  if (printArea) {
    printArea.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 3px solid #0284c7; max-width: 400px; margin: 0 auto; color: #000; background: #fff; border-radius: 12px;">
        <div style="text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-bottom: 12px;">
          <h3 style="margin: 0; font-size: 15px; color: #0284c7;">NARESH HEALTH CARE FOUNDATION</h3>
          <p style="margin: 2px 0; font-size: 11px; font-weight: bold;">OFFICIAL VOLUNTEER & MEMBER IDENTIFICATION</p>
        </div>
        <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 12px;">
          <div style="width: 70px; height: 80px; background: #e2e8f0; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; font-size: 32px;">
            👤
          </div>
          <div style="font-size: 12px; line-height: 1.4;">
            <div style="font-size: 14px; font-weight: bold;">${m.name}</div>
            <div><strong>ID:</strong> ${m.id}</div>
            <div><strong>Category:</strong> ${m.category}</div>
            <div><strong>Blood Group:</strong> <span style="color:red; font-weight:bold;">${m.bloodGroup || 'O+'}</span></div>
          </div>
        </div>
        <div style="font-size: 11px; border-top: 1px dashed #cbd5e1; padding-top: 8px; margin-top: 8px;">
          <div><strong>Phone:</strong> ${m.phone}</div>
          <div><strong>Issued:</strong> ${m.approvedDate || '18 Oct 2026'} | <strong>Valid Thru:</strong> Dec 2028</div>
        </div>
        <div style="text-align: center; margin-top: 12px; font-size: 10px; color: #64748b;">
          Authorized Foundation Credential • In Emergency Call 108 / 112
        </div>
      </div>
    `;
    window.print();
  }
}

// ================= FRANCHISE & PARTNER NETWORK =================
let currentFranchiseSubTab = "active";

function switchFranchiseSubTab(tabName) {
  currentFranchiseSubTab = tabName;
  const btnActive = document.getElementById("frnSubTabActiveBtn");
  const btnApps = document.getElementById("frnSubTabAppsBtn");
  const secActive = document.getElementById("franchiseActiveTableContainer");
  const secApps = document.getElementById("franchiseApplicationsContainer");

  if (tabName === "active") {
    if (btnActive) {
      btnActive.classList.add("btn-adm-primary");
      btnActive.classList.remove("btn-adm-outline");
    }
    if (btnApps) {
      btnApps.classList.remove("btn-adm-primary");
      btnApps.classList.add("btn-adm-outline");
    }
    if (secActive) secActive.style.display = "block";
    if (secApps) secApps.style.display = "none";
  } else {
    if (btnActive) {
      btnActive.classList.remove("btn-adm-primary");
      btnActive.classList.add("btn-adm-outline");
    }
    if (btnApps) {
      btnApps.classList.add("btn-adm-primary");
      btnApps.classList.remove("btn-adm-outline");
    }
    if (secActive) secActive.style.display = "none";
    if (secApps) secApps.style.display = "block";
  }
}

function renderFranchiseAdmin() {
  const franchises = NareshData.get("franchises") || [];
  const applications = NareshData.get("franchiseApplications") || [];

  const pendingApps = applications.filter(a => a.status === "New" || a.status === "Under Review");
  const activeCenters = franchises.filter(f => f.status === "Active");
  const uniqueDistricts = [...new Set(franchises.map(f => f.district))].length;
  const totalNetworkOPDs = franchises.reduce((sum, f) => sum + (f.monthlyConsultations || 0), 0);

  // Update stats
  setText("metricTotalFranchises", franchises.length);
  setText("metricPendingFrnApps", pendingApps.length);
  setText("metricFranchiseDistricts", uniqueDistricts || 1);
  setText("metricTotalNetworkOPDs", totalNetworkOPDs.toLocaleString("en-IN") + " /mo");

  // Update badge count
  setText("badgeFrnAppCount", pendingApps.length);

  // Render Active Centers Table
  const activeTbody = document.getElementById("adminFranchiseActiveTbody");
  if (activeTbody) {
    if (franchises.length === 0) {
      activeTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--adm-text-muted);">No franchise centers registered. Click "+ Onboard Franchise" to add.</td></tr>`;
    } else {
      activeTbody.innerHTML = franchises.map(f => `
        <tr>
          <td><strong style="color:var(--adm-primary);">${f.id}</strong></td>
          <td>
            <div style="font-weight:600; color:#fff;">${f.centerName}</div>
            <div style="font-size:0.75rem; color:var(--adm-text-secondary);">Partner: <strong>${f.partnerName}</strong> • ${f.phone}</div>
          </td>
          <td>
            <div>${f.city}, ${f.district}</div>
            <div style="font-size:0.75rem; color:var(--adm-text-muted);">${f.address}</div>
          </td>
          <td><span class="badge-chip chip-primary">${f.model}</span></td>
          <td>
            <code style="font-size:0.75rem; background:rgba(0,0,0,0.3); padding:0.2rem 0.4rem; border-radius:4px; color:#38bdf8;">${f.licenseKey}</code>
          </td>
          <td>${getStatusBadge(f.status)}</td>
          <td>
            <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
              <button class="btn-adm btn-adm-outline btn-adm-sm" onclick="printFranchiseCertificate('${f.id}')" title="Print Authorization Certificate">📜 Certificate</button>
              <button class="btn-adm btn-adm-outline btn-adm-sm" onclick="openEditFranchiseModal('${f.id}')" title="Edit Center">✏️ Edit</button>
              <button class="btn-adm btn-adm-sm ${f.status === 'Active' ? 'btn-adm-outline' : 'btn-adm-success'}" onclick="toggleFranchiseStatus('${f.id}')">
                ${f.status === 'Active' ? '⏸️ Suspend' : '▶️ Activate'}
              </button>
              <button class="btn-adm btn-adm-outline btn-adm-sm" onclick="openWhatsAppPartner('${f.phone}', '${f.partnerName}', '${f.id}')">💬</button>
            </div>
          </td>
        </tr>
      `).join("");
    }
  }

  // Render Applications Table
  const appsTbody = document.getElementById("adminFranchiseAppsTbody");
  if (appsTbody) {
    if (applications.length === 0) {
      appsTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--adm-text-muted);">No franchise applications received yet.</td></tr>`;
    } else {
      appsTbody.innerHTML = applications.map(app => `
        <tr>
          <td><strong style="color:var(--adm-primary);">${app.id}</strong></td>
          <td>
            <div style="font-weight:600; color:#fff;">${app.applicantName}</div>
            <div style="font-size:0.75rem; color:var(--adm-text-secondary);">${app.phone} • ${app.email}</div>
          </td>
          <td>
            <div>${app.city}, ${app.district || ''}</div>
            <div style="font-size:0.75rem; color:var(--adm-text-muted);">${app.propertyType}</div>
          </td>
          <td>
            <div><strong>${app.preferredModel}</strong></div>
            <div style="font-size:0.75rem; color:var(--adm-success);">Budget: ${app.budget}</div>
          </td>
          <td>${getStatusBadge(app.status)}</td>
          <td>
            <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
              ${app.status !== 'Approved' ? `
                <button class="btn-adm btn-adm-success btn-adm-sm" onclick="approveFranchiseApplication('${app.id}')">✅ Grant Franchise</button>
              ` : `
                <span class="badge-chip chip-success">✓ Granted</span>
              `}
              ${app.status !== 'Rejected' && app.status !== 'Approved' ? `
                <button class="btn-adm btn-adm-danger btn-adm-sm" onclick="rejectFranchiseApplication('${app.id}')">❌ Reject</button>
              ` : ""}
              <button class="btn-adm btn-adm-outline btn-adm-sm" onclick="openWhatsAppPartner('${app.phone}', '${app.applicantName}', '${app.id}')">💬 WhatsApp</button>
            </div>
          </td>
        </tr>
      `).join("");
    }
  }
}

function approveFranchiseApplication(appId) {
  const applications = NareshData.get("franchiseApplications") || [];
  const franchises = NareshData.get("franchises") || [];

  const app = applications.find(a => a.id === appId);
  if (!app) return;

  const nextId = "FRN-" + (100 + franchises.length + 1);
  const cityCode = (app.city.substring(0, 2) || "UP").toUpperCase();
  const licenseKey = `NCH-FRN-2026-${cityCode}-${Math.floor(100 + Math.random() * 900)}`;

  const newFranchise = {
    id: nextId,
    centerName: `Naresh ${app.preferredModel} (${app.city})`,
    partnerName: app.applicantName,
    phone: app.phone,
    email: app.email,
    city: app.city,
    district: app.district || app.city,
    state: app.state || "Uttar Pradesh",
    address: `${app.city} Center, ${app.propertyType}`,
    model: app.preferredModel,
    status: "Active",
    allocatedDate: new Date().toISOString().split("T")[0],
    monthlyConsultations: 0,
    licenseKey: licenseKey
  };

  app.status = "Approved";
  franchises.unshift(newFranchise);

  NareshData.set("franchiseApplications", applications);
  NareshData.set("franchises", franchises);

  renderFranchiseAdmin();
  refreshOverviewMetrics();

  showToast(`Approved! New Franchise awarded to ${app.applicantName} with Code: ${nextId}`, "success");
  alert(`🎉 Franchise Awarded Successfully!\n\nCenter Code: ${nextId}\nLicense Key: ${licenseKey}\nPartner: ${app.applicantName}\nCity: ${app.city}\n\nThe center is now active in your network and visible on the website!`);
}

function rejectFranchiseApplication(appId) {
  if (confirm("Reject this franchise application?")) {
    const applications = NareshData.get("franchiseApplications") || [];
    const app = applications.find(a => a.id === appId);
    if (app) {
      app.status = "Rejected";
      NareshData.set("franchiseApplications", applications);
      renderFranchiseAdmin();
      refreshOverviewMetrics();
      showToast(`Application ${appId} rejected.`, "info");
    }
  }
}

function openOnboardFranchiseModal() {
  document.getElementById("onboardCenterName").value = "";
  document.getElementById("onboardPartnerName").value = "";
  document.getElementById("onboardPhone").value = "";
  document.getElementById("onboardEmail").value = "";
  document.getElementById("onboardCity").value = "";
  document.getElementById("onboardDistrict").value = "";
  document.getElementById("onboardAddress").value = "";
  openAdmModal("onboardFranchiseModal");
}

function saveOnboardFranchiseForm(event) {
  event.preventDefault();
  const franchises = NareshData.get("franchises") || [];
  const city = document.getElementById("onboardCity").value.trim();
  const nextId = "FRN-" + (100 + franchises.length + 1);
  const cityCode = (city.substring(0, 2) || "UP").toUpperCase();
  const licenseKey = `NCH-FRN-2026-${cityCode}-${Math.floor(100 + Math.random() * 900)}`;

  const newFranchise = {
    id: nextId,
    centerName: document.getElementById("onboardCenterName").value.trim(),
    partnerName: document.getElementById("onboardPartnerName").value.trim(),
    phone: document.getElementById("onboardPhone").value.trim(),
    email: document.getElementById("onboardEmail").value.trim(),
    city: city,
    district: document.getElementById("onboardDistrict").value.trim() || city,
    state: document.getElementById("onboardState").value.trim() || "Uttar Pradesh",
    address: document.getElementById("onboardAddress").value.trim(),
    model: document.getElementById("onboardModel").value,
    status: "Active",
    allocatedDate: new Date().toISOString().split("T")[0],
    monthlyConsultations: 0,
    licenseKey: licenseKey
  };

  franchises.unshift(newFranchise);
  NareshData.set("franchises", franchises);

  closeAdmModal("onboardFranchiseModal");
  renderFranchiseAdmin();
  refreshOverviewMetrics();

  showToast(`Onboarded new franchise: ${newFranchise.centerName} (${nextId})`, "success");
}

function openEditFranchiseModal(frnId) {
  const franchises = NareshData.get("franchises") || [];
  const f = franchises.find(fr => fr.id === frnId);
  if (!f) return;

  document.getElementById("editFrnId").value = f.id;
  document.getElementById("editFrnCenterName").value = f.centerName;
  document.getElementById("editFrnPartnerName").value = f.partnerName;
  document.getElementById("editFrnPhone").value = f.phone;
  document.getElementById("editFrnEmail").value = f.email;
  document.getElementById("editFrnCity").value = f.city;
  document.getElementById("editFrnAddress").value = f.address;
  document.getElementById("editFrnStatus").value = f.status;

  openAdmModal("editFranchiseModal");
}

function saveEditFranchiseForm(event) {
  event.preventDefault();
  const franchises = NareshData.get("franchises") || [];
  const frnId = document.getElementById("editFrnId").value;
  const f = franchises.find(fr => fr.id === frnId);

  if (f) {
    f.centerName = document.getElementById("editFrnCenterName").value.trim();
    f.partnerName = document.getElementById("editFrnPartnerName").value.trim();
    f.phone = document.getElementById("editFrnPhone").value.trim();
    f.email = document.getElementById("editFrnEmail").value.trim();
    f.city = document.getElementById("editFrnCity").value.trim();
    f.address = document.getElementById("editFrnAddress").value.trim();
    f.status = document.getElementById("editFrnStatus").value;

    NareshData.set("franchises", franchises);
    closeAdmModal("editFranchiseModal");
    renderFranchiseAdmin();
    showToast(`Updated Franchise Center: ${f.centerName}`, "success");
  }
}

function toggleFranchiseStatus(frnId) {
  const franchises = NareshData.get("franchises") || [];
  const f = franchises.find(fr => fr.id === frnId);
  if (f) {
    f.status = f.status === "Active" ? "Suspended" : "Active";
    NareshData.set("franchises", franchises);
    renderFranchiseAdmin();
    showToast(`Franchise ${frnId} status changed to ${f.status}`, "info");
  }
}

function openWhatsAppPartner(phone, name, id) {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const msg = encodeURIComponent(`Greetings ${name}, this is from Naresh Health Care Foundation Operations regarding your Franchise / Center ${id}.`);
  window.open(`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${msg}`, "_blank");
}

function printFranchiseCertificate(frnId) {
  const franchises = NareshData.get("franchises") || [];
  const f = franchises.find(fr => fr.id === frnId);
  if (!f) return;

  const printArea = document.getElementById("printSlipContent");
  if (printArea) {
    printArea.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 35px; border: 8px double #0284c7; max-width: 720px; margin: 0 auto; color: #000; background: #fff; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 15px; margin-bottom: 20px;">
          <div style="font-size: 36px; margin-bottom: 5px;">🏥</div>
          <h1 style="margin: 0; font-size: 22px; color: #0284c7; text-transform: uppercase;">NARESH COMMUNITY HEALTH CARE & SKILL EMPOWERMENT INDIA FOUNDATION</h1>
          <p style="margin: 4px 0; font-size: 13px; font-weight: bold; color: #334155;">CENTRAL HEALTHCARE ALLIANCE & PARTNERSHIP DIVISION</p>
          <p style="margin: 0; font-size: 11px; color: #64748b;">Registered Non-Profit Health Trust | Section 80G Certified | PAN & CSR Compliant</p>
        </div>

        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="font-size: 20px; color: #0f172a; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px;">CERTIFICATE OF FRANCHISE AUTHORIZATION</h2>
          <div style="font-size: 13px; color: #475569;">License Reference No: <strong>${f.licenseKey}</strong> | Center Code: <strong>${f.id}</strong></div>
        </div>

        <p style="font-size: 14px; line-height: 1.8; text-align: justify; margin-bottom: 20px;">
          This is to formally certify that <strong>${f.partnerName}</strong> is hereby granted the official authorization to establish and operate an authorized <strong>${f.model}</strong> under the brand stewardship and clinical protocol of Naresh Health Care Foundation.
        </p>

        <table style="width: 100%; font-size: 13px; margin-bottom: 25px; border-collapse: collapse; background: #f8fafc; border: 1px solid #cbd5e1;">
          <tr><td style="padding: 8px 12px; border: 1px solid #cbd5e1; width: 35%;"><strong>Center Name:</strong></td><td style="padding: 8px 12px; border: 1px solid #cbd5e1;"><strong>${f.centerName}</strong></td></tr>
          <tr><td style="padding: 8px 12px; border: 1px solid #cbd5e1;"><strong>Franchise Operator:</strong></td><td style="padding: 8px 12px; border: 1px solid #cbd5e1;">${f.partnerName} (${f.phone})</td></tr>
          <tr><td style="padding: 8px 12px; border: 1px solid #cbd5e1;"><strong>Location & Address:</strong></td><td style="padding: 8px 12px; border: 1px solid #cbd5e1;">${f.address}, ${f.city}, District ${f.district}, ${f.state}</td></tr>
          <tr><td style="padding: 8px 12px; border: 1px solid #cbd5e1;"><strong>Operating Model:</strong></td><td style="padding: 8px 12px; border: 1px solid #cbd5e1;">${f.model}</td></tr>
          <tr><td style="padding: 8px 12px; border: 1px solid #cbd5e1;"><strong>Authorization Date:</strong></td><td style="padding: 8px 12px; border: 1px solid #cbd5e1;">${f.allocatedDate} (Valid through March 2028)</td></tr>
        </table>

        <div style="font-size: 11px; color: #475569; line-height: 1.5; margin-bottom: 30px;">
          <em>*This authorization entitles the franchise to operate tele-consultation stations, first-aid posts, receive medical camp support, and utilize Naresh Foundation branding in accordance with the National Healthcare Partnership Code.</em>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #94a3b8; padding-top: 30px; margin-top: 30px;">
          <div style="text-align: center;">
            <div style="font-size: 18px; margin-bottom: 4px;">🛡️</div>
            <div style="font-size: 11px; font-weight: bold;">Official Foundation Seal</div>
            <div style="font-size: 10px; color: #64748b;">Verified & Encrypted</div>
          </div>
          <div style="text-align: center;">
            <div style="font-family: cursive; font-size: 18px; color: #0284c7; margin-bottom: 4px;">Dr. Arvind Naresh</div>
            <div style="font-size: 12px; font-weight: bold; border-top: 1px solid #000; padding-top: 3px;">Chief Medical Director</div>
            <div style="font-size: 10px; color: #64748b;">Naresh Healthcare Foundation</div>
          </div>
          <div style="text-align: center;">
            <div style="font-family: cursive; font-size: 18px; color: #0f766e; margin-bottom: 4px;">Executive Registrar</div>
            <div style="font-size: 12px; font-weight: bold; border-top: 1px solid #000; padding-top: 3px;">Zonal Operations Head</div>
            <div style="font-size: 10px; color: #64748b;">Partnership & Network Wing</div>
          </div>
        </div>
      </div>
    `;
    window.print();
  }
}

function exportFranchiseCSV() {
  exportCSV("franchises");
}

// ================= SITE SETTINGS & BROADCAST =================
function loadSiteSettingsForm() {
  const settings = NareshData.get("siteSettings") || {};
  const noticeInput = document.getElementById("settingEmergencyNotice");
  const phoneInput = document.getElementById("settingHelplinePhone");
  const waInput = document.getElementById("settingWhatsappNumber");
  const addrInput = document.getElementById("settingHqAddress");

  if (noticeInput) noticeInput.value = settings.emergencyNotice || "";
  if (phoneInput) phoneInput.value = settings.helplinePhone || "+91 98765 43210";
  if (waInput) waInput.value = settings.whatsappNumber || "+91 98765 43210";
  if (addrInput) addrInput.value = settings.headquartersAddress || "";

  renderAnnouncementsAdmin(settings.announcements || []);
}

function saveSiteSettingsForm(event) {
  event.preventDefault();
  const settings = NareshData.get("siteSettings") || {};
  settings.emergencyNotice = document.getElementById("settingEmergencyNotice").value.trim();
  settings.helplinePhone = document.getElementById("settingHelplinePhone").value.trim();
  settings.whatsappNumber = document.getElementById("settingWhatsappNumber").value.trim();
  settings.headquartersAddress = document.getElementById("settingHqAddress").value.trim();

  NareshData.set("siteSettings", settings);
  showToast("Website Settings & Emergency Notice updated live!", "success");
}

function renderAnnouncementsAdmin(announcements) {
  const container = document.getElementById("announcementsListAdmin");
  if (!container) return;

  container.innerHTML = announcements.map(a => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem 1rem; background:var(--adm-bg); border-radius:var(--adm-radius-sm); border:1px solid var(--adm-border); margin-bottom:0.5rem;">
      <div>
        <strong style="color:#fff;">${a.title}</strong>
        <div style="font-size:0.75rem; color:var(--adm-text-secondary);">${a.date} • ${a.location}</div>
      </div>
      <span class="badge-chip chip-success">${a.status}</span>
    </div>
  `).join("");
}

function broadcastNewCamp(event) {
  event.preventDefault();
  const settings = NareshData.get("siteSettings") || {};
  if (!settings.announcements) settings.announcements = [];

  const newCamp = {
    id: "anc-" + Date.now(),
    title: document.getElementById("campTitle").value.trim(),
    date: document.getElementById("campDate").value.trim(),
    location: document.getElementById("campLocation").value.trim(),
    status: "Upcoming"
  };

  settings.announcements.unshift(newCamp);
  NareshData.set("siteSettings", settings);
  loadSiteSettingsForm();
  document.getElementById("campTitle").value = "";
  document.getElementById("campDate").value = "";
  document.getElementById("campLocation").value = "";
  showToast(`Broadcasted new Medical Camp: ${newCamp.title}`, "success");
}

// ================= INSTITUTIONS MANAGEMENT =================
function loadInstitutionsAdmin() {
  const container = document.getElementById("institutionsAdminList");
  if (!container) return;

  const institutions = NareshData.get("institutions") || [];
  container.innerHTML = institutions.map(inst => `
    <div class="data-panel-card" style="margin-bottom:1.5rem;">
      <div class="panel-card-header">
        <div>
          <h3 class="panel-card-title">${inst.name}</h3>
          <span style="font-size:0.78rem; color:var(--adm-primary);">${inst.badge} • Code: ${inst.code}</span>
        </div>
      </div>
      <div style="padding:1.5rem;">
        <div class="form-grid-2">
          <div class="form-group-adm">
            <label>Helpline Phone</label>
            <input type="text" class="form-input-adm" id="inst_phone_${inst.id}" value="${inst.phone}">
          </div>
          <div class="form-group-adm">
            <label>Official Email</label>
            <input type="text" class="form-input-adm" id="inst_email_${inst.id}" value="${inst.email}">
          </div>
        </div>
        <div class="form-group-adm">
          <label>Facility Address</label>
          <input type="text" class="form-input-adm" id="inst_addr_${inst.id}" value="${inst.address}">
        </div>
        <div class="form-group-adm">
          <label>Timings / Operating Schedule</label>
          <input type="text" class="form-input-adm" id="inst_timings_${inst.id}" value="${inst.timings || '08:00 AM – 08:00 PM'}">
        </div>
        <button class="btn-adm btn-adm-primary btn-adm-sm" onclick="saveInstitutionDetails('${inst.id}')">💾 Save Updates for ${inst.shortName}</button>
      </div>
    </div>
  `).join("");
}

function saveInstitutionDetails(instId) {
  const institutions = NareshData.get("institutions") || [];
  const inst = institutions.find(i => i.id === instId);
  if (inst) {
    inst.phone = document.getElementById(`inst_phone_${instId}`).value.trim();
    inst.email = document.getElementById(`inst_email_${instId}`).value.trim();
    inst.address = document.getElementById(`inst_addr_${instId}`).value.trim();
    inst.timings = document.getElementById(`inst_timings_${instId}`).value.trim();

    NareshData.set("institutions", institutions);
    showToast(`Saved updates for ${inst.shortName}!`, "success");
  }
}

// ================= INQUIRIES & TICKETS =================
function renderInquiriesAdmin() {
  const tbody = document.getElementById("adminInquiriesTbody");
  if (!tbody) return;

  const inquiries = NareshData.get("enquiries") || [];
  if (inquiries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--adm-text-muted);">No inquiries logged.</td></tr>`;
    return;
  }

  tbody.innerHTML = inquiries.map(enq => `
    <tr>
      <td><strong>${enq.id}</strong></td>
      <td>
        <div style="font-weight:600; color:#fff;">${enq.name}</div>
        <div style="font-size:0.75rem; color:var(--adm-text-secondary);">${enq.phone} • ${enq.email}</div>
      </td>
      <td>${enq.center}</td>
      <td>
        <div style="font-weight:600; font-size:0.85rem; color:#fff;">${enq.subject}</div>
        <div style="font-size:0.78rem; color:var(--adm-text-secondary);">${enq.message}</div>
      </td>
      <td>${getStatusBadge(enq.status)}</td>
      <td>
        <div style="display:flex; gap:0.35rem;">
          ${enq.status !== 'Replied' ? `
            <button class="btn-adm btn-adm-success btn-adm-sm" onclick="markInquiryResolved('${enq.id}')">Mark Replied</button>
          ` : ""}
          <button class="btn-adm btn-adm-outline btn-adm-sm" onclick="openWhatsAppInquiry('${enq.phone}', '${enq.name}')">💬 WhatsApp</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function markInquiryResolved(id) {
  const inquiries = NareshData.get("enquiries") || [];
  const enq = inquiries.find(e => e.id === id);
  if (enq) {
    enq.status = "Replied";
    NareshData.set("enquiries", inquiries);
    renderInquiriesAdmin();
    refreshOverviewMetrics();
    showToast(`Inquiry ${id} marked as replied.`, "success");
  }
}

function openWhatsAppInquiry(phone, name) {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const msg = encodeURIComponent(`Hello ${name}, thank you for reaching out to Naresh Health Care Foundation. We are contacting you regarding your inquiry.`);
  window.open(`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${msg}`, "_blank");
}

// ================= ADMIN CREDENTIALS SETTINGS =================
function loadAdminCredentialsForm() {
  const auth = NareshData.get("adminAuth") || {
    email: "nareshhealthcare.admin@gmail.com",
    pass: "Naresh@Admin2026"
  };
  const emailInput = document.getElementById("changeAdminEmail");
  const passInput = document.getElementById("changeAdminPassword");
  if (emailInput) emailInput.value = auth.email;
  if (passInput) passInput.value = auth.pass;
}

function saveCustomAdminCredentials(event) {
  event.preventDefault();
  const newEmail = document.getElementById("changeAdminEmail").value.trim();
  const newPass = document.getElementById("changeAdminPassword").value.trim();

  if (!newEmail || !newPass) {
    showToast("Please provide both email and password.", "error");
    return;
  }

  NareshData.set("adminAuth", {
    email: newEmail,
    pass: newPass
  });

  showToast(`Admin login credentials updated! Email: ${newEmail}`, "success");
}

// ================= BACKUP & RESTORE =================
function exportFullBackupJSON() {
  const fullBackup = {
    institutions: NareshData.get("institutions"),
    doctors: NareshData.get("doctors"),
    courses: NareshData.get("courses"),
    appointments: NareshData.get("appointments"),
    members: NareshData.get("members"),
    donations: NareshData.get("donations"),
    enquiries: NareshData.get("enquiries"),
    siteSettings: NareshData.get("siteSettings"),
    exportedAt: new Date().toISOString()
  };

  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", jsonStr);
  dlAnchor.setAttribute("download", `naresh_healthcare_backup_${new Date().toISOString().split("T")[0]}.json`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();

  showToast("Full Database JSON backup downloaded successfully!", "success");
}

function handleBackupImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (confirm("Restore database from this backup? Current data will be replaced.")) {
        Object.keys(data).forEach(k => {
          if (k !== "exportedAt") {
            NareshData.set(k, data[k]);
          }
        });
        showToast("Database restored successfully!", "success");
        setTimeout(() => location.reload(), 1000);
      }
    } catch (err) {
      showToast("Invalid JSON backup file.", "error");
    }
  };
  reader.readAsText(file);
}

function resetSystemData() {
  if (confirm("Reset local database to factory default demo records? All changes will be reinitialized.")) {
    NareshData.resetDefaults();
    showToast("System database restored to default records.", "info");
    setTimeout(() => location.reload(), 800);
  }
}

// ================= CSV EXPORT =================
function exportCSV(dataType) {
  const data = NareshData.get(dataType) || [];
  if (data.length === 0) {
    showToast(`No ${dataType} data to export.`, "warning");
    return;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map(item =>
    headers.map(field => {
      let val = item[field];
      if (typeof val === "object" && val !== null) {
        val = JSON.stringify(val).replace(/"/g, '""');
      } else {
        val = String(val).replace(/"/g, '""');
      }
      return `"${val}"`;
    }).join(",")
  );

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `naresh_${dataType}_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Exported ${data.length} records to CSV.`, "success");
}

// ================= MODAL UTILITIES =================
function openAdmModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "flex";
}

function closeAdmModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "none";
}

// ================= HELPER UTILITIES =================
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

function getClinicName(id) {
  const map = {
    foundation: "Naresh Foundation",
    eclinic: "X-Press e-Clinic",
    chc_fac: "Community Health Center",
    fac: "First Aid Center"
  };
  return map[id] || id;
}

function getStatusBadge(status) {
  if (status === "Confirmed" || status === "Approved" || status === "Completed" || status === "Replied") {
    return `<span class="badge-chip chip-success">● ${status}</span>`;
  }
  if (status === "Requested" || status === "New" || status === "Under Review" || status === "Pending") {
    return `<span class="badge-chip chip-warning">● ${status}</span>`;
  }
  if (status === "Cancelled" || status === "Rejected") {
    return `<span class="badge-chip chip-danger">● ${status}</span>`;
  }
  return `<span class="badge-chip chip-muted">${status}</span>`;
}

function showToast(message, type = "info") {
  const container = document.getElementById("adminToastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `adm-toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
    <div>${message}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
