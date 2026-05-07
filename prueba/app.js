const states = [
  "registrado",
  "datos_incompletos",
  "pendiente_pago_ceneval",
  "pago_ceneval_cargado",
  "pago_ceneval_rechazado",
  "pago_ceneval_validado",
  "evaluacion_pendiente",
  "evaluado",
  "no_aceptado",
  "aceptado",
  "documentos_pendientes",
  "documentos_cargados",
  "documentos_observados",
  "documentos_validados",
  "pendiente_pago_inscripcion",
  "pago_inscripcion_validado",
  "inscrito",
  "inactivo",
];

const stateLabels = {
  registrado: "Registrado",
  datos_incompletos: "Datos incompletos",
  pendiente_pago_ceneval: "Pendiente pago CENEVAL",
  pago_ceneval_cargado: "Comprobante CENEVAL cargado",
  pago_ceneval_rechazado: "Pago CENEVAL rechazado",
  pago_ceneval_validado: "Pago CENEVAL validado",
  evaluacion_pendiente: "Evaluacion pendiente",
  evaluado: "Evaluado",
  no_aceptado: "No aceptado",
  aceptado: "Aceptado",
  documentos_pendientes: "Documentos pendientes",
  documentos_cargados: "Documentos cargados",
  documentos_observados: "Documentos observados",
  documentos_validados: "Documentos validados",
  pendiente_pago_inscripcion: "Pendiente pago inscripcion",
  pago_inscripcion_validado: "Pago inscripcion validado",
  inscrito: "Inscrito",
  inactivo: "Inactivo",
};

const roles = [
  { id: "aspirante", label: "Aspirante" },
  { id: "admisiones", label: "Responsable de Admisiones" },
  { id: "inscripciones", label: "Responsable de Inscripciones" },
  { id: "director_academico", label: "Director Academico" },
  { id: "director_carrera", label: "Director de Carrera" },
];

const careers = [
  "TSU en Contabilidad",
  "TSU en Quimica Area Industrial",
  "TSU en Tecnologias de la Informacion",
  "TSU en Gastronomia",
  "TSU en Mantenimiento",
  "TSU en Energias Renovables",
  "TSU en Logistica",
];

const requiredDocuments = [
  "Acta de nacimiento",
  "Certificado de bachillerato",
  "Comprobante de domicilio",
];

const appState = {
  role: "aspirante",
  view: "registro",
  selectedApplicantId: 1,
  directorCareer: "TSU en Contabilidad",
  filter: "",
  toast: "",
  validationErrors: [],
  applicants: createMockApplicants(),
};

const glossary = [
  ["Aspirante", "Persona registrada para participar en el proceso de admision."],
  ["Aceptado", "Aspirante seleccionado despues de resultados o validacion institucional."],
  ["Nuevo ingreso", "Aceptado que esta completando documentos, pago y alta."],
  ["Alumno", "Persona inscrita oficialmente con numero de control."],
  ["Folio", "Identificador de solicitud de admision."],
  ["Numero de control", "Identificador academico que se asigna al alumno inscrito."],
];

const businessRules = [
  "El CURP no puede repetirse dentro del mismo prototipo.",
  "El promedio debe estar entre 0 y 10.",
  "No se captura resultado CENEVAL si el pago CENEVAL no fue validado.",
  "El comprobante de pago de inscripcion se maneja como pago, no como documento academico.",
  "No se genera ficha de inscripcion hasta que todos los documentos obligatorios esten validados.",
  "No se da de alta como alumno si faltan documentos validos.",
  "No se da de alta como alumno si falta pago de inscripcion validado.",
  "El cambio de carrera se solicita y lo resuelve Direccion Academica; no se aplica automaticamente desde el aspirante.",
];

const transitionMatrix = [
  ["registrado", "Generar ficha CENEVAL", "pendiente_pago_ceneval", "Aspirante"],
  ["pendiente_pago_ceneval", "Subir comprobante CENEVAL", "pago_ceneval_cargado", "Aspirante"],
  ["pago_ceneval_cargado", "Validar pago CENEVAL", "evaluacion_pendiente", "Responsable de Admisiones"],
  ["pago_ceneval_cargado", "Rechazar pago CENEVAL", "pago_ceneval_rechazado", "Responsable de Admisiones"],
  ["evaluacion_pendiente", "Capturar puntaje CENEVAL", "evaluado", "Responsable de Admisiones"],
  ["evaluado", "Aceptar aspirante", "aceptado", "Responsable de Admisiones"],
  ["evaluado", "No aceptar aspirante", "no_aceptado", "Responsable de Admisiones"],
  ["aceptado", "Subir documentos", "documentos_pendientes/documentos_cargados", "Aceptado"],
  ["documentos_cargados", "Validar todos los documentos", "documentos_validados", "Responsable de Inscripciones"],
  ["documentos_validados", "Generar ficha de inscripcion", "pendiente_pago_inscripcion", "Aceptado"],
  ["pendiente_pago_inscripcion", "Subir comprobante de inscripcion", "pendiente_pago_inscripcion", "Aceptado"],
  ["pendiente_pago_inscripcion", "Validar pago de inscripcion", "pago_inscripcion_validado", "Responsable de Inscripciones"],
  ["pago_inscripcion_validado", "Dar de alta alumno", "inscrito", "Responsable de Inscripciones"],
];

function createMockApplicants() {
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
      estado: "pago_ceneval_cargado",
      activo: true,
      cenevalPago: {
        referencia: "CEN-0001",
        comprobante: true,
        estatus: "comprobante_cargado",
      },
      resultadoCeneval: null,
      documentos: createDocuments(),
      pagoInscripcion: { referencia: "", comprobante: false, estatus: "pendiente" },
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
      estado: "aceptado",
      activo: true,
      cenevalPago: {
        referencia: "CEN-0002",
        comprobante: true,
        estatus: "validado",
      },
      resultadoCeneval: 1006,
      documentos: createDocuments("pendiente"),
      pagoInscripcion: { referencia: "", comprobante: false, estatus: "pendiente" },
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
      estado: "documentos_cargados",
      activo: true,
      cenevalPago: {
        referencia: "CEN-0003",
        comprobante: true,
        estatus: "validado",
      },
      resultadoCeneval: 950,
      documentos: createDocuments("cargado"),
      pagoInscripcion: { referencia: "", comprobante: false, estatus: "pendiente" },
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
      estado: "inscrito",
      activo: true,
      cenevalPago: {
        referencia: "CEN-0004",
        comprobante: true,
        estatus: "validado",
      },
      resultadoCeneval: 890,
      documentos: createDocuments("valido"),
      pagoInscripcion: { referencia: "INS-0004", comprobante: true, estatus: "validado" },
      numeroControl: "20260004",
      grupo: "1GAS1",
      solicitudesCambio: [],
    },
  ];
}

function createDocuments(status = "pendiente") {
  return requiredDocuments.map((name) => ({
    name,
    status,
    fileName: status === "pendiente" ? "" : `${slugify(name)}.pdf`,
    observation: "",
  }));
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function render() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <div class="app-shell">
      ${renderTopbar()}
      <div class="layout">
        ${renderSidebar()}
        <main class="main">${renderView()}</main>
      </div>
      ${appState.toast ? `<div class="toast">${escapeHtml(appState.toast)}</div>` : ""}
    </div>
  `;
}

function renderTopbar() {
  const roleButtons = roles
    .map(
      (role) => `
        <button class="role-button ${role.id === appState.role ? "active" : ""}" data-action="set-role" data-role="${role.id}">
          ${role.label}
        </button>
      `
    )
    .join("");

  return `
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">UTeM</div>
        <div>
          <h1>SIIGESI Aspirantes</h1>
          <p>Prototipo local sin base de datos</p>
        </div>
      </div>
      <div class="role-switcher">${roleButtons}</div>
    </header>
  `;
}

function renderSidebar() {
  const views = getViewsForRole(appState.role);
  const buttons = views
    .map(
      (view) => `
        <button class="nav-button ${view.id === appState.view ? "active" : ""}" data-action="set-view" data-view="${view.id}">
          ${view.label}
        </button>
      `
    )
    .join("");

  return `
    <aside class="sidebar">
      <p class="sidebar-title">Menu de prueba</p>
      <div class="nav-list">${buttons}</div>
      <div class="actions">
        <button class="button secondary" data-action="reset-data">Reiniciar datos</button>
      </div>
    </aside>
  `;
}

function getViewsForRole(role) {
  const map = {
    aspirante: [
      { id: "registro", label: "Registro" },
      { id: "portal_aspirante", label: "Panel del aspirante" },
      { id: "guia_proyecto", label: "Guia del proyecto" },
      { id: "matriz_estados", label: "Matriz de estados" },
      { id: "reglas_negocio", label: "Reglas y permisos" },
    ],
    admisiones: [
      { id: "panel_admisiones", label: "Aspirantes y CENEVAL" },
      { id: "guia_proyecto", label: "Guia del proyecto" },
      { id: "matriz_estados", label: "Matriz de estados" },
      { id: "reglas_negocio", label: "Reglas y permisos" },
    ],
    inscripciones: [
      { id: "panel_inscripciones", label: "Aceptados y documentos" },
      { id: "guia_proyecto", label: "Guia del proyecto" },
      { id: "matriz_estados", label: "Matriz de estados" },
      { id: "reglas_negocio", label: "Reglas y permisos" },
    ],
    director_academico: [
      { id: "panel_director_academico", label: "Resumen academico" },
      { id: "guia_proyecto", label: "Guia del proyecto" },
      { id: "matriz_estados", label: "Matriz de estados" },
      { id: "reglas_negocio", label: "Reglas y permisos" },
    ],
    director_carrera: [
      { id: "panel_director_carrera", label: "Carrera y grupos" },
      { id: "guia_proyecto", label: "Guia del proyecto" },
      { id: "matriz_estados", label: "Matriz de estados" },
      { id: "reglas_negocio", label: "Reglas y permisos" },
    ],
  };

  return map[role];
}

function renderView() {
  switch (appState.view) {
    case "registro":
      return renderRegistration();
    case "portal_aspirante":
      return renderApplicantPortal();
    case "panel_admisiones":
      return renderAdmissionsPanel();
    case "panel_inscripciones":
      return renderEnrollmentPanel();
    case "panel_director_academico":
      return renderAcademicDirectorPanel();
    case "panel_director_carrera":
      return renderCareerDirectorPanel();
    case "guia_proyecto":
      return renderProjectGuide();
    case "matriz_estados":
      return renderStateMatrix();
    case "reglas_negocio":
      return renderRulesAndPermissions();
    default:
      return renderRegistration();
  }
}

function renderHeading(title, text) {
  return `
    <div class="page-heading">
      <div>
        <h2>${title}</h2>
        <p>${text}</p>
      </div>
    </div>
  `;
}

function renderProjectGuide() {
  return `
    ${renderHeading("Guia del proyecto", "Vista de apoyo para que el prototipo sea entendible como proyecto universitario. Resume alcance, terminos y ruta recomendada.")}
    <section class="panel">
      <h3>Alcance recomendado</h3>
      <p>Este prototipo se enfoca en admision y nuevo ingreso. Deja fuera reinscripciones, bajas, extraordinarios, titulacion, IMSS y convenios complejos para evitar que el proyecto crezca demasiado.</p>
      <div class="timeline">
        ${["Registro", "Pago CENEVAL", "Validacion", "Resultado", "Aceptacion", "Documentos", "Pago inscripcion", "Alta alumno"]
          .map((item) => `<span class="timeline-step done">${item}</span>`)
          .join("")}
      </div>
    </section>
    <section class="grid two">
      <div class="panel">
        <h3>Glosario normalizado</h3>
        <div class="definition-list">
          ${glossary.map(([term, description]) => `<div><strong>${term}</strong><span>${description}</span></div>`).join("")}
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
        ${[
          ["Analisis", "Reglas, estados, actores, alcance y glosario."],
          ["Diseno", "Base de datos, pantallas, permisos y pruebas."],
          ["Implementacion", "Backend, frontend, autenticacion, archivos y reportes."],
        ]
          .map(([title, text]) => `<div class="metric"><strong>${title}</strong><span>${text}</span></div>`)
          .join("")}
      </div>
    </section>
  `;
}

function renderStateMatrix() {
  return `
    ${renderHeading("Matriz de estados", "Formaliza el flujo para que el sistema no dependa de decisiones improvisadas. Cada accion cambia el estado solo si se cumple su condicion.")}
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
            ${transitionMatrix
              .map(
                ([from, action, to, role]) => `
                  <tr>
                    <td>${statusBadge(from)}</td>
                    <td>${action}</td>
                    <td>${to.split("/").map((state) => (stateLabels[state] ? statusBadge(state) : `<span class="badge">${state}</span>`)).join(" ")}</td>
                    <td>${role}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderRulesAndPermissions() {
  return `
    ${renderHeading("Reglas y permisos", "Concentra las condiciones que hacen que el prototipo sea mas cercano a una especificacion funcional.")}
    <section class="grid two">
      <div class="panel">
        <h3>Reglas de negocio implementadas</h3>
        <ul class="clean-list">
          ${businessRules.map((rule) => `<li>${rule}</li>`).join("")}
        </ul>
      </div>
      <div class="panel">
        <h3>Permisos por rol</h3>
        <div class="definition-list">
          <div><strong>Aspirante</strong><span>Registra solicitud, genera fichas y carga comprobantes/documentos propios.</span></div>
          <div><strong>Admisiones</strong><span>Valida CENEVAL, captura resultados y decide aceptacion.</span></div>
          <div><strong>Inscripciones</strong><span>Valida documentos, pago de inscripcion y alta del alumno.</span></div>
          <div><strong>Director Academico</strong><span>Consulta resumen y resuelve cambios de carrera.</span></div>
          <div><strong>Director de Carrera</strong><span>Consulta aspirantes, aceptados y grupos de su carrera.</span></div>
        </div>
      </div>
    </section>
  `;
}

function renderRegistration() {
  return `
    ${renderHeading("Registro de aspirante", "Captura la solicitud inicial. Al guardar, el aspirante queda listo para generar su ficha CENEVAL.")}
    <section class="panel">
      <h3>Solicitud de proceso de admision</h3>
      ${renderValidationErrors()}
      <form id="registration-form" class="grid">
        <div class="grid three">
          ${field("nombre", "Nombre", "text", "Mariana", true)}
          ${field("apellidoPaterno", "Apellido paterno", "text", "Lopez", true)}
          ${field("apellidoMaterno", "Apellido materno", "text", "Ramirez", true)}
        </div>
        <div class="grid three">
          ${field("curp", "CURP", "text", "LORM060512MCMPRR02", true)}
          ${field("correo", "Correo", "email", "mariana.lopez@correo.com", true)}
          ${field("telefono", "Telefono", "tel", "3142223344", true)}
        </div>
        <div class="grid three">
          ${field("fechaNacimiento", "Fecha de nacimiento", "date", "2006-05-12", true)}
          ${selectField("carrera", "Carrera de interes", careers, careers[0])}
          ${field("promedio", "Promedio", "number", "8.9", true, "0.1")}
        </div>
        ${field("bachillerato", "Bachillerato de procedencia", "text", "CBTis 226", true)}
        <div class="actions">
          <button class="button" type="submit">Registrar aspirante</button>
          <button class="button secondary" type="button" data-action="set-view" data-view="portal_aspirante">Ir al panel</button>
        </div>
      </form>
    </section>
    ${renderApplicantTable(appState.applicants, "Aspirantes de prueba")}
  `;
}

function renderValidationErrors() {
  if (!appState.validationErrors.length) return "";
  return `
    <div class="notice danger">
      <strong>Revisa el registro antes de continuar:</strong>
      <ul>
        ${appState.validationErrors.map((error) => `<li>${error}</li>`).join("")}
      </ul>
    </div>
  `;
}

function field(name, label, type, value = "", required = false, step = "") {
  return `
    <div class="field">
      <label for="${name}">${label}</label>
      <input id="${name}" name="${name}" type="${type}" value="${escapeAttr(value)}" ${required ? "required" : ""} ${step ? `step="${step}"` : ""} />
    </div>
  `;
}

function selectField(name, label, options, selected) {
  return `
    <div class="field">
      <label for="${name}">${label}</label>
      <select id="${name}" name="${name}" required>
        ${options.map((option) => `<option value="${escapeAttr(option)}" ${option === selected ? "selected" : ""}>${option}</option>`).join("")}
      </select>
    </div>
  `;
}

function renderApplicantPortal() {
  const applicant = getSelectedApplicant();
  return `
    ${renderHeading("Panel del aspirante", "Simula las acciones que realiza un aspirante o aceptado durante el proceso.")}
    ${renderApplicantSelector()}
    <section class="panel">
      <div class="status-row">
        <h3 style="margin: 0;">${fullName(applicant)}</h3>
        ${statusBadge(applicant.estado)}
        ${applicant.activo ? '<span class="badge green">Activo</span>' : '<span class="badge red">Inactivo</span>'}
      </div>
      <p class="muted">Folio ${applicant.folio} &middot; ${applicant.carrera} &middot; ${applicant.bachillerato}</p>
      ${renderTimeline(applicant.estado)}
      ${renderReadiness(applicant)}
    </section>
    <section class="grid two">
      ${renderCenevalBox(applicant)}
      ${renderApplicantDocumentsBox(applicant)}
    </section>
    <section class="grid two">
      ${renderEnrollmentPaymentBox(applicant)}
      ${renderChangeCareerBox(applicant)}
    </section>
  `;
}

function renderApplicantSelector() {
  return `
    <section class="panel">
      <div class="grid two">
        <div class="field">
          <label for="selectedApplicant">Aspirante de prueba</label>
          <select id="selectedApplicant" data-action="select-applicant">
            ${appState.applicants
              .map((applicant) => `<option value="${applicant.id}" ${applicant.id === appState.selectedApplicantId ? "selected" : ""}>${fullName(applicant)} - ${applicant.folio}</option>`)
              .join("")}
          </select>
        </div>
      </div>
    </section>
  `;
}

function renderCenevalBox(applicant) {
  const canGenerate = canGenerateCeneval(applicant);
  const canUpload = canUploadCeneval(applicant);
  return `
    <section class="panel">
      <h3>CENEVAL</h3>
      <p><strong>Referencia:</strong> ${applicant.cenevalPago.referencia || "Sin generar"}</p>
      <p><strong>Pago:</strong> ${paymentLabel(applicant.cenevalPago.estatus)}</p>
      <p><strong>Resultado:</strong> ${applicant.resultadoCeneval ?? "Sin capturar"}</p>
      <div class="actions">
        <button class="button" data-action="generate-ceneval" data-id="${applicant.id}" ${!canGenerate ? "disabled" : ""}>Generar ficha CENEVAL</button>
        <button class="button secondary" data-action="upload-ceneval" data-id="${applicant.id}" ${!canUpload ? "disabled" : ""}>Subir comprobante</button>
      </div>
    </section>
  `;
}

function renderApplicantDocumentsBox(applicant) {
  const isAccepted = canAccessEnrollment(applicant) && applicant.estado !== "inscrito";
  const docs = applicant.documentos
    .map(
      (doc, index) => `
        <div class="document-row">
          <div>
            <strong>${doc.name}</strong>
            <div class="muted">${doc.fileName || "Sin archivo"} &middot; ${documentLabel(doc.status)}${doc.observation ? ` &middot; ${doc.observation}` : ""}</div>
          </div>
          <button class="button small secondary" data-action="upload-document" data-id="${applicant.id}" data-doc="${index}" ${!isAccepted || doc.status === "valido" ? "disabled" : ""}>Subir</button>
        </div>
      `
    )
    .join("");

  return `
    <section class="panel">
      <h3>Documentos</h3>
      <div class="document-list">${docs}</div>
    </section>
  `;
}

function renderEnrollmentPaymentBox(applicant) {
  const canGenerate = canGenerateEnrollmentPayment(applicant);
  const canUpload = canUploadEnrollmentPayment(applicant);
  return `
    <section class="panel">
      <h3>Pago de inscripcion</h3>
      <p><strong>Referencia:</strong> ${applicant.pagoInscripcion.referencia || "Sin generar"}</p>
      <p><strong>Estatus:</strong> ${paymentLabel(applicant.pagoInscripcion.estatus)}</p>
      ${!allDocumentsValid(applicant) && canAccessEnrollment(applicant) ? '<p class="muted">Primero deben validarse todos los documentos obligatorios.</p>' : ""}
      <div class="actions">
        <button class="button" data-action="generate-enrollment-payment" data-id="${applicant.id}" ${!canGenerate ? "disabled" : ""}>Generar ficha</button>
        <button class="button secondary" data-action="upload-enrollment-payment" data-id="${applicant.id}" ${!canUpload ? "disabled" : ""}>Subir comprobante</button>
      </div>
    </section>
  `;
}

function renderChangeCareerBox(applicant) {
  const canRequest = ["aceptado", "documentos_pendientes", "documentos_cargados", "documentos_observados", "documentos_validados", "pendiente_pago_inscripcion"].includes(applicant.estado);
  return `
    <section class="panel">
      <h3>Solicitud de cambio de carrera</h3>
      <form id="change-career-form" class="grid">
        ${selectField("careerTarget", "Carrera solicitada", careers.filter((career) => career !== applicant.carrera), careers.find((career) => career !== applicant.carrera))}
        <div class="field">
          <label for="careerReason">Motivo</label>
          <textarea id="careerReason" name="careerReason">Deseo cambiar mi opcion por afinidad academica.</textarea>
        </div>
        <input type="hidden" name="applicantId" value="${applicant.id}" />
        <div class="actions">
          <button class="button" type="submit" ${!canRequest ? "disabled" : ""}>Enviar solicitud</button>
        </div>
      </form>
    </section>
  `;
}

function renderAdmissionsPanel() {
  const filtered = getFilteredApplicants();
  return `
    ${renderHeading("Responsable de Admisiones", "Administra aspirantes, pagos CENEVAL, resultados y aceptacion.")}
    ${renderFilter()}
    ${renderMetrics([
      ["Aspirantes", appState.applicants.length],
      ["Pagos CENEVAL por validar", appState.applicants.filter((a) => a.estado === "pago_ceneval_cargado").length],
      ["Aceptados", appState.applicants.filter((a) => acceptedStates().includes(a.estado)).length],
    ])}
    <section class="panel">
      <h3>Listado de aspirantes</h3>
      ${renderAdmissionsTable(filtered)}
    </section>
  `;
}

function renderFilter() {
  return `
    <section class="panel">
      <div class="field">
        <label for="filter">Filtrar por nombre, CURP o carrera</label>
        <input id="filter" data-action="filter" type="search" value="${escapeAttr(appState.filter)}" placeholder="Nombre, CURP o carrera" />
      </div>
    </section>
  `;
}

function renderMetrics(items) {
  return `
    <section class="grid three">
      ${items.map(([label, value]) => `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`).join("")}
    </section>
  `;
}

function renderAdmissionsTable(applicants) {
  if (!applicants.length) return `<div class="empty">No hay aspirantes con ese filtro.</div>`;
  const rows = applicants
    .map(
      (applicant) => `
        <tr>
          <td>
            <strong>${fullName(applicant)}</strong>
            <div class="muted">${applicant.folio} &middot; ${applicant.curp}</div>
          </td>
          <td>${applicant.carrera}<div class="muted">${applicant.bachillerato}</div></td>
          <td>${applicant.promedio}</td>
          <td>${statusBadge(applicant.estado)}</td>
          <td>${applicant.resultadoCeneval ?? "Sin resultado"}</td>
          <td>
            <div class="table-actions">
              <button class="button small success" data-action="validate-ceneval" data-id="${applicant.id}" ${applicant.estado !== "pago_ceneval_cargado" ? "disabled" : ""}>Validar pago</button>
              <button class="button small danger" data-action="reject-ceneval" data-id="${applicant.id}" ${applicant.estado !== "pago_ceneval_cargado" ? "disabled" : ""}>Rechazar pago</button>
              <button class="button small" data-action="capture-score" data-id="${applicant.id}" ${applicant.estado !== "evaluacion_pendiente" ? "disabled" : ""}>Capturar puntaje</button>
              <button class="button small success" data-action="mark-accepted" data-id="${applicant.id}" ${applicant.estado !== "evaluado" ? "disabled" : ""}>Aceptar</button>
              <button class="button small warning" data-action="mark-rejected" data-id="${applicant.id}" ${applicant.estado !== "evaluado" ? "disabled" : ""}>No aceptar</button>
              <button class="button small secondary" data-action="toggle-active" data-id="${applicant.id}">${applicant.activo ? "Desactivar" : "Activar"}</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");

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
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderEnrollmentPanel() {
  const accepted = appState.applicants.filter((applicant) => acceptedStates().includes(applicant.estado));
  return `
    ${renderHeading("Responsable de Inscripciones", "Valida documentos, pago de inscripcion y alta de alumnos de nuevo ingreso.")}
    ${renderMetrics([
      ["Aceptados", accepted.length],
      ["Documentos por revisar", accepted.filter((a) => a.documentos.some((d) => d.status === "cargado")).length],
      ["Inscritos", appState.applicants.filter((a) => a.estado === "inscrito").length],
    ])}
    <section class="panel">
      <h3>Lista de aceptados</h3>
      ${renderEnrollmentTable(accepted)}
    </section>
  `;
}

function renderEnrollmentTable(applicants) {
  if (!applicants.length) return `<div class="empty">No hay aceptados para revisar.</div>`;
  const rows = applicants
    .map(
      (applicant) => `
        <tr>
          <td>
            <strong>${fullName(applicant)}</strong>
            <div class="muted">${applicant.folio} &middot; ${applicant.carrera}</div>
          </td>
          <td>${statusBadge(applicant.estado)}</td>
          <td>${renderDocsMini(applicant)}</td>
          <td>${paymentLabel(applicant.pagoInscripcion.estatus)}</td>
          <td>
            <div class="table-actions">
              ${applicant.documentos
                .map(
                  (doc, index) => `
                    <button class="button small success" data-action="validate-document" data-id="${applicant.id}" data-doc="${index}" ${doc.status !== "cargado" && doc.status !== "no_valido" ? "disabled" : ""}>Validar ${index + 1}</button>
                    <button class="button small danger" data-action="reject-document" data-id="${applicant.id}" data-doc="${index}" ${doc.status !== "cargado" ? "disabled" : ""}>Rechazar ${index + 1}</button>
                  `
                )
                .join("")}
              <button class="button small success" data-action="validate-enrollment-payment" data-id="${applicant.id}" ${applicant.pagoInscripcion.estatus !== "comprobante_cargado" || !allDocumentsValid(applicant) ? "disabled" : ""}>Validar pago</button>
              <button class="button small" data-action="enroll-student" data-id="${applicant.id}" ${!canEnroll(applicant) ? "disabled" : ""}>Dar de alta</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");

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
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderDocsMini(applicant) {
  return applicant.documentos
    .map((doc, index) => `<div>${index + 1}. ${doc.name}: ${documentLabel(doc.status)}</div>`)
    .join("");
}

function renderAcademicDirectorPanel() {
  const byCareer = careers.map((career) => ({
    career,
    total: appState.applicants.filter((a) => a.carrera === career).length,
    accepted: appState.applicants.filter((a) => a.carrera === career && acceptedStates().includes(a.estado)).length,
    enrolled: appState.applicants.filter((a) => a.carrera === career && a.estado === "inscrito").length,
  }));
  const requests = appState.applicants.flatMap((applicant) =>
    applicant.solicitudesCambio.map((request) => ({ applicant, request }))
  );

  return `
    ${renderHeading("Director Academico", "Consulta avance por carrera, aceptados y solicitudes de cambio de carrera.")}
    ${renderMetrics([
      ["Total aspirantes", appState.applicants.length],
      ["Aceptados", appState.applicants.filter((a) => acceptedStates().includes(a.estado)).length],
      ["Solicitudes cambio", requests.length],
    ])}
    <section class="panel">
      <h3>Resumen por carrera</h3>
      ${renderCareerSummaryTable(byCareer)}
    </section>
    <section class="panel">
      <h3>Solicitudes de cambio de carrera</h3>
      ${renderChangeRequestsTable(requests)}
    </section>
  `;
}

function renderCareerSummaryTable(items) {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td>${item.career}</td>
          <td>${item.total}</td>
          <td>${item.accepted}</td>
          <td>${item.enrolled}</td>
        </tr>
      `
    )
    .join("");

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
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderChangeRequestsTable(requests) {
  if (!requests.length) return `<div class="empty">No hay solicitudes registradas.</div>`;
  const rows = requests
    .map(
      ({ applicant, request }) => `
        <tr>
          <td>${fullName(applicant)}<div class="muted">${applicant.carrera}</div></td>
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
    .join("");

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
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderCareerDirectorPanel() {
  const applicants = appState.applicants.filter((applicant) => applicant.carrera === appState.directorCareer);
  const accepted = applicants.filter((applicant) => acceptedStates().includes(applicant.estado));
  return `
    ${renderHeading("Director de Carrera", "Consulta aspirantes, aceptados y grupos simulados de una carrera.")}
    <section class="panel">
      <div class="field">
        <label for="directorCareer">Carrera</label>
        <select id="directorCareer" data-action="select-director-career">
          ${careers.map((career) => `<option value="${career}" ${career === appState.directorCareer ? "selected" : ""}>${career}</option>`).join("")}
        </select>
      </div>
    </section>
    ${renderMetrics([
      ["Aspirantes de carrera", applicants.length],
      ["Aceptados de carrera", accepted.length],
      ["Inscritos de carrera", applicants.filter((a) => a.estado === "inscrito").length],
    ])}
    ${renderApplicantTable(applicants, "Aspirantes de la carrera")}
    <section class="panel">
      <h3>Grupos simulados</h3>
      ${renderGroups(appState.directorCareer, accepted)}
    </section>
  `;
}

function renderGroups(career, accepted) {
  const prefix = getGroupPrefix(career);
  const groups = [
    { key: `1${prefix}1`, capacity: 30 },
    { key: `1${prefix}2`, capacity: 30 },
  ];

  return `
    <div class="grid two">
      ${groups
        .map((group, groupIndex) => {
          const members = accepted.filter((_, index) => index % groups.length === groupIndex);
          return `
            <div class="metric">
              <strong>${group.key}</strong>
              <span>${members.length}/${group.capacity} alumnos proyectados</span>
              <div>${members.map((member) => `<div>${fullName(member)}</div>`).join("") || '<span class="muted">Sin alumnos asignados</span>'}</div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderApplicantTable(applicants, title) {
  const rows = applicants
    .map(
      (applicant) => `
        <tr>
          <td><strong>${fullName(applicant)}</strong><div class="muted">${applicant.folio}</div></td>
          <td>${applicant.curp}</td>
          <td>${applicant.carrera}</td>
          <td>${applicant.promedio}</td>
          <td>${statusBadge(applicant.estado)}</td>
        </tr>
      `
    )
    .join("");

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
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderReadiness(applicant) {
  const checks = [
    ["Pago CENEVAL", applicant.cenevalPago.estatus === "validado"],
    ["Resultado CENEVAL", applicant.resultadoCeneval !== null],
    ["Aceptacion", acceptedStates().includes(applicant.estado)],
    ["Documentos validos", allDocumentsValid(applicant)],
    ["Pago inscripcion", applicant.pagoInscripcion.estatus === "validado"],
  ];

  return `
    <div class="readiness">
      ${checks
        .map(([label, done]) => `<span class="check ${done ? "done" : ""}">${done ? "OK" : "Pendiente"} · ${label}</span>`)
        .join("")}
    </div>
  `;
}

function renderTimeline(currentState) {
  const flow = [
    "registrado",
    "pendiente_pago_ceneval",
    "pago_ceneval_cargado",
    "evaluacion_pendiente",
    "evaluado",
    "aceptado",
    "documentos_cargados",
    "documentos_validados",
    "pendiente_pago_inscripcion",
    "pago_inscripcion_validado",
    "inscrito",
  ];
  const currentIndex = flow.indexOf(currentState);

  return `
    <div class="timeline">
      ${flow
        .map((state, index) => `<span class="timeline-step ${currentIndex >= index || currentState === "inscrito" ? "done" : ""}">${stateLabels[state]}</span>`)
        .join("")}
    </div>
  `;
}

function statusBadge(state) {
  let color = "blue";
  if (["aceptado", "documentos_validados", "pago_inscripcion_validado", "inscrito", "pago_ceneval_validado"].includes(state)) color = "green";
  if (["pago_ceneval_rechazado", "no_aceptado", "documentos_observados", "inactivo"].includes(state)) color = "red";
  if (["pendiente_pago_ceneval", "pago_ceneval_cargado", "documentos_pendientes", "documentos_cargados", "pendiente_pago_inscripcion"].includes(state)) color = "amber";
  if (["evaluado", "evaluacion_pendiente"].includes(state)) color = "purple";
  return `<span class="badge ${color}">${stateLabels[state] || state}</span>`;
}

function documentLabel(status) {
  const labels = {
    pendiente: "Pendiente",
    cargado: "Cargado",
    valido: "Valido",
    no_valido: "No valido",
  };
  return labels[status] || status;
}

function paymentLabel(status) {
  const labels = {
    pendiente: "Pendiente",
    generado: "Generado",
    comprobante_cargado: "Comprobante cargado",
    validado: "Validado",
    rechazado: "Rechazado",
  };
  return labels[status] || status;
}

function getSelectedApplicant() {
  return appState.applicants.find((applicant) => applicant.id === appState.selectedApplicantId) || appState.applicants[0];
}

function getFilteredApplicants() {
  const filter = appState.filter.trim().toLowerCase();
  if (!filter) return appState.applicants;
  return appState.applicants.filter((applicant) => {
    return [fullName(applicant), applicant.curp, applicant.carrera, applicant.folio].some((value) =>
      String(value).toLowerCase().includes(filter)
    );
  });
}

function acceptedStates() {
  return [
    "aceptado",
    "documentos_pendientes",
    "documentos_cargados",
    "documentos_observados",
    "documentos_validados",
    "pendiente_pago_inscripcion",
    "pago_inscripcion_validado",
    "inscrito",
  ];
}

function canAccessEnrollment(applicant) {
  return acceptedStates().includes(applicant.estado);
}

function isTerminalState(applicant) {
  return ["no_aceptado", "inscrito", "inactivo"].includes(applicant.estado);
}

function canGenerateCeneval(applicant) {
  return applicant.activo && !applicant.cenevalPago.referencia && !isTerminalState(applicant);
}

function canUploadCeneval(applicant) {
  return (
    applicant.activo &&
    applicant.cenevalPago.referencia &&
    !applicant.cenevalPago.comprobante &&
    ["pendiente_pago_ceneval", "pago_ceneval_rechazado"].includes(applicant.estado)
  );
}

function allDocumentsValid(applicant) {
  return applicant.documentos.length > 0 && applicant.documentos.every((doc) => doc.status === "valido");
}

function canGenerateEnrollmentPayment(applicant) {
  return canAccessEnrollment(applicant) && allDocumentsValid(applicant) && !applicant.pagoInscripcion.referencia && applicant.estado !== "inscrito";
}

function canUploadEnrollmentPayment(applicant) {
  return (
    canAccessEnrollment(applicant) &&
    allDocumentsValid(applicant) &&
    applicant.pagoInscripcion.referencia &&
    !applicant.pagoInscripcion.comprobante &&
    applicant.estado !== "inscrito"
  );
}

function canEnroll(applicant) {
  return allDocumentsValid(applicant) && applicant.pagoInscripcion.estatus === "validado" && applicant.estado !== "inscrito";
}

function fullName(applicant) {
  return `${applicant.nombre} ${applicant.apellidoPaterno} ${applicant.apellidoMaterno}`.trim();
}

function getGroupPrefix(career) {
  if (career.includes("Contabilidad")) return "CNT";
  if (career.includes("Quimica")) return "QAI";
  if (career.includes("Tecnologias")) return "TID";
  if (career.includes("Gastronomia")) return "GAS";
  if (career.includes("Mantenimiento")) return "MMP";
  if (career.includes("Energias")) return "ERE";
  return "LCS";
}

function updateApplicantState(applicant, nextState) {
  applicant.estado = nextState;
}

function refreshDocumentState(applicant) {
  const allValid = applicant.documentos.every((doc) => doc.status === "valido");
  const allUploaded = applicant.documentos.every((doc) => ["cargado", "valido", "no_valido"].includes(doc.status));
  const hasRejected = applicant.documentos.some((doc) => doc.status === "no_valido");

  if (hasRejected) updateApplicantState(applicant, "documentos_observados");
  else if (allValid) updateApplicantState(applicant, "documentos_validados");
  else if (allUploaded) updateApplicantState(applicant, "documentos_cargados");
  else if (acceptedStates().includes(applicant.estado)) updateApplicantState(applicant, "documentos_pendientes");
}

function showToast(message) {
  appState.toast = message;
  render();
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    appState.toast = "";
    render();
  }, 2600);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;

  if (action === "set-role") {
    appState.role = button.dataset.role;
    appState.view = getViewsForRole(appState.role)[0].id;
    render();
  }

  if (action === "set-view") {
    appState.view = button.dataset.view;
    render();
  }

  if (action === "reset-data") {
    appState.applicants = createMockApplicants();
    appState.selectedApplicantId = 1;
    appState.filter = "";
    appState.validationErrors = [];
    showToast("Datos de prueba reiniciados.");
  }

  if (action === "generate-ceneval") {
    const applicant = findApplicant(button.dataset.id);
    if (!canGenerateCeneval(applicant)) {
      showToast("No se puede generar ficha CENEVAL para este estado.");
      return;
    }
    applicant.cenevalPago.referencia = `CEN-${String(applicant.id).padStart(4, "0")}`;
    applicant.cenevalPago.estatus = "generado";
    updateApplicantState(applicant, "pendiente_pago_ceneval");
    showToast("Ficha CENEVAL generada.");
  }

  if (action === "upload-ceneval") {
    const applicant = findApplicant(button.dataset.id);
    if (!canUploadCeneval(applicant)) {
      showToast("No se puede cargar comprobante CENEVAL en este momento.");
      return;
    }
    applicant.cenevalPago.comprobante = true;
    applicant.cenevalPago.estatus = "comprobante_cargado";
    updateApplicantState(applicant, "pago_ceneval_cargado");
    showToast("Comprobante CENEVAL cargado.");
  }

  if (action === "validate-ceneval") {
    const applicant = findApplicant(button.dataset.id);
    applicant.cenevalPago.estatus = "validado";
    updateApplicantState(applicant, "evaluacion_pendiente");
    showToast("Pago CENEVAL validado. El aspirante queda listo para capturar resultado.");
  }

  if (action === "reject-ceneval") {
    const applicant = findApplicant(button.dataset.id);
    applicant.cenevalPago.estatus = "rechazado";
    applicant.cenevalPago.comprobante = false;
    updateApplicantState(applicant, "pago_ceneval_rechazado");
    showToast("Pago CENEVAL rechazado.");
  }

  if (action === "capture-score") {
    const applicant = findApplicant(button.dataset.id);
    if (applicant.cenevalPago.estatus !== "validado") {
      showToast("No se puede capturar resultado sin pago CENEVAL validado.");
      return;
    }
    const score = window.prompt("Puntaje CENEVAL:", applicant.resultadoCeneval || "900");
    if (!score) return;
    const parsedScore = Number(score);
    if (!Number.isFinite(parsedScore) || parsedScore < 0 || parsedScore > 1300) {
      showToast("El puntaje debe ser numerico y estar entre 0 y 1300.");
      return;
    }
    applicant.resultadoCeneval = parsedScore;
    updateApplicantState(applicant, "evaluado");
    showToast("Resultado CENEVAL capturado.");
  }

  if (action === "mark-accepted") {
    const applicant = findApplicant(button.dataset.id);
    updateApplicantState(applicant, "aceptado");
    showToast("Aspirante marcado como aceptado.");
  }

  if (action === "mark-rejected") {
    const applicant = findApplicant(button.dataset.id);
    updateApplicantState(applicant, "no_aceptado");
    showToast("Aspirante marcado como no aceptado.");
  }

  if (action === "toggle-active") {
    const applicant = findApplicant(button.dataset.id);
    applicant.activo = !applicant.activo;
    if (!applicant.activo) updateApplicantState(applicant, "inactivo");
    if (applicant.activo && applicant.estado === "inactivo") updateApplicantState(applicant, "registrado");
    showToast(applicant.activo ? "Aspirante activado." : "Aspirante desactivado.");
  }

  if (action === "upload-document") {
    const applicant = findApplicant(button.dataset.id);
    const doc = applicant.documentos[Number(button.dataset.doc)];
    doc.status = "cargado";
    doc.fileName = `${slugify(doc.name)}-${applicant.id}.pdf`;
    doc.observation = "";
    refreshDocumentState(applicant);
    showToast("Documento cargado.");
  }

  if (action === "validate-document") {
    const applicant = findApplicant(button.dataset.id);
    const doc = applicant.documentos[Number(button.dataset.doc)];
    doc.status = "valido";
    doc.observation = "";
    refreshDocumentState(applicant);
    showToast("Documento validado.");
  }

  if (action === "reject-document") {
    const applicant = findApplicant(button.dataset.id);
    const doc = applicant.documentos[Number(button.dataset.doc)];
    doc.status = "no_valido";
    doc.observation = "Documento ilegible o incompleto.";
    refreshDocumentState(applicant);
    showToast("Documento marcado como no valido.");
  }

  if (action === "generate-enrollment-payment") {
    const applicant = findApplicant(button.dataset.id);
    if (!canGenerateEnrollmentPayment(applicant)) {
      showToast("No se puede generar ficha: primero valida todos los documentos.");
      return;
    }
    applicant.pagoInscripcion.referencia = `INS-${String(applicant.id).padStart(4, "0")}`;
    applicant.pagoInscripcion.estatus = "generado";
    updateApplicantState(applicant, "pendiente_pago_inscripcion");
    showToast("Ficha de inscripcion generada.");
  }

  if (action === "upload-enrollment-payment") {
    const applicant = findApplicant(button.dataset.id);
    if (!canUploadEnrollmentPayment(applicant)) {
      showToast("No se puede cargar comprobante de inscripcion en este momento.");
      return;
    }
    applicant.pagoInscripcion.comprobante = true;
    applicant.pagoInscripcion.estatus = "comprobante_cargado";
    showToast("Comprobante de inscripcion cargado.");
  }

  if (action === "validate-enrollment-payment") {
    const applicant = findApplicant(button.dataset.id);
    if (!allDocumentsValid(applicant)) {
      showToast("No se puede validar pago: faltan documentos validos.");
      return;
    }
    applicant.pagoInscripcion.estatus = "validado";
    updateApplicantState(applicant, "pago_inscripcion_validado");
    showToast("Pago de inscripcion validado.");
  }

  if (action === "enroll-student") {
    const applicant = findApplicant(button.dataset.id);
    const allDocsValid = applicant.documentos.every((doc) => doc.status === "valido");
    if (!allDocsValid) {
      showToast("No se puede inscribir: faltan documentos validos.");
      return;
    }
    if (applicant.pagoInscripcion.estatus !== "validado") {
      showToast("No se puede inscribir: falta pago de inscripcion validado.");
      return;
    }
    applicant.numeroControl = applicant.numeroControl || `2026${String(applicant.id).padStart(4, "0")}`;
    applicant.grupo = applicant.grupo || `${getGroupPrefix(applicant.carrera)}-1`;
    updateApplicantState(applicant, "inscrito");
    showToast("Alumno dado de alta.");
  }

  if (action === "accept-career-request") {
    const applicant = findApplicant(button.dataset.id);
    const request = applicant.solicitudesCambio.find((item) => item.id === Number(button.dataset.request));
    request.estatus = "aceptada";
    request.respuesta = "Solicitud aceptada por Direccion Academica.";
    applicant.carrera = request.destino;
    showToast("Cambio de carrera aceptado.");
  }

  if (action === "reject-career-request") {
    const applicant = findApplicant(button.dataset.id);
    const request = applicant.solicitudesCambio.find((item) => item.id === Number(button.dataset.request));
    request.estatus = "rechazada";
    request.respuesta = "Solicitud rechazada por cupo o criterios academicos.";
    showToast("Cambio de carrera rechazado.");
  }
});

document.addEventListener("input", (event) => {
  if (event.target.dataset.action === "filter") {
    appState.filter = event.target.value;
    render();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.dataset.action === "select-applicant") {
    appState.selectedApplicantId = Number(event.target.value);
    render();
  }

  if (event.target.dataset.action === "select-director-career") {
    appState.directorCareer = event.target.value;
    render();
  }
});

document.addEventListener("submit", (event) => {
  event.preventDefault();

  if (event.target.id === "registration-form") {
    const formData = new FormData(event.target);
    const errors = validateRegistrationData(formData);
    if (errors.length) {
      appState.validationErrors = errors;
      showToast("Hay datos por corregir en el registro.");
      return;
    }
    const nextId = Math.max(...appState.applicants.map((applicant) => applicant.id)) + 1;
    const applicant = {
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
      estado: "registrado",
      activo: true,
      cenevalPago: { referencia: "", comprobante: false, estatus: "pendiente" },
      resultadoCeneval: null,
      documentos: createDocuments(),
      pagoInscripcion: { referencia: "", comprobante: false, estatus: "pendiente" },
      numeroControl: "",
      grupo: "",
      solicitudesCambio: [],
    };

    appState.applicants.push(applicant);
    appState.selectedApplicantId = applicant.id;
    appState.view = "portal_aspirante";
    appState.validationErrors = [];
    showToast("Aspirante registrado. Se simula envio de accesos por correo.");
  }

  if (event.target.id === "change-career-form") {
    const formData = new FormData(event.target);
    const applicant = findApplicant(formData.get("applicantId"));
    const request = {
      id: Date.now(),
      destino: formData.get("careerTarget"),
      motivo: formData.get("careerReason").trim(),
      estatus: "pendiente",
      respuesta: "",
    };
    applicant.solicitudesCambio.push(request);
    showToast("Solicitud de cambio de carrera enviada.");
  }
});

function validateRegistrationData(formData) {
  const errors = [];
  const curp = String(formData.get("curp") || "").trim().toUpperCase();
  const correo = String(formData.get("correo") || "").trim();
  const telefono = String(formData.get("telefono") || "").trim();
  const promedio = Number(formData.get("promedio"));
  const fechaNacimiento = String(formData.get("fechaNacimiento") || "");
  const required = ["nombre", "apellidoPaterno", "apellidoMaterno", "curp", "correo", "telefono", "fechaNacimiento", "carrera", "bachillerato"];

  required.forEach((fieldName) => {
    if (!String(formData.get(fieldName) || "").trim()) {
      errors.push(`El campo ${fieldName} es obligatorio.`);
    }
  });

  if (curp && !/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(curp)) {
    errors.push("La CURP debe tener 18 caracteres y un formato valido.");
  }

  if (appState.applicants.some((applicant) => applicant.curp === curp)) {
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
}

function findApplicant(id) {
  return appState.applicants.find((applicant) => applicant.id === Number(id));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

render();
