import React, { createContext, useContext, useEffect, useState } from 'react';

export type LanguageCode = 'English' | 'Spanish' | 'German' | 'Arabic' | 'Urdu';

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'beloz-selected-language';
const DEFAULT_LANGUAGE: LanguageCode = 'English';

export const uiLabels: Record<LanguageCode, any> = {
  English: {
    sidebar: {
      user: 'User',
      history: 'History',
      languages: 'Language & Rate',
      lines: 'Line and Extensions',
    },
    header: {
      notifications: 'Notifications',
      myProfile: 'My Profile',
      logout: 'Logout',
      admin: 'Admin',
    },
    notificationItems: [
      'New interpreter request pending',
      'CSR role change approved',
      'Language rate updated',
    ],
    pages: {
      languagesPage: {
        title: 'Language & Rate',
        subtitle: 'Select a language to apply to this page.',
        button: 'Add Language',
        createHeader: 'Create New Language',
        addModalTitle: 'Add New Language',
        editModalTitle: 'Edit Language',
        deleteModalTitle: 'Delete Language Confirmation',
        deleteConfirmation: 'This will permanently remove the selected language.',
        tableHeaders: {
          language: 'Language',
          languageGroup: 'Language Group',
          normalCallRate: 'Normal Call Rate (per minute)',
          emergencyCallRate: 'Emergency Call Rate (per minute)',
          rate: 'Rate / Min',
          status: 'Status',
          edit: 'Edit',
          delete: 'Delete Language',
        },
        statusMap: {
          Active: 'Active',
          Inactive: 'Inactive',
        },
        btnCreate: 'Create',
        btnSave: 'Save',
        btnYesDelete: 'Yes, Delete it',
        btnNoKeep: 'No, Keep it',
      },
      linesPage: {
        title: 'Line and Extensions',
        button: 'Add Line',
        createHeader: 'New Line',
        tableHeaders: {
          lineName: 'Line Name',
          extension: 'Extension',
          assignedTo: 'Assigned To',
          status: 'Status',
        },
        menuItems: {
          salesLine: 'Sales Line',
          supportLine: 'Support Line',
        },
      },
      usersPage: {
        title: 'User',
        filterAll: 'All',
        filterInterpreter: 'Interpreter',
        filterCSR: 'CSR',
        filterCustomer: 'Customer',
        filterWebManager: 'Web Manager',
        createButton: 'Create New User',
        createHeader: 'Create New',
        newInterpreter: 'New Interpreter',
        newCSR: 'New CSR',
        newManager: 'New Manager',
        newCustomer: 'New Customer',
        tableHeaders: {
          name: 'Name',
          email: 'Email',
          phone: 'Phone',
          role: 'Role',
          extension: 'Extension',
          language: 'Language',
          status: 'Status',
          edit: 'Edit',
          delete: 'Delete',
        },
        formLabels: {
          fullName: 'Full Name',
          emailAddress: 'Email Address',
          phoneNumber: 'Phone Number',
          preferredLanguage: 'Preferred Language',
          skill: 'Skill',
          department: 'Department',
          enterprise: 'Enterprise',
          gender: 'Gender',
          requestGender: 'Request Gender',
        },
        buttons: {
          cancel: 'Cancel',
          submit: 'Submit',
          back: 'Back',
          submitRequest: 'Submit Request',
        },
        toast: {
          interpreter: 'Interpreter request submitted',
          csr: 'CSR request submitted',
          manager: 'Manager request submitted',
          customer: 'Customer request submitted',
        },
      },
      historyPage: {
        pageTitle: {
          interpreter: "Interpreter's History",
          csr: "CSR's History",
          customer: "Customer's History",
          webManager: 'Web Manager',
          mobileInterpreter: 'Mobile Interpreter History',
          mobileManager: 'Mobile Manager History',
        },
        historyFilterButton: 'History',
        dropdown: {
          interpreter: "Interpreter's History",
          csr: "CSR's History",
          customer: "Customer's History",
          webManager: 'Web Manager',
          mobileInterpreter: 'Mobile Interpreter History',
          mobileManager: 'Mobile Manager History',
        },
        tableHeaders: {
          enterprise: 'Enterprise',
          dateTime: 'Date & Time',
          accessCode: 'Access Code',
          phone: 'Phone',
          language: 'Language',
          duration: 'Duration',
          edit: 'Edit',
          delete: 'Delete',
        },
        editModal: {
          title: 'Edit history record',
          enterprise: 'Enterprise',
          dateTime: 'Date & Time',
          accessCode: 'Access Code',
          phone: 'Phone',
          language: 'Language',
          duration: 'Duration',
          cancel: 'Cancel',
          saveChanges: 'Save Changes',
        },
        pagination: {
          page: 'Page',
        },
      },
      addInterpreterPage: {
        title: 'Add New Interpreter / CSR',
        fullName: 'Full Name',
        emailAddress: 'Email Address',
        phoneNumber: 'Phone Number',
        requestType: 'Request Type',
        preferredLanguage: 'Preferred Language',
        skill: 'Skill',
        requestGender: 'Request Gender',
        back: 'Back',
        submitRequest: 'Submit Request',
      },
      addCSRPage: {
        title: 'Add New CSR',
        fullName: 'Full Name',
        emailAddress: 'Email Address',
        phoneNumber: 'Phone Number',
        language: 'Language',
        skill: 'Skill',
        gender: 'Gender',
        back: 'Back',
        addCSR: 'Add CSR',
      },
      addManagerPage: {
        title: 'Add New Manager',
        fullName: 'Full Name',
        emailAddress: 'Email Address',
        phoneNumber: 'Phone Number',
        department: 'Department',
        language: 'Language',
        gender: 'Gender',
        back: 'Back',
        addManager: 'Add Manager',
      },
      addCustomerPage: {
        title: 'Add New Customer',
        fullName: 'Full Name',
        emailAddress: 'Email Address',
        phoneNumber: 'Phone Number',
        enterprise: 'Enterprise',
        preferredLanguage: 'Preferred Language',
        back: 'Back',
        addCustomer: 'Add Customer',
      },
      editInterpreterPage: {
        title: 'Edit Interpreter / CSR',
        fullName: 'Full Name',
        emailAddress: 'Email',
        phoneNumber: 'Phone Number',
        language: 'Language',
        skill: 'Skill',
        requestGender: 'Request Gender',
        back: 'Back',
        saveChanges: 'Save Changes',
      },
      editCSRPage: {
        title: 'Edit CSR',
        fullName: 'Full Name',
        emailAddress: 'Email',
        phoneNumber: 'Phone Number',
        language: 'Language',
        skill: 'Skill',
        gender: 'Gender',
        back: 'Back',
        saveChanges: 'Save Changes',
      },
      editManagerPage: {
        title: 'Edit Manager',
        fullName: 'Full Name',
        emailAddress: 'Email',
        phoneNumber: 'Phone Number',
        department: 'Department',
        language: 'Language',
        gender: 'Gender',
        back: 'Back',
        saveManager: 'Save Manager',
      },
    },
  },
  Spanish: {
    sidebar: {
      user: 'Usuario',
      history: 'Historial',
      languages: 'Idioma y tarifa',
      lines: 'Líneas y extensiones',
    },
    header: {
      notifications: 'Notificaciones',
      myProfile: 'Mi perfil',
      logout: 'Cerrar sesión',
      admin: 'Administrador',
    },
    notificationItems: [
      'Solicitud de intérprete nueva pendiente',
      'Cambio de rol CSR aprobado',
      'Tarifa de idioma actualizada',
    ],
    pages: {
      languagesPage: {
        title: 'Idioma y tarifa',
        subtitle: 'Seleccione un idioma para aplicar en esta página.',
        button: 'Agregar idioma',
        createHeader: 'Crear nuevo idioma',
        addModalTitle: 'Agregar nuevo idioma',
        editModalTitle: 'Editar idioma',
        deleteModalTitle: 'Confirmación de eliminación',
        deleteConfirmation: 'Esto eliminará permanentemente el idioma seleccionado.',
        tableHeaders: {
          language: 'Idioma',
          languageGroup: 'Grupo de idioma',
          normalCallRate: 'Tarifa llamada normal (por minuto)',
          emergencyCallRate: 'Tarifa llamada de emergencia (por minuto)',
          rate: 'Tarifa / Min',
          status: 'Estado',
          edit: 'Editar',
          delete: 'Eliminar idioma',
        },
        statusMap: {
          Active: 'Activo',
          Inactive: 'Inactivo',
        },
        btnCreate: 'Crear',
        btnSave: 'Guardar',
        btnYesDelete: 'Sí, eliminar',
        btnNoKeep: 'No, mantener',
      },
      linesPage: {
        title: 'Líneas y extensiones',
        button: 'Agregar línea',
        createHeader: 'Nueva línea',
        tableHeaders: {
          lineName: 'Nombre de la línea',
          extension: 'Extensión',
          assignedTo: 'Asignado a',
          status: 'Estado',
        },
        menuItems: {
          salesLine: 'Línea de ventas',
          supportLine: 'Línea de soporte',
        },
      },
      usersPage: {
        title: 'Usuario',
        filterAll: 'Todo',
        filterInterpreter: 'Intérprete',
        filterCSR: 'CSR',
        filterCustomer: 'Cliente',
        filterWebManager: 'Administrador web',
        createButton: 'Crear nuevo usuario',
        createHeader: 'Crear nuevo',
        newInterpreter: 'Nuevo intérprete',
        newCSR: 'Nuevo CSR',
        newManager: 'Nuevo gerente',
        newCustomer: 'Nuevo cliente',
        tableHeaders: {
          name: 'Nombre',
          email: 'Correo',
          phone: 'Teléfono',
          role: 'Rol',
          extension: 'Extensión',
          language: 'Idioma',
          status: 'Estado',
          edit: 'Editar',
          delete: 'Eliminar',
        },
        formLabels: {
          fullName: 'Nombre completo',
          emailAddress: 'Correo electrónico',
          phoneNumber: 'Número de teléfono',
          preferredLanguage: 'Idioma preferido',
          skill: 'Habilidad',
          department: 'Departamento',
          enterprise: 'Empresa',
          gender: 'Género',
          requestGender: 'Género solicitado',
        },
        buttons: {
          cancel: 'Cancelar',
          submit: 'Enviar',
          back: 'Volver',
          submitRequest: 'Enviar solicitud',
        },
        toast: {
          interpreter: 'Solicitud de intérprete enviada',
          csr: 'Solicitud CSR enviada',
          manager: 'Solicitud de gerente enviada',
          customer: 'Solicitud de cliente enviada',
        },
      },
      historyPage: {
        pageTitle: {
          interpreter: 'Historial del intérprete',
          csr: 'Historial del CSR',
          customer: 'Historial del cliente',
          webManager: 'Administrador web',
          mobileInterpreter: 'Historial del intérprete móvil',
          mobileManager: 'Historial del gerente móvil',
        },
        historyFilterButton: 'Historial',
        dropdown: {
          interpreter: 'Historial del intérprete',
          csr: 'Historial del CSR',
          customer: 'Historial del cliente',
          webManager: 'Administrador web',
          mobileInterpreter: 'Historial del intérprete móvil',
          mobileManager: 'Historial del gerente móvil',
        },
        tableHeaders: {
          enterprise: 'Empresa',
          dateTime: 'Fecha y hora',
          accessCode: 'Código de acceso',
          phone: 'Teléfono',
          language: 'Idioma',
          duration: 'Duración',
          edit: 'Editar',
          delete: 'Eliminar',
        },
        editModal: {
          title: 'Editar historial',
          enterprise: 'Empresa',
          dateTime: 'Fecha y hora',
          accessCode: 'Código de acceso',
          phone: 'Teléfono',
          language: 'Idioma',
          duration: 'Duración',
          cancel: 'Cancelar',
          saveChanges: 'Guardar cambios',
        },
        pagination: {
          page: 'Página',
        },
      },
      addInterpreterPage: {
        title: 'Agregar nuevo intérprete / CSR',
        fullName: 'Nombre completo',
        emailAddress: 'Correo electrónico',
        phoneNumber: 'Número de teléfono',
        requestType: 'Tipo de solicitud',
        preferredLanguage: 'Idioma preferido',
        skill: 'Habilidad',
        requestGender: 'Género solicitado',
        back: 'Volver',
        submitRequest: 'Enviar solicitud',
      },
      addCSRPage: {
        title: 'Agregar nuevo CSR',
        fullName: 'Nombre completo',
        emailAddress: 'Correo electrónico',
        phoneNumber: 'Número de teléfono',
        language: 'Idioma',
        skill: 'Habilidad',
        gender: 'Género',
        back: 'Volver',
        addCSR: 'Agregar CSR',
      },
      addManagerPage: {
        title: 'Agregar nuevo gerente',
        fullName: 'Nombre completo',
        emailAddress: 'Correo electrónico',
        phoneNumber: 'Número de teléfono',
        department: 'Departamento',
        language: 'Idioma',
        gender: 'Género',
        back: 'Volver',
        addManager: 'Agregar gerente',
      },
      addCustomerPage: {
        title: 'Agregar nuevo cliente',
        fullName: 'Nombre completo',
        emailAddress: 'Correo electrónico',
        phoneNumber: 'Número de teléfono',
        enterprise: 'Empresa',
        preferredLanguage: 'Idioma preferido',
        back: 'Volver',
        addCustomer: 'Agregar cliente',
      },
      editInterpreterPage: {
        title: 'Editar intérprete / CSR',
        fullName: 'Nombre completo',
        emailAddress: 'Correo',
        phoneNumber: 'Número de teléfono',
        language: 'Idioma',
        skill: 'Habilidad',
        requestGender: 'Género solicitado',
        back: 'Volver',
        saveChanges: 'Guardar cambios',
      },
      editCSRPage: {
        title: 'Editar CSR',
        fullName: 'Nombre completo',
        emailAddress: 'Correo',
        phoneNumber: 'Número de teléfono',
        language: 'Idioma',
        skill: 'Habilidad',
        gender: 'Género',
        back: 'Volver',
        saveChanges: 'Guardar cambios',
      },
      editManagerPage: {
        title: 'Editar gerente',
        fullName: 'Nombre completo',
        emailAddress: 'Correo',
        phoneNumber: 'Número de teléfono',
        department: 'Departamento',
        language: 'Idioma',
        gender: 'Género',
        back: 'Volver',
        saveManager: 'Guardar gerente',
      },
    },
  },
  German: {
    sidebar: { user: 'Benutzer', history: 'Verlauf', languages: 'Sprache & Tarif', lines: 'Leitungen & Durchwahlen' },
    header: { notifications: 'Benachrichtigungen', myProfile: 'Mein Profil', logout: 'Abmelden', admin: 'Administrator' },
    pages: { languagesPage: { title: 'Sprache & Tarif', subtitle: 'Wählen Sie eine Sprache.', createHeader: 'Neue Sprache erstellen', addModalTitle: 'Neue Sprache hinzufügen', editModalTitle: 'Sprache bearbeiten', deleteModalTitle: 'Löschbestätigung', deleteConfirmation: 'Dies entfernt die ausgewählte Sprache dauerhaft.', tableHeaders: { language: 'Sprache', languageGroup: 'Sprachgruppe', normalCallRate: 'Normaler Tarif (pro Minute)', emergencyCallRate: 'Notfall-Tarif (pro Minute)', rate: 'Tarif / Min', status: 'Status', edit: 'Bearbeiten', delete: 'Sprache löschen' }, btnCreate: 'Erstellen', btnSave: 'Speichern', btnYesDelete: 'Ja, löschen', btnNoKeep: 'Nein, behalten' }, linesPage: { title: 'Leitungen & Durchwahlen', button: 'Leitung hinzufügen', createHeader: 'Neue Leitung', tableHeaders: { lineName: 'Leitungsname', extension: 'Durchwahl', assignedTo: 'Zugewiesen an', status: 'Status' }, menuItems: { salesLine: 'Vertriebsleitung', supportLine: 'Supportleitung' } }, usersPage: { title: 'Benutzer', filterAll: 'Alle', filterInterpreter: 'Dolmetscher', filterCSR: 'CSR', filterCustomer: 'Kunde', filterWebManager: 'Web-Manager', createButton: 'Neuen Benutzer erstellen', createHeader: 'Neu erstellen', newInterpreter: 'Neuer Dolmetscher', newCSR: 'Neuer CSR', newManager: 'Neuer Manager', newCustomer: 'Neuer Kunde', tableHeaders: { name: 'Name', email: 'E-Mail', phone: 'Telefon', role: 'Rolle', extension: 'Durchwahl', language: 'Sprache', status: 'Status', edit: 'Bearbeiten', delete: 'Löschen' }, formLabels: { fullName: 'Vollständiger Name', emailAddress: 'E-Mail-Adresse', phoneNumber: 'Telefonnummer', preferredLanguage: 'Bevorzugte Sprache', skill: 'Fähigkeit', department: 'Abteilung', enterprise: 'Unternehmen', gender: 'Geschlecht', requestGender: 'Angefordertes Geschlecht' }, buttons: { cancel: 'Abbrechen', submit: 'Absenden', back: 'Zurück', submitRequest: 'Anfrage absenden' }, toast: { interpreter: 'Dolmetscher-Anfrage gesendet', csr: 'CSR-Anfrage gesendet', manager: 'Manager-Anfrage gesendet', customer: 'Kundenanfrage gesendet' } }, historyPage: { pageTitle: { interpreter: 'Dolmetscher-Verlauf', csr: 'CSR-Verlauf', customer: 'Kundenverlauf', webManager: 'Web-Manager', mobileInterpreter: 'Mobiler Dolmetscher-Verlauf', mobileManager: 'Mobiler Manager-Verlauf' }, historyFilterButton: 'Verlauf', dropdown: { interpreter: 'Dolmetscher-Verlauf', csr: 'CSR-Verlauf', customer: 'Kundenverlauf', webManager: 'Web-Manager', mobileInterpreter: 'Mobiler Dolmetscher-Verlauf', mobileManager: 'Mobiler Manager-Verlauf' }, tableHeaders: { enterprise: 'Unternehmen', dateTime: 'Datum & Uhrzeit', accessCode: 'Zugriffscode', phone: 'Telefon', language: 'Sprache', duration: 'Dauer', edit: 'Bearbeiten', delete: 'Löschen' }, editModal: { title: 'Verlauf bearbeiten', enterprise: 'Unternehmen', dateTime: 'Datum & Uhrzeit', accessCode: 'Zugriffscode', phone: 'Telefon', language: 'Sprache', duration: 'Dauer', cancel: 'Abbrechen', saveChanges: 'Änderungen speichern' }, pagination: { page: 'Seite' } }, addInterpreterPage: { title: 'Neuen Dolmetscher / CSR hinzufügen', fullName: 'Vollständiger Name', emailAddress: 'E-Mail-Adresse', phoneNumber: 'Telefonnummer', requestType: 'Anfrageart', preferredLanguage: 'Bevorzugte Sprache', skill: 'Fähigkeit', requestGender: 'Angefordertes Geschlecht', back: 'Zurück', submitRequest: 'Anfrage absenden' }, addCSRPage: { title: 'Neuen CSR hinzufügen', fullName: 'Vollständiger Name', emailAddress: 'E-Mail-Adresse', phoneNumber: 'Telefonnummer', language: 'Sprache', skill: 'Fähigkeit', gender: 'Geschlecht', back: 'Zurück', addCSR: 'CSR hinzufügen' }, addManagerPage: { title: 'Neuen Manager hinzufügen', fullName: 'Vollständiger Name', emailAddress: 'E-Mail-Adresse', phoneNumber: 'Telefonnummer', department: 'Abteilung', language: 'Sprache', gender: 'Geschlecht', back: 'Zurück', addManager: 'Manager hinzufügen' }, addCustomerPage: { title: 'Neuen Kunden hinzufügen', fullName: 'Vollständiger Name', emailAddress: 'E-Mail-Adresse', phoneNumber: 'Telefonnummer', enterprise: 'Unternehmen', preferredLanguage: 'Bevorzugte Sprache', back: 'Zurück', addCustomer: 'Kunde hinzufügen' }, editInterpreterPage: { title: 'Dolmetscher / CSR bearbeiten', fullName: 'Vollständiger Name', emailAddress: 'E-Mail', phoneNumber: 'Telefonnummer', language: 'Sprache', skill: 'Fähigkeit', requestGender: 'Angefordertes Geschlecht', back: 'Zurück', saveChanges: 'Änderungen speichern' }, editCSRPage: { title: 'CSR bearbeiten', fullName: 'Vollständiger Name', emailAddress: 'E-Mail', phoneNumber: 'Telefonnummer', language: 'Sprache', skill: 'Fähigkeit', gender: 'Geschlecht', back: 'Zurück', saveChanges: 'Änderungen speichern' }, editManagerPage: { title: 'Manager bearbeiten', fullName: 'Vollständiger Name', emailAddress: 'E-Mail', phoneNumber: 'Telefonnummer', department: 'Abteilung', language: 'Sprache', gender: 'Geschlecht', back: 'Zurück', saveManager: 'Manager speichern' } }
  },
  Arabic: {
    sidebar: { user: 'المستخدم', history: 'السجل', languages: 'اللغة والسعر', lines: 'الخطوط والملحقات' },
    header: { notifications: 'الإشعارات', myProfile: 'ملفي الشخصي', logout: 'تسجيل الخروج', admin: 'المسؤول' },
    pages: { languagesPage: { title: 'اللغة والسعر', subtitle: 'اختر لغة.', createHeader: 'إنشاء لغة جديدة', addModalTitle: 'إضافة لغة جديدة', editModalTitle: 'تعديل اللغة', deleteModalTitle: 'تأكيد الحذف', deleteConfirmation: 'سيتم حذف اللغة المحددة نهائيًا.', tableHeaders: { language: 'اللغة', languageGroup: 'مجموعة اللغة', normalCallRate: 'سعر المكالمة العادية (لكل دقيقة)', emergencyCallRate: 'سعر مكالمة الطوارئ (لكل دقيقة)', rate: 'السعر / دقيقة', status: 'الحالة', edit: 'تعديل', delete: 'حذف اللغة' }, btnCreate: 'إنشاء', btnSave: 'حفظ', btnYesDelete: 'نعم، احذف', btnNoKeep: 'لا، احتفظ' }, linesPage: { title: 'الخطوط والملحقات', button: 'إضافة خط', createHeader: 'خط جديد', tableHeaders: { lineName: 'اسم الخط', extension: 'الملحق', assignedTo: 'مخصص لـ', status: 'الحالة' }, menuItems: { salesLine: 'خط المبيعات', supportLine: 'خط الدعم' } }, usersPage: { title: 'المستخدم', filterAll: 'الكل', filterInterpreter: 'المترجم', filterCSR: 'CSR', filterCustomer: 'العميل', filterWebManager: 'مدير الويب', createButton: 'إنشاء مستخدم جديد', createHeader: 'إنشاء جديد', newInterpreter: 'مترجم جديد', newCSR: 'CSR جديد', newManager: 'مدير جديد', newCustomer: 'عميل جديد', tableHeaders: { name: 'الاسم', email: 'البريد الإلكتروني', phone: 'الهاتف', role: 'الدور', extension: 'الملحق', language: 'اللغة', status: 'الحالة', edit: 'تعديل', delete: 'حذف' }, formLabels: { fullName: 'الاسم الكامل', emailAddress: 'البريد الإلكتروني', phoneNumber: 'رقم الهاتف', preferredLanguage: 'اللغة المفضلة', skill: 'المهارة', department: 'القسم', enterprise: 'المؤسسة', gender: 'الجنس', requestGender: 'الجنس المطلوب' }, buttons: { cancel: 'إلغاء', submit: 'إرسال', back: 'رجوع', submitRequest: 'إرسال الطلب' }, toast: { interpreter: 'تم إرسال طلب المترجم', csr: 'تم إرسال طلب CSR', manager: 'تم إرسال طلب المدير', customer: 'تم إرسال طلب العميل' } }, historyPage: { pageTitle: { interpreter: 'سجل المترجم', csr: 'سجل CSR', customer: 'سجل العميل', webManager: 'مدير الويب', mobileInterpreter: 'سجل المترجم المحمول', mobileManager: 'سجل المدير المحمول' }, historyFilterButton: 'السجل', dropdown: { interpreter: 'سجل المترجم', csr: 'سجل CSR', customer: 'سجل العميل', webManager: 'مدير الويب', mobileInterpreter: 'سجل المترجم المحمول', mobileManager: 'سجل المدير المحمول' }, tableHeaders: { enterprise: 'المؤسسة', dateTime: 'التاريخ والوقت', accessCode: 'رمز الوصول', phone: 'الهاتف', language: 'اللغة', duration: 'المدة', edit: 'تعديل', delete: 'حذف' }, editModal: { title: 'تعديل السجل', enterprise: 'المؤسسة', dateTime: 'التاريخ والوقت', accessCode: 'رمز الوصول', phone: 'الهاتف', language: 'اللغة', duration: 'المدة', cancel: 'إلغاء', saveChanges: 'حفظ التغييرات' }, pagination: { page: 'الصفحة' } }, addInterpreterPage: { title: 'إضافة مترجم / CSR جديد', fullName: 'الاسم الكامل', emailAddress: 'البريد الإلكتروني', phoneNumber: 'رقم الهاتف', requestType: 'نوع الطلب', preferredLanguage: 'اللغة المفضلة', skill: 'المهارة', requestGender: 'الجنس المطلوب', back: 'رجوع', submitRequest: 'إرسال الطلب' }, addCSRPage: { title: 'إضافة CSR جديد', fullName: 'الاسم الكامل', emailAddress: 'البريد الإلكتروني', phoneNumber: 'رقم الهاتف', language: 'اللغة', skill: 'المهارة', gender: 'الجنس', back: 'رجوع', addCSR: 'إضافة CSR' }, addManagerPage: { title: 'إضافة مدير جديد', fullName: 'الاسم الكامل', emailAddress: 'البريد الإلكتروني', phoneNumber: 'رقم الهاتف', department: 'القسم', language: 'اللغة', gender: 'الجنس', back: 'رجوع', addManager: 'إضافة مدير' }, addCustomerPage: { title: 'إضافة عميل جديد', fullName: 'الاسم الكامل', emailAddress: 'البريد الإلكتروني', phoneNumber: 'رقم الهاتف', enterprise: 'المؤسسة', preferredLanguage: 'اللغة المفضلة', back: 'رجوع', addCustomer: 'إضافة عميل' }, editInterpreterPage: { title: 'تعديل المترجم / CSR', fullName: 'الاسم الكامل', emailAddress: 'البريد الإلكتروني', phoneNumber: 'رقم الهاتف', language: 'اللغة', skill: 'المهارة', requestGender: 'الجنس المطلوب', back: 'رجوع', saveChanges: 'حفظ التغييرات' }, editCSRPage: { title: 'تعديل CSR', fullName: 'الاسم الكامل', emailAddress: 'البريد الإلكتروني', phoneNumber: 'رقم الهاتف', language: 'اللغة', skill: 'المهارة', gender: 'الجنس', back: 'رجوع', saveChanges: 'حفظ التغييرات' }, editManagerPage: { title: 'تعديل المدير', fullName: 'الاسم الكامل', emailAddress: 'البريد الإلكتروني', phoneNumber: 'رقم الهاتف', department: 'القسم', language: 'اللغة', gender: 'الجنس', back: 'رجوع', saveManager: 'حفظ المدير' } }
  },
  Urdu: {
    sidebar: { user: 'صارف', history: 'تاریخ', languages: 'زبان اور ریٹ', lines: 'لائنز اور ایکسٹینشنز' },
    header: { notifications: 'نوٹیفکیشنز', myProfile: 'میری پروفائل', logout: 'لاگ آؤٹ', admin: 'ایڈمن' },
    pages: { languagesPage: { title: 'زبان اور ریٹ', subtitle: 'زبان منتخب کریں۔', createHeader: 'نئی زبان بنائیں', addModalTitle: 'نئی زبان شامل کریں', editModalTitle: 'زبان میں ترمیم کریں', deleteModalTitle: 'حذف کرنے کی تصدیق', deleteConfirmation: ' منتخب زبان مستقل طور پر حذف ہو جائے گی۔', tableHeaders: { language: 'زبان', languageGroup: 'زبان کا گروپ', normalCallRate: 'عام کال ریٹ (فی منٹ)', emergencyCallRate: 'ایمرجنسی کال ریٹ (فی منٹ)', rate: 'ریٹ / منٹ', status: 'اسٹیٹس', edit: 'ترمیم', delete: 'زبان حذف کریں' }, btnCreate: 'بنائیں', btnSave: 'محفوظ کریں', btnYesDelete: 'ہاں، حذف کریں', btnNoKeep: 'نہیں، رکھیں' }, linesPage: { title: 'لائنز اور ایکسٹینشنز', button: 'لائن شامل کریں', createHeader: 'نئی لائن', tableHeaders: { lineName: 'لائن کا نام', extension: 'ایکسٹینشن', assignedTo: 'تفویض شدہ', status: 'اسٹیٹس' }, menuItems: { salesLine: 'سیلز لائن', supportLine: 'سپورٹ لائن' } }, usersPage: { title: 'صارف', filterAll: 'سب', filterInterpreter: 'انٹرپریٹر', filterCSR: 'CSR', filterCustomer: 'گاہک', filterWebManager: 'ویب مینیجر', createButton: 'نیا صارف بنائیں', createHeader: 'نیا بنائیں', newInterpreter: 'نیا انٹرپریٹر', newCSR: 'نیا CSR', newManager: 'نیا مینیجر', newCustomer: 'نیا گاہک', tableHeaders: { name: 'نام', email: 'ای میل', phone: 'فون', role: 'کردار', extension: 'ایکسٹینشن', language: 'زبان', status: 'اسٹیٹس', edit: 'ترمیم', delete: 'حذف' }, formLabels: { fullName: 'پورا نام', emailAddress: 'ای میل ایڈریس', phoneNumber: 'فون نمبر', preferredLanguage: 'ترجیحی زبان', skill: 'مہارت', department: 'ڈپارٹمنٹ', enterprise: 'انٹرپرائز', gender: 'جنس', requestGender: 'درخواست جنس' }, buttons: { cancel: 'منسوخ کریں', submit: 'جمع کروائیں', back: 'واپس', submitRequest: 'درخواست جمع کروائیں' }, toast: { interpreter: 'انٹرپریٹر کی درخواست جمع', csr: 'CSR کی درخواست جمع', manager: 'مینیجر کی درخواست جمع', customer: 'گاہک کی درخواست جمع' } }, historyPage: { pageTitle: { interpreter: 'انٹرپریٹر کی تاریخ', csr: 'CSR کی تاریخ', customer: 'گاہک کی تاریخ', webManager: 'ویب مینیجر', mobileInterpreter: 'موبائل انٹرپریٹر ہسٹری', mobileManager: 'موبائل مینیجر ہسٹری' }, historyFilterButton: 'تاریخ', dropdown: { interpreter: 'انٹرپریٹر کی تاریخ', csr: 'CSR کی تاریخ', customer: 'گاہک کی تاریخ', webManager: 'ویب مینیجر', mobileInterpreter: 'موبائل انٹرپریٹر ہسٹری', mobileManager: 'موبائل مینیجر ہسٹری' }, tableHeaders: { enterprise: 'انٹرپرائز', dateTime: 'تاریخ اور وقت', accessCode: 'رسائی کوڈ', phone: 'فون', language: 'زبان', duration: 'مدت', edit: 'ترمیم', delete: 'حذف' }, editModal: { title: 'ریکارڈ میں ترمیم', enterprise: 'انٹرپرائز', dateTime: 'تاریخ اور وقت', accessCode: 'رسائی کوڈ', phone: 'فون', language: 'زبان', duration: 'مدت', cancel: 'منسوخ', saveChanges: 'تبدیلیاں محفوظ کریں' }, pagination: { page: 'صفحہ' } }, addInterpreterPage: { title: 'نیا انٹرپریٹر / CSR شامل کریں', fullName: 'پورا نام', emailAddress: 'ای میل ایڈریس', phoneNumber: 'فون نمبر', requestType: 'درخواست کی قسم', preferredLanguage: 'ترجیحی زبان', skill: 'مہارت', requestGender: 'درخواست جنس', back: 'واپس', submitRequest: 'درخواست جمع کروائیں' }, addCSRPage: { title: 'نیا CSR شامل کریں', fullName: 'پورا نام', emailAddress: 'ای میل ایڈریس', phoneNumber: 'فون نمبر', language: 'زبان', skill: 'مہارت', gender: 'جنس', back: 'واپس', addCSR: 'CSR شامل کریں' }, addManagerPage: { title: 'نیا مینیجر شامل کریں', fullName: 'پورا نام', emailAddress: 'ای میل ایڈریس', phoneNumber: 'فون نمبر', department: 'ڈپارٹمنٹ', language: 'زبان', gender: 'جنس', back: 'واپس', addManager: 'مینیجر شامل کریں' }, addCustomerPage: { title: 'نیا گاہک شامل کریں', fullName: 'پورا نام', emailAddress: 'ای میل ایڈریس', phoneNumber: 'فون نمبر', enterprise: 'انٹرپرائز', preferredLanguage: 'ترجیحی زبان', back: 'واپس', addCustomer: 'گاہک شامل کریں' }, editInterpreterPage: { title: 'انٹرپریٹر / CSR میں ترمیم', fullName: 'پورا نام', emailAddress: 'ای میل', phoneNumber: 'فون نمبر', language: 'زبان', skill: 'مہارت', requestGender: 'درخواست جنس', back: 'واپس', saveChanges: 'تبدیلیاں محفوظ کریں' }, editCSRPage: { title: 'CSR میں ترمیم', fullName: 'پورا نام', emailAddress: 'ای میل', phoneNumber: 'فون نمبر', language: 'زبان', skill: 'مہارت', gender: 'جنس', back: 'واپس', saveChanges: 'تبدیلیاں محفوظ کریں' }, editManagerPage: { title: 'مینیجر میں ترمیم', fullName: 'پورا نام', emailAddress: 'ای میل', phoneNumber: 'فون نمبر', department: 'ڈپارٹمنٹ', language: 'زبان', gender: 'جنس', back: 'واپس', saveManager: 'مینیجر محفوظ کریں' } }
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (uiLabels as Record<string, unknown>)[stored]) {
      return stored as LanguageCode;
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
