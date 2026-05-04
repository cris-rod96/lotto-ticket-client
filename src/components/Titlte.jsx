const Title = ({ titulo, descripcion }) => {
  return (
    <div className="mb-10">
      <h1 className="text-4xl font-black uppercase text-white flex items-center gap-3">
        <span className="w-2 h-10 bg-luck-gold rounded-sm inline-block" />
        {titulo}
      </h1>
      <p className="text-zinc-400 text-sm font-medium mt-2 ml-5 tracking-wide">{descripcion}</p>
    </div>
  )
}

export default Title
