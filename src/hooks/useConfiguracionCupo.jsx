import { catalogoAPI, cifraAPI, configuracionCupoAPI } from "@/api/index.api";
import { useEffect, useState, useMemo } from "react";

const useConfiguracionCupos = () => {
  const [showModal, setShowModal] = useState(false);
  const [configuraciones, setConfiguraciones] = useState([]);
  const [selectedConfiguracion, setSelectedConfirguacion] = useState(null);
  const [catalogos, setCatalogos] = useState([]);
  const [cifras, setCifras] = useState([]);
  const [loading, setLoading] = useState(true);

  const [digitsFilter, setDigitsFilter] = useState("Todos");
  const [jornada, setJornada] = useState("Todos");
  const [paises, setPaises] = useState("Todos");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [respCatalogos, respCifras, respConfiguraciones] =
        await Promise.all([
          catalogoAPI.listarTodos(),
          cifraAPI.listarActivas(),
          configuracionCupoAPI.listarTodos(),
        ]);

      setCatalogos(respCatalogos.data?.catalogos);
      setCifras(respCifras.data?.cifras);
      setConfiguraciones(respConfiguraciones.data?.cuposJornadas);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const uniqueDigits = useMemo(() => {
    const list = cifras
      .map((c) => c.cantidad)
      .filter((val) => val !== undefined && val !== null);
    return [...new Set(list)].sort((a, b) => a - b);
  }, [cifras]);

  const filteredConfigurations = useMemo(() => {
    return configuraciones.filter((conf) => {
      const matchesCifras =
        digitsFilter === "Todos" ||
        conf.Cifra.cantidad.toString() === digitsFilter;
      const matchesJornadas = jornada === "Todos" || conf.jornada === jornada;
      const matchesPaises = paises === "Todos" || conf.Catalogo.pais === paises;

      return matchesCifras && matchesJornadas && matchesPaises;
    });
  }, [configuraciones, digitsFilter, jornada, paises]);

  const totalPages = Math.ceil(filteredConfigurations.length / itemsPerPage);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredConfigurations.slice(start, start + itemsPerPage);
  }, [currentPage, filteredConfigurations]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [digitsFilter]);

  const handleEdit = (configuracion) => {
    setSelectedConfirguacion(configuracion);
    setShowModal(true);
  };

  return {
    cifras,
    setCifras,
    catalogos,
    setCatalogos,
    showModal,
    setShowModal,
    totalPages,
    currentData,
    currentPage,
    setCurrentPage,
    loading,
    fetchData,
    uniqueDigits,
    jornada,
    setJornada,
    handleEdit,
    selectedConfiguracion,
    setSelectedConfirguacion,
    filteredConfigurations,
    setDigitsFilter,
    digitsFilter,
    setJornada,
    setPaises,
    paises,
  };
};
export default useConfiguracionCupos;
