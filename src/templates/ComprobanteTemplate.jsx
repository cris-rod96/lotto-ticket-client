import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

// Registro de fuente para el código
Font.register({
  family: 'Courier-Bold',
  src: 'https://fonts.gstatic.com/s/courierprime/v9/u-4n0qWosX8l7ZP_6idS7L0rbX2_kw.ttf',
})

const styles = StyleSheet.create({
  page: { padding: '10pt', backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
  header: { alignItems: 'center', marginBottom: '10pt' },
  logo: { width: '60pt', marginBottom: '5pt' },
  title: {
    fontSize: '14pt',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    textDecoration: 'underline',
    marginBottom: '4pt',
  },
  infoText: { fontSize: '8pt', textTransform: 'uppercase', textAlign: 'center' },
  userDisplay: {
    fontSize: '11pt',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: '2pt',
    marginBottom: '2pt',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderStyle: 'dashed',
    marginVertical: '8pt',
  },
  paymentBox: {
    paddingVertical: '12pt',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    marginVertical: '5pt',
  },
  amountLabel: { fontSize: '10pt', fontFamily: 'Helvetica-Bold' },
  amountValue: { fontSize: '26pt', fontFamily: 'Helvetica-Bold', marginTop: '4pt' },
  detailsSection: { width: '100%', marginTop: '5pt' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: '4pt' },
  label: { fontSize: '8pt', fontFamily: 'Helvetica-Bold' },
  value: { fontSize: '8pt' },
  highlightValue: { fontSize: '8pt', fontFamily: 'Helvetica-Bold', color: '#000' },
  signatureSection: { marginTop: '40pt', alignItems: 'center' },
  signatureLine: { borderTopWidth: 1, borderTopColor: '#000', width: '150pt', marginBottom: '4pt' },
  footer: { marginTop: '20pt', alignItems: 'center' },
  codeLabel: { fontSize: '7pt', marginBottom: '2pt' },
  securityCode: { fontSize: '14pt', fontFamily: 'Courier-Bold' },
  // NUEVO ESTILO: Impreso visible
  printedDate: {
    fontSize: '7.5pt',
    fontFamily: 'Helvetica-Bold',
    marginTop: '12pt',
    color: '#000',
  },
  prizeBlock: {
    marginBottom: '10pt',
    backgroundColor: '#f9f9f9',
    padding: '4pt',
    borderLeftWidth: 2,
    borderLeftColor: '#000',
  },
})

const ComprobantePagoTemplate = ({ ticket, user }) => {
  if (!ticket) return null

  const jugadasGanadoras =
    ticket.DetallesTickets?.filter((d) => parseFloat(d.montoPremio) > 0) || []

  const receiptHeight = 420 + jugadasGanadoras.length * 60

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })
  }

  return (
    <Document>
      <Page size={[226, receiptHeight]} style={styles.page}>
        <View style={styles.header}>
          <Image src="/logo_principal.png" style={styles.logo} />
          <Text style={styles.title}>RECIBO DE PAGO</Text>
          <Text style={styles.infoText}>{ticket.PuntosVentum?.nombre || 'PUNTO DE VENTA'}</Text>
          <Text style={styles.userDisplay}>{user.nombresCompletos}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.paymentBox}>
          <Text style={styles.amountLabel}>PREMIO TOTAL PAGADO</Text>
          <Text style={styles.amountValue}>
            $ {parseFloat(ticket.montoTotalPremio || 0).toFixed(2)}
          </Text>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>TICKET REF:</Text>
            <Text style={styles.value}>{ticket.codigo}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>SORTEO:</Text>
            <Text style={styles.value}>
              {ticket.Sorteo?.jornada} #{ticket.Sorteo?.numero}
            </Text>
          </View>

          <View
            style={{ marginTop: '10pt', borderTopWidth: 1, borderColor: '#000', paddingTop: '5pt' }}
          >
            <Text style={[styles.label, { marginBottom: '8pt', textAlign: 'center' }]}>
              DETALLE DE PREMIOS:
            </Text>
            {jugadasGanadoras.map((jugada, index) => {
              const dr = ticket.Sorteo?.Resultado?.DetallesResultados?.find(
                (d) => d.numeroGanador === jugada.numeroJugado
              )
              const detalleSuerte = dr?.Suerte?.DetallesSuertes?.[0]
              const factor = detalleSuerte ? parseFloat(detalleSuerte.prem) : 0
              const nombreSuerte = dr?.Suerte?.descripcion || 'PREMIO GANADOR'

              return (
                <View key={index} style={styles.prizeBlock}>
                  <Text style={[styles.label, { fontSize: '9pt', marginBottom: '2pt' }]}>
                    {nombreSuerte}
                  </Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.value}>Número: {jugada.numeroJugado}</Text>
                    <Text style={styles.value}>
                      Apuesta: ${parseFloat(jugada.montoApostado).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.value}>Pago (x{factor.toFixed(0)}):</Text>
                    <Text style={styles.highlightValue}>
                      $ {parseFloat(jugada.montoPremio).toFixed(2)}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>

          <View style={[styles.detailRow, { marginTop: '10pt' }]}>
            <Text style={styles.label}>FECHA COBRO:</Text>
            <Text style={styles.value}>{formatDate(ticket.updatedAt)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.signatureSection}>
          <View style={styles.signatureLine} />
          <Text style={styles.infoText}>FIRMA DE CONFORMIDAD</Text>
          <Text style={[styles.infoText, { fontSize: '6pt', marginTop: '2pt' }]}>
            {ticket.Cliente?.nombre || 'CONSUMIDOR FINAL'}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.codeLabel}>CÓDIGO DE VALIDACIÓN</Text>
          <Text style={styles.securityCode}>{ticket.codigo?.substring(0, 12)}</Text>
          {/* Texto impreso mejorado */}
          <Text style={styles.printedDate}>IMPRESO: {new Date().toLocaleString('es-EC')}</Text>
        </View>
      </Page>
    </Document>
  )
}

export default ComprobantePagoTemplate
