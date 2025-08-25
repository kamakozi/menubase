"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "de"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Menu Management
    menuManagement: "Menu Management",
    menuManagementDescription: "Manage your menu items, categories, and daily specials",
    previewMenu: "Preview Menu",
    menuItems: "Menu Items",
    menuItemsDescription: "Manage your menu items, prices, and availability",
    categories: "Categories",
    dailySpecials: "Daily Specials",
    preview: "Preview",
    themes: "Themes",
    addItem: "Add Item",
    name: "Name",
    category: "Category",
    price: "Price",
    status: "Status",
    actions: "Actions",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    glutenFree: "Gluten Free",
    uncategorized: "Uncategorized",
    available: "Available",
    unavailable: "Unavailable",
    // Dashboard
    dashboard: "Dashboard",
    restaurants: "Restaurants",
    settings: "Settings",
    logout: "Logout",
    // Settings
    language: "Language",
    selectLanguage: "Select Language",
    english: "English",
    german: "German",
    // Themes
    selectTheme: "Select Theme",
    currentTheme: "Current Theme",
    freeThemes: "Free Themes",
    premiumThemes: "Premium Themes",
    customThemes: "Custom Themes",
    comingSoon: "Coming Soon",
    upgrade: "Upgrade",
    classic: "Classic",
    modern: "Modern",
    elegant: "Elegant",
    minimal: "Minimal",
    // Categories and Specials
    organizeMenuItems: "Organize your menu items into categories",
    addCategory: "Add Category",
    description: "Description",
    order: "Order",
    active: "Active",
    inactive: "Inactive",
    manageDailySpecials: "Manage your featured daily specials and seasonal items",
    noDailySpecials: "No Daily Specials",
    addSpecialItem: "Add items to your daily specials to highlight them to customers",
    addSpecial: "Add Special Item",
    removeSpecial: "Remove Special",
    // Visual Editor
    menuEditor: "Menu Editor",
    visualEditor: "Visual Editor",
    design: "Design",
    content: "Content",
    images: "Images",
    template: "Template",
    primaryColor: "Primary Color",
    secondaryColor: "Secondary Color",
    backgroundColor: "Background Color",
    fontFamily: "Font Family",
    addNewItem: "Add New Item",
    itemName: "Item Name",
    itemDescription: "Item Description",
    selectCategory: "Select Category",
    restaurantCoverImage: "Restaurant Cover Image",
    uploadCoverImage: "Upload Cover Image",
    menuItemImages: "Menu Item Images",
    clickEditOnItemsToAddImages: "Click edit on menu items to add images",
    uploading: "Uploading...",
    saveChanges: "Save Changes",
    edit: "Edit",

    // Footer
    footerTagline: "The modern solution for digital menus in Austria and Slovenia",
    footerDescription:
      "Create professional digital menus with QR codes for your restaurant. Easy, fast, and always up-to-date.",
    company: "Company",
    legal: "Legal",
    support: "Support",
    followUs: "Follow Us",

    // Legal pages
    legalNotice: "Legal Notice",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    rightOfWithdrawal: "Right of Withdrawal",
    contact: "Contact",
    pricing: "Pricing",

    // Privacy Policy - Full Content
    privacyTitle: "Privacy Policy – MenuBase",
    privacyIntroduction: "1. Introduction",
    privacyIntroductionText:
      "We take the protection of your personal data very seriously. This Privacy Policy explains what data we collect when you visit our website, how we use it, and what rights you have. Personal data is any information that can be used to identify you personally.",
    privacyController: "2. Controller",
    privacyControllerText:
      "The data processing on this website is carried out by:\nMenuBase\n[Insert Company Address]\nE-Mail: privacy@menubase.eu",
    privacyHostingTitle: "3. Hosting and Content Delivery",
    privacyHostingText:
      "Our website is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Vercel may collect technical information (e.g., IP address, time of request, browser, operating system) in server log files to ensure the secure and efficient operation of the site.",
    privacyDataWeCollect: "4. Data We Collect",
    privacyDataWeCollectText:
      "• Server log files (IP, timestamp, request details, browser/OS)\n• Contact details you provide voluntarily (e.g., via contact form or registration)\n• Account data when you register for our platform",
    privacyPurposes: "5. Purposes of Processing",
    privacyPurposesText:
      "We process your data to:\n• Provide and improve our digital menu platform\n• Ensure technical security and prevent misuse\n• Communicate with you regarding your account or inquiries\n• Fulfill contractual and legal obligations",
    privacyLegalBasis: "6. Legal Basis",
    privacyLegalBasisText:
      "Data is processed on the basis of Art. 6(1) GDPR:\n• For the performance of a contract\n• For compliance with legal obligations\n• On the basis of your consent (where required)",
    privacyYourRights: "7. Your Rights",
    privacyYourRightsText:
      "You have the right to:\n• Access your stored personal data\n• Request rectification or erasure\n• Restrict processing or object to it\n• Data portability\n• Withdraw consent at any time\n• Lodge a complaint with a supervisory authority",
    privacyStoragePeriod: "8. Storage Period",
    privacyStoragePeriodText:
      "We retain personal data only as long as necessary for the stated purposes or as required by law.",
    privacyContactSection: "9. Contact",
    privacyContactSectionText: "If you have questions about privacy, contact us at privacy@menubase.eu.",
    privacyOverview: "Privacy Overview",
    privacyGeneral: "General Information",
    privacyGeneralText: "We collect and process personal data in accordance with applicable data protection laws.",
    privacyDataCollection: "Data Collection",
    privacyDataCollectionText:
      "We collect data you provide directly and automatically through your use of our services.",
    privacyHosting: "Hosting Information",
    privacyVercel: "Vercel Hosting",
    privacyVercelText: "Our website is hosted by Vercel Inc. for reliable and secure service delivery.",
    privacyRights: "Your Rights",
    privacyRightsText: "You have the right to access, rectify, delete, and port your personal data.",
    privacyContactTitle: "Contact Information",
    privacyContactText: "For privacy inquiries, contact us at privacy@menubase.eu",

    // Terms of Service - Full Content
    termsTitle: "Terms of Service",
    termsSection1: "§ 1 Scope",
    termsSection1Text:
      "These Terms and Conditions (T&C) apply to all agreements between MenuBase and our customers concerning the use of our digital menu platform.",
    termsSection2: "§ 2 Services Provided",
    termsSection2Text: "MenuBase offers a Software-as-a-Service (SaaS) platform that includes:",
    termsSection2List:
      "• Creation and management of digital menus\n• QR code generation for contactless access\n• Responsive design compatible with all devices\n• Real-time updates and edits\n• Basic analytics and statistics",
    termsSection3: "§ 3 Prices and Payment",
    termsSection3Text:
      "• All prices include statutory VAT\n• Billing occurs monthly or annually in advance\n• Accepted payment methods: credit card, PayPal, SEPA direct debit\n• Subscriptions renew automatically unless canceled",
    termsSection4: "§ 4 Customer Obligations",
    termsSection4Text: "Customers agree to:",
    termsSection4List:
      "• Provide accurate information during registration\n• Secure their access credentials\n• Refrain from publishing illegal content\n• Comply with food labeling and hospitality regulations",
    termsSection5: "§ 5 Limitation of Liability",
    termsSection5Text:
      "MenuBase is not liable for lost profits, revenue, or indirect damages. Liability is limited to the amount of the annual license fee, except in cases of intent or gross negligence.",
    termsSection6: "§ 6 Termination",
    termsSection6Text:
      "• Contracts may be terminated by either party with 30 days' notice at the end of a month\n• Annual contracts require 3 months' notice prior to expiry",
    termsSection7: "§ 7 Applicable Law and Jurisdiction",
    termsSection7Text:
      "Austrian law applies, excluding the UN Convention on Contracts for the International Sale of Goods. Jurisdiction is Graz, Austria.",
    termsSection8: "§ 8 Severability",
    termsSection8Text:
      "If any provision of these T&C is invalid, the validity of the remaining provisions remains unaffected.",
    termsScope: "Scope of Application",
    termsScopeText: "These terms apply to all use of our MenuBase platform and services.",
    termsServices: "Our Services",
    termsServicesText: "MenuBase provides digital menu creation and management services for restaurants.",
    termsPayment: "Payment Terms",
    termsPaymentText: "Subscription fees are billed monthly or annually in advance.",
    termsLiability: "Limitation of Liability",
    termsLiabilityText: "Our liability is limited to the extent permitted by applicable law.",
    termsTermination: "Termination",
    termsTerminationText: "Either party may terminate the agreement with appropriate notice.",

    // Disclaimer - Full Content
    disclaimerTitle: "Disclaimer – MenuBase",
    disclaimerSection1: "1. Liability for Content",
    disclaimerSection1Text:
      "As a service provider, we are responsible for our own content on these pages in accordance with general laws (§ 7 para. 1 TMG). However, we are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity (§§ 8–10 TMG). Obligations to remove or block the use of information under general law remain unaffected.",
    disclaimerSection2: "2. Liability for Links",
    disclaimerSection2Text:
      "Our website may contain links to external third-party websites. We have no influence over the content of these websites and therefore assume no liability for such external content. The respective provider or operator of the linked sites is always responsible for their content. At the time of linking, no illegal content was recognizable. Continuous monitoring of linked content is not reasonable without concrete indications of a legal violation. If we become aware of any infringements, we will remove such links immediately.",
    disclaimerSection3: "3. Copyright",
    disclaimerSection3Text:
      "The content and works created by the site operators on these pages are subject to copyright law. Duplication, processing, distribution, or any kind of use beyond the scope of copyright requires written consent. Downloads and copies of this site are permitted only for private, non-commercial use.",

    // Right of Withdrawal - Full Content
    withdrawalTitle: "Right of Withdrawal (Widerrufsrecht)",
    withdrawalIntro:
      "You have the right to withdraw from this contract within fourteen (14) days without giving any reason.",
    withdrawalPeriod: "The withdrawal period is fourteen (14) days from the date of conclusion of the contract.",
    withdrawalExercise:
      "To exercise your right of withdrawal, you must notify us by means of a clear declaration (e.g., a letter sent by post or e-mail) of your decision to withdraw from this contract.",
    withdrawalContact:
      "Contact details for withdrawal:\nMenuBase\nE-Mail: widerruf@menubase.eu\nAddress: [Insert Business Address]",
    withdrawalConsequences: "Consequences of Withdrawal:",
    withdrawalConsequencesText:
      "If you withdraw from this contract, we will refund all payments received from you without undue delay and at the latest within fourteen (14) days from the day we receive your notice of withdrawal. Repayment will be made using the same payment method you used, unless expressly agreed otherwise.",
    withdrawalEarlyExpiry: "Early Expiry of the Withdrawal Right:",
    withdrawalEarlyExpiryText:
      "The right of withdrawal expires prematurely if you expressly agree that we begin providing the service before the withdrawal period has expired and you confirm your knowledge that you lose your right of withdrawal by consenting to the start of performance.",
    withdrawalModelForm: "Model Withdrawal Form:",
    withdrawalModelFormText:
      "(If you wish to withdraw from the contract, please complete and return this form.)\n\nTo: MenuBase, widerruf@menubase.eu\n\nI/we (*) hereby withdraw from the contract concluded by me/us (*) for the provision of the following service:\nOrdered on (*)/received on (*):\nName of consumer(s):\nAddress of consumer(s):\nSignature of consumer(s) (only if submitted on paper):\nDate:\n(*) Delete as appropriate.",

    // Hero Section
    heroTitle: "Digital Menus for ",
    heroTitleAccent: "Modern Restaurants",
    heroSubtitle: "Create professional QR code menus for your restaurant in Austria and Slovenia. ",
    heroSubtitleAccent: "Easy, fast, and always up-to-date.",
    getStartedFree: "Get Started Free",
    login: "Login",

    // How it Works
    howItWorksTitle: "How MenuBase Works",
    howItWorksSubtitle: "Get your digital menu up and running in just three simple steps",
    step1Title: "Create Your Account",
    step1Desc: "Sign up in seconds and add your restaurant details",
    step2Title: "Build Your Menu",
    step2Desc: "Add items, categories, and customize your design",
    step3Title: "Share Your QR Code",
    step3Desc: "Print your QR code and let customers scan to view your menu",

    // Why Choose
    whyChooseTitle: "Why Choose MenuBase?",
    whyChooseSubtitle: "Everything you need to modernize your restaurant's menu experience",
    saveTimeTitle: "Save Time",
    saveTimeDesc: "Update prices and items instantly without reprinting menus",
    increaseSalesTitle: "Increase Sales",
    increaseSalesDesc: "Highlight specials and promote high-margin items effectively",
    mobileReadyTitle: "Mobile Ready",
    mobileReadyDesc: "Perfect viewing experience on all smartphones and tablets",
    expertSupportTitle: "Expert Support",
    expertSupportDesc: "Get help when you need it with our dedicated support team",

    // Features
    featuresTitle: "Powerful Features",
    featuresSubtitle: "Everything you need to create and manage professional digital menus",
    dragDropTitle: "Drag & Drop Editor",
    dragDropDesc: "Easily organize your menu items with our intuitive visual editor",
    analyticsTitle: "Menu Analytics",
    analyticsDesc: "Track which items are viewed most and optimize your menu accordingly",
    multiLocationTitle: "Multi-Location Support",
    multiLocationDesc: "Manage multiple restaurant locations from a single dashboard",
    customBrandingTitle: "Custom Branding",
    customBrandingDesc: "Match your restaurant's brand with custom colors and fonts",
    dailySpecialsTitle: "Daily Specials",
    dailySpecialsDesc: "Easily highlight today's specials and seasonal menu items",
    dietaryInfoTitle: "Dietary Information",
    dietaryInfoDesc: "Mark items as vegetarian, vegan, gluten-free, and more",
    qrCodeTitle: "QR Code Generation",
    qrCodeDesc: "Generate high-quality QR codes for contactless menu access",
    secureReliableTitle: "Secure & Reliable",
    secureReliableDesc: "99.9% uptime guarantee with enterprise-grade security",

    // Core Features
    mobileFirstTitle: "Mobile-First Design",
    mobileFirstDesc: "Optimized for smartphones with lightning-fast loading times",
    instantUpdatesTitle: "Instant Updates",
    instantUpdatesDesc: "Change prices and availability in real-time across all locations",
    businessExcellenceTitle: "Business Excellence",
    businessExcellenceDesc: "Professional tools designed specifically for Austrian and Slovenian restaurants",

    // Trusted Section
    trustedTitle: "Trusted by Restaurants",
    activeRestaurants: "Active Restaurants",
    menuViewsMonthly: "Menu Views Monthly",
    uptimeGuarantee: "99.9% Uptime",
    customerSupport: "24/7 Support",

    // Testimonials
    testimonialsTitle: "What Our Customers Say",
    testimonial1:
      "MenuBase transformed how we manage our menu. Updates are instant and our customers love the QR code experience.",
    testimonial1Author: "Maria Schmidt, Gasthaus Alpenblick",
    testimonial2:
      "The analytics help us understand which dishes are popular. We've increased our revenue by 15% since switching.",
    testimonial2Author: "Johann Weber, Restaurant Donauufer",
    testimonial3:
      "Perfect for our multiple locations. We can update all menus from one place and maintain consistency.",
    testimonial3Author: "Ana Novak, Kavarna Ljubljana",

    // CTA Section
    ctaTitle: "Ready to Modernize Your Menu?",
    ctaSubtitle: "Join hundreds of restaurants already using MenuBase to create better customer experiences",
    startFreeTrial: "Start Free Trial",
    ctaFooter: "No credit card required • 14-day free trial • Cancel anytime",

    // Impressum page translation keys
    impressumTitle: "Legal Notice",
    impressumSubtitle: "Company Information",
    impressumCompany: "Company",
    impressumAddress: "MenuBase\n[Insert Company Address]\nAustria",
    impressumContact: "Contact Information",
    impressumEmail: "Email: info@menubase.eu",
    impressumPhone: "Phone: +43 123 456 789",
    impressumVat: "VAT Information",
    impressumVatText: "VAT ID: ATU12345678\nCommercial Register: FN 123456a\nCommercial Court: Graz",
    impressumResponsible: "Responsible for Content",
    impressumDisclaimer: "Disclaimer",
    impressumContentLiability: "Liability for Content",
    impressumContentText:
      "As a service provider, we are responsible for our own content on these pages according to general laws. However, we are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.",
    impressumLinksLiability: "Liability for Links",
    impressumLinksText:
      "Our website contains links to external third-party websites over whose content we have no influence. Therefore, we cannot assume any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages.",
  },
  de: {
    // Menu Management
    menuManagement: "Menü-Verwaltung",
    menuManagementDescription: "Verwalten Sie Ihre Menüpunkte, Kategorien und Tagesangebote",
    previewMenu: "Menü Vorschau",
    menuItems: "Menüpunkte",
    menuItemsDescription: "Verwalten Sie Ihre Menüpunkte, Preise und Verfügbarkeit",
    categories: "Kategorien",
    dailySpecials: "Tagesangebote",
    preview: "Vorschau",
    themes: "Designs",
    addItem: "Artikel hinzufügen",
    name: "Name",
    category: "Kategorie",
    price: "Preis",
    status: "Status",
    actions: "Aktionen",
    vegetarian: "Vegetarisch",
    vegan: "Vegan",
    glutenFree: "Glutenfrei",
    uncategorized: "Unkategorisiert",
    available: "Verfügbar",
    unavailable: "Nicht verfügbar",
    // Dashboard
    dashboard: "Dashboard",
    restaurants: "Restaurants",
    settings: "Einstellungen",
    logout: "Abmelden",
    // Settings
    language: "Sprache",
    selectLanguage: "Sprache auswählen",
    english: "Englisch",
    german: "Deutsch",
    // Themes
    selectTheme: "Design auswählen",
    currentTheme: "Aktuelles Design",
    freeThemes: "Kostenlose Designs",
    premiumThemes: "Premium Designs",
    customThemes: "Individuelle Designs",
    comingSoon: "Demnächst verfügbar",
    upgrade: "Upgrade",
    classic: "Klassisch",
    modern: "Modern",
    elegant: "Elegant",
    minimal: "Minimal",
    // Categories and Specials
    organizeMenuItems: "Organisieren Sie Ihre Menüpunkte in Kategorien",
    addCategory: "Kategorie hinzufügen",
    description: "Beschreibung",
    order: "Reihenfolge",
    active: "Aktiv",
    inactive: "Inaktiv",
    manageDailySpecials: "Verwalten Sie Ihre hervorgehobenen Tagesangebote und saisonalen Artikel",
    noDailySpecials: "Keine Tagesangebote",
    addSpecialItem: "Fügen Sie Artikel zu Ihren Tagesangeboten hinzu, um sie den Kunden zu präsentieren",
    addSpecial: "Tagesangebot hinzufügen",
    removeSpecial: "Tagesangebot entfernen",
    // Visual Editor
    menuEditor: "Menü-Editor",
    visualEditor: "Visueller Editor",
    design: "Design",
    content: "Inhalt",
    images: "Bilder",
    template: "Vorlage",
    primaryColor: "Primärfarbe",
    secondaryColor: "Sekundärfarbe",
    backgroundColor: "Hintergrundfarbe",
    fontFamily: "Schriftart",
    addNewItem: "Neuen Artikel hinzufügen",
    itemName: "Artikelname",
    itemDescription: "Artikelbeschreibung",
    selectCategory: "Kategorie auswählen",
    restaurantCoverImage: "Restaurant Titelbild",
    uploadCoverImage: "Titelbild hochladen",
    menuItemImages: "Menüartikel Bilder",
    clickEditOnItemsToAddImages: "Klicken Sie auf Bearbeiten bei Menüartikeln, um Bilder hinzuzufügen",
    uploading: "Wird hochgeladen...",
    saveChanges: "Änderungen speichern",
    edit: "Bearbeiten",

    // Footer
    footerTagline: "Die moderne Lösung für digitale Speisekarten in Österreich und Slowenien",
    footerDescription:
      "Erstellen Sie professionelle digitale Speisekarten mit QR-Codes für Ihr Restaurant. Einfach, schnell und immer aktuell.",
    company: "Unternehmen",
    legal: "Rechtliches",
    support: "Support",
    followUs: "Folgen Sie uns",

    // Legal pages
    legalNotice: "Impressum",
    privacyPolicy: "Datenschutzerklärung",
    termsOfService: "Allgemeine Geschäftsbedingungen (AGB)",
    rightOfWithdrawal: "Widerrufsbelehrung",
    contact: "Kontakt",
    pricing: "Preise",

    // Privacy Policy - German Version
    privacyTitle: "Datenschutzerklärung – MenuBase",
    privacyIntroduction: "1. Einleitung",
    privacyIntroductionText:
      "Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung erklärt, welche Daten wir beim Besuch unserer Website sammeln, wie wir sie verwenden und welche Rechte Sie haben. Personenbezogene Daten sind alle Informationen, mit denen Sie persönlich identifiziert werden können.",
    privacyController: "2. Verantwortlicher",
    privacyControllerText:
      "Die Datenverarbeitung auf dieser Website wird durchgeführt von:\nMenuBase\n[Firmenadresse einfügen]\nE-Mail: privacy@menubase.eu",
    privacyHostingTitle: "3. Hosting und Content Delivery",
    privacyHostingText:
      "Unsere Website wird von Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA gehostet. Vercel kann technische Informationen (z.B. IP-Adresse, Zeitpunkt der Anfrage, Browser, Betriebssystem) in Server-Logdateien sammeln, um den sicheren und effizienten Betrieb der Website zu gewährleisten.",
    privacyDataWeCollect: "4. Daten, die wir sammeln",
    privacyDataWeCollectText:
      "• Server-Logdateien (IP, Zeitstempel, Anfrage-Details, Browser/OS)\n• Kontaktdaten, die Sie freiwillig angeben (z.B. über Kontaktformular oder Registrierung)\n• Kontodaten bei der Registrierung für unsere Plattform",
    privacyPurposes: "5. Zwecke der Verarbeitung",
    privacyPurposesText:
      "Wir verarbeiten Ihre Daten, um:\n• Unsere digitale Speisekarten-Plattform bereitzustellen und zu verbessern\n• Technische Sicherheit zu gewährleisten und Missbrauch zu verhindern\n• Mit Ihnen bezüglich Ihres Kontos oder Anfragen zu kommunizieren\n• Vertragliche und rechtliche Verpflichtungen zu erfüllen",
    privacyLegalBasis: "6. Rechtsgrundlage",
    privacyLegalBasisText:
      "Daten werden auf Grundlage von Art. 6(1) DSGVO verarbeitet:\n• Zur Erfüllung eines Vertrags\n• Zur Einhaltung rechtlicher Verpflichtungen\n• Auf Grundlage Ihrer Einwilligung (wo erforderlich)",
    privacyYourRights: "7. Ihre Rechte",
    privacyYourRightsText:
      "Sie haben das Recht auf:\n• Zugang zu Ihren gespeicherten personenbezogenen Daten\n• Berichtigung oder Löschung\n• Einschränkung der Verarbeitung oder Widerspruch\n• Datenübertragbarkeit\n• Widerruf der Einwilligung jederzeit\n• Beschwerde bei einer Aufsichtsbehörde",
    privacyStoragePeriod: "8. Speicherdauer",
    privacyStoragePeriodText:
      "Wir bewahren personenbezogene Daten nur so lange auf, wie es für die genannten Zwecke erforderlich ist oder gesetzlich vorgeschrieben.",
    privacyContactSection: "9. Kontakt",
    privacyContactSectionText: "Bei Fragen zum Datenschutz kontaktieren Sie uns unter privacy@menubase.eu.",
    privacyOverview: "Datenschutz-Übersicht",
    privacyGeneral: "Allgemeine Informationen",
    privacyGeneralText:
      "Wir sammeln und verarbeiten personenbezogene Daten in Übereinstimmung mit geltendem Datenschutzrecht.",
    privacyDataCollection: "Datensammlung",
    privacyDataCollectionText:
      "Wir sammeln Daten, die Sie direkt bereitstellen und automatisch durch die Nutzung unserer Dienste.",
    privacyHosting: "Hosting-Informationen",
    privacyVercel: "Vercel Hosting",
    privacyVercelText:
      "Unsere Website wird von Vercel Inc. für zuverlässige und sichere Servicebereitstellung gehostet.",
    privacyRights: "Ihre Rechte",
    privacyRightsText:
      "Sie haben das Recht auf Zugang, Berichtigung, Löschung und Übertragung Ihrer personenbezogenen Daten.",
    privacyContactTitle: "Kontaktinformationen",
    privacyContactText: "Bei Datenschutzanfragen kontaktieren Sie uns unter privacy@menubase.eu",

    // Terms of Service - German Version
    termsTitle: "Allgemeine Geschäftsbedingungen",
    termsSection1: "§ 1 Geltungsbereich",
    termsSection1Text:
      "Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Vereinbarungen zwischen MenuBase und unseren Kunden bezüglich der Nutzung unserer digitalen Speisekarten-Plattform.",
    termsSection2: "§ 2 Erbrachte Leistungen",
    termsSection2Text: "MenuBase bietet eine Software-as-a-Service (SaaS) Plattform, die Folgendes umfasst:",
    termsSection2List:
      "• Erstellung und Verwaltung digitaler Speisekarten\n• QR-Code-Generierung für kontaktlosen Zugang\n• Responsive Design kompatibel mit allen Geräten\n• Echtzeit-Updates und Bearbeitungen\n• Grundlegende Analysen und Statistiken",
    termsSection3: "§ 3 Preise und Zahlung",
    termsSection3Text:
      "• Alle Preise verstehen sich inklusive gesetzlicher Mehrwertsteuer\n• Abrechnung erfolgt monatlich oder jährlich im Voraus\n• Akzeptierte Zahlungsmethoden: Kreditkarte, PayPal, SEPA-Lastschrift\n• Abonnements verlängern sich automatisch, sofern nicht gekündigt",
    termsSection4: "§ 4 Kundenpflichten",
    termsSection4Text: "Kunden verpflichten sich:",
    termsSection4List:
      "• Korrekte Informationen bei der Registrierung anzugeben\n• Ihre Zugangsdaten zu sichern\n• Keine rechtswidrigen Inhalte zu veröffentlichen\n• Lebensmittelkennzeichnungs- und Gastronomievorschriften einzuhalten",
    termsSection5: "§ 5 Haftungsbeschränkung",
    termsSection5Text:
      "MenuBase haftet nicht für entgangene Gewinne, Umsätze oder indirekte Schäden. Die Haftung ist auf die Höhe der jährlichen Lizenzgebühr beschränkt, außer bei Vorsatz oder grober Fahrlässigkeit.",
    termsSection6: "§ 6 Kündigung",
    termsSection6Text:
      "• Verträge können von beiden Parteien mit 30 Tagen Kündigungsfrist zum Monatsende gekündigt werden\n• Jahresverträge erfordern 3 Monate Kündigungsfrist vor Ablauf",
    termsSection7: "§ 7 Anwendbares Recht und Gerichtsstand",
    termsSection7Text:
      "Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist Graz, Österreich.",
    termsSection8: "§ 8 Salvatorische Klausel",
    termsSection8Text:
      "Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die Gültigkeit der übrigen Bestimmungen unberührt.",
    termsScope: "Geltungsbereich",
    termsScopeText: "Diese Bedingungen gelten für alle Nutzung unserer MenuBase-Plattform und -Dienste.",
    termsServices: "Unsere Dienste",
    termsServicesText: "MenuBase bietet digitale Speisekarten-Erstellung und -Verwaltungsdienste für Restaurants.",
    termsPayment: "Zahlungsbedingungen",
    termsPaymentText: "Abonnementgebühren werden monatlich oder jährlich im Voraus abgerechnet.",
    termsLiability: "Haftungsbeschränkung",
    termsLiabilityText: "Unsere Haftung ist im gesetzlich zulässigen Umfang beschränkt.",
    termsTermination: "Kündigung",
    termsTerminationText: "Beide Parteien können die Vereinbarung mit angemessener Kündigungsfrist beenden.",

    // Disclaimer - German Version
    disclaimerTitle: "Haftungsausschluss – MenuBase",
    disclaimerSection1: "1. Haftung für Inhalte",
    disclaimerSection1Text:
      "Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen.",
    disclaimerSection2: "2. Haftung für Links",
    disclaimerSection2Text:
      "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.",
    disclaimerSection3: "3. Urheberrecht",
    disclaimerSection3Text:
      "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.",

    // Right of Withdrawal - German Version
    withdrawalTitle: "Widerrufsbelehrung",
    withdrawalIntro:
      "Sie haben das Recht, binnen vierzehn (14) Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.",
    withdrawalPeriod: "Die Widerrufsfrist beträgt vierzehn (14) Tage ab dem Tag des Vertragsabschlusses.",
    withdrawalExercise:
      "Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.",
    withdrawalContact:
      "Kontaktdaten für den Widerruf:\nMenuBase\nE-Mail: widerruf@menubase.eu\nAdresse: [Geschäftsadresse einfügen]",
    withdrawalConsequences: "Folgen des Widerrufs:",
    withdrawalConsequencesText:
      "Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn (14) Tage ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Die Rückzahlung erfolgt unter Verwendung desselben Zahlungsmittels, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart.",
    withdrawalEarlyExpiry: "Vorzeitiges Erlöschen des Widerrufsrechts:",
    withdrawalEarlyExpiryText:
      "Das Widerrufsrecht erlischt vorzeitig, wenn Sie ausdrücklich zugestimmt haben, dass wir mit der Ausführung der Dienstleistung vor Ablauf der Widerrufsfrist beginnen und Sie Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung mit Beginn der Ausführung Ihr Widerrufsrecht verlieren.",
    withdrawalModelForm: "Muster-Widerrufsformular:",
    withdrawalModelFormText:
      "(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)\n\nAn: MenuBase, widerruf@menubase.eu\n\nHiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:\nBestellt am (*)/erhalten am (*):\nName des/der Verbraucher(s):\nAnschrift des/der Verbraucher(s):\nUnterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):\nDatum:\n(*) Unzutreffendes streichen.",

    // Hero Section
    heroTitle: "Digitale Speisekarten für ",
    heroTitleAccent: "Moderne Restaurants",
    heroSubtitle: "Erstellen Sie professionelle QR-Code-Speisekarten für Ihr Restaurant in Österreich und Slowenien. ",
    heroSubtitleAccent: "Einfach, schnell und immer aktuell.",
    getStartedFree: "Kostenlos starten",
    login: "Anmelden",

    // How it Works
    howItWorksTitle: "So funktioniert MenuBase",
    howItWorksSubtitle: "Bringen Sie Ihre digitale Speisekarte in nur drei einfachen Schritten online",
    step1Title: "Konto erstellen",
    step1Desc: "Registrieren Sie sich in Sekunden und fügen Sie Ihre Restaurantdetails hinzu",
    step2Title: "Speisekarte erstellen",
    step2Desc: "Fügen Sie Gerichte, Kategorien hinzu und passen Sie das Design an",
    step3Title: "QR-Code teilen",
    step3Desc: "Drucken Sie Ihren QR-Code und lassen Sie Kunden scannen, um Ihre Speisekarte zu sehen",

    // Why Choose
    whyChooseTitle: "Warum MenuBase wählen?",
    whyChooseSubtitle: "Alles was Sie brauchen, um das Speisekarten-Erlebnis Ihres Restaurants zu modernisieren",
    saveTimeTitle: "Zeit sparen",
    saveTimeDesc: "Aktualisieren Sie Preise und Gerichte sofort ohne Speisekarten neu zu drucken",
    increaseSalesTitle: "Umsatz steigern",
    increaseSalesDesc: "Heben Sie Tagesangebote hervor und bewerben Sie gewinnbringende Gerichte effektiv",
    mobileReadyTitle: "Mobiloptimiert",
    mobileReadyDesc: "Perfekte Darstellung auf allen Smartphones und Tablets",
    expertSupportTitle: "Experten-Support",
    expertSupportDesc: "Erhalten Sie Hilfe wenn Sie sie brauchen mit unserem engagierten Support-Team",

    // Features
    featuresTitle: "Leistungsstarke Funktionen",
    featuresSubtitle: "Alles was Sie brauchen, um professionelle digitale Speisekarten zu erstellen und zu verwalten",
    dragDropTitle: "Drag & Drop Editor",
    dragDropDesc: "Organisieren Sie Ihre Speisekarten-Artikel einfach mit unserem intuitiven visuellen Editor",
    analyticsTitle: "Speisekarten-Analysen",
    analyticsDesc:
      "Verfolgen Sie welche Artikel am meisten angesehen werden und optimieren Sie Ihre Speisekarte entsprechend",
    multiLocationTitle: "Multi-Standort-Support",
    multiLocationDesc: "Verwalten Sie mehrere Restaurant-Standorte von einem einzigen Dashboard aus",
    customBrandingTitle: "Individuelles Branding",
    customBrandingDesc: "Passen Sie das Design an Ihre Restaurant-Marke mit individuellen Farben und Schriften an",
    dailySpecialsTitle: "Tagesangebote",
    dailySpecialsDesc: "Heben Sie einfach die heutigen Spezialitäten und saisonale Speisekarten-Artikel hervor",
    dietaryInfoTitle: "Ernährungsinformationen",
    dietaryInfoDesc: "Markieren Sie Gerichte als vegetarisch, vegan, glutenfrei und mehr",
    qrCodeTitle: "QR-Code-Generierung",
    qrCodeDesc: "Generieren Sie hochwertige QR-Codes für kontaktlosen Speisekarten-Zugang",
    secureReliableTitle: "Sicher & Zuverlässig",
    secureReliableDesc: "99,9% Verfügbarkeitsgarantie mit Sicherheit auf Unternehmensebene",

    // Core Features
    mobileFirstTitle: "Mobile-First Design",
    mobileFirstDesc: "Optimiert für Smartphones mit blitzschnellen Ladezeiten",
    instantUpdatesTitle: "Sofortige Updates",
    instantUpdatesDesc: "Ändern Sie Preise und Verfügbarkeit in Echtzeit an allen Standorten",
    businessExcellenceTitle: "Business Excellence",
    businessExcellenceDesc: "Professionelle Tools speziell für österreichische und slowenische Restaurants entwickelt",

    // Trusted Section
    trustedTitle: "Vertraut von Restaurants",
    activeRestaurants: "Aktive Restaurants",
    menuViewsMonthly: "Speisekarten-Aufrufe monatlich",
    uptimeGuarantee: "99,9% Verfügbarkeit",
    customerSupport: "24/7 Support",

    // Testimonials
    testimonialsTitle: "Was unsere Kunden sagen",
    testimonial1:
      "MenuBase hat die Art verändert, wie wir unsere Speisekarte verwalten. Updates sind sofort verfügbar und unsere Kunden lieben das QR-Code-Erlebnis.",
    testimonial1Author: "Maria Schmidt, Gasthaus Alpenblick",
    testimonial2:
      "Die Analysen helfen uns zu verstehen, welche Gerichte beliebt sind. Wir haben unseren Umsatz um 15% gesteigert seit dem Wechsel.",
    testimonial2Author: "Johann Weber, Restaurant Donauufer",
    testimonial3:
      "Perfekt für unsere mehreren Standorte. Wir können alle Speisekarten von einem Ort aus aktualisieren und Konsistenz bewahren.",
    testimonial3Author: "Ana Novak, Kavarna Ljubljana",

    // CTA Section
    ctaTitle: "Bereit, Ihre Speisekarte zu modernisieren?",
    ctaSubtitle:
      "Schließen Sie sich Hunderten von Restaurants an, die bereits MenuBase verwenden, um bessere Kundenerlebnisse zu schaffen",
    startFreeTrial: "Kostenlose Testversion starten",
    ctaFooter: "Keine Kreditkarte erforderlich • 14-tägige kostenlose Testversion • Jederzeit kündbar",

    // Impressum page translation keys in German
    impressumTitle: "Impressum",
    impressumSubtitle: "Angaben gemäß § 5 TMG",
    impressumCompany: "Unternehmen",
    impressumAddress: "MenuBase\n[Firmenadresse einfügen]\nÖsterreich",
    impressumContact: "Kontakt",
    impressumEmail: "E-Mail: info@menubase.eu",
    impressumPhone: "Telefon: +43 123 456 789",
    impressumVat: "Umsatzsteuer-ID",
    impressumVatText:
      "Umsatzsteuer-Identifikationsnummer: ATU12345678\nHandelsregister: FN 123456a\nRegistergericht: Graz",
    impressumResponsible: "Verantwortlich für den Inhalt",
    impressumDisclaimer: "Haftungsausschluss",
    impressumContentLiability: "Haftung für Inhalte",
    impressumContentText:
      "Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen.",
    impressumLinksLiability: "Haftung für Links",
    impressumLinksText:
      "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("smartmenu-language") as Language
      if (saved && (saved === "en" || saved === "de")) {
        setLanguage(saved)
      }
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("smartmenu-language", lang)
    }
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
