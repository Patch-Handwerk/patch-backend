export interface PhaseData {
  name: string;
  subphases: SubPhaseData[];
}

export interface SubPhaseData {
  name: string;
  question: QuestionData;
}

export interface QuestionData {
  text: string;
  sortId: number;
  answerLevels: AnswerLevelData[];
}

export interface AnswerLevelData {
  level: number;
  stage: string;
  description: string;
  answers: AnswerData[];
}

export interface AnswerData {
  text: string;
  point: number;
  isStopAnswer?: boolean;
}

export interface StageData {
  name: string;
  minimumToAchieve: number;
  maximumToAchieve: number;
}

export const phasesData: PhaseData[] = [
  {
    name: "Planungs- und Logistikphase",
    subphases: [
      {
        name: "Materialbeschaffung",
        question: {
          text: "Wie strukturieren Sie Ihren Materialbeschaffungsprozess?",
          sortId: 1,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              description: "Analog Procurement",
              answers: [
                { text: "this answer is not correct", point: 1, isStopAnswer: true },
                { text: "Bestellungen erfolgen telefonisch oder persönlich beim Lieferanten", point: 3 },
                { text: "Materialbedarfe werden händisch aufgelistet (Papier, Whiteboard, Notizbuch)", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              description: "Digital Documentation (Office)",
              answers: [
                { text: "Manuelle Pflege der Tabellen, keine automatisierten Prozesse", point: 1, isStopAnswer: true },
                { text: "Gemeinsame Ablage von Bestelllisten in einer Cloud (z. B. Google, OneDrive)", point: 3 },
                { text: "Bestellungen werden per E-Mail oder Fax an Lieferanten übermittelt", point: 6 },
                { text: "Erste Schritte: Erfassung des Materialbedarfs in Excel-Tabellen", point: 9 },
              ]
            },
            {
              level: 3,
              stage: "Digi Apprentice",
              description: "Online Shops & Supplier Portals",
              answers: [
                { text: "Erste Zeitersparnis durch digitalisierte Bestellwege", point: 1, isStopAnswer: true },
                { text: "Daten (z. B. Bestellhistorie) liegen beim Lieferantenportal, können aber oft exportiert werden", point: 3 },
                { text: "Einfache Preisvergleiche und Bestellung per Klick möglich", point: 6 },
                { text: "Nutzung der Webshops der Lieferanten oder zentraler Beschaffungsportale", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Journeyman",
              description: "Basic inventory management tool",
              answers: [
                { text: "Weitgehend manuelles Auslösen der Bestellungen", point: 1, isStopAnswer: true },
                { text: "Teilweise Automatisierung: Warnhinweise bei Unterschreiten des Mindestbestands, Generierung von Bestellvorschlägen", point: 3 },
                { text: "Einführung einer leichten Warenwirtschaftssoftware (z. B. Lexware, sevDesk) zur Verwaltung von Artikeln, Beständen und Bestellungen", point: 6 },
              ]
            },
            {
              level: 5,
              stage: "Digi Journeyman",
              description: "Partially automated ordering processes",
              answers: [
                { text: "Erste Stammdatenpflege: Lieferanten, Preise und Artikelbeschreibungen werden zentral verwaltet, weniger manuelle Doppelarbeit", point: 1,isStopAnswer: true },
                { text: "Automatische Generierung von Bestelllisten, die nur noch freigegeben werden müssen", point: 3 },
                { text: "Verknüpfung von Warenwirtschafts-Software mit E-Mail-/Bestellsystemen (z. B. über Zapier oder Make)", point: 6 },
              ]
            },
            {
              level: 6,
              stage: "Digi Journeyman",
              description: "Integrated warehouse and project planning",
              answers: [
                { text: "Automatische Bedarfsmeldungen, wenn ein neues Projekt gestartet wird oder sich der Bestand ändert", point: 1 ,isStopAnswer: true},
                { text: "Einblick in Echtzeit, welche Materialien schon verplant sind und welche noch verfügbar sind", point: 3 },
                { text: "Integration mit Projekt- oder Zeiterfassungssoftware (z. B. Projektmanagement-Tools, Zeiterfassung), sodass Materialbedarf direkt aus Projektdaten hervorgeht", point: 6 },
              ]
            },
            {
              level: 7,
              stage: "Digi Master",
              description: "Digital supplier integration",
              answers: [
                { text: "Automatischer Abgleich von Bestellungen und Lieferscheinen, weniger Abweichungen und Fehler", point: 1, isStopAnswer: true },
                { text: "Bestände, Liefertermine und Preise werden in Echtzeit synchronisiert", point: 3 },
                { text: "Elektronische Datenaustausch-Verfahren (z. B. EDI, API-Anbindungen) zwischen Warenwirtschaft und Lieferanten-Systemen", point: 6 },
              ]
            },
            {
              level: 8,
              stage: "Digi Master",
              description: "Complete automation & AI",
              answers: [
                { text: "Automatische Bestellauslösung, wenn definierte Schwellwerte unterschritten werden, inklusive Budgetkontrolle und Freigabemechanismen", point: 1, isStopAnswer: true },
                { text: "Prognose zukünftiger Materialbedarfe basierend auf vergangenen Projekten, Saisonalität oder Trenddaten", point: 3 },
                { text: "Vollständig vernetztes System (Warenwirtschaft, Projektmanagement, Buchhaltung, Lieferanten-EDI) mit KI-gestützter Bedarfsvorhersage", point: 6 },
              ]
            },
          ]
        }
      },
      {
        name: "Subunternehmer",
        question: {
          text: "Wie verwalten Sie Ihre Subunternehmer?",
          sortId: 2,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              description: "Manual Management",
              answers: [
                { text: "Keine systematische Verwaltung", point: 1, isStopAnswer: true },
                { text: "Manuelle Liste auf Papier oder Excel", point: 3 },
                { text: "Digitale Kontaktdaten in Excel oder Word", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              description: "Digital Contact Management",
              answers: [
                { text: "Strukturierte Kontaktdatenbank", point: 6 },
                { text: "E-Mail-Kommunikation mit Subunternehmern", point: 6 },
                { text: "Digitale Dokumentenverwaltung", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              description: "Integrated Subcontractor Management",
              answers: [
                { text: "Dedizierte Subunternehmer-Management-Software", point: 9 },
                { text: "Digitale Auftragsvergabe und -verfolgung", point: 9 },
                { text: "Automatisierte Kommunikationsprozesse", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              description: "Advanced Subcontractor Analytics",
              answers: [
                { text: "KI-gestützte Subunternehmer-Auswahl", point: 12 },
                { text: "Predictive Analytics für Projektplanung", point: 12 },
                { text: "Autonome Subunternehmer-Koordination", point: 12 },
              ]
            }
          ]
        }
      },
      {
        name: "Interne Kommunikation & Organisation",
        question: {
          text: "Wie organisieren Sie Ihre interne Kommunikation?",
          sortId: 3,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              description: "Basic Communication",
              answers: [
                { text: "Keine strukturierte Kommunikation", point: 1, isStopAnswer: true },
                { text: "Persönliche Gespräche und Telefonate", point: 3 },
                { text: "E-Mail-Kommunikation", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              description: "Digital Communication Tools",
              answers: [
                { text: "WhatsApp-Gruppen für Teamkommunikation", point: 6 },
                { text: "Cloud-basierte Dokumentenfreigabe", point: 6 },
                { text: "Digitale Kalender und Terminplanung", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              description: "Integrated Communication Platform",
              answers: [
                { text: "Unified Communication Platform (Teams, Slack)", point: 9 },
                { text: "Projektmanagement-Software mit Kommunikation", point: 9 },
                { text: "Automatisierte Workflows und Benachrichtigungen", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              description: "Advanced Communication Analytics",
              answers: [
                { text: "KI-gestützte Kommunikationsoptimierung", point: 12 },
                { text: "Predictive Analytics für Team-Performance", point: 12 },
                { text: "Autonome Kommunikationsprozesse", point: 12 },
              ]
            }
          ]
        }
      }
    ]
  },
  {
    name: "Informationsphase",
    subphases: [
      {
        name: "Marketing",
        question: {
          text: "Wie informieren Sie Ihre Kunden?",
          sortId: 4,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              description: "Traditional Marketing",
              answers: [
                { text: "Keine aktive Kundeninformation", point: 1, isStopAnswer: true },
                { text: "Persönliche Gespräche und Mundpropaganda", point: 3 },
                { text: "E-Mail-Newsletter", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              description: "Digital Marketing Basics",
              answers: [
                { text: "Einfache Website mit Kontaktinformationen", point: 6 },
                { text: "Social Media Präsenz (Facebook, Instagram)", point: 6 },
                { text: "Digitale Broschüren und Flyer", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              description: "Integrated Marketing Platform",
              answers: [
                { text: "Content Management System für Website", point: 9 },
                { text: "E-Mail-Marketing-Automation", point: 9 },
                { text: "Analytics und Performance-Tracking", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              description: "Advanced Marketing Analytics",
              answers: [
                { text: "KI-gestützte Personalisierung", point: 12 },
                { text: "Predictive Analytics für Kundenverhalten", point: 12 },
                { text: "Autonome Marketing-Kampagnen", point: 12 },
              ]
            }
          ]
        }
      },
      {
        name: "Akquisition",
        question: {
          text: "Wie informieren Sie potenzielle Neukunden über Ihr Angebot?",
          sortId: 5,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              description: "Manual Acquisition",
              answers: [
                { text: "Keine systematische Akquisition", point: 1, isStopAnswer: true },
                { text: "Persönliche Kontakte und Empfehlungen", point: 3 },
                { text: "Digitale Präsentationen und Broschüren", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              description: "Digital Lead Generation",
              answers: [
                { text: "Online-Bewertungsplattformen", point: 6 },
                { text: "Digitale Angebotsanfragen", point: 6 },
                { text: "Social Media Lead Generation", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              description: "Integrated CRM System",
              answers: [
                { text: "Customer Relationship Management (CRM)", point: 9 },
                { text: "Automatisierte Lead-Qualifizierung", point: 9 },
                { text: "Digitale Angebotserstellung", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              description: "Advanced Acquisition Analytics",
              answers: [
                { text: "KI-gestützte Lead-Scoring", point: 12 },
                { text: "Predictive Analytics für Kundenakquisition", point: 12 },
                { text: "Autonome Akquisitionsprozesse", point: 12 },
              ]
            }
          ]
        }
      }
    ]
  },
  {
    name: "Angebotsphase",
    subphases: [
      {
        name: "Bewertung der Anfrage und Budgetabschätzung",
        question: {
          text: "Wie bewerten Sie Anfragen und berechnen Sie Ihr Budget?",
          sortId: 6,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              description: "Manual Calculation",
              answers: [
                { text: "Keine strukturierte Bewertung", point: 1, isStopAnswer: true },
                { text: "Manuelle Kalkulation auf Papier", point: 3 },
                { text: "Excel-basierte Kalkulation", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              description: "Digital Calculation Tools",
              answers: [
                { text: "Digitale Kalkulationstabellen", point: 6 },
                { text: "Online-Kalkulatoren und Tools", point: 6 },
                { text: "Digitale Angebotserstellung", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              description: "Integrated Estimation System",
              answers: [
                { text: "Dedizierte Kalkulationssoftware", point: 9 },
                { text: "Automatisierte Kostenermittlung", point: 9 },
                { text: "Digitale Angebotsverwaltung", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              description: "Advanced Estimation Analytics",
              answers: [
                { text: "KI-gestützte Kostenprognosen", point: 12 },
                { text: "Predictive Analytics für Projektkosten", point: 12 },
                { text: "Autonome Angebotserstellung", point: 12 },
              ]
            }
          ]
        }
      }
    ]
  },
  {
    name: "Ausführungsphase",
    subphases: [
      {
        name: "Projektplanung & Terminierung",
        question: {
          text: "Wie erstellen Sie Ihre Projekt- und Zeitplanungspläne?",
          sortId: 8,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              description: "Manual Planning",
              answers: [
                { text: "Keine strukturierte Planung", point: 1, isStopAnswer: true },
                { text: "Manuelle Terminplanung", point: 3 },
                { text: "Digitale Projektplanung", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              description: "Digital Planning Tools",
              answers: [
                { text: "Excel-basierte Projektpläne", point: 6 },
                { text: "Online-Kalender und Terminplanung", point: 6 },
                { text: "Digitale To-Do-Listen", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              description: "Integrated Project Management",
              answers: [
                { text: "Projektmanagement-Software", point: 9 },
                { text: "Automatisierte Terminplanung", point: 9 },
                { text: "Digitale Ressourcenverwaltung", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              description: "Advanced Project Analytics",
              answers: [
                { text: "KI-gestützte Projektplanung", point: 12 },
                { text: "Predictive Analytics für Projektverlauf", point: 12 },
                { text: "Autonome Projektsteuerung", point: 12 },
              ]
            }
          ]
        }
      }
    ]
  },
  {
    name: "Nutzungsphase",
    subphases: [
      {
        name: "Schuldenmanagement",
        question: {
          text: "Wie ist Ihr Schuldenmanagement aufgebaut?",
          sortId: 10,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              description: "Manual Debt Management",
              answers: [
                { text: "Keine systematische Schuldenverwaltung", point: 1, isStopAnswer: true },
                { text: "Manuelle Forderungsverwaltung", point: 3 },
                { text: "Digitale Forderungsverwaltung", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              description: "Digital Debt Tracking",
              answers: [
                { text: "Excel-basierte Forderungsverwaltung", point: 6 },
                { text: "Digitale Mahnwesen-Software", point: 6 },
                { text: "E-Mail-basierte Mahnungen", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              description: "Integrated Debt Management",
              answers: [
                { text: "Integrierte Buchhaltungssoftware", point: 9 },
                { text: "Automatisierte Mahnprozesse", point: 9 },
                { text: "Digitale Inkasso-Verwaltung", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              description: "Advanced Debt Analytics",
              answers: [
                { text: "KI-gestützte Kreditrisikobewertung", point: 12 },
                { text: "Predictive Analytics für Zahlungsverhalten", point: 12 },
                { text: "Autonome Inkasso-Prozesse", point: 12 },
              ]
            }
          ]
        }
      },
      {
        name: "Zahlungsabwicklung",
        question: {
          text: "Wie ist Ihr Arbeitsablauf bei der Zahlungsabwicklung strukturiert?",
          sortId: 11,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              description: "Manual Payment Processing",
              answers: [
                { text: "Keine strukturierte Zahlungsabwicklung", point: 1, isStopAnswer: true },
                { text: "Manuelle Rechnungserstellung", point: 3 },
                { text: "Digitale Rechnungserstellung", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              description: "Digital Payment Tools",
              answers: [
                { text: "Online-Banking für Zahlungen", point: 6 },
                { text: "Digitale Rechnungsverwaltung", point: 6 },
                { text: "E-Mail-basierte Rechnungsversendung", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              description: "Integrated Payment System",
              answers: [
                { text: "Integrierte Buchhaltungssoftware", point: 9 },
                { text: "Automatisierte Zahlungsprozesse", point: 9 },
                { text: "Digitale Rechnungsverfolgung", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              description: "Advanced Payment Analytics",
              answers: [
                { text: "KI-gestützte Zahlungsoptimierung", point: 12 },
                { text: "Predictive Analytics für Cashflow", point: 12 },
                { text: "Autonome Zahlungsprozesse", point: 12 },
              ]
            }
          ]
        }
      }
    ]
  },
  {
    name: "After-Sales-Phase",
    subphases: [
      {
        name: "Aktivitäten zur Kundenbindung",
        question: {
          text: "Wie gestalten Sie Ihre Kundenbindungsstrategien?",
          sortId: 12,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              description: "Manual Customer Retention",
              answers: [
                { text: "Keine systematische Kundenbindung", point: 1, isStopAnswer: true },
                { text: "Persönliche Nachbetreuung", point: 3 },
                { text: "Digitale Kundenbindungsprogramme", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              description: "Digital Customer Communication",
              answers: [
                { text: "E-Mail-Newsletter für Kunden", point: 6 },
                { text: "Social Media Kundenbetreuung", point: 6 },
                { text: "Digitale Kundenumfragen", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              description: "Integrated Customer Management",
              answers: [
                { text: "Customer Relationship Management (CRM)", point: 9 },
                { text: "Automatisierte Kundenkommunikation", point: 9 },
                { text: "Digitale Loyalitätsprogramme", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              description: "Advanced Customer Analytics",
              answers: [
                { text: "KI-gestützte Kundenbindungsstrategien", point: 12 },
                { text: "Predictive Analytics für Kundenverhalten", point: 12 },
                { text: "Autonome Kundenbetreuung", point: 12 },
              ]
            }
          ]
        }
      }
    ]
  }
];

export const stagesData: StageData[] = [
  { name: "Digi Apprentice", minimumToAchieve: 0, maximumToAchieve: 18 },
  { name: "Digi Journeyman", minimumToAchieve: 19, maximumToAchieve: 35 },
  { name: "Digi Master", minimumToAchieve: 36, maximumToAchieve: 54 }
]; 