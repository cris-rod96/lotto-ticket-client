import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: { width: 50, height: 50 },
  brandSection: { textAlign: 'right' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 8, color: '#64748b', textTransform: 'uppercase' },

  metaContainer: { flexDirection: 'row', gap: 5, marginBottom: 20 },
  metaCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 4,
    border: 0.5,
    borderColor: '#e2e8f0',
  },
  metaLabel: { fontSize: 7, color: '#94a3b8', textTransform: 'uppercase' },
  metaValue: { fontSize: 10, fontWeight: 'bold', color: '#1e293b' },

  table: { width: '100%', marginTop: 10 },
  headerRow: { flexDirection: 'row', backgroundColor: '#0f172a', padding: 6, borderRadius: 2 },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 5,
  },

  // Columnas fijas para evitar encimamiento
  colFecha: { width: '25%', fontSize: 8 },
  colDesc: { width: '35%', fontSize: 8 },
  colResp: { width: '20%', fontSize: 8 },
  colTipo: { width: '10%', fontSize: 8 },
  colMonto: { width: '10%', fontSize: 8, textAlign: 'right', fontWeight: 'bold' },

  th: { color: '#ffffff', fontWeight: 'bold', fontSize: 7, textTransform: 'uppercase' },

  // Footer con wrap={false} para que no se corte
  footerResumen: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    border: 1,
    borderColor: '#e2e8f0',
    borderRadius: 5,
  },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  footerLabel: { fontSize: 9, fontWeight: 'bold', color: '#475569' },
  footerValue: { fontSize: 9, fontWeight: 'bold' },
  utilidadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
  },
})

const ReporteAuditoria = ({ data }) => {
  const totalIngresos =
    data.Movimientos?.filter((m) => m.tipo === 'Ingreso').reduce(
      (acc, m) => acc + parseFloat(m.monto),
      0
    ) || 0
  const totalEgresos =
    data.Movimientos?.filter((m) => m.tipo === 'Egreso').reduce(
      (acc, m) => acc + parseFloat(m.monto),
      0
    ) || 0
  const utilidadNeta = totalIngresos - totalEgresos

  return (
    <Document title={`Auditoria_${data.id}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src="/logo_principal.png" style={styles.logo} />
          <View style={styles.brandSection}>
            <Text style={styles.title}>Auditoría de Sesión</Text>
            <Text style={styles.subtitle}>Reporte Detallado de Flujos</Text>
          </View>
        </View>

        <View style={styles.metaContainer}>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>ID Sesión</Text>
            <Text style={styles.metaValue}>{data.id?.slice(0, 8).toUpperCase()}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Emisión</Text>
            <Text style={styles.metaValue}>{new Date().toLocaleDateString('es-EC')}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Total Movimientos</Text>
            <Text style={styles.metaValue}>{data.Movimientos?.length || 0}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={[styles.colFecha, styles.th]}>Fecha / Hora</Text>
            <Text style={[styles.colDesc, styles.th]}>Descripción</Text>
            <Text style={[styles.colResp, styles.th]}>Responsable</Text>
            <Text style={[styles.colTipo, styles.th]}>Tipo</Text>
            <Text style={[styles.colMonto, styles.th]}>Monto</Text>
          </View>

          {data.Movimientos?.map((m, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.colFecha}>{new Date(m.createdAt).toLocaleString('es-EC')}</Text>
              <Text style={styles.colDesc}>{m.descripcion}</Text>
              <Text style={styles.colResp}>{m.Usuario?.nombresCompletos || 'Admin'}</Text>
              <Text style={styles.colTipo}>{m.tipo}</Text>
              <Text
                style={[styles.colMonto, { color: m.tipo === 'Ingreso' ? '#16a34a' : '#dc2626' }]}
              >
                {m.tipo === 'Ingreso' ? '+' : '-'}
                {parseFloat(m.monto).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer forzado a mantenerse unido (wrap={false}) */}
        <View style={styles.footerResumen} wrap={false}>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>TOTAL INGRESOS</Text>
            <Text style={[styles.footerValue, { color: '#16a34a' }]}>
              + {totalIngresos.toFixed(2)}
            </Text>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>TOTAL EGRESOS</Text>
            <Text style={[styles.footerValue, { color: '#dc2626' }]}>
              - {totalEgresos.toFixed(2)}
            </Text>
          </View>
          <View style={styles.utilidadRow}>
            <Text style={[styles.footerLabel, { color: '#000', fontSize: 11 }]}>UTILIDAD NETA</Text>
            <Text style={[styles.footerValue, { color: '#000', fontSize: 11 }]}>
              {utilidadNeta.toFixed(2)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ReporteAuditoria
