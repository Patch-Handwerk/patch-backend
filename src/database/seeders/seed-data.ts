export interface PhaseData {
  name: string;
  translationKey: string;
  subphases: SubPhaseData[];
}

export interface SubPhaseData {
  name: string;
  translationKey: string;
  question: QuestionData;
}

export interface QuestionData {
  text: string;
  translationKey: string;
  sortId: number;
  answerLevels: AnswerLevelData[];
}

export interface AnswerLevelData {
  level: number;
  stage: string;
  stageKey: string;
  description: string;
  descriptionKey: string;
  answers: AnswerData[];
}

export interface AnswerData {
  text: string;
  translationKey: string;
  point: number;
  isStopAnswer?: boolean;
}

export interface StageData {
  name: string;
  translationKey: string;
  minimumToAchieve: number;
  maximumToAchieve: number;
}

export const phasesData: PhaseData[] = [
  {
    name: "Planungs- und Logistikphase",
    translationKey: "assessment.phase.planningAndLogistics",
    subphases: [
      {
        name: "Materialbeschaffung",
        translationKey: "assessment.subphase.materialProcurement",
        question: {
          text: "Wie strukturieren Sie Ihren Materialbeschaffungsprozess?",
          translationKey: "assessment.question.materialProcurement",
          sortId: 1,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Analog Procurement",
              descriptionKey: "assessment.description.analogProcurement",
              answers: [
                { text: "this answer is not correct", translationKey: "assessment.answer.materialProcurement.l1a1", point: 1, isStopAnswer: true },
                { text: "Bestellungen erfolgen telefonisch oder persönlich beim Lieferanten", translationKey: "assessment.answer.materialProcurement.l1a2", point: 3 },
                { text: "Materialbedarfe werden händisch aufgelistet (Papier, Whiteboard, Notizbuch)", translationKey: "assessment.answer.materialProcurement.l1a3", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Digital Documentation (Office)",
              descriptionKey: "assessment.description.digitalDocumentation",
              answers: [
                { text: "Manuelle Pflege der Tabellen, keine automatisierten Prozesse", translationKey: "assessment.answer.materialProcurement.l2a1", point: 1, isStopAnswer: true },
                { text: "Gemeinsame Ablage von Bestelllisten in einer Cloud (z. B. Google, OneDrive)", translationKey: "assessment.answer.materialProcurement.l2a2", point: 3 },
                { text: "Bestellungen werden per E-Mail oder Fax an Lieferanten übermittelt", translationKey: "assessment.answer.materialProcurement.l2a3", point: 6 },
                { text: "Erste Schritte: Erfassung des Materialbedarfs in Excel-Tabellen", translationKey: "assessment.answer.materialProcurement.l2a4", point: 9 },
              ]
            },
            {
              level: 3,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Online Shops & Supplier Portals",
              descriptionKey: "assessment.description.onlineShopsAndSupplierPortals",
              answers: [
                { text: "Erste Zeitersparnis durch digitalisierte Bestellwege", translationKey: "assessment.answer.materialProcurement.l3a1", point: 1, isStopAnswer: true },
                { text: "Daten (z. B. Bestellhistorie) liegen beim Lieferantenportal, können aber oft exportiert werden", translationKey: "assessment.answer.materialProcurement.l3a2", point: 3 },
                { text: "Einfache Preisvergleiche und Bestellung per Klick möglich", translationKey: "assessment.answer.materialProcurement.l3a3", point: 6 },
                { text: "Nutzung der Webshops der Lieferanten oder zentraler Beschaffungsportale", translationKey: "assessment.answer.materialProcurement.l3a4", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Journeyman",
              stageKey: "assessment.stage.digiJourneyman",
              description: "Basic inventory management tool",
              descriptionKey: "assessment.description.basicInventoryManagement",
              answers: [
                { text: "Weitgehend manuelles Auslösen der Bestellungen", translationKey: "assessment.answer.materialProcurement.l4a1", point: 1, isStopAnswer: true },
                { text: "Teilweise Automatisierung: Warnhinweise bei Unterschreiten des Mindestbestands, Generierung von Bestellvorschlägen", translationKey: "assessment.answer.materialProcurement.l4a2", point: 3 },
                { text: "Einführung einer leichten Warenwirtschaftssoftware (z. B. Lexware, sevDesk) zur Verwaltung von Artikeln, Beständen und Bestellungen", translationKey: "assessment.answer.materialProcurement.l4a3", point: 6 },
              ]
            },
            {
              level: 5,
              stage: "Digi Journeyman",
              stageKey: "assessment.stage.digiJourneyman",
              description: "Partially automated ordering processes",
              descriptionKey: "assessment.description.partiallyAutomatedOrdering",
              answers: [
                { text: "Erste Stammdatenpflege: Lieferanten, Preise und Artikelbeschreibungen werden zentral verwaltet, weniger manuelle Doppelarbeit", translationKey: "assessment.answer.materialProcurement.l5a1", point: 1, isStopAnswer: true },
                { text: "Automatische Generierung von Bestelllisten, die nur noch freigegeben werden müssen", translationKey: "assessment.answer.materialProcurement.l5a2", point: 3 },
                { text: "Verknüpfung von Warenwirtschafts-Software mit E-Mail-/Bestellsystemen (z. B. über Zapier oder Make)", translationKey: "assessment.answer.materialProcurement.l5a3", point: 6 },
              ]
            },
            {
              level: 6,
              stage: "Digi Journeyman",
              stageKey: "assessment.stage.digiJourneyman",
              description: "Integrated warehouse and project planning",
              descriptionKey: "assessment.description.integratedWarehouseAndProjectPlanning",
              answers: [
                { text: "Automatische Bedarfsmeldungen, wenn ein neues Projekt gestartet wird oder sich der Bestand ändert", translationKey: "assessment.answer.materialProcurement.l6a1", point: 1, isStopAnswer: true },
                { text: "Einblick in Echtzeit, welche Materialien schon verplant sind und welche noch verfügbar sind", translationKey: "assessment.answer.materialProcurement.l6a2", point: 3 },
                { text: "Integration mit Projekt- oder Zeiterfassungssoftware (z. B. Projektmanagement-Tools, Zeiterfassung), sodass Materialbedarf direkt aus Projektdaten hervorgeht", translationKey: "assessment.answer.materialProcurement.l6a3", point: 6 },
              ]
            },
            {
              level: 7,
              stage: "Digi Master",
              stageKey: "assessment.stage.digiMaster",
              description: "Digital supplier integration",
              descriptionKey: "assessment.description.digitalSupplierIntegration",
              answers: [
                { text: "Automatischer Abgleich von Bestellungen und Lieferscheinen, weniger Abweichungen und Fehler", translationKey: "assessment.answer.materialProcurement.l7a1", point: 1, isStopAnswer: true },
                { text: "Bestände, Liefertermine und Preise werden in Echtzeit synchronisiert", translationKey: "assessment.answer.materialProcurement.l7a2", point: 3 },
                { text: "Elektronische Datenaustausch-Verfahren (z. B. EDI, API-Anbindungen) zwischen Warenwirtschaft und Lieferanten-Systemen", translationKey: "assessment.answer.materialProcurement.l7a3", point: 6 },
              ]
            },
            {
              level: 8,
              stage: "Digi Master",
              stageKey: "assessment.stage.digiMaster",
              description: "Complete automation & AI",
              descriptionKey: "assessment.description.completeAutomationAndAi",
              answers: [
                { text: "Automatische Bestellauslösung, wenn definierte Schwellwerte unterschritten werden, inklusive Budgetkontrolle und Freigabemechanismen", translationKey: "assessment.answer.materialProcurement.l8a1", point: 1, isStopAnswer: true },
                { text: "Prognose zukünftiger Materialbedarfe basierend auf vergangenen Projekten, Saisonalität oder Trenddaten", translationKey: "assessment.answer.materialProcurement.l8a2", point: 3 },
                { text: "Vollständig vernetztes System (Warenwirtschaft, Projektmanagement, Buchhaltung, Lieferanten-EDI) mit KI-gestützter Bedarfsvorhersage", translationKey: "assessment.answer.materialProcurement.l8a3", point: 6 },
              ]
            },
          ]
        }
      },
      {
        name: "Subunternehmer",
        translationKey: "assessment.subphase.subcontractors",
        question: {
          text: "Wie verwalten Sie Ihre Subunternehmer?",
          translationKey: "assessment.question.subcontractors",
          sortId: 2,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Manual Management",
              descriptionKey: "assessment.description.manualManagement",
              answers: [
                { text: "Keine systematische Verwaltung", translationKey: "assessment.answer.subcontractors.l1a1", point: 1, isStopAnswer: true },
                { text: "Manuelle Liste auf Papier oder Excel", translationKey: "assessment.answer.subcontractors.l1a2", point: 3 },
                { text: "Digitale Kontaktdaten in Excel oder Word", translationKey: "assessment.answer.subcontractors.l1a3", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Digital Contact Management",
              descriptionKey: "assessment.description.digitalContactManagement",
              answers: [
                { text: "Strukturierte Kontaktdatenbank", translationKey: "assessment.answer.subcontractors.l2a1", point: 6 },
                { text: "E-Mail-Kommunikation mit Subunternehmern", translationKey: "assessment.answer.subcontractors.l2a2", point: 6 },
                { text: "Digitale Dokumentenverwaltung", translationKey: "assessment.answer.subcontractors.l2a3", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              stageKey: "assessment.stage.digiJourneyman",
              description: "Integrated Subcontractor Management",
              descriptionKey: "assessment.description.integratedSubcontractorManagement",
              answers: [
                { text: "Dedizierte Subunternehmer-Management-Software", translationKey: "assessment.answer.subcontractors.l3a1", point: 9 },
                { text: "Digitale Auftragsvergabe und -verfolgung", translationKey: "assessment.answer.subcontractors.l3a2", point: 9 },
                { text: "Automatisierte Kommunikationsprozesse", translationKey: "assessment.answer.subcontractors.l3a3", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              stageKey: "assessment.stage.digiMaster",
              description: "Advanced Subcontractor Analytics",
              descriptionKey: "assessment.description.advancedSubcontractorAnalytics",
              answers: [
                { text: "KI-gestützte Subunternehmer-Auswahl", translationKey: "assessment.answer.subcontractors.l4a1", point: 12 },
                { text: "Predictive Analytics für Projektplanung", translationKey: "assessment.answer.subcontractors.l4a2", point: 12 },
                { text: "Autonome Subunternehmer-Koordination", translationKey: "assessment.answer.subcontractors.l4a3", point: 12 },
              ]
            }
          ]
        }
      },
      {
        name: "Interne Kommunikation & Organisation",
        translationKey: "assessment.subphase.internalCommunication",
        question: {
          text: "Wie organisieren Sie Ihre interne Kommunikation?",
          translationKey: "assessment.question.internalCommunication",
          sortId: 3,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Basic Communication",
              descriptionKey: "assessment.description.basicCommunication",
              answers: [
                { text: "Keine strukturierte Kommunikation", translationKey: "assessment.answer.internalCommunication.l1a1", point: 1, isStopAnswer: true },
                { text: "Persönliche Gespräche und Telefonate", translationKey: "assessment.answer.internalCommunication.l1a2", point: 3 },
                { text: "E-Mail-Kommunikation", translationKey: "assessment.answer.internalCommunication.l1a3", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Digital Communication Tools",
              descriptionKey: "assessment.description.digitalCommunicationTools",
              answers: [
                { text: "WhatsApp-Gruppen für Teamkommunikation", translationKey: "assessment.answer.internalCommunication.l2a1", point: 6 },
                { text: "Cloud-basierte Dokumentenfreigabe", translationKey: "assessment.answer.internalCommunication.l2a2", point: 6 },
                { text: "Digitale Kalender und Terminplanung", translationKey: "assessment.answer.internalCommunication.l2a3", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              stageKey: "assessment.stage.digiJourneyman",
              description: "Integrated Communication Platform",
              descriptionKey: "assessment.description.integratedCommunicationPlatform",
              answers: [
                { text: "Unified Communication Platform (Teams, Slack)", translationKey: "assessment.answer.internalCommunication.l3a1", point: 9 },
                { text: "Projektmanagement-Software mit Kommunikation", translationKey: "assessment.answer.internalCommunication.l3a2", point: 9 },
                { text: "Automatisierte Workflows und Benachrichtigungen", translationKey: "assessment.answer.internalCommunication.l3a3", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              stageKey: "assessment.stage.digiMaster",
              description: "Advanced Communication Analytics",
              descriptionKey: "assessment.description.advancedCommunicationAnalytics",
              answers: [
                { text: "KI-gestützte Kommunikationsoptimierung", translationKey: "assessment.answer.internalCommunication.l4a1", point: 12 },
                { text: "Predictive Analytics für Team-Performance", translationKey: "assessment.answer.internalCommunication.l4a2", point: 12 },
                { text: "Autonome Kommunikationsprozesse", translationKey: "assessment.answer.internalCommunication.l4a3", point: 12 },
              ]
            }
          ]
        }
      }
    ]
  },
  {
    name: "Informationsphase",
    translationKey: "assessment.phase.information",
    subphases: [
      {
        name: "Marketing",
        translationKey: "assessment.subphase.marketing",
        question: {
          text: "Wie informieren Sie Ihre Kunden?",
          translationKey: "assessment.question.marketing",
          sortId: 4,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Traditional Marketing",
              descriptionKey: "assessment.description.traditionalMarketing",
              answers: [
                { text: "Keine aktive Kundeninformation", translationKey: "assessment.answer.marketing.l1a1", point: 1, isStopAnswer: true },
                { text: "Persönliche Gespräche und Mundpropaganda", translationKey: "assessment.answer.marketing.l1a2", point: 3 },
                { text: "E-Mail-Newsletter", translationKey: "assessment.answer.marketing.l1a3", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Digital Marketing Basics",
              descriptionKey: "assessment.description.digitalMarketingBasics",
              answers: [
                { text: "Einfache Website mit Kontaktinformationen", translationKey: "assessment.answer.marketing.l2a1", point: 6 },
                { text: "Social Media Präsenz (Facebook, Instagram)", translationKey: "assessment.answer.marketing.l2a2", point: 6 },
                { text: "Digitale Broschüren und Flyer", translationKey: "assessment.answer.marketing.l2a3", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              stageKey: "assessment.stage.digiJourneyman",
              description: "Integrated Marketing Platform",
              descriptionKey: "assessment.description.integratedMarketingPlatform",
              answers: [
                { text: "Content Management System für Website", translationKey: "assessment.answer.marketing.l3a1", point: 9 },
                { text: "E-Mail-Marketing-Automation", translationKey: "assessment.answer.marketing.l3a2", point: 9 },
                { text: "Analytics und Performance-Tracking", translationKey: "assessment.answer.marketing.l3a3", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              stageKey: "assessment.stage.digiMaster",
              description: "Advanced Marketing Analytics",
              descriptionKey: "assessment.description.advancedMarketingAnalytics",
              answers: [
                { text: "KI-gestützte Personalisierung", translationKey: "assessment.answer.marketing.l4a1", point: 12 },
                { text: "Predictive Analytics für Kundenverhalten", translationKey: "assessment.answer.marketing.l4a2", point: 12 },
                { text: "Autonome Marketing-Kampagnen", translationKey: "assessment.answer.marketing.l4a3", point: 12 },
              ]
            }
          ]
        }
      },
      {
        name: "Akquisition",
        translationKey: "assessment.subphase.acquisition",
        question: {
          text: "Wie informieren Sie potenzielle Neukunden über Ihr Angebot?",
          translationKey: "assessment.question.acquisition",
          sortId: 5,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Manual Acquisition",
              descriptionKey: "assessment.description.manualAcquisition",
              answers: [
                { text: "Keine systematische Akquisition", translationKey: "assessment.answer.acquisition.l1a1", point: 1, isStopAnswer: true },
                { text: "Persönliche Kontakte und Empfehlungen", translationKey: "assessment.answer.acquisition.l1a2", point: 3 },
                { text: "Digitale Präsentationen und Broschüren", translationKey: "assessment.answer.acquisition.l1a3", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Digital Lead Generation",
              descriptionKey: "assessment.description.digitalLeadGeneration",
              answers: [
                { text: "Online-Bewertungsplattformen", translationKey: "assessment.answer.acquisition.l2a1", point: 6 },
                { text: "Digitale Angebotsanfragen", translationKey: "assessment.answer.acquisition.l2a2", point: 6 },
                { text: "Social Media Lead Generation", translationKey: "assessment.answer.acquisition.l2a3", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              stageKey: "assessment.stage.digiJourneyman",
              description: "Integrated CRM System",
              descriptionKey: "assessment.description.integratedCrmSystem",
              answers: [
                { text: "Customer Relationship Management (CRM)", translationKey: "assessment.answer.acquisition.l3a1", point: 9 },
                { text: "Automatisierte Lead-Qualifizierung", translationKey: "assessment.answer.acquisition.l3a2", point: 9 },
                { text: "Digitale Angebotserstellung", translationKey: "assessment.answer.acquisition.l3a3", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              stageKey: "assessment.stage.digiMaster",
              description: "Advanced Acquisition Analytics",
              descriptionKey: "assessment.description.advancedAcquisitionAnalytics",
              answers: [
                { text: "KI-gestützte Lead-Scoring", translationKey: "assessment.answer.acquisition.l4a1", point: 12 },
                { text: "Predictive Analytics für Kundenakquisition", translationKey: "assessment.answer.acquisition.l4a2", point: 12 },
                { text: "Autonome Akquisitionsprozesse", translationKey: "assessment.answer.acquisition.l4a3", point: 12 },
              ]
            }
          ]
        }
      }
    ]
  },
  {
    name: "Angebotsphase",
    translationKey: "assessment.phase.offers",
    subphases: [
      {
        name: "Bewertung der Anfrage und Budgetabschätzung",
        translationKey: "assessment.subphase.requestEvaluation",
        question: {
          text: "Wie bewerten Sie Anfragen und berechnen Sie Ihr Budget?",
          translationKey: "assessment.question.requestEvaluation",
          sortId: 6,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Manual Calculation",
              descriptionKey: "assessment.description.manualCalculation",
              answers: [
                { text: "Keine strukturierte Bewertung", translationKey: "assessment.answer.requestEvaluation.l1a1", point: 1, isStopAnswer: true },
                { text: "Manuelle Kalkulation auf Papier", translationKey: "assessment.answer.requestEvaluation.l1a2", point: 3 },
                { text: "Excel-basierte Kalkulation", translationKey: "assessment.answer.requestEvaluation.l1a3", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Digital Calculation Tools",
              descriptionKey: "assessment.description.digitalCalculationTools",
              answers: [
                { text: "Digitale Kalkulationstabellen", translationKey: "assessment.answer.requestEvaluation.l2a1", point: 6 },
                { text: "Online-Kalkulatoren und Tools", translationKey: "assessment.answer.requestEvaluation.l2a2", point: 6 },
                { text: "Digitale Angebotserstellung", translationKey: "assessment.answer.requestEvaluation.l2a3", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              stageKey: "assessment.stage.digiJourneyman",
              description: "Integrated Estimation System",
              descriptionKey: "assessment.description.integratedEstimationSystem",
              answers: [
                { text: "Dedizierte Kalkulationssoftware", translationKey: "assessment.answer.requestEvaluation.l3a1", point: 9 },
                { text: "Automatisierte Kostenermittlung", translationKey: "assessment.answer.requestEvaluation.l3a2", point: 9 },
                { text: "Digitale Angebotsverwaltung", translationKey: "assessment.answer.requestEvaluation.l3a3", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              stageKey: "assessment.stage.digiMaster",
              description: "Advanced Estimation Analytics",
              descriptionKey: "assessment.description.advancedEstimationAnalytics",
              answers: [
                { text: "KI-gestützte Kostenprognosen", translationKey: "assessment.answer.requestEvaluation.l4a1", point: 12 },
                { text: "Predictive Analytics für Projektkosten", translationKey: "assessment.answer.requestEvaluation.l4a2", point: 12 },
                { text: "Autonome Angebotserstellung", translationKey: "assessment.answer.requestEvaluation.l4a3", point: 12 },
              ]
            }
          ]
        }
      }
    ]
  },
  {
    name: "Ausführungsphase",
    translationKey: "assessment.phase.execution",
    subphases: [
      {
        name: "Projektplanung & Terminierung",
        translationKey: "assessment.subphase.projectPlanning",
        question: {
          text: "Wie erstellen Sie Ihre Projekt- und Zeitplanungspläne?",
          translationKey: "assessment.question.projectPlanning",
          sortId: 8,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Manual Planning",
              descriptionKey: "assessment.description.manualPlanning",
              answers: [
                { text: "Keine strukturierte Planung", translationKey: "assessment.answer.projectPlanning.l1a1", point: 1, isStopAnswer: true },
                { text: "Manuelle Terminplanung", translationKey: "assessment.answer.projectPlanning.l1a2", point: 3 },
                { text: "Digitale Projektplanung", translationKey: "assessment.answer.projectPlanning.l1a3", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Digital Planning Tools",
              descriptionKey: "assessment.description.digitalPlanningTools",
              answers: [
                { text: "Excel-basierte Projektpläne", translationKey: "assessment.answer.projectPlanning.l2a1", point: 6 },
                { text: "Online-Kalender und Terminplanung", translationKey: "assessment.answer.projectPlanning.l2a2", point: 6 },
                { text: "Digitale To-Do-Listen", translationKey: "assessment.answer.projectPlanning.l2a3", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              stageKey: "assessment.stage.digiJourneyman",
              description: "Integrated Project Management",
              descriptionKey: "assessment.description.integratedProjectManagement",
              answers: [
                { text: "Projektmanagement-Software", translationKey: "assessment.answer.projectPlanning.l3a1", point: 9 },
                { text: "Automatisierte Terminplanung", translationKey: "assessment.answer.projectPlanning.l3a2", point: 9 },
                { text: "Digitale Ressourcenverwaltung", translationKey: "assessment.answer.projectPlanning.l3a3", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              stageKey: "assessment.stage.digiMaster",
              description: "Advanced Project Analytics",
              descriptionKey: "assessment.description.advancedProjectAnalytics",
              answers: [
                { text: "KI-gestützte Projektplanung", translationKey: "assessment.answer.projectPlanning.l4a1", point: 12 },
                { text: "Predictive Analytics für Projektverlauf", translationKey: "assessment.answer.projectPlanning.l4a2", point: 12 },
                { text: "Autonome Projektsteuerung", translationKey: "assessment.answer.projectPlanning.l4a3", point: 12 },
              ]
            }
          ]
        }
      }
    ]
  },
  {
    name: "Nutzungsphase",
    translationKey: "assessment.phase.usage",
    subphases: [
      {
        name: "Schuldenmanagement",
        translationKey: "assessment.subphase.debtManagement",
        question: {
          text: "Wie ist Ihr Schuldenmanagement aufgebaut?",
          translationKey: "assessment.question.debtManagement",
          sortId: 10,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Manual Debt Management",
              descriptionKey: "assessment.description.manualDebtManagement",
              answers: [
                { text: "Keine systematische Schuldenverwaltung", translationKey: "assessment.answer.debtManagement.l1a1", point: 1, isStopAnswer: true },
                { text: "Manuelle Forderungsverwaltung", translationKey: "assessment.answer.debtManagement.l1a2", point: 3 },
                { text: "Digitale Forderungsverwaltung", translationKey: "assessment.answer.debtManagement.l1a3", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Digital Debt Tracking",
              descriptionKey: "assessment.description.digitalDebtTracking",
              answers: [
                { text: "Excel-basierte Forderungsverwaltung", translationKey: "assessment.answer.debtManagement.l2a1", point: 6 },
                { text: "Digitale Mahnwesen-Software", translationKey: "assessment.answer.debtManagement.l2a2", point: 6 },
                { text: "E-Mail-basierte Mahnungen", translationKey: "assessment.answer.debtManagement.l2a3", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              stageKey: "assessment.stage.digiJourneyman",
              description: "Integrated Debt Management",
              descriptionKey: "assessment.description.integratedDebtManagement",
              answers: [
                { text: "Integrierte Buchhaltungssoftware", translationKey: "assessment.answer.debtManagement.l3a1", point: 9 },
                { text: "Automatisierte Mahnprozesse", translationKey: "assessment.answer.debtManagement.l3a2", point: 9 },
                { text: "Digitale Inkasso-Verwaltung", translationKey: "assessment.answer.debtManagement.l3a3", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              stageKey: "assessment.stage.digiMaster",
              description: "Advanced Debt Analytics",
              descriptionKey: "assessment.description.advancedDebtAnalytics",
              answers: [
                { text: "KI-gestützte Kreditrisikobewertung", translationKey: "assessment.answer.debtManagement.l4a1", point: 12 },
                { text: "Predictive Analytics für Zahlungsverhalten", translationKey: "assessment.answer.debtManagement.l4a2", point: 12 },
                { text: "Autonome Inkasso-Prozesse", translationKey: "assessment.answer.debtManagement.l4a3", point: 12 },
              ]
            }
          ]
        }
      },
      {
        name: "Zahlungsabwicklung",
        translationKey: "assessment.subphase.paymentProcessing",
        question: {
          text: "Wie ist Ihr Arbeitsablauf bei der Zahlungsabwicklung strukturiert?",
          translationKey: "assessment.question.paymentProcessing",
          sortId: 11,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Manual Payment Processing",
              descriptionKey: "assessment.description.manualPaymentProcessing",
              answers: [
                { text: "Keine strukturierte Zahlungsabwicklung", translationKey: "assessment.answer.paymentProcessing.l1a1", point: 1, isStopAnswer: true },
                { text: "Manuelle Rechnungserstellung", translationKey: "assessment.answer.paymentProcessing.l1a2", point: 3 },
                { text: "Digitale Rechnungserstellung", translationKey: "assessment.answer.paymentProcessing.l1a3", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Digital Payment Tools",
              descriptionKey: "assessment.description.digitalPaymentTools",
              answers: [
                { text: "Online-Banking für Zahlungen", translationKey: "assessment.answer.paymentProcessing.l2a1", point: 6 },
                { text: "Digitale Rechnungsverwaltung", translationKey: "assessment.answer.paymentProcessing.l2a2", point: 6 },
                { text: "E-Mail-basierte Rechnungsversendung", translationKey: "assessment.answer.paymentProcessing.l2a3", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              stageKey: "assessment.stage.digiJourneyman",
              description: "Integrated Payment System",
              descriptionKey: "assessment.description.integratedPaymentSystem",
              answers: [
                { text: "Integrierte Buchhaltungssoftware", translationKey: "assessment.answer.paymentProcessing.l3a1", point: 9 },
                { text: "Automatisierte Zahlungsprozesse", translationKey: "assessment.answer.paymentProcessing.l3a2", point: 9 },
                { text: "Digitale Rechnungsverfolgung", translationKey: "assessment.answer.paymentProcessing.l3a3", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              stageKey: "assessment.stage.digiMaster",
              description: "Advanced Payment Analytics",
              descriptionKey: "assessment.description.advancedPaymentAnalytics",
              answers: [
                { text: "KI-gestützte Zahlungsoptimierung", translationKey: "assessment.answer.paymentProcessing.l4a1", point: 12 },
                { text: "Predictive Analytics für Cashflow", translationKey: "assessment.answer.paymentProcessing.l4a2", point: 12 },
                { text: "Autonome Zahlungsprozesse", translationKey: "assessment.answer.paymentProcessing.l4a3", point: 12 },
              ]
            }
          ]
        }
      }
    ]
  },
  {
    name: "After-Sales-Phase",
    translationKey: "assessment.phase.afterSales",
    subphases: [
      {
        name: "Aktivitäten zur Kundenbindung",
        translationKey: "assessment.subphase.customerRetention",
        question: {
          text: "Wie gestalten Sie Ihre Kundenbindungsstrategien?",
          translationKey: "assessment.question.customerRetention",
          sortId: 12,
          answerLevels: [
            {
              level: 1,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Manual Customer Retention",
              descriptionKey: "assessment.description.manualCustomerRetention",
              answers: [
                { text: "Keine systematische Kundenbindung", translationKey: "assessment.answer.customerRetention.l1a1", point: 1, isStopAnswer: true },
                { text: "Persönliche Nachbetreuung", translationKey: "assessment.answer.customerRetention.l1a2", point: 3 },
                { text: "Digitale Kundenbindungsprogramme", translationKey: "assessment.answer.customerRetention.l1a3", point: 6 },
              ]
            },
            {
              level: 2,
              stage: "Digi Apprentice",
              stageKey: "assessment.stage.digiApprentice",
              description: "Digital Customer Communication",
              descriptionKey: "assessment.description.digitalCustomerCommunication",
              answers: [
                { text: "E-Mail-Newsletter für Kunden", translationKey: "assessment.answer.customerRetention.l2a1", point: 6 },
                { text: "Social Media Kundenbetreuung", translationKey: "assessment.answer.customerRetention.l2a2", point: 6 },
                { text: "Digitale Kundenumfragen", translationKey: "assessment.answer.customerRetention.l2a3", point: 6 },
              ]
            },
            {
              level: 3,
              stage: "Digi Journeyman",
              stageKey: "assessment.stage.digiJourneyman",
              description: "Integrated Customer Management",
              descriptionKey: "assessment.description.integratedCustomerManagement",
              answers: [
                { text: "Customer Relationship Management (CRM)", translationKey: "assessment.answer.customerRetention.l3a1", point: 9 },
                { text: "Automatisierte Kundenkommunikation", translationKey: "assessment.answer.customerRetention.l3a2", point: 9 },
                { text: "Digitale Loyalitätsprogramme", translationKey: "assessment.answer.customerRetention.l3a3", point: 9 },
              ]
            },
            {
              level: 4,
              stage: "Digi Master",
              stageKey: "assessment.stage.digiMaster",
              description: "Advanced Customer Analytics",
              descriptionKey: "assessment.description.advancedCustomerAnalytics",
              answers: [
                { text: "KI-gestützte Kundenbindungsstrategien", translationKey: "assessment.answer.customerRetention.l4a1", point: 12 },
                { text: "Predictive Analytics für Kundenverhalten", translationKey: "assessment.answer.customerRetention.l4a2", point: 12 },
                { text: "Autonome Kundenbetreuung", translationKey: "assessment.answer.customerRetention.l4a3", point: 12 },
              ]
            }
          ]
        }
      }
    ]
  }
];

export const stagesData: StageData[] = [
  { name: "Digi Apprentice", translationKey: "assessment.stage.digiApprentice", minimumToAchieve: 0, maximumToAchieve: 18 },
  { name: "Digi Journeyman", translationKey: "assessment.stage.digiJourneyman", minimumToAchieve: 19, maximumToAchieve: 35 },
  { name: "Digi Master", translationKey: "assessment.stage.digiMaster", minimumToAchieve: 36, maximumToAchieve: 54 }
];
