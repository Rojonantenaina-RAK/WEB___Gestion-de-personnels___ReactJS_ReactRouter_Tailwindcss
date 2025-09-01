import { useEffect, useState, memo } from "react";
import avatar from "../../assets/images/avatar.jpg";

function Presence() {
  const [presences, setPresences] = useState([]);
  const [form, setForm] = useState({
    idPresence: null,
    datePresence: "",
    heureArrivee: "",
    heureDepart: "",
    statut: "Présent",
    matricule: ""
  });

  const API_URL = "http://localhost:8080/gestion-personnel/api/presences";

  // Charger la liste
  const fetchPresences = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      setPresences(data);
    } catch (err) {
      console.error("Erreur lors du fetch:", err);
    }
  };

  useEffect(() => {
    fetchPresences();
  }, []);

  // Gérer la saisie du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Ajouter ou mettre à jour
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = form.idPresence ? "PUT" : "POST";
      const url = form.idPresence ? `${API_URL}/${form.idPresence}` : API_URL;

      const body =
        method === "POST"
          ? {
            datePresence: form.datePresence,
            heureArrivee: form.heureArrivee,
            heureDepart: form.heureDepart,
            statut: form.statut,
            matricule: parseInt(form.matricule)
          }
          : {
            idPresence: form.idPresence,
            datePresence: form.datePresence,
            heureArrivee: form.heureArrivee,
            heureDepart: form.heureDepart,
            statut: form.statut,
            personnel: { matricule: parseInt(form.matricule) }
          };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Erreur API");
      setForm({
        idPresence: null,
        datePresence: "",
        heureArrivee: "",
        heureDepart: "",
        statut: "Présent",
        matricule: ""
      });
      fetchPresences();
    } catch (err) {
      console.error("Erreur lors de l'envoi:", err);
    }
  };

  // Pré-remplir formulaire pour édition
  const handleEdit = (p) => {
    setForm({
      idPresence: p.idPresence,
      datePresence: p.datePresence,
      heureArrivee: p.heureArrivee || "",
      heureDepart: p.heureDepart || "",
      statut: p.statut,
      matricule: p.matricule || (p.personnel?.matricule ?? "")
    });
  };

  // Supprimer
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette présence ?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchPresences();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  return (
    <div className="pl-80">
      <div className="w-full flex justify-between items-center px-6 bg-[#F9F9F9] h-20 border-b-2 border-[#EEEEEE]">
        <h2 className="font-bold text-2xl">Présence</h2>
        <img className="w-12 h-12 rounded-full" src={avatar} alt="avatar" />
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
        <input type="date" name="datePresence" value={form.datePresence} onChange={handleChange} required className="border p-2 rounded" />
        <input type="time" name="heureArrivee" value={form.heureArrivee} onChange={handleChange} className="border p-2 rounded" />
        <input type="time" name="heureDepart" value={form.heureDepart} onChange={handleChange} className="border p-2 rounded" />
        <select name="statut" value={form.statut} onChange={handleChange} className="border p-2 rounded">
          <option value="Présent">Présent</option>
          <option value="Absent">Absent</option>
        </select>
        <input type="number" name="matricule" placeholder="Matricule" value={form.matricule} onChange={handleChange} required className="border p-2 rounded" />

        {/* Bouton Ajouter / Modifier */}
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white transition ${form.idPresence
              ? "bg-gray-700 hover:bg-gray-900"
              : "bg-[rgba(100,0,159,0.5)] hover:bg-[rgba(100,0,159,0.7)]"
            }`}
        >
          {form.idPresence ? "Mettre à jour" : "Ajouter"}
        </button>
      </form>

      {/* Tableau des présences */}
      <table className="w-full mt-6 border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Arrivée</th>
            <th className="border p-2">Départ</th>
            <th className="border p-2">Statut</th>
            <th className="border p-2">Matricule</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {presences.map((p) => (
            <tr key={p.idPresence} className="hover:bg-gray-50">
              <td className="border p-2">{p.idPresence}</td>
              <td className="border p-2">{p.datePresence}</td>
              <td className="border p-2">{p.heureArrivee || "-"}</td>
              <td className="border p-2">{p.heureDepart || "-"}</td>
              <td className="border p-2">{p.statut}</td>
              <td className="border p-2">{p.matricule || (p.personnel?.matricule ?? "-")}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="px-2 py-1 rounded bg-gray-700 text-white hover:bg-gray-900 transition"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(p.idPresence)}
                  className="px-2 py-1 rounded bg-gray-300 text-black hover:bg-gray-500 transition"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(Presence);