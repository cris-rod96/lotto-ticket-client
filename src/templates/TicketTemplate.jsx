import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

// Registro de fuente para el look de ticket térmico
Font.register({
  family: 'Courier-Bold',
  src: 'https://fonts.gstatic.com/s/courierprime/v9/u-4n0qWosX8l7ZP_6idS7L0rbX2_kw.ttf',
})

const styles = StyleSheet.create({
  page: {
    padding: '10pt', // Un poco más de aire en los bordes
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    alignItems: 'center',
    marginBottom: '4pt',
  },
  logo: {
    width: '65pt',
    marginBottom: '2pt',
  },
  brandText: {
    fontSize: '9pt',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: '1pt',
  },
  userText: {
    fontSize: '6.5pt',
    color: '#333',
    marginTop: '1pt',
    textTransform: 'uppercase',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: '4pt',
  },
  drawInfo: {
    textAlign: 'center',
    marginBottom: '4pt',
  },
  drawTitle: {
    fontSize: '10pt',
    fontFamily: 'Helvetica-Bold',
  },
  drawDateTime: {
    fontSize: '8pt',
    marginTop: '1pt',
    fontFamily: 'Helvetica',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '2pt',
  },
  tableHeaderText: {
    fontSize: '7.5pt',
    fontFamily: 'Helvetica-Bold',
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '1.5pt',
  },
  entryNumber: {
    fontSize: '12pt', // Reducido de 13pt
    fontFamily: 'Helvetica-Bold',
  },
  entryValue: {
    fontSize: '10pt', // Reducido de 11pt
  },
  totalSection: {
    marginTop: '6pt',
    paddingVertical: '6pt',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#000',
    alignItems: 'center',
  },
  totalText: {
    fontSize: '14pt', // Reducido de 16pt para evitar empuje
    fontFamily: 'Helvetica-Bold',
  },
  prizeSection: {
    marginTop: '8pt',
  },
  prizeTitle: {
    fontSize: '7.5pt',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: '4pt',
    textDecoration: 'underline',
  },
  prizeRow: {
    flexDirection: 'row',
    marginBottom: '2pt',
  },
  prizeNameCol: {
    width: '70%',
    fontSize: '7.5pt', // Reducido de 8pt
    fontFamily: 'Courier',
  },
  prizeValueCol: {
    width: '30%',
    fontSize: '7.5pt',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  footer: {
    marginTop: '10pt',
    alignItems: 'center',
  },
  expiryDate: {
    fontSize: '8.5pt',
    fontFamily: 'Helvetica-Bold',
    marginTop: '2pt',
  },
  securityCode: {
    fontSize: '13pt', // Reducido para que no se desborde el ancho
    fontFamily: 'Courier-Bold',
    letterSpacing: '1pt',
  },
})

const TicketTemplate = ({ ticket, suertes }) => {
  if (!ticket) return null

  const suertesConPremioCorrecto = suertes
    ?.filter((s) => s.CifraId === ticket.Sorteo?.CifraId)
    .map((suerte) => {
      const detallePV = suerte.DetallesSuertes?.find((d) => d.PuntoVentaId === ticket.PuntoVentaId)
      return {
        descripcion: suerte.descripcion,
        premio: detallePV ? detallePV.premio : 0,
      }
    })

  const total =
    ticket.DetallesTickets?.reduce((acc, d) => acc + parseFloat(d.montoApostado || 0), 0) || 0

  // --- CÁLCULO DE ALTURA DINÁMICA AJUSTADO ---
  const baseHeight = 280 // Base más ajustada
  const rowHeight = (ticket.DetallesTickets?.length || 0) * 18 // Reducido de 22
  const prizesHeight = (suertesConPremioCorrecto?.length || 0) * 12 // Reducido de 16
  const buffer = 40 // Espacio extra de seguridad para evitar saltos
  const dynamicHeight = baseHeight + rowHeight + prizesHeight + buffer

  const formatPrizeName = (name) => (name ? name.replace(/SUERTE/gi, '').trim() : '')

  return (
    <Document>
      <Page size={[226, dynamicHeight]} style={styles.page}>
        {/* Contenedor principal para forzar que todo se trate como un solo bloque */}
        <View>
          <View style={styles.header}>
            <Image src="/logo_principal.png" style={styles.logo} />
            <Text style={styles.brandText}>ECUADOR</Text>
            <Text style={styles.userText}>
              VENDEDOR: {ticket.Usuario?.nombresCompletos || 'SISTEMA'}
            </Text>
            <Text style={[styles.userText, { fontSize: '6pt' }]}>
              {ticket.PuntosVentum?.nombre}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.drawInfo}>
            <Text style={styles.drawTitle}>
              {ticket.Sorteo?.jornada?.toUpperCase()} - No. {ticket.Sorteo?.numero}
            </Text>
            <Text style={styles.drawDateTime}>
              {ticket.Sorteo?.fechaSorteo} - {ticket.Sorteo?.horaSorteo?.substring(0, 5)}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* JUGADAS */}
          <View style={{ marginBottom: 5 }}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>NÚMERO</Text>
              <Text style={styles.tableHeaderText}>VALOR</Text>
            </View>
            {ticket.DetallesTickets?.map((det, i) => (
              <View key={i} style={styles.entryRow}>
                <Text style={styles.entryNumber}>{det.numeroJugado}</Text>
                <Text style={styles.entryValue}>$ {parseFloat(det.montoApostado).toFixed(2)}</Text>
              </View>
            ))}
          </View>

          {/* TOTAL */}
          <View style={styles.totalSection}>
            <Text style={styles.totalText}>TOTAL: $ {total.toFixed(2)}</Text>
          </View>

          {/* PREMIOS */}
          <View style={styles.prizeSection}>
            <Text style={styles.prizeTitle}>PREMIOS (REF. $1.00)</Text>
            {suertesConPremioCorrecto?.map((s, i) => (
              <View key={i} style={styles.prizeRow}>
                <Text style={styles.prizeNameCol}>{formatPrizeName(s.descripcion)}</Text>
                <Text style={styles.prizeValueCol}>$ {parseFloat(s.premio).toFixed(2)}</Text>
              </View>
            ))}
          </View>

          {/* FOOTER: Con margen superior y sin permitir saltos internos */}
          <View style={styles.footer} break={false}>
            <Text style={{ fontSize: '7pt', color: '#666' }}>
              Generado: {new Date(ticket.createdAt).toLocaleString('es-EC')}
            </Text>
            <Text style={styles.expiryDate}>
              {ticket.fechaCaducidad ? `CADUCA EL ${ticket.fechaCaducidad}` : 'CADUCA EN 6 DÍAS'}
            </Text>
            <View
              style={{
                marginTop: 8,
                alignItems: 'center',
                width: '100%',
                borderTopWidth: 1,
                borderStyle: 'dashed',
                paddingTop: 8,
              }}
            >
              <Text style={{ fontSize: '7pt', marginBottom: 2 }}>CÓDIGO</Text>
              <Text style={styles.securityCode}>{ticket.codigo}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default TicketTemplate
