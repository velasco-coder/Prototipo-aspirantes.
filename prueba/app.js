(() => {
  "use strict";

  const STATES = Object.freeze({
    REGISTERED: "registrado",
    INCOMPLETE_DATA: "datos_incompletos",
    CENEVAL_PAYMENT_PENDING: "pendiente_pago_ceneval",
    CENEVAL_PAYMENT_UPLOADED: "pago_ceneval_cargado",
    CENEVAL_PAYMENT_REJECTED: "pago_ceneval_rechazado",
    CENEVAL_PAYMENT_VALIDATED: "pago_ceneval_validado",
    EVALUATION_PENDING: "evaluacion_pendiente",
    EVALUATED: "evaluado",
    NOT_ACCEPTED: "no_aceptado",
    ACCEPTED: "aceptado",
    DOCUMENTS_PENDING: "documentos_pendientes",
    DOCUMENTS_UPLOADED: "documentos_cargados",
    DOCUMENTS_OBSERVED: "documentos_observados",
    DOCUMENTS_VALIDATED: "documentos_validados",
    ENROLLMENT_PAYMENT_PENDING: "pendiente_pago_inscripcion",
    ENROLLMENT_PAYMENT_VALIDATED: "pago_inscripcion_validado",
    ENROLLED: "inscrito",
    INACTIVE: "inactivo",
  });

  const LABELS = Object.freeze({
    state: {
      [STATES.REGISTERED]: "Registrado",
      [STATES.INCOMPLETE_DATA]: "Datos incompletos",
      [STATES.CENEVAL_PAYMENT_PENDING]: "Pendiente pago CENEVAL",
      [STATES.CENEVAL_PAYMENT_UPLOADED]: "Comprobante CENEVAL cargado",
      [STATES.CENEVAL_PAYMENT_REJECTED]: "Pago CENEVAL rechazado",
      [STATES.CENEVAL_PAYMENT_VALIDATED]: "Pago CENEVAL validado",
      [STATES.EVALUATION_PENDING]: "Evaluacion pendiente",
      [STATES.EVALUATED]: "Evaluado",
      [STATES.NOT_ACCEPTED]: "No aceptado",
      [STATES.ACCEPTED]: "Aceptado",
      [STATES.DOCUMENTS_PENDING]: "Documentos pendientes",
      [STATES.DOCUMENTS_UPLOADED]: "Documentos cargados",
      [STATES.DOCUMENTS_OBSERVED]: "Documentos observados",
      [STATES.DOCUMENTS_VALIDATED]: "Documentos validados",
      [STATES.ENROLLMENT_PAYMENT_PENDING]: "Pendiente pago inscripcion",
      [STATES.ENROLLMENT_PAYMENT_VALIDATED]: "Pago inscripcion validado",
      [STATES.ENROLLED]: "Inscrito",
      [STATES.INACTIVE]: "Inactivo",
    },
    document: {
      pendiente: "Pendiente",
      cargado: "Cargado",
      valido: "Valido",
      no_valido: "No valido",
    },
    payment: {
      pendiente: "Pendiente",
      generado: "Generado",
      comprobante_cargado: "Comprobante cargado",
      validado: "Validado",
      rechazado: "Rechazado",
    },
  });

  const sharedViews = [
    { id: "guia_proyecto", label: "Guia del proyecto" },
    { id: "matriz_estados", label: "Matriz de estados" },
    { id: "reglas_negocio", label: "Reglas y permisos" },
  ];

  const CONFIG = Object.freeze({
    mockUsers: [
      {
        email: "aspirante@correo.com",
        password: "Aspirante123",
        name: "Carlos Emiliano Torres Salgado",
        role: "aspirante",
        accessType: "aspirante",
        applicantId: 1,
      },
      {
        email: "admisiones@utem.edu.mx",
        password: "Admisiones123",
        name: "Responsable de Admisiones",
        role: "admisiones",
        accessType: "institucional",
      },
      {
        email: "inscripciones@utem.edu.mx",
        password: "Inscripciones123",
        name: "Responsable de Inscripciones",
        role: "inscripciones",
        accessType: "institucional",
      },
      {
        email: "director.academico@utem.edu.mx",
        password: "Academico123",
        name: "Director Academico",
        role: "director_academico",
        accessType: "institucional",
      },
      {
        email: "director.carrera@utem.edu.mx",
        password: "Carrera123",
        name: "Director de Carrera",
        role: "director_carrera",
        accessType: "institucional",
      },
    ],
    roles: [
      { id: "aspirante", label: "Aspirante" },
      { id: "admisiones", label: "Responsable de Admisiones" },
      { id: "inscripciones", label: "Responsable de Inscripciones" },
      { id: "director_academico", label: "Director Academico" },
      { id: "director_carrera", label: "Director de Carrera" },
    ],
    careers: [
      "TSU en Contabilidad",
      "TSU en Quimica Area Industrial",
      "TSU en Tecnologias de la Informacion",
      "TSU en Gastronomia",
      "TSU en Mantenimiento",
      "TSU en Energias Renovables",
      "TSU en Logistica",
    ],
    requiredDocuments: [
      "Acta de nacimiento",
      "Certificado de bachillerato",
      "Comprobante de domicilio",
      "Foto del aspirante",
    ],
    glossary: [
      ["Aspirante", "Persona registrada para participar en el proceso de admision."],
      ["Aceptado", "Aspirante seleccionado despues de resultados o validacion institucional."],
      ["Nuevo ingreso", "Aceptado que esta completando documentos, pago y alta."],
      ["Alumno", "Persona inscrita oficialmente con numero de control."],
      ["Folio", "Identificador de solicitud de admision."],
      ["Numero de control", "Identificador academico que se asigna al alumno inscrito."],
    ],
    businessRules: [
      "El CURP no puede repetirse dentro del mismo prototipo.",
      "El promedio debe estar entre 0 y 10.",
      "No se captura resultado CENEVAL si el pago CENEVAL no fue validado.",
      "El comprobante de pago de inscripcion se maneja como pago, no como documento academico.",
      "No se genera ficha de inscripcion hasta que todos los documentos obligatorios esten validados.",
      "No se da de alta como alumno si faltan documentos validos.",
      "No se da de alta como alumno si falta pago de inscripcion validado.",
      "El cambio de carrera se solicita y lo resuelve Direccion Academica; no se aplica automaticamente desde el aspirante.",
      "El aspirante solo puede consultar el expediente asociado a su sesion.",
    ],
    acceptedStates: [
      STATES.ACCEPTED,
      STATES.DOCUMENTS_PENDING,
      STATES.DOCUMENTS_UPLOADED,
      STATES.DOCUMENTS_OBSERVED,
      STATES.DOCUMENTS_VALIDATED,
      STATES.ENROLLMENT_PAYMENT_PENDING,
      STATES.ENROLLMENT_PAYMENT_VALIDATED,
      STATES.ENROLLED,
    ],
    terminalStates: [STATES.NOT_ACCEPTED, STATES.ENROLLED, STATES.INACTIVE],
    flowStates: [
      STATES.REGISTERED,
      STATES.CENEVAL_PAYMENT_PENDING,
      STATES.CENEVAL_PAYMENT_UPLOADED,
      STATES.EVALUATION_PENDING,
      STATES.EVALUATED,
      STATES.ACCEPTED,
      STATES.DOCUMENTS_UPLOADED,
      STATES.DOCUMENTS_VALIDATED,
      STATES.ENROLLMENT_PAYMENT_PENDING,
      STATES.ENROLLMENT_PAYMENT_VALIDATED,
      STATES.ENROLLED,
    ],
    transitionMatrix: [
      [STATES.REGISTERED, "Generar ficha CENEVAL", STATES.CENEVAL_PAYMENT_PENDING, "Aspirante"],
      [STATES.CENEVAL_PAYMENT_PENDING, "Subir comprobante CENEVAL", STATES.CENEVAL_PAYMENT_UPLOADED, "Aspirante"],
      [STATES.CENEVAL_PAYMENT_UPLOADED, "Validar comprobante CENEVAL", STATES.EVALUATION_PENDING, "Responsable de Admisiones"],
      [STATES.CENEVAL_PAYMENT_UPLOADED, "Rechazar comprobante CENEVAL", STATES.CENEVAL_PAYMENT_REJECTED, "Responsable de Admisiones"],
      [STATES.EVALUATION_PENDING, "Capturar puntaje CENEVAL", STATES.EVALUATED, "Responsable de Admisiones"],
      [STATES.EVALUATED, "Aceptar aspirante", STATES.ACCEPTED, "Responsable de Admisiones"],
      [STATES.EVALUATED, "No aceptar aspirante", STATES.NOT_ACCEPTED, "Responsable de Admisiones"],
      [STATES.ACCEPTED, "Subir documentos", `${STATES.DOCUMENTS_PENDING}/${STATES.DOCUMENTS_UPLOADED}`, "Aceptado"],
      [STATES.DOCUMENTS_UPLOADED, "Validar todos los documentos", STATES.DOCUMENTS_VALIDATED, "Responsable de Inscripciones"],
      [STATES.DOCUMENTS_VALIDATED, "Generar ficha de inscripcion", STATES.ENROLLMENT_PAYMENT_PENDING, "Aceptado"],
      [STATES.ENROLLMENT_PAYMENT_PENDING, "Subir comprobante de inscripcion", STATES.ENROLLMENT_PAYMENT_PENDING, "Aceptado"],
      [STATES.ENROLLMENT_PAYMENT_PENDING, "Validar pago de inscripcion", STATES.ENROLLMENT_PAYMENT_VALIDATED, "Responsable de Inscripciones"],
      [STATES.ENROLLMENT_PAYMENT_VALIDATED, "Dar de alta alumno", STATES.ENROLLED, "Responsable de Inscripciones"],
    ],
    viewsByRole: {
      aspirante: [
        { id: "registro", label: "Registro" },
        { id: "portal_aspirante", label: "Panel del aspirante" },
      ],
      admisiones: [
        { id: "panel_admisiones", label: "Aspirantes y CENEVAL" },
        ...sharedViews,
      ],
      inscripciones: [
        { id: "panel_inscripciones", label: "Aceptados y documentos" },
        ...sharedViews,
      ],
      director_academico: [
        { id: "panel_director_academico", label: "Resumen academico" },
        ...sharedViews,
      ],
      director_carrera: [
        { id: "panel_director_carrera", label: "Carrera y grupos" },
        ...sharedViews,
      ],
    },
    maxCenevalScore: 1300,
    whatsappSupport: {
      phone: "523141466523",
      message: "Hola, quiero informacion sobre mi proceso de admision.",
    },
  });

  const Utils = {
    escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
    escapeAttr(value) {
      return Utils.escapeHtml(value);
    },
    slugify(value) {
      return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    },
    documentExtension(name) {
      return name.toLowerCase().includes("foto") ? "jpg" : "pdf";
    },
    list(items) {
      return items.join("");
    },
  };

  const Factory = {
    applicants() {
      return [
        {
          id: 1,
          folio: "ASP-2026-0001",
          nombre: "Carlos Emiliano",
          apellidoPaterno: "Torres",
          apellidoMaterno: "Salgado",
          curp: "TOSC060918HCMRLR08",
          correo: "carlos.torres@correo.com",
          telefono: "3147788899",
          fechaNacimiento: "2006-09-18",
          carrera: "TSU en Contabilidad",
          bachillerato: "CBTis 226",
          promedio: 8.7,
          estado: STATES.CENEVAL_PAYMENT_UPLOADED,
          activo: true,
          cenevalPago: {
            referencia: "CEN-0001",
            comprobante: true,
            estatus: "comprobante_cargado",
          },
          resultadoCeneval: null,
          documentos: Factory.documents(),
          pagoInscripcion: Factory.payment(),
          numeroControl: "",
          grupo: "",
          solicitudesCambio: [],
        },
        {
          id: 2,
          folio: "ASP-2026-0002",
          nombre: "Abigail",
          apellidoPaterno: "De la Cruz",
          apellidoMaterno: "Solano",
          curp: "CUSA060415MCMRLB05",
          correo: "abigail.solano@correo.com",
          telefono: "3145552211",
          fechaNacimiento: "2006-04-15",
          carrera: "TSU en Tecnologias de la Informacion",
          bachillerato: "Prepa UDG 12",
          promedio: 9.3,
          estado: STATES.ACCEPTED,
          activo: true,
          cenevalPago: {
            referencia: "CEN-0002",
            comprobante: true,
            estatus: "validado",
          },
          resultadoCeneval: 1006,
          documentos: Factory.documents("pendiente"),
          pagoInscripcion: Factory.payment(),
          numeroControl: "",
          grupo: "",
          solicitudesCambio: [
            {
              id: 1,
              destino: "TSU en Contabilidad",
              motivo: "Deseo cambiar al area financiera por afinidad con mi bachillerato.",
              estatus: "pendiente",
              respuesta: "",
            },
          ],
        },
        {
          id: 3,
          folio: "ASP-2026-0003",
          nombre: "Juan Pedro",
          apellidoPaterno: "Guerra",
          apellidoMaterno: "Glez",
          curp: "GUGJ060211HCMRZN09",
          correo: "juan.guerra@correo.com",
          telefono: "3149876543",
          fechaNacimiento: "2006-02-11",
          carrera: "TSU en Quimica Area Industrial",
          bachillerato: "CBTis 156 Cihuatlan",
          promedio: 8.1,
          estado: STATES.DOCUMENTS_UPLOADED,
          activo: true,
          cenevalPago: {
            referencia: "CEN-0003",
            comprobante: true,
            estatus: "validado",
          },
          resultadoCeneval: 950,
          documentos: Factory.documents("cargado"),
          pagoInscripcion: Factory.payment(),
          numeroControl: "",
          grupo: "",
          solicitudesCambio: [],
        },
        {
          id: 4,
          folio: "ASP-2026-0004",
          nombre: "Sofia",
          apellidoPaterno: "Mendoza",
          apellidoMaterno: "Rios",
          curp: "MERS060721MCMNFF04",
          correo: "sofia.mendoza@correo.com",
          telefono: "3144449988",
          fechaNacimiento: "2006-07-21",
          carrera: "TSU en Gastronomia",
          bachillerato: "Bachillerato Tecnico 8",
          promedio: 7.8,
          estado: STATES.ENROLLED,
          activo: true,
          cenevalPago: {
            referencia: "CEN-0004",
            comprobante: true,
            estatus: "validado",
          },
          resultadoCeneval: 890,
          documentos: Factory.documents("valido"),
          pagoInscripcion: Factory.payment("INS-0004", true, "validado"),
          numeroControl: "20260004",
          grupo: "1GAS1",
          solicitudesCambio: [],
        },
      ];
    },
    documents(status = "pendiente") {
      return CONFIG.requiredDocuments.map((name) => ({
        name,
        status,
        fileName: status === "pendiente" ? "" : `${Utils.slugify(name)}.${Utils.documentExtension(name)}`,
        observation: "",
      }));
    },
    payment(referencia = "", comprobante = false, estatus = "pendiente") {
      return { referencia, comprobante, estatus };
    },
    applicantFromForm(formData, nextId) {
      return {
        id: nextId,
        folio: `ASP-2026-${String(nextId).padStart(4, "0")}`,
        nombre: formData.get("nombre").trim(),
        apellidoPaterno: formData.get("apellidoPaterno").trim(),
        apellidoMaterno: formData.get("apellidoMaterno").trim(),
        curp: formData.get("curp").trim().toUpperCase(),
        correo: formData.get("correo").trim(),
        telefono: formData.get("telefono").trim(),
        fechaNacimiento: formData.get("fechaNacimiento"),
        carrera: formData.get("carrera"),
        bachillerato: formData.get("bachillerato").trim(),
        promedio: Number(formData.get("promedio")),
        estado: STATES.REGISTERED,
        activo: true,
        cenevalPago: Factory.payment(),
        resultadoCeneval: null,
        documentos: Factory.documents(),
        pagoInscripcion: Factory.payment(),
        numeroControl: "",
        grupo: "",
        solicitudesCambio: [],
      };
    },
  };

  const state = {
    session: null,
    loginAccessType: "aspirante",
    loginError: "",
    role: "aspirante",
    view: "registro",
    selectedApplicantId: 1,
    directorCareer: CONFIG.careers[0],
    filter: "",
    toast: "",
    validationErrors: [],
    applicants: Factory.applicants(),
  };

  const Selectors = {
    roleLabel(roleId) {
      return CONFIG.roles.find((role) => role.id === roleId)?.label || roleId;
    },
    viewsForRole(role) {
      return CONFIG.viewsByRole[role] || CONFIG.viewsByRole.aspirante;
    },
    userByCredentials(email, password, accessType) {
      return CONFIG.mockUsers.find(
        (user) =>
          user.email.toLowerCase() === String(email).trim().toLowerCase() &&
          user.password === password &&
          user.accessType === accessType
      );
    },
    applicantById(id) {
      return state.applicants.find((applicant) => applicant.id === Number(id));
    },
    selectedApplicant() {
      if (state.session?.role === "aspirante" && state.session.applicantId) {
        return Selectors.applicantById(state.session.applicantId) || state.applicants[0];
      }
      return Selectors.applicantById(state.selectedApplicantId) || state.applicants[0];
    },
    filteredApplicants() {
      const filter = state.filter.trim().toLowerCase();
      if (!filter) return state.applicants;

      return state.applicants.filter((applicant) =>
        [Rules.fullName(applicant), applicant.curp, applicant.carrera, applicant.folio].some((value) =>
          String(value).toLowerCase().includes(filter)
        )
      );
    },
    careerRequests() {
      return state.applicants.flatMap((applicant) =>
        applicant.solicitudesCambio.map((request) => ({ applicant, request }))
      );
    },
    nextApplicantId() {
      return Math.max(...state.applicants.map((applicant) => applicant.id)) + 1;
    },
  };

  const Rules = {
    fullName(applicant) {
      return `${applicant.nombre} ${applicant.apellidoPaterno} ${applicant.apellidoMaterno}`.trim();
    },
    acceptedStates() {
      return CONFIG.acceptedStates;
    },
    canAccessEnrollment(applicant) {
      return CONFIG.acceptedStates.includes(applicant.estado);
    },
    isTerminalState(applicant) {
      return CONFIG.terminalStates.includes(applicant.estado);
    },
    canGenerateCeneval(applicant) {
      return applicant.activo && !applicant.cenevalPago.referencia && !Rules.isTerminalState(applicant);
    },
    canUploadCeneval(applicant) {
      return (
        applicant.activo &&
        applicant.cenevalPago.referencia &&
        !applicant.cenevalPago.comprobante &&
        [STATES.CENEVAL_PAYMENT_PENDING, STATES.CENEVAL_PAYMENT_REJECTED].includes(applicant.estado)
      );
    },
    allDocumentsValid(applicant) {
      return applicant.documentos.length > 0 && applicant.documentos.every((doc) => doc.status === "valido");
    },
    canGenerateEnrollmentPayment(applicant) {
      return (
        Rules.canAccessEnrollment(applicant) &&
        Rules.allDocumentsValid(applicant) &&
        !applicant.pagoInscripcion.referencia &&
        applicant.estado !== STATES.ENROLLED
      );
    },
    canUploadEnrollmentPayment(applicant) {
      return (
        Rules.canAccessEnrollment(applicant) &&
        Rules.allDocumentsValid(applicant) &&
        applicant.pagoInscripcion.referencia &&
        !applicant.pagoInscripcion.comprobante &&
        applicant.estado !== STATES.ENROLLED
      );
    },
    canEnroll(applicant) {
      return (
        Rules.allDocumentsValid(applicant) &&
        applicant.pagoInscripcion.estatus === "validado" &&
        applicant.estado !== STATES.ENROLLED
      );
    },
    canRequestCareerChange(applicant) {
      return [
        STATES.ACCEPTED,
        STATES.DOCUMENTS_PENDING,
        STATES.DOCUMENTS_UPLOADED,
        STATES.DOCUMENTS_OBSERVED,
        STATES.DOCUMENTS_VALIDATED,
        STATES.ENROLLMENT_PAYMENT_PENDING,
      ].includes(applicant.estado);
    },
    groupPrefix(career) {
      if (career.includes("Contabilidad")) return "CNT";
      if (career.includes("Quimica")) return "QAI";
      if (career.includes("Tecnologias")) return "TID";
      if (career.includes("Gastronomia")) return "GAS";
      if (career.includes("Mantenimiento")) return "MMP";
      if (career.includes("Energias")) return "ERE";
      return "LCS";
    },
  };

  const Mutations = {
    resetData() {
      state.applicants = Factory.applicants();
      state.selectedApplicantId = 1;
      if (state.session?.role === "aspirante") {
        const applicant = state.applicants[0];
        state.session.applicantId = applicant.id;
        state.session.name = Rules.fullName(applicant);
      }
      state.filter = "";
      state.validationErrors = [];
    },
    startSession(user) {
      state.session = {
        email: user.email,
        name: user.name,
        role: user.role,
        accessType: user.accessType,
        applicantId: user.applicantId || null,
      };
      state.role = user.role;
      state.view = user.role === "aspirante" ? "portal_aspirante" : Selectors.viewsForRole(user.role)[0].id;
      if (user.applicantId) state.selectedApplicantId = user.applicantId;
      state.loginError = "";
      state.validationErrors = [];
    },
    endSession() {
      state.session = null;
      state.loginAccessType = "aspirante";
      state.loginError = "";
      state.role = "aspirante";
      state.view = "registro";
      state.filter = "";
      state.validationErrors = [];
    },
    setApplicantState(applicant, nextState) {
      applicant.estado = nextState;
    },
    refreshDocumentState(applicant) {
      const allValid = applicant.documentos.every((doc) => doc.status === "valido");
      const allUploaded = applicant.documentos.every((doc) => ["cargado", "valido", "no_valido"].includes(doc.status));
      const hasRejected = applicant.documentos.some((doc) => doc.status === "no_valido");

      if (hasRejected) Mutations.setApplicantState(applicant, STATES.DOCUMENTS_OBSERVED);
      else if (allValid) Mutations.setApplicantState(applicant, STATES.DOCUMENTS_VALIDATED);
      else if (allUploaded) Mutations.setApplicantState(applicant, STATES.DOCUMENTS_UPLOADED);
      else if (Rules.canAccessEnrollment(applicant)) Mutations.setApplicantState(applicant, STATES.DOCUMENTS_PENDING);
    },
    addApplicant(applicant) {
      state.applicants.push(applicant);
      state.selectedApplicantId = applicant.id;
      if (state.session?.role === "aspirante") {
        state.session.applicantId = applicant.id;
        state.session.name = Rules.fullName(applicant);
      }
      state.view = "portal_aspirante";
      state.validationErrors = [];
    },
  };

  const Validator = {
    login(formData) {
      const errors = [];
      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "");

      if (!email) errors.push("Captura el correo.");
      if (!password) errors.push("Captura la contrasena.");
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("El correo no tiene un formato valido.");
      }

      return errors;
    },
    registration(formData) {
      const errors = [];
      const curp = String(formData.get("curp") || "").trim().toUpperCase();
      const correo = String(formData.get("correo") || "").trim();
      const telefono = String(formData.get("telefono") || "").trim();
      const promedio = Number(formData.get("promedio"));
      const fechaNacimiento = String(formData.get("fechaNacimiento") || "");
      const required = [
        "nombre",
        "apellidoPaterno",
        "apellidoMaterno",
        "curp",
        "correo",
        "telefono",
        "fechaNacimiento",
        "carrera",
        "bachillerato",
      ];

      required.forEach((fieldName) => {
        if (!String(formData.get(fieldName) || "").trim()) {
          errors.push(`El campo ${fieldName} es obligatorio.`);
        }
      });

      if (curp && !/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(curp)) {
        errors.push("La CURP debe tener 18 caracteres y un formato valido.");
      }

      if (state.applicants.some((applicant) => applicant.curp === curp)) {
        errors.push("Ya existe un aspirante registrado con esa CURP.");
      }

      if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        errors.push("El correo electronico no tiene un formato valido.");
      }

      if (telefono && !/^\d{10}$/.test(telefono)) {
        errors.push("El telefono debe tener 10 digitos numericos.");
      }

      if (!Number.isFinite(promedio) || promedio < 0 || promedio > 10) {
        errors.push("El promedio debe ser un numero entre 0 y 10.");
      }

      if (fechaNacimiento) {
        const date = new Date(`${fechaNacimiento}T00:00:00`);
        if (Number.isNaN(date.getTime()) || date > new Date()) {
          errors.push("La fecha de nacimiento no puede estar vacia ni ser futura.");
        }
      }

      return errors;
    },
  };

  const Components = {
    heading(title, text) {
      return `
        <div class="page-heading">
          <div>
            <h2>${title}</h2>
            <p>${text}</p>
          </div>
        </div>
      `;
    },
    topbar() {
      const user = state.session;
      return `
        <header class="topbar">
          <div class="brand">
            <div class="brand-mark">UTeM</div>
            <div>
              <h1>SIIGESI Aspirantes</h1>
              <p>${user ? `Sesion de prueba: ${Selectors.roleLabel(user.role)}` : "Prototipo local sin base de datos"}</p>
            </div>
          </div>
          ${
            user
              ? `
                <div class="session-box">
                  <div>
                    <strong>${user.name}</strong>
                    <span>${user.email}</span>
                  </div>
                  <button class="role-button" data-action="logout">Salir</button>
                </div>
              `
              : ""
          }
        </header>
      `;
    },
    sidebar() {
      const resetHelp =
        state.role === "aspirante"
          ? "El reinicio solo sirve para esta demostracion: restaura los datos mock y borra cambios hechos durante la prueba."
          : "Modo prueba: restaura aspirantes, pagos y documentos simulados.";
      const whatsappUrl = `https://wa.me/${CONFIG.whatsappSupport.phone}?text=${encodeURIComponent(CONFIG.whatsappSupport.message)}`;
      return `
        <aside class="sidebar">
          <p class="sidebar-title">Menu de prueba</p>
          <div class="nav-list">
            ${Utils.list(
              Selectors.viewsForRole(state.role).map(
                (view) => `
                  <button class="nav-button ${view.id === state.view ? "active" : ""}" data-action="set-view" data-view="${view.id}">
                    ${view.label}
                  </button>
                `
              )
            )}
          </div>
          <div class="actions">
            <button class="button secondary" data-action="reset-data">Reiniciar datos</button>
          </div>
          <p class="sidebar-help">${resetHelp}</p>
          ${
            state.role === "aspirante"
              ? `
                <div class="support-box">
                  <p class="sidebar-title">Preguntas</p>
                  <p class="sidebar-help">Contacta al area de admision por WhatsApp para dudas del proceso.</p>
                  <a class="button whatsapp-button" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">Contactar por WhatsApp</a>
                </div>
              `
              : ""
          }
        </aside>
      `;
    },
    field(name, label, type, value = "", required = false, step = "") {
      return `
        <div class="field">
          <label for="${name}">${label}</label>
          <input id="${name}" name="${name}" type="${type}" value="${Utils.escapeAttr(value)}" ${required ? "required" : ""} ${step ? `step="${step}"` : ""} />
        </div>
      `;
    },
    selectField(name, label, options, selected) {
      return `
        <div class="field">
          <label for="${name}">${label}</label>
          <select id="${name}" name="${name}" required>
            ${Utils.list(
              options.map(
                (option) => `<option value="${Utils.escapeAttr(option)}" ${option === selected ? "selected" : ""}>${option}</option>`
              )
            )}
          </select>
        </div>
      `;
    },
    statusBadge(applicantState) {
      const green = [STATES.ACCEPTED, STATES.DOCUMENTS_VALIDATED, STATES.ENROLLMENT_PAYMENT_VALIDATED, STATES.ENROLLED, STATES.CENEVAL_PAYMENT_VALIDATED];
      const red = [STATES.CENEVAL_PAYMENT_REJECTED, STATES.NOT_ACCEPTED, STATES.DOCUMENTS_OBSERVED, STATES.INACTIVE];
      const amber = [STATES.CENEVAL_PAYMENT_PENDING, STATES.CENEVAL_PAYMENT_UPLOADED, STATES.DOCUMENTS_PENDING, STATES.DOCUMENTS_UPLOADED, STATES.ENROLLMENT_PAYMENT_PENDING];
      const purple = [STATES.EVALUATED, STATES.EVALUATION_PENDING];

      let color = "blue";
      if (green.includes(applicantState)) color = "green";
      if (red.includes(applicantState)) color = "red";
      if (amber.includes(applicantState)) color = "amber";
      if (purple.includes(applicantState)) color = "purple";

      return `<span class="badge ${color}">${LABELS.state[applicantState] || applicantState}</span>`;
    },
    documentLabel(status) {
      return LABELS.document[status] || status;
    },
    paymentLabel(status) {
      return LABELS.payment[status] || status;
    },
    metrics(items) {
      return `
        <section class="grid three">
          ${Utils.list(items.map(([label, value]) => `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`))}
        </section>
      `;
    },
    filter() {
      return `
        <section class="panel">
          <div class="field">
            <label for="filter">Filtrar por nombre, CURP o carrera</label>
            <input id="filter" data-action="filter" type="search" value="${Utils.escapeAttr(state.filter)}" placeholder="Nombre, CURP o carrera" />
          </div>
        </section>
      `;
    },
    validationErrors() {
      if (!state.validationErrors.length) return "";
      return `
        <div class="notice danger">
          <strong>Revisa el registro antes de continuar:</strong>
          <ul>${Utils.list(state.validationErrors.map((error) => `<li>${error}</li>`))}</ul>
        </div>
      `;
    },
    timeline(currentState) {
      const currentIndex = CONFIG.flowStates.indexOf(currentState);

      return `
        <div class="timeline">
          ${Utils.list(
            CONFIG.flowStates.map((flowState, index) => {
              const done = currentIndex >= index || currentState === STATES.ENROLLED;
              return `<span class="timeline-step ${done ? "done" : ""}">${LABELS.state[flowState]}</span>`;
            })
          )}
        </div>
      `;
    },
    readiness(applicant) {
      const checks = [
        ["Pago CENEVAL", applicant.cenevalPago.estatus === "validado"],
        ["Resultado CENEVAL", applicant.resultadoCeneval !== null],
        ["Aceptacion", Rules.acceptedStates().includes(applicant.estado)],
        ["Documentos validos", Rules.allDocumentsValid(applicant)],
        ["Pago inscripcion", applicant.pagoInscripcion.estatus === "validado"],
      ];

      return `
        <div class="readiness">
          ${Utils.list(
            checks.map(
              ([label, done]) => `<span class="check ${done ? "done" : ""}">${done ? "OK" : "Pendiente"} &middot; ${label}</span>`
            )
          )}
        </div>
      `;
    },
    applicantTable(applicants, title) {
      return `
        <section class="panel">
          <h3>${title}</h3>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>CURP</th>
                  <th>Carrera</th>
                  <th>Promedio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                ${Utils.list(
                  applicants.map(
                    (applicant) => `
                      <tr>
                        <td><strong>${Rules.fullName(applicant)}</strong><div class="muted">${applicant.folio}</div></td>
                        <td>${applicant.curp}</td>
                        <td>${applicant.carrera}</td>
                        <td>${applicant.promedio}</td>
                        <td>${Components.statusBadge(applicant.estado)}</td>
                      </tr>
                    `
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      `;
    },
  };

  const Views = {
    current() {
      const renderer = {
        registro: Views.registration,
        portal_aspirante: Views.applicantPortal,
        panel_admisiones: Views.admissionsPanel,
        panel_inscripciones: Views.enrollmentPanel,
        panel_director_academico: Views.academicDirectorPanel,
        panel_director_carrera: Views.careerDirectorPanel,
        guia_proyecto: Views.projectGuide,
        matriz_estados: Views.stateMatrix,
        reglas_negocio: Views.rulesAndPermissions,
      }[state.view];

      return (renderer || Views.registration)();
    },
    login() {
      const institutionalUsers = CONFIG.mockUsers.filter((user) => user.accessType === "institucional");
      const aspiranteUsers = CONFIG.mockUsers.filter((user) => user.accessType === "aspirante");
      return `
        <div class="login-page">
          <section class="login-hero">
            <div>
              <span class="badge green">Prototipo de autenticacion</span>
              <h2>Acceso al sistema de admision</h2>
              <p>Selecciona el tipo de acceso para simular como entrarian aspirantes y personal UTeM. En una version real, el rol vendria desde la cuenta del usuario.</p>
            </div>
            <div class="login-cards">
              <button class="login-card ${state.loginAccessType === "aspirante" ? "active" : ""}" data-action="set-login-type" data-type="aspirante">
                <strong>Acceso aspirante</strong>
                <span>Registro, seguimiento, documentos y pagos.</span>
              </button>
              <button class="login-card ${state.loginAccessType === "institucional" ? "active" : ""}" data-action="set-login-type" data-type="institucional">
                <strong>Acceso institucional</strong>
                <span>Admisiones, inscripciones y directivos.</span>
              </button>
            </div>
          </section>

          <section class="grid two">
            <div class="panel">
              <h3>${state.loginAccessType === "aspirante" ? "Ingresar como aspirante" : "Ingresar como personal UTeM"}</h3>
              ${
                state.loginError
                  ? `<div class="notice danger"><strong>No se pudo iniciar sesion:</strong><br />${state.loginError}</div>`
                  : `<div class="notice">Este login es simulado. No guarda sesiones reales ni valida contra base de datos.</div>`
              }
              <form id="login-form" class="grid">
                ${Components.field("email", "Correo", "email", state.loginAccessType === "aspirante" ? "aspirante@correo.com" : "admisiones@utem.edu.mx", true)}
                ${Components.field("password", "Contrasena", "password", state.loginAccessType === "aspirante" ? "Aspirante123" : "Admisiones123", true)}
                <div class="actions">
                  <button class="button" type="submit">Iniciar sesion</button>
                  <button class="button secondary" type="button" data-action="show-convocation">Consultar convocatoria</button>
                </div>
              </form>
            </div>

            <div class="panel">
              <h3>Credenciales de prueba</h3>
              <p class="muted">Usa cualquiera de estas cuentas para entrar al prototipo.</p>
              <div class="credentials-list">
                ${Utils.list(
                  [...aspiranteUsers, ...institutionalUsers].map(
                    (user) => `
                      <button class="credential-item" data-action="use-credentials" data-type="${user.accessType}" data-email="${user.email}" data-password="${user.password}">
                        <strong>${user.name}</strong>
                        <span>${Selectors.roleLabel(user.role)}</span>
                        <code>${user.email}</code>
                        <code>${user.password}</code>
                      </button>
                    `
                  )
                )}
              </div>
            </div>
          </section>
        </div>
      `;
    },
    projectGuide() {
      const phases = [
        ["Analisis", "Reglas, estados, actores, alcance y glosario."],
        ["Diseno", "Base de datos, pantallas, permisos y pruebas."],
        ["Implementacion", "Backend, frontend, autenticacion, archivos y reportes."],
      ];

      return `
        ${Components.heading("Guia del proyecto", "Vista de apoyo para que el prototipo sea entendible como proyecto universitario. Resume alcance, terminos y ruta recomendada.")}
        <section class="panel">
          <h3>Alcance recomendado</h3>
          <p>Este prototipo se enfoca en admision y nuevo ingreso. Deja fuera reinscripciones, bajas, extraordinarios, titulacion, IMSS y convenios complejos para evitar que el proyecto crezca demasiado.</p>
          <div class="timeline">
            ${Utils.list(["Registro", "Pago CENEVAL", "Validacion", "Resultado", "Aceptacion", "Documentos", "Pago inscripcion", "Alta alumno"].map((item) => `<span class="timeline-step done">${item}</span>`))}
          </div>
        </section>
        <section class="grid two">
          <div class="panel">
            <h3>Glosario normalizado</h3>
            <div class="definition-list">
              ${Utils.list(CONFIG.glossary.map(([term, description]) => `<div><strong>${term}</strong><span>${description}</span></div>`))}
            </div>
          </div>
          <div class="panel">
            <h3>Mejoras aplicadas en esta prueba</h3>
            <ul class="clean-list">
              <li>Separacion de documentos academicos y pago de inscripcion.</li>
              <li>Validacion de CURP, correo, telefono y promedio.</li>
              <li>Matriz de estados visible dentro del prototipo.</li>
              <li>Reglas de negocio visibles y bloqueos en acciones criticas.</li>
              <li>Menus compartidos para explicar el proyecto sin cambiar archivos.</li>
            </ul>
          </div>
        </section>
        <section class="panel">
          <h3>Fases para convertirlo en sistema real</h3>
          <div class="grid three">
            ${Utils.list(phases.map(([title, text]) => `<div class="metric"><strong>${title}</strong><span>${text}</span></div>`))}
          </div>
        </section>
      `;
    },
    stateMatrix() {
      return `
        ${Components.heading("Matriz de estados", "Formaliza el flujo para que el sistema no dependa de decisiones improvisadas. Cada accion cambia el estado solo si se cumple su condicion.")}
        <section class="panel">
          <h3>Transiciones principales</h3>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Estado origen</th>
                  <th>Accion</th>
                  <th>Estado destino</th>
                  <th>Rol responsable</th>
                </tr>
              </thead>
              <tbody>
                ${Utils.list(
                  CONFIG.transitionMatrix.map(
                    ([from, action, to, role]) => `
                      <tr>
                        <td>${Components.statusBadge(from)}</td>
                        <td>${action}</td>
                        <td>${Utils.list(
                          String(to)
                            .split("/")
                            .map((item) => (LABELS.state[item] ? Components.statusBadge(item) : `<span class="badge">${item}</span>`))
                        )}</td>
                        <td>${role}</td>
                      </tr>
                    `
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      `;
    },
    rulesAndPermissions() {
      const permissions = [
        ["Aspirante", "Registra solicitud, genera fichas y carga comprobantes/documentos propios."],
        ["Admisiones", "Valida CENEVAL, captura resultados y decide aceptacion."],
        ["Inscripciones", "Valida documentos, pago de inscripcion y alta del alumno."],
        ["Director Academico", "Consulta resumen y resuelve cambios de carrera."],
        ["Director de Carrera", "Consulta aspirantes, aceptados y grupos de su carrera."],
      ];

      return `
        ${Components.heading("Reglas y permisos", "Concentra las condiciones que hacen que el prototipo sea mas cercano a una especificacion funcional.")}
        <section class="grid two">
          <div class="panel">
            <h3>Reglas de negocio implementadas</h3>
            <ul class="clean-list">
              ${Utils.list(CONFIG.businessRules.map((rule) => `<li>${rule}</li>`))}
            </ul>
          </div>
          <div class="panel">
            <h3>Permisos por rol</h3>
            <div class="definition-list">
              ${Utils.list(permissions.map(([term, description]) => `<div><strong>${term}</strong><span>${description}</span></div>`))}
            </div>
          </div>
        </section>
      `;
    },
    registration() {
      return `
        ${Components.heading("Registro de aspirante", "Captura la solicitud inicial. Al guardar, el aspirante queda listo para generar su ficha CENEVAL.")}
        <section class="panel">
          <h3>Solicitud de proceso de admision</h3>
          ${Components.validationErrors()}
          <form id="registration-form" class="grid">
            <div class="grid three">
              ${Components.field("nombre", "Nombre", "text", "Mariana", true)}
              ${Components.field("apellidoPaterno", "Apellido paterno", "text", "Lopez", true)}
              ${Components.field("apellidoMaterno", "Apellido materno", "text", "Ramirez", true)}
            </div>
            <div class="grid three">
              ${Components.field("curp", "CURP", "text", "LORM060512MCMPRR02", true)}
              ${Components.field("correo", "Correo", "email", "mariana.lopez@correo.com", true)}
              ${Components.field("telefono", "Telefono", "tel", "3142223344", true)}
            </div>
            <div class="grid three">
              ${Components.field("fechaNacimiento", "Fecha de nacimiento", "date", "2006-05-12", true)}
              ${Components.selectField("carrera", "Carrera de interes", CONFIG.careers, CONFIG.careers[0])}
              ${Components.field("promedio", "Promedio", "number", "8.9", true, "0.1")}
            </div>
            ${Components.field("bachillerato", "Bachillerato de procedencia", "text", "CBTis 226", true)}
            <div class="actions">
              <button class="button" type="submit">Registrar aspirante</button>
              <button class="button secondary" type="button" data-action="set-view" data-view="portal_aspirante">Ir al panel</button>
            </div>
          </form>
        </section>
        ${state.role === "aspirante" ? "" : Components.applicantTable(state.applicants, "Aspirantes de prueba")}
      `;
    },
    applicantPortal() {
      const applicant = Selectors.selectedApplicant();
      return `
        ${Components.heading("Panel del aspirante", "Simula las acciones que realiza un aspirante o aceptado durante el proceso.")}
        ${Views.applicantSelector()}
        <section class="panel">
          <div class="status-row">
            <h3 style="margin: 0;">${Rules.fullName(applicant)}</h3>
            ${Components.statusBadge(applicant.estado)}
            ${applicant.activo ? '<span class="badge green">Activo</span>' : '<span class="badge red">Inactivo</span>'}
          </div>
          <p class="muted">Folio ${applicant.folio} &middot; ${applicant.carrera} &middot; ${applicant.bachillerato}</p>
          ${Components.timeline(applicant.estado)}
          ${Components.readiness(applicant)}
        </section>
        <section class="grid two">
          ${Views.cenevalBox(applicant)}
          ${Views.applicantDocumentsBox(applicant)}
        </section>
        <section class="grid two">
          ${Views.enrollmentPaymentBox(applicant)}
          ${Views.changeCareerBox(applicant)}
        </section>
      `;
    },
    applicantSelector() {
      if (state.session?.role === "aspirante") {
        const applicant = Selectors.selectedApplicant();
        return `
          <section class="panel">
            <h3>Expediente de la sesion</h3>
            <p class="muted">Estas consultando solamente la cuenta asociada a tu acceso de aspirante.</p>
            <div class="definition-list compact">
              <div><strong>Aspirante</strong><span>${Rules.fullName(applicant)}</span></div>
              <div><strong>Correo</strong><span>${applicant.correo}</span></div>
              <div><strong>Folio</strong><span>${applicant.folio}</span></div>
            </div>
          </section>
        `;
      }

      return `
        <section class="panel">
          <div class="grid two">
            <div class="field">
              <label for="selectedApplicant">Aspirante de prueba</label>
              <select id="selectedApplicant" data-action="select-applicant">
                ${Utils.list(
                  state.applicants.map(
                    (applicant) =>
                      `<option value="${applicant.id}" ${applicant.id === state.selectedApplicantId ? "selected" : ""}>${Rules.fullName(applicant)} - ${applicant.folio}</option>`
                  )
                )}
              </select>
            </div>
          </div>
        </section>
      `;
    },
    cenevalBox(applicant) {
      return `
        <section class="panel">
          <h3>CENEVAL</h3>
          <p><strong>Referencia:</strong> ${applicant.cenevalPago.referencia || "Sin generar"}</p>
          <p><strong>Pago:</strong> ${Components.paymentLabel(applicant.cenevalPago.estatus)}</p>
          <p><strong>Resultado:</strong> ${applicant.resultadoCeneval ?? "Sin capturar"}</p>
          <div class="actions">
            <button class="button" data-action="generate-ceneval" data-id="${applicant.id}" ${!Rules.canGenerateCeneval(applicant) ? "disabled" : ""}>Generar ficha CENEVAL</button>
            <button class="button secondary" data-action="upload-ceneval" data-id="${applicant.id}" ${!Rules.canUploadCeneval(applicant) ? "disabled" : ""}>Subir comprobante</button>
          </div>
        </section>
      `;
    },
    applicantDocumentsBox(applicant) {
      const isAccepted = Rules.canAccessEnrollment(applicant) && applicant.estado !== STATES.ENROLLED;
      return `
        <section class="panel">
          <h3>Documentos</h3>
          <div class="document-list">
            ${Utils.list(
              applicant.documentos.map(
                (doc, index) => `
                  <div class="document-row">
                    <div>
                      <strong>${doc.name}</strong>
                      <div class="muted">${doc.fileName || "Sin archivo"} &middot; ${Components.documentLabel(doc.status)}${doc.observation ? ` &middot; ${doc.observation}` : ""}</div>
                    </div>
                    <button class="button small secondary" data-action="upload-document" data-id="${applicant.id}" data-doc="${index}" ${!isAccepted || doc.status === "valido" ? "disabled" : ""}>Subir</button>
                  </div>
                `
              )
            )}
          </div>
        </section>
      `;
    },
    enrollmentPaymentBox(applicant) {
      return `
        <section class="panel">
          <h3>Pago de inscripcion</h3>
          <p><strong>Referencia:</strong> ${applicant.pagoInscripcion.referencia || "Sin generar"}</p>
          <p><strong>Estatus:</strong> ${Components.paymentLabel(applicant.pagoInscripcion.estatus)}</p>
          ${!Rules.allDocumentsValid(applicant) && Rules.canAccessEnrollment(applicant) ? '<p class="muted">Primero deben validarse todos los documentos obligatorios.</p>' : ""}
          <div class="actions">
            <button class="button" data-action="generate-enrollment-payment" data-id="${applicant.id}" ${!Rules.canGenerateEnrollmentPayment(applicant) ? "disabled" : ""}>Generar ficha</button>
            <button class="button secondary" data-action="upload-enrollment-payment" data-id="${applicant.id}" ${!Rules.canUploadEnrollmentPayment(applicant) ? "disabled" : ""}>Subir comprobante</button>
          </div>
        </section>
      `;
    },
    changeCareerBox(applicant) {
      const careerTarget = CONFIG.careers.find((career) => career !== applicant.carrera);
      return `
        <section class="panel">
          <h3>Solicitud de cambio de carrera</h3>
          <div class="notice">
            El cambio de carrera es una solicitud sujeta a revision por Direccion Academica. Enviarla no garantiza que el cambio sea aprobado.
          </div>
          <form id="change-career-form" class="grid">
            ${Components.selectField("careerTarget", "Carrera solicitada", CONFIG.careers.filter((career) => career !== applicant.carrera), careerTarget)}
            <div class="field">
              <label for="careerReason">Motivo</label>
              <textarea id="careerReason" name="careerReason">Deseo cambiar mi opcion por afinidad academica.</textarea>
            </div>
            <input type="hidden" name="applicantId" value="${applicant.id}" />
            <div class="actions">
              <button class="button" type="submit" ${!Rules.canRequestCareerChange(applicant) ? "disabled" : ""}>Enviar solicitud</button>
            </div>
          </form>
        </section>
      `;
    },
    admissionsPanel() {
      const applicants = Selectors.filteredApplicants();
      return `
        ${Components.heading("Responsable de Admisiones", "Administra aspirantes, pagos CENEVAL, resultados y aceptacion.")}
        ${Components.filter()}
        ${Components.metrics([
          ["Aspirantes", state.applicants.length],
          ["Pagos CENEVAL por validar", state.applicants.filter((applicant) => applicant.estado === STATES.CENEVAL_PAYMENT_UPLOADED).length],
          ["Aceptados", state.applicants.filter((applicant) => Rules.acceptedStates().includes(applicant.estado)).length],
        ])}
        <section class="panel">
          <h3>Listado de aspirantes</h3>
          <div class="notice">
            Desactivar un aspirante no elimina su expediente; solo suspende su avance dentro del proceso hasta que sea reactivado.
          </div>
          ${Views.admissionsTable(applicants)}
        </section>
      `;
    },
    admissionsTable(applicants) {
      if (!applicants.length) return `<div class="empty">No hay aspirantes con ese filtro.</div>`;
      return `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Aspirante</th>
                <th>Carrera</th>
                <th>Promedio</th>
                <th>Estado</th>
                <th>CENEVAL</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${Utils.list(
                applicants.map(
                  (applicant) => `
                    <tr>
                      <td>
                        <strong>${Rules.fullName(applicant)}</strong>
                        <div class="muted">${applicant.folio} &middot; ${applicant.curp}</div>
                      </td>
                      <td>${applicant.carrera}<div class="muted">${applicant.bachillerato}</div></td>
                      <td>${applicant.promedio}</td>
                      <td>${Components.statusBadge(applicant.estado)}</td>
                      <td>${applicant.resultadoCeneval ?? "Sin resultado"}</td>
                      <td>
                        <div class="table-actions">
                          <button class="button small success" data-action="validate-ceneval" data-id="${applicant.id}" ${applicant.estado !== STATES.CENEVAL_PAYMENT_UPLOADED ? "disabled" : ""}>Validar comprobante CENEVAL</button>
                          <button class="button small danger" data-action="reject-ceneval" data-id="${applicant.id}" ${applicant.estado !== STATES.CENEVAL_PAYMENT_UPLOADED ? "disabled" : ""}>Rechazar comprobante CENEVAL</button>
                          <button class="button small" data-action="capture-score" data-id="${applicant.id}" ${applicant.estado !== STATES.EVALUATION_PENDING ? "disabled" : ""}>Capturar puntaje</button>
                          <button class="button small success" data-action="mark-accepted" data-id="${applicant.id}" ${applicant.estado !== STATES.EVALUATED ? "disabled" : ""}>Aceptar</button>
                          <button class="button small warning" data-action="mark-rejected" data-id="${applicant.id}" ${applicant.estado !== STATES.EVALUATED ? "disabled" : ""}>No aceptar</button>
                          <button class="button small secondary" data-action="toggle-active" data-id="${applicant.id}">${applicant.activo ? "Desactivar" : "Activar"}</button>
                        </div>
                      </td>
                    </tr>
                  `
                )
              )}
            </tbody>
          </table>
        </div>
      `;
    },
    enrollmentPanel() {
      const accepted = state.applicants.filter((applicant) => Rules.acceptedStates().includes(applicant.estado));
      return `
        ${Components.heading("Responsable de Inscripciones", "Valida documentos, pago de inscripcion y alta de alumnos de nuevo ingreso.")}
        ${Components.metrics([
          ["Aceptados", accepted.length],
          ["Documentos por revisar", accepted.filter((applicant) => applicant.documentos.some((doc) => doc.status === "cargado")).length],
          ["Inscritos", state.applicants.filter((applicant) => applicant.estado === STATES.ENROLLED).length],
        ])}
        <section class="panel">
          <h3>Lista de aceptados</h3>
          <div class="notice">
            Cuando Admisiones marca a un aspirante como aceptado, aparece automaticamente en esta lista. Aqui se revisan archivos simulados, se valida el pago de inscripcion y, si todo esta completo, se da de alta como alumno.
          </div>
          ${Views.enrollmentTable(accepted)}
        </section>
      `;
    },
    enrollmentTable(applicants) {
      if (!applicants.length) return `<div class="empty">No hay aceptados para revisar.</div>`;
      return `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Aceptado</th>
                <th>Estado</th>
                <th>Documentos</th>
                <th>Pago inscripcion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${Utils.list(
                applicants.map(
                  (applicant) => `
                    <tr>
                      <td>
                        <strong>${Rules.fullName(applicant)}</strong>
                        <div class="muted">${applicant.folio} &middot; ${applicant.carrera}</div>
                      </td>
                      <td>${Components.statusBadge(applicant.estado)}</td>
                      <td>${Views.docsMini(applicant)}</td>
                      <td>
                        ${Components.paymentLabel(applicant.pagoInscripcion.estatus)}
                        <div class="muted">${applicant.pagoInscripcion.referencia || "Sin referencia"}${applicant.pagoInscripcion.comprobante ? " - comprobante cargado" : ""}</div>
                      </td>
                      <td>
                        <div class="table-actions">
                          ${Utils.list(
                            applicant.documentos.map(
                              (doc, index) => `
                                <button class="button small secondary" data-action="preview-document" data-id="${applicant.id}" data-doc="${index}" ${!doc.fileName ? "disabled" : ""}>Ver doc ${index + 1}</button>
                                <button class="button small success" data-action="validate-document" data-id="${applicant.id}" data-doc="${index}" ${doc.status !== "cargado" && doc.status !== "no_valido" ? "disabled" : ""}>Validar ${index + 1}</button>
                                <button class="button small danger" data-action="reject-document" data-id="${applicant.id}" data-doc="${index}" ${doc.status !== "cargado" ? "disabled" : ""}>Rechazar ${index + 1}</button>
                              `
                            )
                          )}
                          <button class="button small secondary" data-action="preview-enrollment-payment" data-id="${applicant.id}" ${!applicant.pagoInscripcion.comprobante ? "disabled" : ""}>Ver pago</button>
                          <button class="button small success" data-action="validate-enrollment-payment" data-id="${applicant.id}" ${applicant.pagoInscripcion.estatus !== "comprobante_cargado" || !Rules.allDocumentsValid(applicant) ? "disabled" : ""}>Validar pago inscripcion</button>
                          <button class="button small" data-action="enroll-student" data-id="${applicant.id}" ${!Rules.canEnroll(applicant) ? "disabled" : ""}>Dar de alta</button>
                        </div>
                      </td>
                    </tr>
                  `
                )
              )}
            </tbody>
          </table>
        </div>
      `;
    },
    docsMini(applicant) {
      return Utils.list(
        applicant.documentos.map(
          (doc, index) =>
            `<div>${index + 1}. ${doc.name}: ${Components.documentLabel(doc.status)}<span class="muted"> - ${doc.fileName || "sin archivo"}</span></div>`
        )
      );
    },
    academicDirectorPanel() {
      const requests = Selectors.careerRequests();
      const byCareer = CONFIG.careers.map((career) => ({
        career,
        total: state.applicants.filter((applicant) => applicant.carrera === career).length,
        accepted: state.applicants.filter((applicant) => applicant.carrera === career && Rules.acceptedStates().includes(applicant.estado)).length,
        enrolled: state.applicants.filter((applicant) => applicant.carrera === career && applicant.estado === STATES.ENROLLED).length,
      }));

      return `
        ${Components.heading("Director Academico", "Supervisa cuantos aspirantes, aceptados e inscritos hay por carrera y resuelve solicitudes de cambio de carrera.")}
        ${Components.metrics([
          ["Total aspirantes", state.applicants.length],
          ["Aceptados", state.applicants.filter((applicant) => Rules.acceptedStates().includes(applicant.estado)).length],
          ["Solicitudes cambio", requests.length],
        ])}
        <section class="panel">
          <h3>Resumen por carrera</h3>
          <div class="notice">
            Esta vista es de supervision academica: no valida documentos ni pagos, solo permite revisar demanda, cupos y cambios de carrera.
          </div>
          ${Views.careerSummaryTable(byCareer)}
        </section>
        <section class="panel">
          <h3>Solicitudes de cambio de carrera</h3>
          ${Views.changeRequestsTable(requests)}
        </section>
      `;
    },
    careerSummaryTable(items) {
      return `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Carrera</th>
                <th>Aspirantes</th>
                <th>Aceptados</th>
                <th>Inscritos</th>
              </tr>
            </thead>
            <tbody>
              ${Utils.list(
                items.map(
                  (item) => `
                    <tr>
                      <td>${item.career}</td>
                      <td>${item.total}</td>
                      <td>${item.accepted}</td>
                      <td>${item.enrolled}</td>
                    </tr>
                  `
                )
              )}
            </tbody>
          </table>
        </div>
      `;
    },
    changeRequestsTable(requests) {
      if (!requests.length) return `<div class="empty">No hay solicitudes registradas.</div>`;
      return `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Aspirante</th>
                <th>Carrera solicitada</th>
                <th>Motivo</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${Utils.list(
                requests.map(
                  ({ applicant, request }) => `
                    <tr>
                      <td>${Rules.fullName(applicant)}<div class="muted">${applicant.carrera}</div></td>
                      <td>${request.destino}</td>
                      <td>${request.motivo}</td>
                      <td>${request.estatus}</td>
                      <td>
                        <div class="table-actions">
                          <button class="button small success" data-action="accept-career-request" data-id="${applicant.id}" data-request="${request.id}" ${request.estatus !== "pendiente" ? "disabled" : ""}>Aceptar</button>
                          <button class="button small danger" data-action="reject-career-request" data-id="${applicant.id}" data-request="${request.id}" ${request.estatus !== "pendiente" ? "disabled" : ""}>Rechazar</button>
                        </div>
                      </td>
                    </tr>
                  `
                )
              )}
            </tbody>
          </table>
        </div>
      `;
    },
    careerDirectorPanel() {
      const applicants = state.applicants.filter((applicant) => applicant.carrera === state.directorCareer);
      const accepted = applicants.filter((applicant) => Rules.acceptedStates().includes(applicant.estado));

      return `
        ${Components.heading("Director de Carrera", "Consulta aspirantes, aceptados, inscritos y avance contra los grupos proyectados de su carrera.")}
        <section class="panel">
          <div class="field">
            <label for="directorCareer">Carrera</label>
            <select id="directorCareer" data-action="select-director-career">
              ${Utils.list(CONFIG.careers.map((career) => `<option value="${career}" ${career === state.directorCareer ? "selected" : ""}>${career}</option>`))}
            </select>
          </div>
        </section>
        ${Components.metrics([
          ["Aspirantes de carrera", applicants.length],
          ["Aceptados de carrera", accepted.length],
          ["Inscritos de carrera", applicants.filter((applicant) => applicant.estado === STATES.ENROLLED).length],
        ])}
        ${Components.applicantTable(applicants, "Aspirantes de la carrera")}
        <section class="panel">
          <h3>Grupos simulados</h3>
          <div class="notice">
            Esta vista ayuda a comparar alumnos proyectados contra lugares disponibles. El director de carrera consulta el avance, pero no inscribe ni valida pagos desde aqui.
          </div>
          ${Views.groups(state.directorCareer, accepted)}
        </section>
      `;
    },
    groups(career, accepted) {
      const prefix = Rules.groupPrefix(career);
      const groups = [
        { key: `1${prefix}1`, capacity: 30 },
        { key: `1${prefix}2`, capacity: 30 },
      ];

      return `
        <div class="grid two">
          ${Utils.list(
            groups.map((group, groupIndex) => {
              const members = accepted.filter((_, index) => index % groups.length === groupIndex);
              return `
                <div class="metric">
                  <strong>${group.key}</strong>
                  <span>${members.length}/${group.capacity} alumnos proyectados</span>
                  <div>${Utils.list(members.map((member) => `<div>${Rules.fullName(member)}</div>`)) || '<span class="muted">Sin alumnos asignados</span>'}</div>
                </div>
              `;
            })
          )}
        </div>
      `;
    },
  };

  const Actions = {
    "set-login-type": (element) => {
      state.loginAccessType = element.dataset.type;
      state.loginError = "";
      render();
    },
    "use-credentials": (element) => {
      const user = Selectors.userByCredentials(element.dataset.email, element.dataset.password, element.dataset.type);
      if (!user) {
        state.loginError = "Las credenciales de prueba no coinciden.";
        render();
        return;
      }
      Mutations.startSession(user);
      Toast.show(`Bienvenido: ${user.name}`);
    },
    "show-convocation": () => {
      Toast.show("Convocatoria simulada: admision TSU 2026. Consulta requisitos, fechas y carreras disponibles.");
    },
    logout: () => {
      Mutations.endSession();
      render();
    },
    "set-role": (element) => {
      state.role = element.dataset.role;
      state.view = Selectors.viewsForRole(state.role)[0].id;
      render();
    },
    "set-view": (element) => {
      state.view = element.dataset.view;
      render();
    },
    "reset-data": () => {
      if (!window.confirm("Seguro que quieres reiniciar todos los datos? Esta accion restaura la informacion mock y borra los cambios hechos durante la prueba.")) {
        return;
      }
      Mutations.resetData();
      Toast.show("Datos de prueba reiniciados.");
    },
    "generate-ceneval": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      if (!Rules.canGenerateCeneval(applicant)) {
        Toast.show("No se puede generar ficha CENEVAL para este estado.");
        return;
      }
      applicant.cenevalPago.referencia = `CEN-${String(applicant.id).padStart(4, "0")}`;
      applicant.cenevalPago.estatus = "generado";
      Mutations.setApplicantState(applicant, STATES.CENEVAL_PAYMENT_PENDING);
      Toast.show("Ficha CENEVAL generada.");
    },
    "upload-ceneval": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      if (!Rules.canUploadCeneval(applicant)) {
        Toast.show("No se puede cargar comprobante CENEVAL en este momento.");
        return;
      }
      applicant.cenevalPago.comprobante = true;
      applicant.cenevalPago.estatus = "comprobante_cargado";
      Mutations.setApplicantState(applicant, STATES.CENEVAL_PAYMENT_UPLOADED);
      Toast.show("Comprobante CENEVAL cargado.");
    },
    "validate-ceneval": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      if (!window.confirm(`Confirmas que el comprobante CENEVAL de ${Rules.fullName(applicant)} fue revisado y es valido?`)) return;
      applicant.cenevalPago.estatus = "validado";
      Mutations.setApplicantState(applicant, STATES.EVALUATION_PENDING);
      Toast.show("Pago CENEVAL validado. El aspirante queda listo para capturar resultado.");
    },
    "reject-ceneval": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      if (!window.confirm(`Seguro que quieres rechazar el comprobante CENEVAL de ${Rules.fullName(applicant)}?`)) return;
      applicant.cenevalPago.estatus = "rechazado";
      applicant.cenevalPago.comprobante = false;
      Mutations.setApplicantState(applicant, STATES.CENEVAL_PAYMENT_REJECTED);
      Toast.show("Pago CENEVAL rechazado.");
    },
    "capture-score": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      if (applicant.cenevalPago.estatus !== "validado") {
        Toast.show("No se puede capturar resultado sin pago CENEVAL validado.");
        return;
      }

      const score = window.prompt("Puntaje CENEVAL:", applicant.resultadoCeneval || "900");
      if (!score) return;

      const parsedScore = Number(score);
      if (!Number.isFinite(parsedScore) || parsedScore < 0 || parsedScore > CONFIG.maxCenevalScore) {
        Toast.show(`El puntaje debe ser numerico y estar entre 0 y ${CONFIG.maxCenevalScore}.`);
        return;
      }

      applicant.resultadoCeneval = parsedScore;
      Mutations.setApplicantState(applicant, STATES.EVALUATED);
      Toast.show("Resultado CENEVAL capturado.");
    },
    "mark-accepted": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      if (!window.confirm(`El puntaje CENEVAL capturado es ${applicant.resultadoCeneval}. Confirmas que el puntaje es correcto y quieres aceptar al aspirante?`)) return;
      Mutations.setApplicantState(applicant, STATES.ACCEPTED);
      Toast.show("Aspirante marcado como aceptado.");
    },
    "mark-rejected": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      if (!window.confirm(`El puntaje CENEVAL capturado es ${applicant.resultadoCeneval}. Confirmas que el puntaje es correcto y quieres marcarlo como no aceptado?`)) return;
      Mutations.setApplicantState(applicant, STATES.NOT_ACCEPTED);
      Toast.show("Aspirante marcado como no aceptado.");
    },
    "toggle-active": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      const action = applicant.activo ? "desactivar" : "reactivar";
      const warning = applicant.activo
        ? "El expediente no se eliminara, pero el aspirante no podra continuar el proceso hasta ser reactivado."
        : "El aspirante podra continuar nuevamente el proceso.";
      if (!window.confirm(`Seguro que quieres ${action} a ${Rules.fullName(applicant)}? ${warning}`)) return;
      applicant.activo = !applicant.activo;
      if (!applicant.activo) Mutations.setApplicantState(applicant, STATES.INACTIVE);
      if (applicant.activo && applicant.estado === STATES.INACTIVE) Mutations.setApplicantState(applicant, STATES.REGISTERED);
      Toast.show(applicant.activo ? "Aspirante activado." : "Aspirante desactivado.");
    },
    "preview-document": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      const doc = applicant.documentos[Number(element.dataset.doc)];
      if (!doc.fileName) {
        Toast.show("Este documento aun no tiene archivo cargado.");
        return;
      }
      window.alert(`Vista previa simulada\n\nAspirante: ${Rules.fullName(applicant)}\nDocumento: ${doc.name}\nArchivo: ${doc.fileName}\nEstatus: ${Components.documentLabel(doc.status)}${doc.observation ? `\nObservacion: ${doc.observation}` : ""}`);
    },
    "upload-document": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      const doc = applicant.documentos[Number(element.dataset.doc)];
      doc.status = "cargado";
      doc.fileName = `${Utils.slugify(doc.name)}-${applicant.id}.${Utils.documentExtension(doc.name)}`;
      doc.observation = "";
      Mutations.refreshDocumentState(applicant);
      Toast.show("Documento cargado.");
    },
    "validate-document": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      const doc = applicant.documentos[Number(element.dataset.doc)];
      doc.status = "valido";
      doc.observation = "";
      Mutations.refreshDocumentState(applicant);
      Toast.show("Documento validado.");
    },
    "reject-document": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      const doc = applicant.documentos[Number(element.dataset.doc)];
      doc.status = "no_valido";
      doc.observation = "Documento ilegible o incompleto.";
      Mutations.refreshDocumentState(applicant);
      Toast.show("Documento marcado como no valido.");
    },
    "preview-enrollment-payment": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      if (!applicant.pagoInscripcion.comprobante) {
        Toast.show("El aspirante aun no ha cargado comprobante de inscripcion.");
        return;
      }
      window.alert(`Comprobante de inscripcion simulado\n\nAspirante: ${Rules.fullName(applicant)}\nReferencia: ${applicant.pagoInscripcion.referencia}\nEstatus: ${Components.paymentLabel(applicant.pagoInscripcion.estatus)}\nRevision: comprobar referencia, monto y datos antes de validar.`);
    },
    "generate-enrollment-payment": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      if (!Rules.canGenerateEnrollmentPayment(applicant)) {
        Toast.show("No se puede generar ficha: primero valida todos los documentos.");
        return;
      }
      applicant.pagoInscripcion.referencia = `INS-${String(applicant.id).padStart(4, "0")}`;
      applicant.pagoInscripcion.estatus = "generado";
      Mutations.setApplicantState(applicant, STATES.ENROLLMENT_PAYMENT_PENDING);
      Toast.show("Ficha de inscripcion generada.");
    },
    "upload-enrollment-payment": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      if (!Rules.canUploadEnrollmentPayment(applicant)) {
        Toast.show("No se puede cargar comprobante de inscripcion en este momento.");
        return;
      }
      applicant.pagoInscripcion.comprobante = true;
      applicant.pagoInscripcion.estatus = "comprobante_cargado";
      Toast.show("Comprobante de inscripcion cargado.");
    },
    "validate-enrollment-payment": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      if (!Rules.allDocumentsValid(applicant)) {
        Toast.show("No se puede validar pago: faltan documentos validos.");
        return;
      }
      if (!window.confirm(`Confirmas que el comprobante de inscripcion de ${Rules.fullName(applicant)} coincide con referencia, monto y datos del aspirante?`)) return;
      applicant.pagoInscripcion.estatus = "validado";
      Mutations.setApplicantState(applicant, STATES.ENROLLMENT_PAYMENT_VALIDATED);
      Toast.show("Pago de inscripcion validado.");
    },
    "enroll-student": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      if (!Rules.allDocumentsValid(applicant)) {
        Toast.show("No se puede inscribir: faltan documentos validos.");
        return;
      }
      if (applicant.pagoInscripcion.estatus !== "validado") {
        Toast.show("No se puede inscribir: falta pago de inscripcion validado.");
        return;
      }
      applicant.numeroControl = applicant.numeroControl || `2026${String(applicant.id).padStart(4, "0")}`;
      applicant.grupo = applicant.grupo || `${Rules.groupPrefix(applicant.carrera)}-1`;
      Mutations.setApplicantState(applicant, STATES.ENROLLED);
      Toast.show("Alumno dado de alta.");
    },
    "accept-career-request": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      const request = applicant.solicitudesCambio.find((item) => item.id === Number(element.dataset.request));
      request.estatus = "aceptada";
      request.respuesta = "Solicitud aceptada por Direccion Academica.";
      applicant.carrera = request.destino;
      Toast.show("Cambio de carrera aceptado.");
    },
    "reject-career-request": (element) => {
      const applicant = Selectors.applicantById(element.dataset.id);
      const request = applicant.solicitudesCambio.find((item) => item.id === Number(element.dataset.request));
      request.estatus = "rechazada";
      request.respuesta = "Solicitud rechazada por cupo o criterios academicos.";
      Toast.show("Cambio de carrera rechazado.");
    },
  };

  const FormHandlers = {
    "login-form": (form) => {
      const formData = new FormData(form);
      const errors = Validator.login(formData);
      if (errors.length) {
        state.loginError = errors.join(" ");
        render();
        return;
      }

      const user = Selectors.userByCredentials(formData.get("email"), formData.get("password"), state.loginAccessType);
      if (!user) {
        state.loginError = "Correo, contrasena o tipo de acceso incorrecto.";
        render();
        return;
      }

      Mutations.startSession(user);
      Toast.show(`Bienvenido: ${user.name}`);
    },
    "registration-form": (form) => {
      const formData = new FormData(form);
      const errors = Validator.registration(formData);
      if (errors.length) {
        state.validationErrors = errors;
        Toast.show("Hay datos por corregir en el registro.");
        return;
      }

      Mutations.addApplicant(Factory.applicantFromForm(formData, Selectors.nextApplicantId()));
      Toast.show("Aspirante registrado. Se simula envio de accesos por correo.");
    },
    "change-career-form": (form) => {
      const formData = new FormData(form);
      const applicant = Selectors.applicantById(formData.get("applicantId"));
      if (!window.confirm("Estas seguro de que quieres enviar la solicitud de cambio de carrera? Esta solicitud sera revisada por Direccion Academica y no garantiza el cambio.")) {
        return;
      }
      const request = {
        id: Date.now(),
        destino: formData.get("careerTarget"),
        motivo: formData.get("careerReason").trim(),
        estatus: "pendiente",
        respuesta: "",
      };

      applicant.solicitudesCambio.push(request);
      Toast.show("Solicitud de cambio de carrera enviada.");
    },
  };

  const Events = {
    bind() {
      document.addEventListener("click", Events.onClick);
      document.addEventListener("input", Events.onInput);
      document.addEventListener("change", Events.onChange);
      document.addEventListener("submit", Events.onSubmit);
    },
    onClick(event) {
      const element = event.target.closest("[data-action]");
      if (!element) return;

      const handler = Actions[element.dataset.action];
      if (handler) handler(element);
    },
    onInput(event) {
      if (event.target.dataset.action !== "filter") return;
      state.filter = event.target.value;
      render();
    },
    onChange(event) {
      const { action } = event.target.dataset;

      if (action === "select-applicant") {
        state.selectedApplicantId = Number(event.target.value);
        render();
      }

      if (action === "select-director-career") {
        state.directorCareer = event.target.value;
        render();
      }
    },
    onSubmit(event) {
      const handler = FormHandlers[event.target.id];
      if (!handler) return;

      event.preventDefault();
      handler(event.target);
    },
  };

  const Toast = {
    show(message) {
      state.toast = message;
      render();
      window.clearTimeout(Toast.timeout);
      Toast.timeout = window.setTimeout(() => {
        state.toast = "";
        render();
      }, 2600);
    },
  };

  function render() {
    const app = document.querySelector("#app");
    if (!state.session) {
      app.innerHTML = `
        <div class="app-shell">
          ${Components.topbar()}
          <main class="auth-main">${Views.login()}</main>
          ${state.toast ? `<div class="toast">${Utils.escapeHtml(state.toast)}</div>` : ""}
        </div>
      `;
      return;
    }

    app.innerHTML = `
      <div class="app-shell">
        ${Components.topbar()}
        <div class="layout">
          ${Components.sidebar()}
          <main class="main">${Views.current()}</main>
        </div>
        ${state.toast ? `<div class="toast">${Utils.escapeHtml(state.toast)}</div>` : ""}
      </div>
    `;
  }

  Events.bind();
  render();
})();
