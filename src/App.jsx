import React, { useState, useMemo } from "react";

// ---------- Datos de ejemplo (mock) ----------
const CATEGORIAS = [
  { id: "jardin", nombre: "Vista Jardín", precio: 110000, color: "#7A9270" },
  { id: "mar", nombre: "Vista al Mar", precio: 175000, color: "#3E7C8C" },
  { id: "suite", nombre: "Suite Frente al Mar", precio: 320000, color: "#1B4B5A" },
];

function generarHabitaciones() {
  const hab = [];
  let n = 101;
  CATEGORIAS.forEach((cat, ci) => {
    const cantidad = ci === 2 ? 6 : ci === 1 ? 18 : 20;
    for (let i = 0; i < cantidad; i++) {
      hab.push({ numero: n++, categoria: cat.id });
    }
  });
  return hab;
}
const HABITACIONES = generarHabitaciones();

const HOY = new Date(2026, 7, 4); // 4 ago 2026
function fechaISO(d) {
  return d.toISOString().slice(0, 10);
}
function sumarDias(fecha, dias) {
  const d = new Date(fecha);
  d.setDate(d.getDate() + dias);
  return d;
}

const ESTADOS = {
  confirmada: { label: "Confirmada", color: "#6B7B58" },
  pendiente: { label: "Pendiente de pago", color: "#C9A227" },
  pagada: { label: "Pagada", color: "#2F6F62" },
};

function generarReservas() {
  const muestras = [
    { hab: 101, inicio: 0, noches: 2, estado: "confirmada", huesped: "Marcela Ríos" },
    { hab: 102, inicio: 1, noches: 3, estado: "pendiente", huesped: "J. Herrera" },
    { hab: 105, inicio: 3, noches: 1, estado: "pagada", huesped: "Familia Torres" },
    { hab: 121, inicio: 0, noches: 4, estado: "confirmada", huesped: "Andrés Pino" },
    { hab: 123, inicio: 2, noches: 2, estado: "pagada", huesped: "L. Cantillo" },
    { hab: 126, inicio: 5, noches: 3, estado: "pendiente", huesped: "Grupo Ferretería" },
    { hab: 139, inicio: 1, noches: 2, estado: "confirmada", huesped: "Sofía Baena" },
    { hab: 140, inicio: 68, noches: 5, estado: "pendiente", huesped: "Familia Uribe (puente diciembre)" },
  ];
  return muestras.map((m, i) => ({
    id: i + 1,
    habitacion: m.hab,
    checkin: fechaISO(sumarDias(HOY, m.inicio)),
    checkout: fechaISO(sumarDias(HOY, m.inicio + m.noches)),
    estado: m.estado,
    huesped: m.huesped,
  }));
}

export default function App() {
  const [reservas, setReservas] = useState(generarReservas());
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [panel, setPanel] = useState(null); // { habitacion, fechaISO } | null
  const [ventanaInicio, setVentanaInicio] = useState(HOY);
  const [saltoFecha, setSaltoFecha] = useState(fechaISO(HOY));

  const [busqueda, setBusqueda] = useState({
    entrada: fechaISO(sumarDias(HOY, 75)),
    salida: fechaISO(sumarDias(HOY, 78)),
    categoria: "todas",
  });
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);

  const DIAS = useMemo(
    () => Array.from({ length: 10 }, (_, i) => sumarDias(ventanaInicio, i)),
    [ventanaInicio]
  );

  const habitacionesVisibles = useMemo(
    () =>
      categoriaActiva === "todas"
        ? HABITACIONES
        : HABITACIONES.filter((h) => h.categoria === categoriaActiva),
    [categoriaActiva]
  );

  function reservaEnCelda(numHab, fecha) {
    const f = fechaISO(fecha);
    return reservas.find(
      (r) => r.habitacion === numHab && r.checkin <= f && f < r.checkout
    );
  }

  function habitacionLibreEnRango(numHab, entrada, salida) {
    return !reservas.some(
      (r) =>
        r.habitacion === numHab && entrada < r.checkout && salida > r.checkin
    );
  }

  function inicioDeBarra(res, fecha) {
    return res.checkin === fechaISO(fecha);
  }

  const disponibilidadHoy = useMemo(() => {
    return CATEGORIAS.map((cat) => {
      const total = HABITACIONES.filter((h) => h.categoria === cat.id).length;
      const ocupadas = HABITACIONES.filter(
        (h) => h.categoria === cat.id && reservaEnCelda(h.numero, HOY)
      ).length;
      return { ...cat, total, ocupadas, libres: total - ocupadas };
    });
  }, [reservas]);

  function abrirNuevaReserva(numHab, fecha) {
    if (reservaEnCelda(numHab, fecha)) return;
    setPanel({ habitacion: numHab, fecha: fechaISO(fecha) });
  }

  function crearReserva(datos) {
    setReservas((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        habitacion: datos.habitacion,
        checkin: datos.checkin,
        checkout: datos.checkout,
        estado: datos.estado,
        huesped: datos.huesped,
      },
    ]);
    setPanel(null);
  }

  function irAFecha(fISO) {
    setVentanaInicio(new Date(fISO + "T00:00:00"));
  }

  function moverSemana(dias) {
    setVentanaInicio((prev) => {
      const nueva = sumarDias(prev, dias);
      setSaltoFecha(fechaISO(nueva));
      return nueva;
    });
  }

  function buscarDisponibilidad(e) {
    e.preventDefault();
    const { entrada, salida, categoria } = busqueda;
    if (!entrada || !salida || salida <= entrada) return;
    const candidatas =
      categoria === "todas"
        ? HABITACIONES
        : HABITACIONES.filter((h) => h.categoria === categoria);
    const libres = candidatas.filter((h) =>
      habitacionLibreEnRango(h.numero, entrada, salida)
    );
    setResultadoBusqueda({ entrada, salida, libres });
  }

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandMark}>H</div>
          <div>
            <div style={styles.brandTitle}>Carta de Reservas</div>
            <div style={styles.brandSub}>Recepción · frente al mar</div>
          </div>
        </div>

        <div style={styles.sideSection}>
          <div style={styles.sideLabel}>Disponibilidad · hoy</div>
          {disponibilidadHoy.map((c) => (
            <div key={c.id} style={styles.dispRow}>
              <span style={{ ...styles.dot, background: c.color }} />
              <span style={styles.dispNombre}>{c.nombre}</span>
              <span style={styles.dispCifra}>
                {c.libres}/{c.total} libres
              </span>
            </div>
          ))}
        </div>

        <div style={styles.sideSection}>
          <div style={styles.sideLabel}>Filtrar categoría</div>
          <button
            onClick={() => setCategoriaActiva("todas")}
            style={{
              ...styles.filtroBtn,
              ...(categoriaActiva === "todas" ? styles.filtroBtnActivo : {}),
            }}
          >
            Todas las habitaciones
          </button>
          {CATEGORIAS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoriaActiva(c.id)}
              style={{
                ...styles.filtroBtn,
                ...(categoriaActiva === c.id ? styles.filtroBtnActivo : {}),
              }}
            >
              <span style={{ ...styles.dot, background: c.color }} />
              {c.nombre} — ${c.precio.toLocaleString("es-CO")}
            </button>
          ))}
        </div>

        <div style={styles.sideFooter}>
          Click en una celda vacía de la carta para tomar una reserva por
          teléfono.
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.h1}>Estado de habitaciones</h1>
          <p style={styles.sub}>
            {DIAS[0].toLocaleDateString("es-CO", { day: "numeric", month: "long" })}
            {" – "}
            {DIAS[DIAS.length - 1].toLocaleDateString("es-CO", {
              day: "numeric",
              month: "long",
            })}
          </p>
          <svg
            width="120"
            height="10"
            viewBox="0 0 120 10"
            style={{ marginTop: 10 }}
          >
            <path
              d="M0 5 C 10 0, 20 10, 30 5 C 40 0, 50 10, 60 5 C 70 0, 80 10, 90 5 C 100 0, 110 10, 120 5"
              fill="none"
              stroke="#3E7C8C"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </header>

        <form style={styles.searchCard} onSubmit={buscarDisponibilidad}>
          <div style={styles.searchTitleWrap}>
            <div style={styles.searchEyebrow}>Buscar disponibilidad</div>
            <div style={styles.searchTitle}>
              Para reservas con meses de anticipación
            </div>
          </div>
          <div style={styles.searchFields}>
            <label style={styles.searchField}>
              <span style={styles.fieldLabel}>Entrada</span>
              <input
                type="date"
                value={busqueda.entrada}
                onChange={(e) =>
                  setBusqueda((b) => ({ ...b, entrada: e.target.value }))
                }
                style={styles.input}
              />
            </label>
            <label style={styles.searchField}>
              <span style={styles.fieldLabel}>Salida</span>
              <input
                type="date"
                value={busqueda.salida}
                onChange={(e) =>
                  setBusqueda((b) => ({ ...b, salida: e.target.value }))
                }
                style={styles.input}
              />
            </label>
            <label style={styles.searchField}>
              <span style={styles.fieldLabel}>Categoría</span>
              <select
                value={busqueda.categoria}
                onChange={(e) =>
                  setBusqueda((b) => ({ ...b, categoria: e.target.value }))
                }
                style={styles.input}
              >
                <option value="todas">Todas</option>
                {CATEGORIAS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" style={styles.searchBtn}>
              Buscar
            </button>
          </div>

          {resultadoBusqueda && (
            <div style={styles.searchResult}>
              {resultadoBusqueda.libres.length === 0 ? (
                <span>
                  Sin habitaciones libres del{" "}
                  {resultadoBusqueda.entrada} al {resultadoBusqueda.salida}.
                </span>
              ) : (
                <>
                  <span style={{ fontWeight: 700 }}>
                    {resultadoBusqueda.libres.length} libres
                  </span>
                  {" — "}
                  {resultadoBusqueda.libres.slice(0, 10).map((h) => {
                    const cat = CATEGORIAS.find((c) => c.id === h.categoria);
                    return (
                      <button
                        key={h.numero}
                        type="button"
                        onClick={() => {
                          irAFecha(resultadoBusqueda.entrada);
                          setPanel({
                            habitacion: h.numero,
                            fecha: resultadoBusqueda.entrada,
                          });
                        }}
                        style={{
                          ...styles.resultChip,
                          borderColor: cat.color,
                          color: cat.color,
                        }}
                      >
                        {h.numero}
                      </button>
                    );
                  })}
                  {resultadoBusqueda.libres.length > 10 && (
                    <span style={{ color: "#5C7A83" }}>
                      {" "}
                      +{resultadoBusqueda.libres.length - 10} más
                    </span>
                  )}
                </>
              )}
            </div>
          )}
        </form>

        <div style={styles.chartNav}>
          <button
            type="button"
            onClick={() => moverSemana(-7)}
            style={styles.navBtn}
          >
            ← Semana
          </button>
          <form
            style={styles.navJump}
            onSubmit={(e) => {
              e.preventDefault();
              irAFecha(saltoFecha);
            }}
          >
            <input
              type="date"
              value={saltoFecha}
              onChange={(e) => setSaltoFecha(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.navBtnGhost}>
              Ir a fecha
            </button>
          </form>
          <button
            type="button"
            onClick={() => moverSemana(7)}
            style={styles.navBtn}
          >
            Semana →
          </button>
        </div>

        <div style={styles.chartWrap}>
          <div
            style={{
              ...styles.chartGrid,
              gridTemplateColumns: `88px repeat(${DIAS.length}, 76px)`,
            }}
          >
            {/* fila de fechas */}
            <div style={styles.cornerCell}>Habitación</div>
            {DIAS.map((d) => (
              <div key={fechaISO(d)} style={styles.dateHeadCell}>
                <div style={styles.dateDow}>
                  {d.toLocaleDateString("es-CO", { weekday: "short" })}
                </div>
                <div style={styles.dateNum}>{d.getDate()}</div>
              </div>
            ))}

            {habitacionesVisibles.map((h) => {
              const cat = CATEGORIAS.find((c) => c.id === h.categoria);
              return (
                <React.Fragment key={h.numero}>
                  <div style={styles.roomCell}>
                    <span style={{ ...styles.dot, background: cat.color }} />
                    {h.numero}
                  </div>
                  {DIAS.map((d) => {
                    const res = reservaEnCelda(h.numero, d);
                    if (res) {
                      const esInicio = inicioDeBarra(res, d);
                      return (
                        <div
                          key={fechaISO(d)}
                          title={`${res.huesped} · ${ESTADOS[res.estado].label}`}
                          style={{
                            ...styles.bookedCell,
                            background: ESTADOS[res.estado].color,
                            borderLeft: esInicio
                              ? "2px solid rgba(0,0,0,0.25)"
                              : "none",
                          }}
                        >
                          {esInicio ? res.huesped.split(" ")[0] : ""}
                        </div>
                      );
                    }
                    return (
                      <button
                        key={fechaISO(d)}
                        onClick={() => abrirNuevaReserva(h.numero, d)}
                        style={styles.freeCell}
                        aria-label={`Reservar habitación ${h.numero} el ${fechaISO(
                          d
                        )}`}
                      />
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div style={styles.legend}>
          {Object.entries(ESTADOS).map(([k, v]) => (
            <span key={k} style={styles.legendItem}>
              <span style={{ ...styles.dot, background: v.color }} />
              {v.label}
            </span>
          ))}
          <span style={styles.legendItem}>
            <span style={{ ...styles.dot, background: "#EFE7D4", border: "1px solid #C9BE9E" }} />
            Disponible (click para reservar)
          </span>
        </div>
      </main>

      {panel && (
        <NuevaReservaPanel
          habitacion={panel.habitacion}
          fechaInicial={panel.fecha}
          onCerrar={() => setPanel(null)}
          onGuardar={crearReserva}
        />
      )}
    </div>
  );
}

function NuevaReservaPanel({ habitacion, fechaInicial, onCerrar, onGuardar }) {
  const cat = CATEGORIAS.find(
    (c) => c.id === HABITACIONES.find((h) => h.numero === habitacion).categoria
  );
  const [checkin, setCheckin] = useState(fechaInicial);
  const [checkout, setCheckout] = useState(
    fechaISO(sumarDias(new Date(fechaInicial), 1))
  );
  const [huesped, setHuesped] = useState("");
  const [telefono, setTelefono] = useState("");
  const [anticipo, setAnticipo] = useState("");
  const [estado, setEstado] = useState("pendiente");

  const noches = Math.max(
    1,
    Math.round(
      (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)
    )
  );
  const total = noches * cat.precio;

  function submit(e) {
    e.preventDefault();
    if (!huesped.trim()) return;
    onGuardar({ habitacion, checkin, checkout, estado, huesped });
  }

  return (
    <div style={styles.overlay} onClick={onCerrar}>
      <form
        style={styles.drawer}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div style={styles.drawerHead}>
          <div>
            <div style={styles.drawerEyebrow}>Nueva reserva telefónica</div>
            <div style={styles.drawerTitle}>
              Habitación {habitacion} · {cat.nombre}
            </div>
          </div>
          <button type="button" onClick={onCerrar} style={styles.closeBtn}>
            ×
          </button>
        </div>

        <div style={styles.fieldRow}>
          <label style={styles.field}>
            <span style={styles.fieldLabel}>Entrada</span>
            <input
              type="date"
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
              style={styles.input}
            />
          </label>
          <label style={styles.field}>
            <span style={styles.fieldLabel}>Salida</span>
            <input
              type="date"
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
              style={styles.input}
            />
          </label>
        </div>

        <label style={styles.field}>
          <span style={styles.fieldLabel}>Nombre del huésped</span>
          <input
            type="text"
            value={huesped}
            onChange={(e) => setHuesped(e.target.value)}
            placeholder="Ej. Marcela Ríos"
            style={styles.input}
            required
          />
        </label>

        <label style={styles.field}>
          <span style={styles.fieldLabel}>Teléfono</span>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="300 000 0000"
            style={styles.input}
          />
        </label>

        <div style={styles.fieldRow}>
          <label style={styles.field}>
            <span style={styles.fieldLabel}>Anticipo</span>
            <input
              type="number"
              value={anticipo}
              onChange={(e) => setAnticipo(e.target.value)}
              placeholder="0"
              style={styles.input}
            />
          </label>
          <label style={styles.field}>
            <span style={styles.fieldLabel}>Estado</span>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              style={styles.input}
            >
              {Object.entries(ESTADOS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={styles.summaryBox}>
          <div style={styles.summaryRow}>
            <span>{noches} noche(s) × ${cat.precio.toLocaleString("es-CO")}</span>
            <span>${total.toLocaleString("es-CO")}</span>
          </div>
          {anticipo && (
            <div style={styles.summaryRow}>
              <span>Anticipo recibido</span>
              <span>−${Number(anticipo).toLocaleString("es-CO")}</span>
            </div>
          )}
          <div style={{ ...styles.summaryRow, fontWeight: 700 }}>
            <span>Saldo pendiente</span>
            <span>
              $
              {Math.max(0, total - Number(anticipo || 0)).toLocaleString(
                "es-CO"
              )}
            </span>
          </div>
        </div>

        <button type="submit" style={styles.submitBtn}>
          Confirmar reserva
        </button>
      </form>
    </div>
  );
}

// ---------- Estilos ----------
const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    fontFamily:
      '"IBM Plex Sans", "Segoe UI", system-ui, -apple-system, sans-serif',
    background: "#F4EEDD",
    color: "#173540",
  },
  sidebar: {
    width: 260,
    flexShrink: 0,
    background:
      "linear-gradient(180deg, #0E2E3B 0%, #123B4B 55%, #164A5C 100%)",
    color: "#E4EFEF",
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 28,
  },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: 4,
    background: "#D9A441",
    color: "#0E2E3B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Georgia, serif",
    fontWeight: 700,
    fontSize: 20,
  },
  brandTitle: {
    fontFamily: "Georgia, serif",
    fontSize: 17,
    lineHeight: 1.2,
  },
  brandSub: { fontSize: 11.5, color: "#8FB3BC", marginTop: 2 },
  sideSection: { display: "flex", flexDirection: "column", gap: 8 },
  sideLabel: {
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#7FA3AC",
    marginBottom: 4,
  },
  dispRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13.5,
    padding: "4px 0",
  },
  dispNombre: { flex: 1 },
  dispCifra: { color: "#AFCBD1", fontSize: 12.5 },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 2,
    display: "inline-block",
    flexShrink: 0,
  },
  filtroBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    textAlign: "left",
    background: "transparent",
    border: "1px solid transparent",
    color: "#CFE1E3",
    padding: "8px 10px",
    borderRadius: 4,
    fontSize: 13.5,
    cursor: "pointer",
  },
  filtroBtnActivo: {
    background: "#1B4656",
    border: "1px solid #2E5F70",
    color: "#F4EEDD",
  },
  sideFooter: {
    marginTop: "auto",
    fontSize: 12,
    color: "#6D97A0",
    lineHeight: 1.5,
    borderTop: "1px solid #1E4956",
    paddingTop: 16,
  },
  main: { flex: 1, padding: "32px 36px", overflowX: "auto" },
  header: { marginBottom: 20 },
  h1: {
    fontFamily: "Georgia, serif",
    fontSize: 26,
    margin: 0,
    color: "#0E2E3B",
  },
  sub: { color: "#5C7A83", fontSize: 13.5, marginTop: 4 },
  searchCard: {
    background: "#123B4B",
    borderRadius: 8,
    padding: "16px 20px",
    marginBottom: 16,
    color: "#E4EFEF",
  },
  searchTitleWrap: { marginBottom: 12 },
  searchEyebrow: {
    fontSize: 10.5,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#D9A441",
    fontWeight: 700,
  },
  searchTitle: { fontFamily: "Georgia, serif", fontSize: 16, marginTop: 3 },
  searchFields: {
    display: "flex",
    gap: 12,
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  searchField: { display: "flex", flexDirection: "column", gap: 5, minWidth: 130 },
  searchBtn: {
    background: "#D9A441",
    color: "#0E2E3B",
    border: "none",
    borderRadius: 4,
    padding: "9px 18px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    height: 38,
  },
  searchResult: {
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid #2E5F70",
    fontSize: 13.5,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  resultChip: {
    background: "#FFFDF6",
    border: "1.5px solid",
    borderRadius: 4,
    padding: "2px 8px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  chartNav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 12,
  },
  navBtn: {
    background: "#EDE3C8",
    border: "1px solid #DCCFA0",
    borderRadius: 4,
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "#0E2E3B",
    cursor: "pointer",
  },
  navBtnGhost: {
    background: "transparent",
    border: "1px solid #B9AA78",
    borderRadius: 4,
    padding: "8px 12px",
    fontSize: 13,
    color: "#0E2E3B",
    cursor: "pointer",
  },
  navJump: { display: "flex", gap: 8, alignItems: "center" },
  chartWrap: {
    background: "#FFFDF6",
    border: "1px solid #E3D9BE",
    borderRadius: 6,
    overflow: "auto",
    boxShadow: "0 1px 2px rgba(14,46,59,0.06)",
  },
  chartGrid: { display: "grid", minWidth: "fit-content" },
  cornerCell: {
    position: "sticky",
    left: 0,
    background: "#EDE3C8",
    borderBottom: "1px solid #E3D9BE",
    borderRight: "1px solid #E3D9BE",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#8A7A4E",
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
    fontWeight: 600,
  },
  dateHeadCell: {
    background: "#EDE3C8",
    borderBottom: "1px solid #E3D9BE",
    borderRight: "1px solid #E6DCC1",
    textAlign: "center",
    padding: "6px 0",
  },
  dateDow: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#9E8C55",
    letterSpacing: "0.05em",
  },
  dateNum: { fontFamily: "Georgia, serif", fontSize: 15, color: "#0E2E3B" },
  roomCell: {
    position: "sticky",
    left: 0,
    background: "#FFFDF6",
    borderBottom: "1px solid #EFE6C9",
    borderRight: "1px solid #E3D9BE",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 10px",
    fontSize: 13.5,
    fontWeight: 600,
    height: 34,
  },
  freeCell: {
    height: 34,
    borderBottom: "1px solid #EFE6C9",
    borderRight: "1px solid #F2E9CC",
    background: "#FFFDF6",
    cursor: "pointer",
    padding: 0,
  },
  bookedCell: {
    height: 34,
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    paddingLeft: 6,
    fontSize: 11,
    color: "#FFFDF8",
    fontWeight: 600,
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  legend: {
    display: "flex",
    flexWrap: "wrap",
    gap: 18,
    marginTop: 14,
    fontSize: 12.5,
    color: "#4C6169",
  },
  legendItem: { display: "flex", alignItems: "center", gap: 6 },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(14,46,59,0.45)",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 50,
  },
  drawer: {
    width: 380,
    maxWidth: "90vw",
    background: "#FFFDF6",
    height: "100%",
    padding: "26px 26px 30px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    boxShadow: "-4px 0 24px rgba(0,0,0,0.18)",
    overflowY: "auto",
  },
  drawerHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  drawerEyebrow: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#C68B2E",
    fontWeight: 700,
  },
  drawerTitle: {
    fontFamily: "Georgia, serif",
    fontSize: 19,
    marginTop: 4,
    color: "#0E2E3B",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: 26,
    lineHeight: 1,
    color: "#8A7A4E",
    cursor: "pointer",
  },
  fieldRow: { display: "flex", gap: 12 },
  field: { flex: 1, display: "flex", flexDirection: "column", gap: 5 },
  fieldLabel: { fontSize: 12, color: "#5C7A83", fontWeight: 600 },
  input: {
    border: "1px solid #DCD0AC",
    borderRadius: 4,
    padding: "9px 10px",
    fontSize: 14,
    background: "#FFFEFB",
    color: "#173540",
    fontFamily: "inherit",
  },
  summaryBox: {
    background: "#EDE3C8",
    borderRadius: 6,
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 13.5,
    marginTop: 4,
  },
  summaryRow: { display: "flex", justifyContent: "space-between" },
  submitBtn: {
    marginTop: 8,
    background: "#0E2E3B",
    color: "#F4EEDD",
    border: "none",
    borderRadius: 4,
    padding: "12px 16px",
    fontSize: 14.5,
    fontWeight: 600,
    cursor: "pointer",
  },
};
