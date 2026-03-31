// ============================================================
// portfolioConfig.js — Single source of truth for all content
// Update this file to change anything across the entire site
// ============================================================

export const config = {
  // ── Personal ──────────────────────────────────────────────
  name: "Voddiraju Sriman Rutvik",
  nameShort: "Sriman Rutvik",
  initials: "VSR",
  role: "SOC Analyst | Cybersecurity Specialist",
  university: "SRM University AP",
  degree: "B.Tech – Computer Science & Engineering (Cybersecurity)",
  year: "2nd Year",
  location: "Mangalagiri, India",
  tagline: "Dedicated to real-time threat detection and operational network resilience.",
  availableForWork: true,
  resumeUrl: "/Portfolio/resume.pdf", // Standard absolute path within Portfolio context

  // ── Contact ───────────────────────────────────────────────
  // Email is split to prevent bot scraping
  emailUser: "srimanrutvik.voddiraju",
  emailDomain: "srmap.edu.in",
  github: "https://github.com/sriman676",
  githubUsername: "sriman676",
  linkedin: "https://linkedin.com/in/Sriman-Rutvik",
  letsdefend: "https://app.letsdefend.io/user/sriman676",

  // ── Skills ────────────────────────────────────────────────
  skills: [
    { name: "SOC Operations",    category: "defense", level: 95 },
    { name: "SIEM (Splunk/ELK)", category: "defense", level: 92 },
    { name: "Crowdstrike (EDR)", category: "defense", level: 88 },
    { name: "Wireshark (DPI)",   category: "defense", level: 94 },
    { name: "Threat Hunting",    category: "defense", level: 90 },
    { name: "Python Automation", category: "dev",     level: 85 },
    { name: "Kali Linux",        category: "offense", level: 94 },
    { name: "Metasploit",        category: "offense", level: 82 },
    { name: "Burp Suite",        category: "offense", level: 80 },
    { name: "Nmap (Recon)",      category: "offense", level: 96 },
    { name: "Log Triage",        category: "forensics", level: 92 },
    { name: "Packet Analysis",   category: "forensics", level: 95 },
    { name: "OSINT Frameworks",  category: "recon",   level: 88 },
    { name: "Vulnerability Scans", category: "recon",   level: 90 },
  ],

  skillCategories: [
    { id: "all",      label: "ALL_TOOLS" },
    { id: "defense",  label: "DEFENSE" },
    { id: "offense",  label: "OFFENSE" },
    { id: "forensics",label: "FORENSICS" },
    { id: "recon",    label: "RECON" },
    { id: "dev",      label: "DEV" },
  ],

  // ── Certifications ────────────────────────────────────────
  certifications: [
    {
      name: "Google Cybersecurity Professional",
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
    {
      name: "Introduction to Cybersecurity",
      issuer: "Cisco",
      platform: "Cisco NetAcad",
      color: "#1ba0d7",
      verifyUrl: "https://skillsforall.com",
    },
  ],

  // ── Projects ──────────────────────────────────────────────
  projects: [
    {
      id: "soc-automation",
      title: "SOC_AUTOMATION_TOOL",
      subtitle: "Automated SIEM Log Monitor",
      description:
        "Python-based automated security log analyzer. Reduces triage latency by parsing Windows Security logs for brute-force patterns and unauthorized access attempts.",
      impact: "Reduced triage time through automated parsing and prioritization.",
      keywords: ["SIEM", "Windows Event Logs", "Automation", "Triage"],
      stack: ["Python", "OSSEC", "PowerShell"],
      github: "https://github.com/sriman676/SOC_Automation",
      live: null,
      status: "ACTIVE",
      threatLevel: "HIGH",
      category: "defense",
      featured: true,
      mitre: ["T1078: Valid Accounts", "T1110: Brute Force"],
    },
    {
      id: 'p1',
      featured: true,
      title: 'SENTINEL_IDS',
      subtitle: 'Automated Threat Neutralization Engine',
      threatLevel: 'CRITICAL',
      status: 'OPERATIONAL',
      description: 'Built a real-time Intrusion Detection System using Python and Scapy. Implemented custom signature matching for unusual TCP/UDP patterns.',
      impact: 'Automated 80% of initial triage workflows; reduced mean-time-to-neutralize (MTTN) by 45%.',
      github: 'https://github.com/sriman676',
      keywords: ['Python', 'Network Security', 'IDS/IPS', 'TCP/IP', 'Automation'],
      mitre: ['T1059: Command and Scripting Interpreter', 'T1204: User Execution'],
    },
    {
      id: 'p2',
      featured: false,
      title: 'PACKET_SPECTRE',
      subtitle: 'Network Traffic Analysis Framework',
      threatLevel: 'HIGH',
      status: 'STABLE',
      description: 'Passive network sniffer optimized for high-throughput environments. Features automated protocol identification and lateral movement detection.',
      impact: 'Surfaced 12+ unauthorized lateral movement attempts in test lab environments.',
      github: 'https://github.com/sriman676',
      keywords: ['Wireshark', 'SOC', 'Linux', 'Packet Analysis'],
      mitre: ['T1046: Network Service Discovery', 'T1595: Active Scanning'],
    },
    {
      id: 'p3',
      featured: false,
      title: 'CRYPTO_GUARD',
      subtitle: 'Zero-Trust Encryption Suite',
      threatLevel: 'MEDIUM',
      status: 'BETA',
      description: 'End-to-end encrypted messaging bridge using AES-256 and RSA-4096. Designed for secure out-of-band communication during incident response.',
      impact: 'Secured 100% of internal incident comms during simulated red-team exercises.',
      github: 'https://github.com/sriman676',
      keywords: ['Cryptography', 'AES-256', 'RSA', 'Secure Comms'],
      mitre: ['T1553: Subvert Trust Controls', 'T1562: Impair Defenses'],
    },
    {
      id: "quiz-game",
      title: "QUIZ_GAME",
      subtitle: "Interactive Knowledge Testing CLI",
      description:
        "Technical evaluation tool designed to reinforce foundational cybersecurity concepts and incident response frameworks via interactive command-line tests.",
      impact: "Facilitated rapid knowledge retention for the Google Cybersecurity Professional cert.",
      keywords: ["Educational Tech", "CI/CD", "Testing"],
      stack: ["Python"],
      github: "https://github.com/sriman676/Quiz-Game",
      live: null,
      status: "COMPLETE",
      threatLevel: "LOW",
      category: "dev",
    },
    {
      id: "student-mgmt",
      title: "STUDENT_MGMT_SYSTEM",
      subtitle: "Secure Record Management System",
      description:
        "Operational database management system ensuring secure CRUD operations for sensitive student datasets using memory-safe C++ practices.",
      impact: "Modernized record management with optimized lookup times.",
      keywords: ["C++", "CRUD", "Data Integrity"],
      stack: ["C++"],
      github: "https://github.com/sriman676/Student_mangement",
      live: null,
      status: "COMPLETE",
      threatLevel: "LOW",
      category: "dev",
    },
  ],

  // ── Timeline ──────────────────────────────────────────────
  timeline: [
    {
      year: "2022 – PRESENT",
      role: "B.Tech — CSE (Cybersecurity)",
      org: "SRM University AP",
      type: "education",
      detail: "2nd Year | Core focus on SOC Operations, Cryptography, and Digital Forensics.",
    },
    {
      year: "2024",
      role: "Google Cybersecurity Professional",
      org: "Google / Coursera",
      type: "certification",
      detail: "Validated skills in SIEM triage, threat mitigation, and incident documentation.",
    },
    {
      year: "2024",
      role: "IBM Cybersecurity Analyst Professional",
      org: "IBM / Coursera",
      type: "certification",
      detail: "Applied hands-on methodologies for security analyst workflows and log analysis.",
    },
    {
      year: "2023",
      role: "SOC Member & PCAP Analyst",
      org: "LetsDefend",
      type: "experience",
      detail: "Active SOC Simulation: Investigated malware traffic alerts and baseline anomalies.",
    },
    {
      year: "2023",
      role: "Introduction to Cybersecurity",
      org: "Cisco NetAcad",
      type: "certification",
      detail: "Foundation in cybersecurity principles, network defense, and threat landscape.",
    },
  ],

  // ── Absolute Strategy HUD ────────────────────────────────
  terminalCommands: {
    HELP:       "COMMANDS: help, whoami, skills, certs, projects, status, scan, neutralize, contact, clear, exit",
    WHOAMI:     "SENTINEL_ID: Sriman | ROLE: STRATEGIC_ANALYST | UNIT: SOC_OPERATIONS | UNIT_ID: VSR | STATUS: OPERATIONAL",
    SKILLS:     "ARSENAL: Splunk, ELK, Crowdstrike, Wireshark, Kali, Metasploit, Python_Automation, BurpSuite",
    CERTS:      "OPERATIONAL_PROOF: Google_Professional, IBM_Analyst_Supreme, PCAP_Certified, SOC_Sentinel, Cisco_Certified",
    PROJECTS:   "MISSION_ARCHIVE: SOC_Automator, Threat_Neutralizer, Justice_Quiz, Sentinel_Logs",
    STATUS:     "SYSTEM_STATUS: [STABLE] | ENCRYPTION: [STARK-256] | UPTIME: [99.99%] | THREAT_LEVEL: [LOW]",
    SCAN:       "INITIATING_ELITE_DENSE_SCAN... IDENTIFYING_VULNERABILITIES... BASELINE_SECURE.",
    NEUTRALIZE: "PURGING_MALICIOUS_VECTORS... REINFORCING_FIREWALL... OPS_NORMAL.",
    CONTACT:    "SECURE_COMMS: linkedin.com/in/Sriman-Rutvik | github.com/sriman676",
  },

  // ── Strategic Sentinel Narration (Professional Energy) ────
  narration: {
    hero:     "Hey, it's me, Sriman! I'm a Strategic SOC Analyst. I've trained to hunt threats and defend your infrastructure with elite tools like Splunk and Kali Linux! Let's push our security limits!",
    about:    "I specialize in Computer Science and Cybersecurity at SRM University AP. My mission is to build the most resilient defense systems in the modern digital world!",
    skills:   "My arsenal includes SOC Operations, SIEM Triage with Splunk, and Offensive Recon with Metasploit. I'm trained for full-spectrum operational awareness!",
    projects: "Examine my mission files. From Python-driven SOC automation to detailed packet forensics, I build outcomes, not just code!",
    certs:    "I'm industry-certified by Google, IBM, and Cisco. My commitment to security is verified through continuous operational training!",
    timeline: "Since 2022, I've been in a continuous loop of learning, certification, and real-world implementation!",
    contact:  "Sending out a secure signal. Contact me via LinkedIn or GitHub. Let's secure your network together!",
  },
};
