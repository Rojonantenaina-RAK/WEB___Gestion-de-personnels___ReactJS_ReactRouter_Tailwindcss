// Personnel.jsx
import { memo, useEffect, useState } from 'react'
import avatar from '../../assets/images/avatar.jpg'

function Personnel() {
  const [personnels, setPersonnels] = useState([])
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    adresse: '',
    telephone: '',
    email: '',
    dateEmbauche: '',
    salaire: '',
    idService: '',
    idPoste: ''
  })
  const [editId, setEditId] = useState(null)

  // Fetch liste de personnels
  const fetchPersonnels = async () => {
    try {
      const res = await fetch('http://localhost:8080/gestion-personnel/api/personnels')
      const data = await res.json()
      console.log("Personnels reçus:", data)
      setPersonnels(data)
    } catch (err) {
      console.error("Erreur fetch personnels:", err)
    }
  }

  useEffect(() => {
    fetchPersonnels()
  }, [])

  // Ajouter / Modifier personnel
  const handleSubmit = async (e) => {
    e.preventDefault()

    const method = editId ? 'PUT' : 'POST'
    const url = editId
      ? `http://localhost:8080/gestion-personnel/api/personnels/${editId}`
      : 'http://localhost:8080/gestion-personnel/api/personnels'

    // Construction du body selon POST vs PUT
    const body = editId
      ? {
        matricule: editId,
        nom: form.nom,
        prenom: form.prenom,
        adresse: form.adresse,
        telephone: form.telephone,
        email: form.email,
        dateEmbauche: form.dateEmbauche,
        salaire: Number(form.salaire),
        service: { idService: Number(form.idService) },
        poste: { idPoste: Number(form.idPoste) }
      }
      : {
        nom: form.nom,
        prenom: form.prenom,
        adresse: form.adresse,
        telephone: form.telephone,
        email: form.email,
        dateEmbauche: form.dateEmbauche,
        salaire: Number(form.salaire),
        idService: Number(form.idService),
        idPoste: Number(form.idPoste)
      }

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      // Reset form
      setForm({
        nom: '',
        prenom: '',
        adresse: '',
        telephone: '',
        email: '',
        dateEmbauche: '',
        salaire: '',
        idService: '',
        idPoste: ''
      })
      setEditId(null)
      fetchPersonnels()
    } catch (err) {
      console.error("Erreur submit:", err)
    }
  }

  // Supprimer personnel
  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce personnel ?')) {
      try {
        await fetch(`http://localhost:8080/gestion-personnel/api/personnels/${id}`, {
          method: 'DELETE'
        })
        fetchPersonnels()
      } catch (err) {
        console.error("Erreur delete:", err)
      }
    }
  }

  // Remplir le formulaire pour modification
  const handleEdit = (p) => {
    setForm({
      nom: p.nom,
      prenom: p.prenom,
      adresse: p.adresse,
      telephone: p.telephone,
      email: p.email,
      dateEmbauche: p.dateEmbauche,
      salaire: p.salaire,
      idService: p.service?.idService || '',
      idPoste: p.poste?.idPoste || ''
    })
    setEditId(p.matricule)
  }

  return (
    <div className='pl-76'>
      <div className='w-full flex justify-between items-center px-10 py-4 bg-[#F9F9F9] border-b-2 border-[#EEEEEE]'>
        <h2 className='font-bold text-2xl'>Personnels</h2>
        <img className='w-12 h-12 rounded-full' src={avatar} alt="Avatar" />
      </div>

      {/* Formulaire Ajouter / Modifier */}
      <div className='p-6 bg-white shadow rounded mt-6 mx-6'>
        <h3 className='font-semibold text-lg mb-4'>
          {editId ? 'Modifier Personnel' : 'Ajouter Personnel'}
        </h3>
        <form className='grid grid-cols-2 gap-4' onSubmit={handleSubmit}>
          <input className='border p-2 rounded' placeholder='Nom' value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
          <input className='border p-2 rounded' placeholder='Prénom' value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} required />
          <input className='border p-2 rounded' placeholder='Adresse' value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} required />
          <input className='border p-2 rounded' placeholder='Téléphone' value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} required />
          <input className='border p-2 rounded' type='email' placeholder='Email' value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input className='border p-2 rounded' type='date' placeholder='Date Embauche' value={form.dateEmbauche} onChange={e => setForm({ ...form, dateEmbauche: e.target.value })} required />
          <input className='border p-2 rounded' type='number' placeholder='Salaire' value={form.salaire} onChange={e => setForm({ ...form, salaire: e.target.value })} required />
          <input className='border p-2 rounded' type='number' placeholder='ID Service' value={form.idService} onChange={e => setForm({ ...form, idService: e.target.value })} required />
          <input className='border p-2 rounded' type='number' placeholder='ID Poste' value={form.idPoste} onChange={e => setForm({ ...form, idPoste: e.target.value })} required />
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white transition ${form.matricule
                ? "bg-gray-700 hover:bg-gray-900"
                : "bg-[rgba(100,0,159,0.5)] hover:bg-[rgba(100,0,159,0.7)]"
              }`}
          >
            {form.matricule ? "Mettre à jour" : "Ajouter"}
          </button>
        </form>
      </div>

      {/* Liste des Personnels */}
      <div className='mt-6 mx-6 bg-white shadow rounded p-4'>
        <h3 className='font-semibold text-lg mb-4'>Liste des Personnels</h3>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr>
              <th className='border p-2'>Matricule</th>
              <th className='border p-2'>Nom</th>
              <th className='border p-2'>Prénom</th>
              <th className='border p-2'>Email</th>
              <th className='border p-2'>Téléphone</th>
              <th className='border p-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {personnels.map(p => (
              <tr key={p.matricule} className='hover:bg-gray-100'>
                <td className='border p-2'>{p.matricule}</td>
                <td className='border p-2'>{p.nom}</td>
                <td className='border p-2'>{p.prenom}</td>
                <td className='border p-2'>{p.email}</td>
                <td className='border p-2'>{p.telephone}</td>
                <td className='border p-2 space-x-2'>
                  <button onClick={() => handleEdit(p)} className="px-2 py-1 rounded bg-gray-700 text-white hover:bg-gray-900 transition">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(p.matricule)} className="px-2 py-1 rounded bg-gray-300 text-black hover:bg-gray-500 transition">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default memo(Personnel)
