// ProjetsTaches.jsx
import { memo, useEffect, useState } from "react";
import avatar from "../../assets/images/avatar.jpg";

const API_BASE = "http://localhost:8080/gestion-personnel/api";

function ProjetsTaches() {
  const [projets, setProjets] = useState([]);
  const [taches, setTaches] = useState([]);
  const [personnels, setPersonnels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI states pour formulaire project / task
  const [projectForm, setProjectForm] = useState({ nomProjet: "", objectif: "", dateDebut: "", dateFin: "" });
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [taskForm, setTaskForm] = useState({
    libelle: "",
    description: "",
    dateDebut: "",
    dateFin: "",
    statut: "",
    matricule: "",
    idProjet: ""
  });
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Normalisation : accepte array OR { content: [...] } etc.
  const normalizeList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.content && Array.isArray(data.content)) return data.content;
    // HATEOAS style?
    if (data._embedded) {
      const key = Object.keys(data._embedded)[0];
      return data._embedded[key] || [];
    }
    // fallback : single object -> make array
    if (typeof data === "object") return [data];
    return [];
  };

  // Helpers pour lire champs différents (snake_case / camelCase)
  const get = (obj, camel, snake) => obj?.[camel] ?? obj?.[snake] ?? obj?.[camel.toLowerCase()] ?? undefined;

  // Récupération initiale
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prRes, taRes, peRes] = await Promise.all([
          fetch(`${API_BASE}/projets`),
          fetch(`${API_BASE}/taches`),
          fetch(`${API_BASE}/personnels`)
        ]);

        if (!prRes.ok || !taRes.ok || !peRes.ok) {
          console.error("Statuses:", prRes.status, taRes.status, peRes.status);
          throw new Error("Erreur lors des fetch (voir network)");
        }

        const [prJson, taJson, peJson] = await Promise.all([prRes.json(), taRes.json(), peRes.json()]);

        const prList = normalizeList(prJson).map(p => ({
          idProjet: get(p, "idProjet", "id_projet") ?? get(p, "id", "id"),
          nomProjet: get(p, "nomProjet", "nom_projet") ?? p.nomProjet ?? p.nom_projet ?? "",
          objectif: p.objectif ?? p.objectif ?? "",
          dateDebut: get(p, "dateDebut", "date_debut") ?? "",
          dateFin: get(p, "dateFin", "date_fin") ?? ""
        }));

        const taList = normalizeList(taJson).map(t => ({
          idTache: get(t, "idTache", "id_tache") ?? get(t, "id", "id"),
          libelle: t.libelle ?? "",
          description: t.description ?? "",
          dateDebut: get(t, "dateDebut", "date_debut") ?? "",
          dateFin: get(t, "dateFin", "date_fin") ?? "",
          statut: t.statut ?? "",
          // matricule peut venir direct ou dans personnel
          matricule: t.matricule ?? t.personnel?.matricule ?? t.personnel?.matricule ?? (t.personnel ? t.personnel.matricule : undefined),
          // idProjet peut venir direct ou dans projet
          idProjet: t.idProjet ?? t.projet?.idProjet ?? t.projet?.id_projet ?? t.id_projet
        }));

        const peList = normalizeList(peJson).map(p => ({
          matricule: p.matricule ?? p.matricule,
          nom: p.nom ?? "",
          prenom: p.prenom ?? ""
        }));

        setProjets(prList);
        setTaches(taList);
        setPersonnels(peList);
      } catch (err) {
        console.error("Erreur fetch:", err);
        setError(err.message || "Erreur inconnu");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Utilitaire pour recharger
  const refresh = async () => {
    setLoading(true);
    try {
      const [prRes, taRes, peRes] = await Promise.all([
        fetch(`${API_BASE}/projets`),
        fetch(`${API_BASE}/taches`),
        fetch(`${API_BASE}/personnels`)
      ]);
      const [prJson, taJson, peJson] = await Promise.all([prRes.json(), taRes.json(), peRes.json()]);
      setProjets(normalizeList(prJson));
      setTaches(normalizeList(taJson));
      setPersonnels(normalizeList(peJson));
    } catch (err) {
      console.error("Erreur refresh:", err);
    } finally {
      setLoading(false);
    }
  };

  // ----- PROJETS CRUD -----
  const createProject = async (e) => {
    e && e.preventDefault();
    try {
      const body = {
        nomProjet: projectForm.nomProjet,
        objectif: projectForm.objectif,
        dateDebut: projectForm.dateDebut,
        dateFin: projectForm.dateFin
      };
      const res = await fetch(`${API_BASE}/projets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`POST projet failed: ${res.status}`);
      await refresh();
      setProjectForm({ nomProjet: "", objectif: "", dateDebut: "", dateFin: "" });
    } catch (err) {
      console.error("createProject:", err);
      alert("Erreur création projet — voir console");
    }
  };

  const startEditProject = (p) => {
    setEditingProjectId(get(p, "idProjet", "id_projet") ?? p.id);
    setProjectForm({
      nomProjet: p.nomProjet ?? p.nom_projet ?? p.nom ?? "",
      objectif: p.objectif ?? "",
      dateDebut: p.dateDebut ?? p.date_debut ?? "",
      dateFin: p.dateFin ?? p.date_fin ?? ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateProject = async (e) => {
    e && e.preventDefault();
    try {
      const id = editingProjectId;
      const body = {
        nomProjet: projectForm.nomProjet,
        objectif: projectForm.objectif,
        dateDebut: projectForm.dateDebut,
        dateFin: projectForm.dateFin
      };
      const res = await fetch(`${API_BASE}/projets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`PUT projet failed: ${res.status}`);
      await refresh();
      setEditingProjectId(null);
      setProjectForm({ nomProjet: "", objectif: "", dateDebut: "", dateFin: "" });
    } catch (err) {
      console.error("updateProject:", err);
      alert("Erreur modification projet — voir console");
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Supprimer ce projet ?")) return;
    try {
      const res = await fetch(`${API_BASE}/projets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`DELETE projet failed: ${res.status}`);
      await refresh();
    } catch (err) {
      console.error("deleteProject:", err);
      alert("Erreur suppression projet — voir console");
    }
  };

  // ----- TACHES CRUD -----
  const createTask = async (e) => {
    e && e.preventDefault();
    try {
      // POST expects matricule + idProjet (selon tes curls)
      const body = {
        libelle: taskForm.libelle,
        description: taskForm.description,
        dateDebut: taskForm.dateDebut,
        dateFin: taskForm.dateFin,
        statut: taskForm.statut,
        matricule: Number(taskForm.matricule),
        idProjet: Number(taskForm.idProjet)
      };
      const res = await fetch(`${API_BASE}/taches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`POST tache failed: ${res.status}`);
      await refresh();
      setTaskForm({ libelle: "", description: "", dateDebut: "", dateFin: "", statut: "", matricule: "", idProjet: "" });
    } catch (err) {
      console.error("createTask:", err);
      alert("Erreur création tâche — voir console");
    }
  };

  const startEditTask = (t) => {
    const id = get(t, "idTache", "id_tache") ?? t.id;
    setEditingTaskId(id);
    setTaskForm({
      libelle: t.libelle ?? "",
      description: t.description ?? "",
      dateDebut: t.dateDebut ?? t.date_debut ?? "",
      dateFin: t.dateFin ?? t.date_fin ?? "",
      statut: t.statut ?? "",
      // matricule peut être matricule direct ou personnel.matricule
      matricule: t.matricule ?? t.personnel?.matricule ?? t.personnel?.matricule ?? "",
      idProjet: t.idProjet ?? t.projet?.idProjet ?? t.projet?.id_projet ?? ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateTask = async (e) => {
    e && e.preventDefault();
    try {
      const id = editingTaskId;
      // PUT expects nested objects (personnel, projet) per curl
      const body = {
        idTache: id,
        libelle: taskForm.libelle,
        description: taskForm.description,
        dateDebut: taskForm.dateDebut,
        dateFin: taskForm.dateFin,
        statut: taskForm.statut,
        personnel: { matricule: Number(taskForm.matricule) },
        projet: { idProjet: Number(taskForm.idProjet) }
      };
      const res = await fetch(`${API_BASE}/taches/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`PUT tache failed: ${res.status}`);
      await refresh();
      setEditingTaskId(null);
      setTaskForm({ libelle: "", description: "", dateDebut: "", dateFin: "", statut: "", matricule: "", idProjet: "" });
    } catch (err) {
      console.error("updateTask:", err);
      alert("Erreur modification tâche — voir console");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Supprimer cette tâche ?")) return;
    try {
      const res = await fetch(`${API_BASE}/taches/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`DELETE tache failed: ${res.status}`);
      await refresh();
    } catch (err) {
      console.error("deleteTask:", err);
      alert("Erreur suppression tâche — voir console");
    }
  };

  const getPersonnelName = (matricule) => {
    const p = personnels.find((pers) => {
      const m = pers.matricule ?? pers.matricule;
      return Number(m) === Number(matricule);
    });
    return p ? `${p.nom ?? ""} ${p.prenom ?? ""}`.trim() : "Inconnu";
  };

  if (loading) return <p className="p-4">Chargement...</p>;
  if (error) return <p className="p-4 text-red-600">Erreur: {error}</p>;

  return (
    <div className="pl-76">
      {/* Header */}
      <div className="w-full flex justify-between px-6 items-center bg-[#F9F9F9] h-20 border-b-2 border-[#EEEEEE]">
        <h2 className="font-bold text-2xl">Projets et tâches</h2>
        <img className="w-12 rounded-full" src={avatar} alt="avatar" />
      </div>

      <div className="p-6 space-y-6">
        {/* FORM Projet */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">{editingProjectId ? "Modifier projet" : "Ajouter projet"}</h3>
          <form onSubmit={editingProjectId ? updateProject : createProject} className="grid grid-cols-4 gap-3">
            <input placeholder="Nom projet" value={projectForm.nomProjet} onChange={(e) => setProjectForm({ ...projectForm, nomProjet: e.target.value })} required className="col-span-1 border p-2 rounded" />
            <input placeholder="Objectif" value={projectForm.objectif} onChange={(e) => setProjectForm({ ...projectForm, objectif: e.target.value })} required className="col-span-1 border p-2 rounded" />
            <input type="date" value={projectForm.dateDebut} onChange={(e) => setProjectForm({ ...projectForm, dateDebut: e.target.value })} className="col-span-1 border p-2 rounded" />
            <input type="date" value={projectForm.dateFin} onChange={(e) => setProjectForm({ ...projectForm, dateFin: e.target.value })} className="col-span-1 border p-2 rounded" />
            <div className="col-span-4 flex gap-2 mt-2">
              <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">{editingProjectId ? "Enregistrer" : "Ajouter projet"}</button>
              {editingProjectId && <button type="button" onClick={() => { setEditingProjectId(null); setProjectForm({ nomProjet: "", objectif: "", dateDebut: "", dateFin: "" }); }} className="px-3 py-1 border rounded">Annuler</button>}
            </div>
          </form>
        </div>

        {/* FORM Tâche */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">{editingTaskId ? "Modifier tâche" : "Ajouter tâche"}</h3>
          <form onSubmit={editingTaskId ? updateTask : createTask} className="grid grid-cols-4 gap-3">
            <input placeholder="Libellé" value={taskForm.libelle} onChange={(e) => setTaskForm({ ...taskForm, libelle: e.target.value })} required className="col-span-1 border p-2 rounded" />
            <input placeholder="Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} className="col-span-1 border p-2 rounded" />
            <input type="date" value={taskForm.dateDebut} onChange={(e) => setTaskForm({ ...taskForm, dateDebut: e.target.value })} className="col-span-1 border p-2 rounded" />
            <input type="date" value={taskForm.dateFin} onChange={(e) => setTaskForm({ ...taskForm, dateFin: e.target.value })} className="col-span-1 border p-2 rounded" />
            <input placeholder="Statut" value={taskForm.statut} onChange={(e) => setTaskForm({ ...taskForm, statut: e.target.value })} className="col-span-1 border p-2 rounded" />
            <select value={taskForm.matricule} onChange={(e) => setTaskForm({ ...taskForm, matricule: e.target.value })} className="col-span-1 border p-2 rounded" required>
              <option value="">Sélectionner personnel</option>
              {personnels.map(p => <option key={p.matricule} value={p.matricule}>{(p.nom ?? "") + " " + (p.prenom ?? "")}</option>)}
            </select>
            <select value={taskForm.idProjet} onChange={(e) => setTaskForm({ ...taskForm, idProjet: e.target.value })} className="col-span-1 border p-2 rounded" required>
              <option value="">Sélectionner projet</option>
              {projets.map(pr => <option key={get(pr, "idProjet", "id_projet") ?? pr.id} value={get(pr, "idProjet", "id_projet") ?? pr.id}>{pr.nomProjet ?? pr.nom_projet ?? pr.nom}</option>)}
            </select>

            <div className="col-span-4 flex gap-2 mt-2">
              <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">{editingTaskId ? "Enregistrer tâche" : "Ajouter tâche"}</button>
              {editingTaskId && <button type="button" onClick={() => { setEditingTaskId(null); setTaskForm({ libelle: "", description: "", dateDebut: "", dateFin: "", statut: "", matricule: "", idProjet: "" }); }} className="px-3 py-1 border rounded">Annuler</button>}
            </div>
          </form>
        </div>

        {/* Liste projets et leurs tâches */}
        {projets.length === 0 ? <p>Aucun projet.</p> : projets.map((projet) => {
          const pid = get(projet, "idProjet", "id_projet") ?? projet.id;
          const nom = projet.nomProjet ?? projet.nom_projet ?? projet.nom ?? "Projet";
          return (
            <div key={pid} className="border rounded-2xl shadow p-4 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-xl">{nom}</h3>
                  <p className="text-gray-600">{projet.objectif}</p>
                  <p className="text-sm text-gray-500">{projet.dateDebut} → {projet.dateFin}</p>
                </div>
                <div className="space-x-2">
                  <button onClick={() => startEditProject({ ...projet, idProjet: pid })} className="px-3 py-1 bg-blue-500 text-white rounded-lg">Modifier</button>
                  <button onClick={() => deleteProject(pid)} className="px-3 py-1 bg-red-500 text-white rounded-lg">Supprimer</button>
                </div>
              </div>

              <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                {taches.filter(t => (get(t, "idProjet", "id_projet") ?? t.idProjet ?? t.id_projet ?? t.id) == pid).length === 0 && <p className="text-sm text-gray-500">Aucune tâche pour ce projet</p>}
                {taches.filter(t => (get(t, "idProjet", "id_projet") ?? t.idProjet ?? t.id_projet ?? t.id) == pid).map((tache) => {
                  const tid = get(tache, "idTache", "id_tache") ?? tache.idTache ?? tache.id;
                  const matricule = tache.matricule ?? tache.personnel?.matricule ?? "";
                  return (
                    <div key={tid} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium">{tache.libelle}</p>
                        <p className="text-sm text-gray-600">{tache.description}</p>
                        <p className="text-xs text-gray-500">{tache.dateDebut} → {tache.dateFin} • <span className="font-semibold">{tache.statut}</span></p>
                        <p className="text-xs text-gray-700">Assignée à : <span className="font-semibold">{getPersonnelName(matricule)}</span></p>
                      </div>
                      <div className="space-x-2">
                        <button onClick={() => handleEdit(p)} className="px-2 py-1 rounded bg-gray-700 text-white hover:bg-gray-900 transition">
                          Modifier
                        </button>
                        <button onClick={() => handleDelete(p.idProjet)} className="px-2 py-1 rounded bg-gray-300 text-black hover:bg-gray-500 transition">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(ProjetsTaches);
