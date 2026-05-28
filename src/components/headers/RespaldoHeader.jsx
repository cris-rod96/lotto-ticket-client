import Title from '../Titlte' // Mantengo el typo exacto de tu import "Titlte"

const RespaldoHeader = () => {
  return (
    <div className="flex justify-between items-center mb-10">
      <Title
        titulo="Auditoría de Respaldos"
        descripcion="Historial de copias de seguridad de la base de datos almacenadas en Cloudinary"
      />
    </div>
  )
}

export default RespaldoHeader
