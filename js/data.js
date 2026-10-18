// Initial mock database for Naresh All-in-One Platform
// Stored and synchronized with window.localStorage

const DEFAULT_DATA = {
  institutions: [
    {
      id: "foundation",
      code: "NCHSEIF",
      name: "Naresh Community Health Care & Skill Empowerment India Foundation",
      shortName: "Naresh Foundation",
      badge: "Non-Profit Organization",
      tagline: "Empowering communities through accessible healthcare, life-saving training, and vocational skills.",
      description: "Established to bridge healthcare inequalities and uplift youth through community wellness programs, free health camps, and skill empowerment initiatives across rural and semi-urban India.",
      address: "Foundation Headquarters, Civil Lines Road, Near Medical College, Uttar Pradesh - 202001",
      phone: "+91 98765 43210",
      email: "foundation@nareshhealthcare.org",
      highlights: [
        "Over 15,000+ rural lives touched through free health camps",
        "Empowered 1,200+ rural youth with certified first aid & nursing assistant skills",
        "Registered Non-Profit Foundation under Indian Trust & Societies Act",
        "Active disaster relief and community medical outreach teams"
      ],
      initiatives: [
        {
          title: "Arogya Gramin Swasthya Mission",
          desc: "Monthly free medical checkup camps, free diagnostic screening, and basic medicine distribution in remote villages.",
          beneficiaries: "8,500+ Villagers",
          status: "Ongoing"
        },
        {
          title: "Sanjeevani Skill Empowerment",
          desc: "Vocational certified courses for youth in First Aid, Geriatric Care, and Basic Patient Care Assistance to boost rural livelihoods.",
          beneficiaries: "1,200+ Students Trained",
          status: "Active"
        },
        {
          title: "Suraksha Kavach First Aid Drive",
          desc: "Equipping schools, panchayats, and transport hubs with emergency first aid kits and training citizen responders.",
          beneficiaries: "350+ Centers Equipped",
          status: "Phase 3"
        }
      ]
    },
    {
      id: "eclinic",
      code: "NXPEC",
      name: "Naresh X-Press e-Clinic",
      shortName: "X-Press e-Clinic",
      badge: "Smart Digital Clinic",
      tagline: "Rapid digital consultations, smart diagnostics, and specialist doctor appointments at your doorstep.",
      description: "A hybrid digital healthcare clinic combining connected digital diagnostic stations, quick doctor consultations, and paperless prescription management for faster clinical attention.",
      address: "Shop No. 12-14, Ground Floor, Vikas Complex, Station Road, UP - 202001",
      phone: "+91 98765 43211",
      email: "eclinic@nareshhealthcare.org",
      timings: "Monday – Saturday: 08:30 AM – 08:00 PM | Sunday: 09:00 AM – 02:00 PM",
      services: [
        "Instant Digital Vitals Check (ECG, SPO2, Blood Pressure, Blood Sugar in 5 mins)",
        "Tele-Specialist OPD Consultations with Senior Physicians",
        "Same-Day Digital Lab Reports & Health Monitoring",
        "Chronic Disease Monitoring (Diabetes, Hypertension, Thyroid)"
      ]
    },
    {
      id: "chc_fac",
      code: "NCHCFAC",
      name: "Naresh Community Health Care Center & First Aid Center",
      shortName: "Community Health Center",
      badge: "Primary Health & First Aid",
      tagline: "Accessible primary care, outpatient services, maternal wellness, and prompt first-aid intervention.",
      description: "Our comprehensive physical health center delivering primary care OPD, maternal and child healthcare, minor surgical dressings, immunizations, and community wellness advisory.",
      address: "Plot 45, Bye-Pass Circle, Shanti Nagar, District Health Zone, UP - 202002",
      phone: "+91 98765 43212",
      email: "chc@nareshhealthcare.org",
      timings: "Open 7 Days: 08:00 AM – 09:00 PM | First Aid: 24/7 On-Call",
      services: [
        "General Medicine & Family Health OPD",
        "Minor Wound Dressing, Suturing & Burn Management",
        "Vaccination & Child Immunization Guidance",
        "Antenatal Care & Nutritional Health Consultations",
        "Nebulization, IV Fluids & Observation Beds"
      ]
    },
    {
      id: "fac",
      code: "NFAC",
      name: "Naresh First Aid Center",
      shortName: "First Aid Center",
      badge: "Trauma & Rapid Care",
      tagline: "Dedicated rapid emergency response, wound care, hemorrhage control, and first-aid education.",
      description: "A dedicated point-of-care facility focused exclusively on urgent first aid, industrial safety treatment, sports injuries, acute wound stabilization, and life-support community workshops.",
      address: "Main Highway Hub, Near Toll Plaza, Industrial Area Corridor, UP - 202003",
      phone: "+91 98765 43213",
      email: "firstaid@nareshhealthcare.org",
      timings: "24 Hours First Aid Attendant on site | Emergency Helplines Active",
      services: [
        "Accidental Injury & Fracture Stabilization",
        "Bleeding / Hemorrhage Immediate Control & Sterilization",
        "Burn & Chemical Splash First-Line Relief",
        "CPR & Automated External Defibrillator (AED) Ready Post",
        "Community First Aid Kit Distribution & Refill Support"
      ]
    }
  ],

  doctors: [
    {
      id: "doc-1",
      name: "Dr. Arvind Naresh",
      title: "Chief Medical Director & Senior Physician",
      qualifications: "MBBS, MD (General Medicine), FCGP",
      experience: "22+ Years",
      specialty: "General Medicine & Lifestyle Diseases",
      clinics: ["foundation", "eclinic", "chc_fac"],
      languages: ["Hindi", "English"],
      rating: 4.9,
      reviewsCount: 312,
      fee: "₹250 (Foundation Subsidized)",
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      slots: ["09:30 AM", "10:30 AM", "11:30 AM", "05:00 PM", "06:30 PM"],
      bio: "Dr. Arvind Naresh has over two decades of dedicated medical service in community healthcare, specializing in internal medicine, hypertension, and rural epidemics management."
    },
    {
      id: "doc-2",
      name: "Dr. Meera Sharma",
      title: "Consultant Gynecologist & Women's Health Specialist",
      qualifications: "MBBS, MS (Obstetrics & Gynecology), DGO",
      experience: "14+ Years",
      specialty: "Women Health & Maternal Wellness",
      clinics: ["chc_fac", "eclinic"],
      languages: ["Hindi", "English"],
      rating: 4.8,
      reviewsCount: 245,
      fee: "₹300",
      availableDays: ["Mon", "Wed", "Fri", "Sat"],
      slots: ["10:00 AM", "11:00 AM", "12:00 PM", "04:00 PM"],
      bio: "Specialist in maternal-fetal health, adolescent counseling, antenatal care, and preventive health screenings for women in semi-urban communities."
    },
    {
      id: "doc-3",
      name: "Dr. Rajesh Verma",
      title: "Senior Emergency Care & Trauma Surgeon",
      qualifications: "MBBS, MS (General Surgery), Trauma Life Support Cert.",
      experience: "16+ Years",
      specialty: "Trauma, Wound Care & Minor Surgery",
      clinics: ["fac", "chc_fac"],
      languages: ["Hindi", "English"],
      rating: 4.9,
      reviewsCount: 198,
      fee: "₹350",
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      slots: ["09:00 AM", "11:00 AM", "03:00 PM", "05:30 PM"],
      bio: "Veteran emergency physician with extensive experience in stabilization of trauma patients, suturing, burn wound debridement, and occupational safety injuries."
    },
    {
      id: "doc-4",
      name: "Dr. Sunita Saxena",
      title: "Consultant Pediatrician & Child Health Specialist",
      qualifications: "MBBS, DCH (Pediatrics)",
      experience: "11+ Years",
      specialty: "Pediatrics & Child Immunization",
      clinics: ["eclinic", "chc_fac"],
      languages: ["Hindi", "English"],
      rating: 4.7,
      reviewsCount: 167,
      fee: "₹250",
      availableDays: ["Tue", "Thu", "Sat"],
      slots: ["10:30 AM", "12:00 PM", "04:30 PM", "06:00 PM"],
      bio: "Dedicated child healthcare expert focusing on growth tracking, neonatal care, seasonal infections, and government immunization schedules."
    },
    {
      id: "doc-5",
      name: "Dr. Vikramaditya Singh",
      title: "Consultant Orthopedist & Joint Care Specialist",
      qualifications: "MBBS, D.Ortho, DNB (Orthopedics)",
      experience: "15+ Years",
      specialty: "Orthopedics & Fracture Care",
      clinics: ["chc_fac", "fac"],
      languages: ["Hindi", "English"],
      rating: 4.9,
      reviewsCount: 220,
      fee: "₹350",
      availableDays: ["Mon", "Wed", "Sat"],
      slots: ["11:30 AM", "01:00 PM", "05:00 PM"],
      bio: "Specializes in sports injury management, accidental bone fractures, joint arthritis care, and post-trauma rehabilitation."
    }
  ],

  courses: [
    {
      id: "crs-1",
      code: "FA-101",
      title: "Certified Emergency First Aid & CPR Responder",
      category: "First Aid & Emergency",
      badge: "Best Seller",
      instructor: "Dr. Rajesh Verma & First Aid Team",
      duration: "4 Weeks (Self-Paced + Practical Demo)",
      lessonsCount: 8,
      language: "Hindi & English",
      fee: 0,
      feeType: "Free Foundation Course",
      featured: true,
      thumbnail: "assets/images/firstaid_training.jpg",
      overview: "Comprehensive foundational course teaching life-saving interventions: CPR for adults & infants, bleeding control, choking relief, fracture stabilization, and AED operation.",
      syllabus: [
        { title: "Module 1: Principles of First Aid & Scene Safety", time: "25 mins" },
        { title: "Module 2: Cardiopulmonary Resuscitation (CPR) & Recovery Position", time: "40 mins" },
        { title: "Module 3: Controlling Severe Bleeding & Tourniquet Application", time: "35 mins" },
        { title: "Module 4: Burns, Scalds & Electrical Injury First Response", time: "30 mins" },
        { title: "Module 5: Fractures, Sprains & Splinting Techniques", time: "30 mins" },
        { title: "Module 6: Choking Protocol (Heimlich Maneuver)", time: "20 mins" },
        { title: "Module 7: Medical Emergencies (Heart Attack, Stroke, Seizures)", time: "45 mins" },
        { title: "Module 8: Final Certification Quiz & Assessment", time: "30 mins" }
      ],
      quiz: [
        {
          id: "q1",
          question: "What is the recommended compression-to-breath ratio for adult CPR according to standard protocols?",
          options: ["15 compressions to 2 breaths", "30 compressions to 2 breaths", "50 compressions to 5 breaths", "10 compressions to 1 breath"],
          answerIndex: 1
        },
        {
          id: "q2",
          question: "What is the first step you must take before approaching an injured person at an accident scene?",
          options: ["Check the scene for danger / ensure safety", "Check the patient's phone for emergency contacts", "Give water to the victim immediately", "Start chest compressions immediately"],
          answerIndex: 0
        },
        {
          id: "q3",
          question: "For a severe arterial limb hemorrhage where direct pressure fails, what device should be applied high and tight?",
          options: ["Cloth bandage with ice", "Commercial or improvised tourniquet", "Hot water compress", "Plaster cast"],
          answerIndex: 1
        },
        {
          id: "q4",
          question: "How should a first-degree superficial burn be immediately treated?",
          options: ["Apply butter or oil immediately", "Cool the burn with running cool tap water for at least 10–20 minutes", "Break all blisters with a needle", "Rub ice directly on the burnt skin"],
          answerIndex: 1
        },
        {
          id: "q5",
          question: "If a person is experiencing signs of a suspected stroke, which FAST acronym step checks face symmetry?",
          options: ["F - Facial drooping or weakness", "A - Abdominal pain", "S - Shivering", "T - Temperature check"],
          answerIndex: 0
        }
      ]
    },
    {
      id: "crs-2",
      code: "GDA-201",
      title: "Community General Duty Health & Nursing Assistant",
      category: "Healthcare Skill",
      badge: "Skill Empowerment",
      instructor: "Dr. Arvind Naresh & Sister Rekha Devi",
      duration: "8 Weeks (Certification Program)",
      lessonsCount: 12,
      language: "Hindi",
      fee: 499,
      feeType: "Subsidized Vocational Fee",
      featured: true,
      thumbnail: "assets/images/foundation_hero.jpg",
      overview: "Designed for youth seeking healthcare careers. Covers patient vital signs monitoring, bed-making, infection control, basic pharmacology awareness, and elderly patient care.",
      syllabus: [
        { title: "Module 1: Role and Ethics of a Community Health Assistant", time: "35 mins" },
        { title: "Module 2: Vital Signs Mastery: Blood Pressure, Pulse, SPO2 & Temperature", time: "50 mins" },
        { title: "Module 3: Universal Hand Hygiene & Personal Protective Equipment (PPE)", time: "30 mins" },
        { title: "Module 4: Patient Comfort, Bed Positioning & Prevention of Bed Sores", time: "45 mins" },
        { title: "Module 5: Diabetic Blood Glucose Testing & Insulin Awareness", time: "40 mins" },
        { title: "Module 6: Final Practical Evaluation & Certificate Exam", time: "40 mins" }
      ],
      quiz: [
        {
          id: "q21",
          question: "What is the normal resting blood pressure range for a healthy adult?",
          options: ["180/110 mmHg", "120/80 mmHg", "70/40 mmHg", "150/100 mmHg"],
          answerIndex: 1
        },
        {
          id: "q22",
          question: "Which simple procedure is proven to be the single most effective way to prevent clinic-acquired infections?",
          options: ["Frequent proper handwashing with soap or alcohol rub", "Taking daily antibiotics", "Wearing multiple pairs of socks", "Keeping windows closed at all times"],
          answerIndex: 0
        },
        {
          id: "q23",
          question: "A pulse oximeter reading (SpO2) of what level indicates normal healthy blood oxygenation?",
          options: ["Below 85%", "Between 88% and 91%", "Between 95% and 100%", "Exactly 50%"],
          answerIndex: 2
        }
      ]
    },
    {
      id: "crs-3",
      code: "MCH-301",
      title: "Maternal & Child Nutrition & Rural Health Worker",
      category: "Public Health",
      badge: "Community Wellness",
      instructor: "Dr. Meera Sharma & Public Health Nutritionists",
      duration: "6 Weeks",
      lessonsCount: 10,
      language: "Hindi & English",
      fee: 0,
      feeType: "Free Foundation Course",
      featured: false,
      thumbnail: "assets/images/eclinic_smart.jpg",
      overview: "Focused on village health nutrition, antenatal care protocols, breast-feeding guidelines, iron deficiency anemia prevention, and government immunization schedules.",
      syllabus: [
        { title: "Module 1: Antenatal Checkups and Danger Signs in Pregnancy", time: "40 mins" },
        { title: "Module 2: Preventing Anemia & High Risk Pregnancy Identification", time: "35 mins" },
        { title: "Module 3: Exclusive Breastfeeding & Infant Nutrition Guidelines", time: "40 mins" },
        { title: "Module 4: Universal Immunization Program (UIP) Chart", time: "45 mins" },
        { title: "Module 5: Community Health Quiz & Certification", time: "30 mins" }
      ],
      quiz: [
        {
          id: "q31",
          question: "Until what age is exclusive breastfeeding recommended by the World Health Organization?",
          options: ["First 1 month", "First 6 months", "First 2 weeks", "First 2 years without solid food"],
          answerIndex: 1
        },
        {
          id: "q32",
          question: "Which essential nutrient is supplemented during pregnancy to prevent neural tube birth defects in the infant?",
          options: ["Folic Acid", "Vitamin D2 only", "Sodium chloride", "Glucose"],
          answerIndex: 0
        }
      ]
    }
  ],

  appointments: [
    {
      id: "APT-2026-101",
      patientName: "Ramesh Chand",
      patientPhone: "+91 98112 34567",
      patientEmail: "ramesh.chand@gmail.com",
      institutionId: "eclinic",
      institutionName: "Naresh X-Press e-Clinic",
      doctorId: "doc-1",
      doctorName: "Dr. Arvind Naresh",
      date: "2026-10-19",
      slot: "10:30 AM",
      reason: "Hypertension follow-up and blood sugar review",
      status: "Confirmed",
      createdAt: "2026-10-17 14:20"
    },
    {
      id: "APT-2026-102",
      patientName: "Sunita Devi",
      patientPhone: "+91 94550 98765",
      patientEmail: "sunita.d@outlook.com",
      institutionId: "chc_fac",
      institutionName: "Naresh Community Health Care Center",
      doctorId: "doc-2",
      doctorName: "Dr. Meera Sharma",
      date: "2026-10-20",
      slot: "11:00 AM",
      reason: "Routine antenatal trimester health checkup",
      status: "Requested",
      createdAt: "2026-10-17 16:45"
    },
    {
      id: "APT-2026-103",
      patientName: "Amit Kumar Yadav",
      patientPhone: "+91 91234 56789",
      patientEmail: "amit.yadav@gmail.com",
      institutionId: "fac",
      institutionName: "Naresh First Aid Center",
      doctorId: "doc-3",
      doctorName: "Dr. Rajesh Verma",
      date: "2026-10-18",
      slot: "03:00 PM",
      reason: "Hand laceration dressing and suture inspection",
      status: "Confirmed",
      createdAt: "2026-10-17 11:10"
    },
    {
      id: "APT-2026-104",
      patientName: "Geeta Rani",
      patientPhone: "+91 97890 12345",
      patientEmail: "",
      institutionId: "eclinic",
      institutionName: "Naresh X-Press e-Clinic",
      doctorId: "doc-4",
      doctorName: "Dr. Sunita Saxena",
      date: "2026-10-21",
      slot: "10:30 AM",
      reason: "Child fever and persistent coughing consultation",
      status: "Requested",
      createdAt: "2026-10-17 18:30"
    }
  ],

  members: [
    {
      id: "MBR-2026-501",
      name: "Sandeep Kumar",
      phone: "+91 99887 76655",
      email: "sandeep.volunteer@gmail.com",
      gender: "Male",
      bloodGroup: "O+",
      category: "Health Volunteer",
      address: "House 45, Sector 4, Civil Lines, Aligarh, UP",
      status: "Approved",
      appliedDate: "2026-10-10",
      approvedDate: "2026-10-12",
      idCardIssued: true
    },
    {
      id: "MBR-2026-502",
      name: "Pooja Verma",
      phone: "+91 97654 32109",
      email: "pooja.v@gmail.com",
      gender: "Female",
      bloodGroup: "B+",
      category: "Skill Trainer",
      address: "Lane 3, Shanti Nagar, Aligarh, UP",
      status: "Approved",
      appliedDate: "2026-10-12",
      approvedDate: "2026-10-14",
      idCardIssued: true
    },
    {
      id: "MBR-2026-503",
      name: "Mohan Lal Gupta",
      phone: "+91 98321 65498",
      email: "mlgupta.trader@yahoo.com",
      gender: "Male",
      bloodGroup: "A+",
      category: "Patron Member",
      address: "Main Bazar, Railway Road, UP",
      status: "Under Review",
      appliedDate: "2026-10-16",
      approvedDate: null,
      idCardIssued: false
    },
    {
      id: "MBR-2026-504",
      name: "Anjali Saxena",
      phone: "+91 91122 33445",
      email: "anjali.saxena21@gmail.com",
      gender: "Female",
      bloodGroup: "AB+",
      category: "General Member",
      address: "B-12, Green Park Colony, UP",
      status: "New",
      appliedDate: "2026-10-17",
      approvedDate: null,
      idCardIssued: false
    }
  ],

  donations: [
    {
      id: "DON-2026-901",
      donorName: "Vikas Aggarwal",
      donorPhone: "+91 98101 23456",
      donorEmail: "vikas.aggarwal@gmail.com",
      amount: 5000,
      purpose: "Free Rural Health Camp & Medicine Distribution",
      paymentMode: "UPI / Net Banking",
      status: "Completed",
      date: "2026-10-15",
      receiptNo: "REC-NCH-2026-089"
    },
    {
      id: "DON-2026-902",
      donorName: "Dr. K. K. Srivastava",
      donorPhone: "+91 94123 45678",
      donorEmail: "kksrivastava@hotmail.com",
      amount: 11000,
      purpose: "Emergency First Aid Equipment for Schools",
      paymentMode: "Bank Transfer (NEFT)",
      status: "Completed",
      date: "2026-10-16",
      receiptNo: "REC-NCH-2026-090"
    },
    {
      id: "DON-2026-903",
      donorName: "Priyanka Mishra",
      donorPhone: "+91 99234 56781",
      donorEmail: "priyanka.m@gmail.com",
      amount: 2500,
      purpose: "Sanjeevani Youth Skill Training Sponsorship",
      paymentMode: "Credit/Debit Card",
      status: "Completed",
      date: "2026-10-17",
      receiptNo: "REC-NCH-2026-091"
    }
  ],

  enquiries: [
    {
      id: "ENQ-101",
      name: "Deepak Sharma",
      phone: "+91 98712 34560",
      email: "deepak.sharma@gmail.com",
      center: "Naresh First Aid Center",
      subject: "Inquiry about corporate First Aid training on site",
      message: "We have an industrial plant with 120 workers. We want to conduct an emergency CPR and wound management session next month.",
      status: "Pending",
      date: "2026-10-17 13:10"
    },
    {
      id: "ENQ-102",
      name: "Rekha Kashyap",
      phone: "+91 94111 22334",
      email: "rekha.k@gmail.com",
      center: "Naresh Community Health Care & Skill Empowerment India Foundation",
      subject: "Requesting free health camp in village Rampur",
      message: "Our Gram Panchayat would like to organize an eye and general health checkup camp on Sunday. Kindly advise the procedure.",
      status: "Replied",
      date: "2026-10-16 17:40"
    }
  ],

  studentState: {
    isLoggedIn: true,
    student: {
      name: "Rahul Sharma",
      email: "rahul.sharma@learner.org",
      phone: "+91 98765 12340",
      enrolledCourses: ["crs-1"],
      progress: {
        "crs-1": {
          completedLessons: [0, 1, 2, 3, 4, 5, 6, 7],
          quizTaken: true,
          score: 100,
          passed: true,
          certificateId: "NCH-CERT-2026-7842",
          completedDate: "17 Oct 2026"
        }
      }
    }
  }
};

// Data service helpers
window.NareshData = {
  get: function(key) {
    const raw = localStorage.getItem("naresh_platform_" + key);
    if (!raw) {
      this.set(key, DEFAULT_DATA[key]);
      return DEFAULT_DATA[key];
    }
    try {
      return JSON.parse(raw);
    } catch(e) {
      return DEFAULT_DATA[key];
    }
  },

  set: function(key, val) {
    localStorage.setItem("naresh_platform_" + key, JSON.stringify(val));
  },

  init: function() {
    Object.keys(DEFAULT_DATA).forEach(key => {
      if (!localStorage.getItem("naresh_platform_" + key)) {
        this.set(key, DEFAULT_DATA[key]);
      }
    });
  },

  resetDefaults: function() {
    Object.keys(DEFAULT_DATA).forEach(key => {
      this.set(key, DEFAULT_DATA[key]);
    });
  }
};

window.NareshData.init();
