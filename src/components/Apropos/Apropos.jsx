import { memo, useEffect, useState } from 'react'
import avatar from '../../assets/images/avatar.jpg'

function Apropos() {
  const [contrats, setContrats] = useState([])
  const [postes, setPostes] = useState([])
  const [services, setServices] = useState([])

  // Récupération données au montage
  useEffect(() => {
    fetch("http://localhost:8080/gestion-personnel/api/contrats")
      .then(res => res.json())
      .then(setContrats)

    fetch("http://localhost:8080/gestion-personnel/api/postes")
      .then(res => res.json())
      .then(setPostes)

    fetch("http://localhost:8080/gestion-personnel/api/services")
      .then(res => res.json())
      .then(setServices)
  }, [])

  // Suppression générique
  const handleDelete = (endpoint, id, setState) => {
    fetch(`http://localhost:8080/gestion-personnel/api/${endpoint}/${id}`, {
      method: "DELETE"
    }).then(() => {
      setState(prev => prev.filter(item =>
        item.idContrat === id || item.idPoste === id || item.idService === id
      ))
    })
  }

  return (
    <div className="pl-83">
      {/* Header */}
      <div className="w-full flex justify-between items-center bg-[#F9F9F9] h-19 border-b-2 border-[#EEEEEE] px-6 py-4 mb-6">
        <h2 className="font-bold text-2xl">Gestion des Ressources</h2>
        <img className="w-12 h-12 rounded-full" src={avatar} alt="avatar" />
      </div>

      {/* Contrats */}
      <div className="mb-8">
        <h3 className="font-semibold text-xl mb-4">📑 Contrats</h3>
        <div className="flex flex-col gap-3">
          {contrats.map(c => (
            <div key={c.idContrat} className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <p><span className="font-semibold">Type:</span> {c.type}</p>
                <p><span className="font-semibold">Début:</span> {c.dateDebut}</p>
                <p><span className="font-semibold">Fin:</span> {c.dateFin || "—"}</p>
                <p><span className="font-semibold">Statut:</span> {c.statut}</p>
                <p><span className="font-semibold">Matricule:</span> {c.matricule}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded bg-gray-800 text-white">Modifier</button>
                <button
                  onClick={() => handleDelete("contrats", c.idContrat, setContrats)}
                  className="px-3 py-1 rounded bg-gray-200 text-black"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Postes */}
      <div className="mb-8">
        <h3 className="font-semibold text-xl mb-4">💼 Postes</h3>
        <div className="flex flex-col gap-3">
          {postes.map(p => (
            <div key={p.idPoste} className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <p><span className="font-semibold">Libellé:</span> {p.libelle}</p>
                <p><span className="font-semibold">Description:</span> {p.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded bg-gray-800 text-white">Modifier</button>
                <button
                  onClick={() => handleDelete("postes", p.idPoste, setPostes)}
                  className="px-3 py-1 rounded bg-gray-200 text-black"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="mb-8">
        <h3 className="font-semibold text-xl mb-4">🏢 Services</h3>
        <div className="flex flex-col gap-3">
          {services.map(s => (
            <div key={s.idService} className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <p><span className="font-semibold">Nom:</span> {s.nomService}</p>
                <p><span className="font-semibold">Localisation:</span> {s.localisation}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded bg-gray-800 text-white">Modifier</button>
                <button
                  onClick={() => handleDelete("services", s.idService, setServices)}
                  className="px-3 py-1 rounded bg-gray-200 text-black"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(Apropos)
