// Unified Admin Dashboard Controller for Naresh All-in-One Platform

let currentAdminRole = "super_admin";

function openAdminModal() {
  refreshAdminDashboard();
  openModal("adminModal");
}

function handleAdminRoleSwitch(role) {
  currentAdminRole = role;
  showToast(`Switched admin view to: ${role.replace("_", " ").toUpperCase()}`, "info");
  refreshAdminDashboard();
}

function refreshAdminDashboard() {
  updateDashboardCounters();
  renderAdminAppointments();
  renderAdminMembers();
  renderAdminDonations();
  renderAdminEnquiries();
}

function updateDashboardCounters() {
  const appointments = NareshData.get("appointments") || [];
  const members = NareshData.get("members") || [];
  const donations = NareshData.get("donations") || [];
  const enquiries = NareshData.get("enquiries") || [];

  const totalDonationAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const activeMembers = members.filter(m => m.status === "Approved").length;
  const pendingEnquiries = enquiries.filter(e => e.status === "Pending").length;

  // Counts in tabs
  document.getElementById("adminAptCount").innerText = appointments.length;
  document.getElementById("adminMbrCount").innerText = members.length;
  document.getElementById("adminDonCount").innerText = donations.length;
  document.getElementById("adminEnqCount").innerText = enquiries.length;

  // Stats cards
  document.getElementById("dashTotalApt").innerText = appointments.length;
  document.getElementById("dashActiveMbr").innerText = activeMembers;
  document.getElementById("dashTotalDonations").innerText = "₹" + totalDonationAmount.toLocaleString("en-IN");
  document.getElementById("dashPendingEnquiries").innerText = pendingEnquiries;
}

function switchAdminTab(tabName, btn) {
  document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const tabs = ["overview", "appointments", "members", "donations", "enquiries"];
  tabs.forEach(t => {
    const el = document.getElementById("adminTab-" + t);
    if (el) el.style.display = t === tabName ? "block" : "none";
  });
}

// ================= APPOINTMENTS ADMIN =================
function renderAdminAppointments() {
  const tbody = document.getElementById("adminAppointmentsTbody");
  if (!tbody) return;

  const filter = document.getElementById("adminAptFilter")?.value || "all";
  let appointments = NareshData.get("appointments") || [];

  if (filter !== "all") {
    appointments = appointments.filter(a => a.status === filter);
  }

  if (appointments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No appointment records matching filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = appointments.map(apt => {
    let badgeClass = "badge-secondary";
    if (apt.status === "Confirmed") badgeClass = "badge-success";
    if (apt.status === "Requested") badgeClass = "badge-warning";
    if (apt.status === "Cancelled") badgeClass = "badge-danger";

    return `
      <tr>
        <td><strong>${apt.id}</strong></td>
        <td>
          <div style="font-weight:600;">${apt.patientName}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${apt.patientPhone}</div>
          <div style="font-size:0.75rem; color:#475569;">${apt.reason}</div>
        </td>
        <td>${apt.institutionName}</td>
        <td>${apt.doctorName}</td>
        <td>
          <div>${apt.date}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${apt.slot}</div>
        </td>
        <td><span class="badge ${badgeClass}">${apt.status}</span></td>
        <td>
          <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
            ${apt.status !== 'Confirmed' ? `
              <button class="btn btn-sm btn-outline" style="color:var(--success); border-color:var(--success);" onclick="updateAppointmentStatus('${apt.id}', 'Confirmed')">Confirm</button>
            ` : ""}
            ${apt.status !== 'Completed' ? `
              <button class="btn btn-sm btn-outline" onclick="updateAppointmentStatus('${apt.id}', 'Completed')">Complete</button>
            ` : ""}
            ${apt.status !== 'Cancelled' ? `
              <button class="btn btn-sm btn-outline" style="color:var(--danger); border-color:var(--danger);" onclick="updateAppointmentStatus('${apt.id}', 'Cancelled')">Cancel</button>
            ` : ""}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function updateAppointmentStatus(aptId, newStatus) {
  const appointments = NareshData.get("appointments") || [];
  const apt = appointments.find(a => a.id === aptId);
  if (apt) {
    apt.status = newStatus;
    NareshData.set("appointments", appointments);
    refreshAdminDashboard();
    showToast(`Appointment ${aptId} status updated to: ${newStatus}`, "success");
  }
}

// ================= MEMBERS ADMIN =================
function renderAdminMembers() {
  const tbody = document.getElementById("adminMembersTbody");
  if (!tbody) return;

  const filter = document.getElementById("adminMbrFilter")?.value || "all";
  let members = NareshData.get("members") || [];

  if (filter !== "all") {
    members = members.filter(m => m.status === filter);
  }

  if (members.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No membership applications found.</td></tr>`;
    return;
  }

  tbody.innerHTML = members.map(m => {
    let badgeClass = "badge-secondary";
    if (m.status === "Approved") badgeClass = "badge-success";
    if (m.status === "New" || m.status === "Under Review") badgeClass = "badge-warning";
    if (m.status === "Rejected") badgeClass = "badge-danger";

    return `
      <tr>
        <td><strong>${m.id}</strong></td>
        <td>
          <div style="font-weight:600;">${m.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${m.gender || 'Not specified'}</div>
        </td>
        <td>
          <div>${m.phone}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${m.email}</div>
        </td>
        <td><span class="badge badge-primary">${m.category}</span></td>
        <td><strong>${m.bloodGroup || 'O+'}</strong></td>
        <td><span class="badge ${badgeClass}">${m.status}</span></td>
        <td>
          <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
            ${m.status !== 'Approved' ? `
              <button class="btn btn-sm btn-outline" style="color:var(--success); border-color:var(--success);" onclick="updateMemberStatus('${m.id}', 'Approved')">Approve</button>
            ` : `
              <button class="btn btn-sm btn-primary" onclick="viewAdminMemberIdCard('${m.id}')">🪪 ID Card</button>
            `}
            ${m.status !== 'Rejected' ? `
              <button class="btn btn-sm btn-outline" style="color:var(--danger); border-color:var(--danger);" onclick="updateMemberStatus('${m.id}', 'Rejected')">Reject</button>
            ` : ""}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function updateMemberStatus(memberId, newStatus) {
  const members = NareshData.get("members") || [];
  const m = members.find(mbr => mbr.id === memberId);
  if (m) {
    m.status = newStatus;
    if (newStatus === "Approved") {
      m.approvedDate = new Date().toISOString().split("T")[0];
      m.idCardIssued = true;
    }
    NareshData.set("members", members);
    refreshAdminDashboard();
    showToast(`Member application ${memberId} is now ${newStatus}`, "success");
  }
}

function viewAdminMemberIdCard(memberId) {
  const members = NareshData.get("members") || [];
  const m = members.find(mbr => mbr.id === memberId);
  if (!m) return;

  closeModal("adminModal");
  showSection("membership");
  updateLiveIdCardPreview(m);
  showToast(`Loaded ID card preview for: ${m.name}`, "info");
}

// ================= DONATIONS ADMIN =================
function renderAdminDonations() {
  const tbody = document.getElementById("adminDonationsTbody");
  if (!tbody) return;

  const donations = NareshData.get("donations") || [];

  if (donations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No donations recorded.</td></tr>`;
    return;
  }

  tbody.innerHTML = donations.map(d => `
    <tr>
      <td><strong>${d.receiptNo}</strong></td>
      <td>
        <div style="font-weight:600;">${d.donorName}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${d.donorPhone} | ${d.donorEmail}</div>
      </td>
      <td><strong style="color:var(--secondary); font-size:1rem;">₹${(d.amount || 0).toLocaleString("en-IN")}</strong></td>
      <td style="font-size:0.82rem;">${d.purpose}</td>
      <td>${d.paymentMode}</td>
      <td>${d.date}</td>
      <td><span class="badge badge-success">Completed (80G)</span></td>
    </tr>
  `).join("");
}

// ================= ENQUIRIES ADMIN =================
function renderAdminEnquiries() {
  const tbody = document.getElementById("adminEnquiriesTbody");
  if (!tbody) return;

  const enquiries = NareshData.get("enquiries") || [];

  if (enquiries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">No inquiries logged.</td></tr>`;
    return;
  }

  tbody.innerHTML = enquiries.map(enq => `
    <tr>
      <td><strong>${enq.id}</strong></td>
      <td>
        <div style="font-weight:600;">${enq.name}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${enq.phone} | ${enq.email}</div>
      </td>
      <td style="font-size:0.82rem;">${enq.center}</td>
      <td>
        <div style="font-weight:600; font-size:0.85rem;">${enq.subject}</div>
        <div style="font-size:0.8rem; color:#475569;">${enq.message}</div>
      </td>
      <td>
        <span class="badge ${enq.status === 'Replied' ? 'badge-success' : 'badge-warning'}">${enq.status}</span>
      </td>
      <td>
        ${enq.status !== 'Replied' ? `
          <button class="btn btn-sm btn-primary" onclick="markEnquiryReplied('${enq.id}')">Mark Replied</button>
        ` : `<span style="font-size:0.75rem; color:var(--text-muted);">Resolved</span>`}
      </td>
    </tr>
  `).join("");
}

function markEnquiryReplied(enqId) {
  const enquiries = NareshData.get("enquiries") || [];
  const enq = enquiries.find(e => e.id === enqId);
  if (enq) {
    enq.status = "Replied";
    NareshData.set("enquiries", enquiries);
    refreshAdminDashboard();
    showToast(`Inquiry ${enqId} marked as replied.`, "success");
  }
}

// ================= CSV EXPORT UTILITY =================
function exportDataCSV(dataType) {
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
  link.setAttribute("download", `naresh_platform_${dataType}_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Exported ${data.length} records to CSV.`, "success");
}

function resetDemoData() {
  if (confirm("Reset local database back to default initial records?")) {
    NareshData.resetDefaults();
    refreshAdminDashboard();
    initApp();
    showToast("Mock database restored to factory defaults.", "info");
  }
}
