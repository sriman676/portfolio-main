// ============================================================
// portfolioConfig.js — Single source of truth for all content
// Update this file to change anything across the entire site
// ============================================================

export const config = {
  // ── Identity ──────────────────────────────────────────────
  name: "Voddiraju Sriman Rutvik",
  nameShort: "Sriman Rutvik",
  initials: "VSR",
  role: "Cybersecurity Student · SOC Analyst",
  university: "SRM University AP",
  degree: "B.Tech – Computer Science & Engineering (Cybersecurity)",
  location: "Mangalagiri, India · Open to Remote",
  availableForWork: true,
  resumeUrl: "/Portfolio/resume.pdf",


  hiringEssentials: {
    targetRoles: ["SOC Analyst Intern", "Detection Engineer Intern", "Blue Team Analyst"],
    location: "Mangalagiri, India (Open to Remote/Relocation)",
    workAuth: "India (Authorized)",
    availability: "Immediate / Remote Friendly",
    noticePeriod: "None (Student)",
  },

  executiveSummary: {
    metrics: [
      { label: "False Positive Reduction", value: "40%", icon: "shield" },
      { label: "Triage Speed Improvement", value: "35%", icon: "bolt" },
      { label: "Security Assessments Complete", value: "12+", icon: "check" },
    ],
    primaryCTA: "DOWNLOAD_EXECUTIVE_CV",
  },

  // ── Contact ───────────────────────────────────────────────
  emailUser: "srimanrutvik.voddiraju",
  emailDomain: "srmap.edu.in",
  github: "https://github.com/sriman676",
  githubUsername: "sriman676",
  linkedin: "https://linkedin.com/in/Sriman-Rutvik",
  letsdefend: "https://app.letsdefend.io/user/sriman676",

  // ── Role Targeting (Why Me) ────────────────────────────────
  roleTargeting: {
    soc: [
      "Proficient in real-time alert triage and incident investigation using SIEM (Splunk/ELK).",
      "Hands-on experience with packet-level forensics (Wireshark) to identify anomalous traffic.",
      "Committed to 24/7 operational resilience and proactive threat mitigation.",
    ],
    detection: [
      "Designing custom detection logic for brute-force and lateral movement patterns.",
      "Automating log parsing workflows via Python to reduce mean-time-to-detection (MTTD).",
      "Analyzing MITRE ATT&CK techniques to implement defensive countermeasures.",
    ],
    blueTeam: [
      "Hardening network infrastructure through vulnerability assessments and CI/CD security.",
      "Implementing zero-trust messaging protocols for secure incident response comms.",
      "Continuous learning via simulated SOC environments (LetsDefend).",
    ],
  },

  // ── Skills ────────────────────────────────────────────────
  skills: [
    // ── CYBER_DEFENSE ──────────────────────────────────────
    { name: "Security Operations (SecOps)", category: "defense", level: 93 },
    { name: "SIEM (Splunk/ELK)", category: "defense", level: 95 },
    { name: "Wazuh (XDR/SIEM)", category: "defense", level: 85 },
    { name: "Threat Detection", category: "defense", level: 94 },
    { name: "Web Application Security", category: "defense", level: 86 },
    { name: "OWASP Framework", category: "defense", level: 88 },
    { name: "Incident Response", category: "defense", level: 92 },
    { name: "Log Analysis", category: "defense", level: 95 },
    { name: "Incident Handling", category: "defense", level: 93 },
    { name: "Threat & Vulnerability Mgt", category: "defense", level: 90 },
    { name: "Windows Defender Endpoint", category: "defense", level: 86 },

    // ── AI_INTELLIGENCE ─────────────────────────────────────
    { name: "Machine Learning", category: "intelligence", level: 90 },
    { name: "Deep Learning", category: "intelligence", level: 88 },
    { name: "PyTorch", category: "intelligence", level: 82 },
    { name: "Reinforcement Learning", category: "intelligence", level: 78 },
    { name: "Anomaly Detection", category: "intelligence", level: 92 },
    { name: "Cyber Threat Intel (CTI)", category: "intelligence", level: 88 },

    // ── TACTICAL_OPS ────────────────────────────────────────
    { name: "MITRE ATT&CK Framework", category: "operations", level: 96 },
    { name: "Ethical Hacking", category: "operations", level: 92 },
    { name: "Nmap (Recon)", category: "operations", level: 96 },
    { name: "Wireshark (DPI)", category: "operations", level: 95 },
    { name: "Tcpdump (Packet Capture)", category: "operations", level: 92 },
    { name: "Network Traffic Analysis", category: "operations", level: 94 },

    // ── CORE_FOUNDATIONS ────────────────────────────────────
    { name: "TCP/IP Suite", category: "foundations", level: 96 },
    { name: "OSI Model", category: "foundations", level: 98 },
    { name: "Network Security", category: "foundations", level: 94 },
    { name: "Python Automation", category: "foundations", level: 94 },
    { name: "SQL (Database Security)", category: "foundations", level: 88 },
    { name: "C++ (Systems)", category: "foundations", level: 80 },
    { name: "Linux (Kali/Ubuntu)", category: "foundations", level: 96 },
    { name: "Windows Administration", category: "foundations", level: 94 },
  ],

  skillCategories: [
    { id: "all",          label: "ATS_KEYWORDS" },
    { id: "defense",      label: "CYBER_DEFENSE" },
    { id: "intelligence",  label: "AI_INTEL" },
    { id: "operations",    label: "TACTICAL_OPS" },
    { id: "foundations",   label: "CORE_INFRA" },
  ],

  // ── Certifications ────────────────────────────────────────
  certifications: [
    {
      name: "Google Cybersecurity Professional Certificate (v.2)",
      issuer: "Google",
      platform: "Coursera",
      color: "#4285f4",
      verifyUrl: "https://www.coursera.org/account/accomplishments/professional-cert/SST68REK9D29",
    },
    {
      name: "IBM Cybersecurity Analyst Professional",
      issuer: "IBM",
      platform: "Coursera",
      color: "#1f70c1",
      verifyUrl: "https://www.coursera.org/account/accomplishments/specialization/SST68REK9D29",
    },
    {
      name: "PCAP Analysis Certificate",
      issuer: "LetsDefend",
      platform: "LetsDefend",
      color: "#00f3ff",
      verifyUrl: "https://app.letsdefend.io/user/sriman676",
    },
    {
      name: "SOC Member Certificate",
      issuer: "LetsDefend",
      platform: "LetsDefend",
      color: "#00ff88",
      verifyUrl: "https://app.letsdefend.io/user/sriman676",
    },
  ],

  // ── Projects (Recruiter Optimized) ────────────────────────
  projects: [
    {
      id: "soc-automation",
      title: "SOC_Automation",
      subtitle: "Automated Security Operations & Incident Response",
      problem: "Traditional security monitoring required manual event correlation across disjointed logs.",
      action: "Developed a Python-based automation suite for real-time security telemetry and automated response triggers.",
      result: "Achieved a centralized visibility layer for anomalous behavior across local and virtual clusters.",
      keywords: ["Python", "Automation", "SOC", "Security"],
      stack: ["Python", "Log Analysis", "Security Automation"],
      github: "https://github.com/sriman676/SOC_Automation",
      featured: true,
      mitre: ["T1059: Command and Scripting Interpreter"],
    },
    {
      id: "trustnet",
      title: "Trustnet",
      subtitle: "Zero-Trust Infrastructure & Network Security",
      problem: "Insecure network nodes within a simulated SOC allowed for potential lateral movement.",
      action: "Architected a Trustnet core implementing strict access control and encrypted data-streams between endpoints.",
      result: "Eliminated unauthorized endpoint communication within the simulated environment by 100%.",
      github: "https://github.com/sriman676/trustnet",
      featured: true,
      keywords: ["Network Security", "Zero Trust", "Encryption"],
      mitre: ["T1557: Adversary-in-the-Middle"],
    },
    {
      id: "farmers-app",
      title: "Farmers_app",
      subtitle: "Secure E-Commerce Platform for Agricultural Supply",
      problem: "Direct farm-to-door logistics lacked trust verification and secure payment handshakes.",
      action: "Built a secure platform (Farmers_app) for direct agricultural commerce with built-in audit logs.",
      result: "Established a verifiable supply chain for local farmers with integrated security protocols.",
      github: "https://github.com/sriman676/Farmers_app",
      featured: true,
      keywords: ["E-Commerce", "Security", "Logistics"],
    },
    {
      id: "soc-core",
      title: "SOC",
      subtitle: "Core Security Operations Center Lab Environment",
      problem: "Developing security expertise required a controlled but realistic attack/defense laboratory.",
      action: "Deployed a dedicated SOC lab for analyzing real-time phishing samples and brute-force patterns.",
      result: "Facilitated over 50+ simulated incident response exercises across multiple threat vectors.",
      github: "https://github.com/sriman676/SOC",
      featured: true,
      keywords: ["SOC Lab", "Blue Team", "Threat Analysis"],
    },
    {
      id: "simulation",
      title: "Simulation",
      subtitle: "Tactical Threat & Intrusion Simulation",
      problem: "Testing defensive logic required reproducible and safe threat simulation workflows.",
      action: "Engineered a simulation engine for executing controlled network Discovery and Enumeration techniques.",
      result: "Provided valid telemetry for tuning SIEM correlation rules and IDS signature sets.",
      github: "https://github.com/sriman676/Simulation",
      featured: true,
      keywords: ["Threat Simulation", "Red Team", "SIEM Tuning"],
      mitre: ["T1046: Network Service Discovery"],
    },
  ],

  // ── Security Work Evidence ───────────────────────────────
  securityEvidence: [
    {
      id: "alert-1",
      title: "Brute Force Detection",
      type: "Alert Log",
      content: '{"timestamp": "2024-03-21T10:14:02Z", "event_id": 4625, "source_ip": "192.168.1.104", "status": "FAIL", "count": 12}',
      description: "Automated alert triggered after 10+ failed login attempts within 5 seconds.",
    },
    {
      id: "logic-1",
      title: "Detection Logic (Sigma)",
      type: "Code Snippet",
      content: "logsource:\n  product: windows\n  service: security\ndetection:\n  selection:\n    EventID: 4625\n  condition: selection | count() > 5",
      description: "Custom Sigma rule for identifying potential brute-force vectors.",
    },
  ],

  // ── Industry Trust ────────────────────────────────────────
  testimonials: [
    {
      quote: "Sriman demonstrates a high level of operational discipline and a keen eye for anomalous patterns. His technical foundation is solid.",
      attribution: "Professional Reference // LetsDefend SOC Verification",
      link: "https://app.letsdefend.io/user/sriman676",
    },
  ],

  // ── Timeline (Reverse Chronological) ──────────────────────
  timeline: [
    {
      year: "APR 2026",
      role: "HIDRA Paper Presented",
      org: "Academic Publication",
      type: "education",
      detail: "Presented research on the HIDRA system, detailing novel approaches in cybersecurity architectures.",
    },
    {
      year: "FEB 2026",
      role: "Google Cybersecurity Professional Certificate (v.2)",
      org: "Coursera",
      type: "certification",
      detail: "Validated skills in SIEM triage, threat mitigation, and operational documentation.",
    },
    {
      year: "2026",
      role: "Cyber Job Simulation",
      org: "Deloitte Australia / Forage",
      type: "experience",
      detail: "Practical simulation covering threat assessment, forensic analysis, and security reporting.",
    },
    {
      year: "2025",
      role: "SOC Analyst Training",
      org: "LetsDefend",
      type: "experience",
      detail: "Execution of real-time malware analysis and anomalous behavior investigations.",
    },
    {
      year: "2024 – PRESENT",
      role: "B.Tech — CSE (Cybersecurity)",
      org: "SRM University AP",
      type: "education",
      detail: "Focused on SOC Engineering, Digital Forensics, and Tactical Network Infrastructure.",
    },
  ],

  // ── Global Terminal Commands ──────────────────────────────
  terminalCommands: {
    HELP:     "COMMANDS: help, whoami, skills, certs, projects, status, contact, exit",
    WHOAMI:   "OPERATOR: Sriman Rutvik | ROLE: SOC_ANALYST | CLEARANCE: ACTIVE",
    SKILLS:   "ARSENAL: Splunk, ELK, Wireshark, Kali, Python_Automation, PCAP_Forensics",
    CERTS:    "VERIFIED: Google_Cybersecurity, IBM_Analyst, PCAP_Cert, SOC_Member",
    PROJECTS: "LOGS: SIEM_Threat_Lab, Sentinel_IDS, Phish_Triage_Auto",
    STATUS:   "SYSTEM: OPTIMAL | AVAILABLE: YES | THREAT_LEVEL: ZERO",
    CONTACT:  "COMMS: linkedin.com/in/Sriman-Rutvik | github.com/sriman676",
  },
};

