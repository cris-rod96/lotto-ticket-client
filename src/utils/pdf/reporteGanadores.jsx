import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 0, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },

  // CABECERA BRANDING MEJORADA
  brandHeader: {
    backgroundColor: '#052e16',
    height: 110,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    borderBottom: 4,
    borderBottomColor: '#EAB308',
  },
  logoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 12,
    marginRight: 20,
  },
  logo: { width: 60, height: 60 },
  brandTitle: { fontSize: 24, fontWeight: 'bold', color: '#EAB308', letterSpacing: 1 },
  brandSubtitle: { fontSize: 10, color: '#4ade80', fontWeight: 'bold', textTransform: 'uppercase' },

  contentBody: { padding: 40 },

  // TICKET CARD
  ticketCard: {
    marginBottom: 40,
    borderRadius: 12,
    border: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  ticketHeader: {
    backgroundColor: '#f8fafc',
    padding: '12 20',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: 2,
    borderBottomColor: '#052e16', // Línea verde oscuro para contraste
  },
  codigoTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },
  badge: {
    fontSize: 8,
    padding: '4 12',
    backgroundColor: '#22c55e',
    color: '#FFFFFF',
    borderRadius: 6,
    fontWeight: 'bold',
  },

  // CABECERA DE TABLA MEJORADA
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9', // Fondo gris suave para la cabecera de la tabla
    padding: '8 20',
    alignItems: 'center',
  },
  colCifra: { width: '15%' },
  colInversion: { width: '20%', textAlign: 'center' },
  colSuerte: { width: '40%', paddingLeft: 15 },
  colPremio: { width: '25%', textAlign: 'right' },
  label: {
    fontSize: 8,
    color: '#475569',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // FILAS
  tableWrapper: { padding: 0 }, // El padding lo manejan las filas
  row: {
    flexDirection: 'row',
    padding: '12 20',
    borderBottom: 1,
    borderBottomColor: '#f1f5f9',
    alignItems: 'center',
  },
  numJugado: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  montoAposta: { fontSize: 11, color: '#64748b' },
  suerteName: { fontSize: 9, color: '#052e16', fontWeight: 'bold' },
  factorText: { fontSize: 7, color: '#94a3b8', marginTop: 2 },
  montoPremio: { fontSize: 13, fontWeight: 'bold' },

  // FOOTER LIQUIDACIÓN
  paymentZone: {
    backgroundColor: '#052e16',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  auditText: { fontSize: 8, color: '#4ade80', lineHeight: 1.5 },
  totalLabel: { fontSize: 9, color: '#EAB308', textTransform: 'uppercase', textAlign: 'right' },
  totalVal: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF' },
})

const ReporteGanadoresPDF = ({ data }) => {
  const ticketsGanadoresMap = data.DetallesResultados?.reduce((acc, detResultado) => {
    detResultado.Ganadores?.forEach((ganador) => {
      const ticket = ganador.Ticket
      const puntoVentaIdTicket = ticket.PuntoVentaId

      if (!acc[ticket.id]) {
        acc[ticket.id] = {
          info: ticket,
          totalTicket: parseFloat(ticket.montoTotalPremio || 0),
          desglosePremios: {},
        }
      }

      const detalleSuertePV = detResultado.Suerte?.DetallesSuertes?.find(
        (ds) => ds.PuntoVentaId === puntoVentaIdTicket
      )

      acc[ticket.id].desglosePremios[detResultado.numeroGanador] = {
        nombre: detResultado.Suerte?.descripcion,
        multiplicador: detalleSuertePV ? parseFloat(detalleSuertePV.premio) : 0,
        montoGanado: parseFloat(ganador.montoPremio),
      }
    })
    return acc
  }, {})

  const tickets = Object.values(ticketsGanadoresMap || {})

  return (
    <Document title="Auditoría El Golpe de la Suerte">
      <Page size="A4" style={styles.page}>
        <View style={styles.brandHeader}>
          <View style={styles.logoContainer}>
            <Image src="/logo_principal.png" style={styles.logo} />
          </View>
          <View>
            <Text style={styles.brandTitle}>El Golpe de la Suerte</Text>
            <Text style={styles.brandSubtitle}>Auditoría de Ganadores Oficial</Text>
          </View>
        </View>

        <View style={styles.contentBody}>
          {tickets.map((t, idx) => (
            <View key={idx} style={styles.ticketCard} wrap={false}>
              {/* Header del Ticket con "Código" */}
              <View style={styles.ticketHeader}>
                <Text style={styles.codigoTitle}>CÓDIGO: {t.info.codigo}</Text>
                <Text style={styles.badge}>{t.info.estado}</Text>
              </View>

              <View style={styles.tableWrapper}>
                {/* Cabecera de Tabla con Fondo */}
                <View style={styles.tableHeader}>
                  <View style={styles.colCifra}>
                    <Text style={styles.label}>Nro</Text>
                  </View>
                  <View style={styles.colInversion}>
                    <Text style={styles.label}>Apostado</Text>
                  </View>
                  <View style={styles.colSuerte}>
                    <Text style={styles.label}>Suerte (Factor)</Text>
                  </View>
                  <View style={styles.colPremio}>
                    <Text style={styles.label}>Subtotal</Text>
                  </View>
                </View>

                {t.info.DetallesTickets?.map((dt, i) => {
                  const premio = t.desglosePremios[dt.numeroJugad]
                  return (
                    <View key={i} style={styles.row}>
                      <View style={styles.colCifra}>
                        <Text style={styles.numJugado}>{dt.numeroJugad}</Text>
                      </View>
                      <View style={styles.colInversion}>
                        <Text style={styles.montoAposta}>
                          ${parseFloat(dt.montoAposta).toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.colSuerte}>
                        {premio ? (
                          <View>
                            <Text style={styles.suerteName}>{premio.nombre}</Text>
                            <Text style={styles.factorText}>
                              Factor PV: x{premio.multiplicador}
                            </Text>
                          </View>
                        ) : (
                          <Text style={{ fontSize: 8, color: '#cbd5e1' }}>Sin premio</Text>
                        )}
                      </View>
                      <View style={styles.colPremio}>
                        <Text
                          style={[styles.montoPremio, { color: premio ? '#16a34a' : '#cbd5e1' }]}
                        >
                          {premio ? `+$${premio.montoGanado.toFixed(2)}` : '$0.00'}
                        </Text>
                      </View>
                    </View>
                  )
                })}
              </View>

              {/* Pie con ID de Punto de Venta */}
              <View style={styles.paymentZone}>
                <View>
                  <Text style={styles.auditText}>Punto de Venta: {t.info.PuntoVentaId}</Text>
                  <Text style={{ fontSize: 8, color: '#FFFFFF' }}>
                    Emisión: {new Date(t.info.createdAt).toLocaleString()}
                  </Text>
                </View>
                <View>
                  <Text style={styles.totalLabel}>Total Liquidado</Text>
                  <Text style={styles.totalVal}>${t.totalTicket.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}

export default ReporteGanadoresPDF
