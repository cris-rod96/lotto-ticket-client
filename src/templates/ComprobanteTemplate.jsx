import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

// Fuente para el código (Courier es estándar en térmicas)
Font.register({
  family: 'Courier-Bold',
  src: 'https://fonts.gstatic.com/s/courierprime/v9/u-4n0qWosX8l7ZP_6idS7L0rbX2_kw.ttf',
})

const styles = StyleSheet.create({
  page: {
    padding: '10pt',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    alignItems: 'center',
    marginBottom: '10pt',
  },
  logo: {
    width: '60pt',
    marginBottom: '5pt',
    grayscale: 1, // Asegura que no envíe datos de color innecesarios
  },
  title: {
    fontSize: '14pt',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    textDecoration: 'underline',
    marginBottom: '4pt',
  },
  infoText: {
    fontSize: '8pt',
    textTransform: 'uppercase',
    textAlign: 'center',
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
  amountLabel: {
    fontSize: '10pt',
    fontFamily: 'Helvetica-Bold',
  },
  amountValue: {
    fontSize: '26pt',
    fontFamily: 'Helvetica-Bold',
    marginTop: '4pt',
  },
  detailsSection: {
    width: '100%',
    marginTop: '5pt',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '4pt',
  },
  label: {
    fontSize: '8pt',
    fontFamily: 'Helvetica-Bold',
  },
  value: {
    fontSize: '8pt',
  },
  signatureSection: {
    marginTop: '40pt',
    alignItems: 'center',
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    width: '150pt',
    marginBottom: '4pt',
  },
  footer: {
    marginTop: '20pt',
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: '7pt',
    marginBottom: '2pt',
  },
  securityCode: {
    fontSize: '14pt',
    fontFamily: 'Courier-Bold',
  },
})

const ComprobantePagoTemplate = ({ ticket }) => {
  if (!ticket) return null

  const receiptHeight = 420

  // Formateador de fecha reutilizable
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleString('es-EC', {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  }

  return (
    <Document>
      <Page size={[226, receiptHeight]} style={styles.page}>
        {/* ENCABEZADO */}
        <View style={styles.header}>
          <Image src="/logo_principal.png" style={styles.logo} />
          <Text style={styles.title}>RECIBO DE PAGO</Text>
          <Text style={styles.infoText}>{ticket.PuntosVentum?.nombre || 'PUNTO DE VENTA'}</Text>
          <Text style={styles.infoText}>
            Vendedor: {ticket.Usuario?.nombresCompletos?.split(' ')[0]}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* CAJA DE MONTO */}
        <View style={styles.paymentBox}>
          <Text style={styles.amountLabel}>PREMIO PAGADO</Text>
          <Text style={styles.amountValue}>
            $ {parseFloat(ticket.montoTotalPremio || 0).toFixed(2)}
          </Text>
        </View>

        {/* DETALLES DEL TICKET ORIGEN */}
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

          {/* USAMOS updatedAt PARA LA FECHA DE COBRO REAL */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>FECHA COBRO:</Text>
            <Text style={styles.value}>{formatDate(ticket.updatedAt)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* FIRMA */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureLine} />
          <Text style={styles.infoText}>FIRMA DE CONFORMIDAD</Text>
          <Text style={[styles.infoText, { fontSize: '6pt', marginTop: '2pt' }]}>
            {ticket.Cliente?.nombre || 'CONSUMIDOR FINAL'} - {ticket.Cliente?.documento || ''}
          </Text>
        </View>

        {/* VALIDACIÓN Y FECHA DE IMPRESIÓN */}
        <View style={styles.footer}>
          <Text style={styles.codeLabel}>CÓDIGO DE VALIDACIÓN</Text>
          <Text style={styles.securityCode}>{ticket.codigo?.substring(0, 12)}</Text>

          {/* NOTA DE IMPRESIÓN ACTUAL PARA AUDITORÍA */}
          <Text style={[styles.infoText, { fontSize: '6pt', marginTop: '10pt', color: '#666' }]}>
            Copia impresa el: {new Date().toLocaleString('es-EC')}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
export default ComprobantePagoTemplate
