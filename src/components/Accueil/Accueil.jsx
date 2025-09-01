import { memo } from 'react'
import avatar from '../../assets/images/avatar.jpg'
import { Outlet, NavLink } from 'react-router-dom'

import imagePersonnel from '../../assets/images/personnel.jpg'
import imagePresence from '../../assets/images/presence.jpg'
import imageProjectTache from '../../assets/images/tache.jpg'
import imageApropos from '../../assets/images/apropos.jpg'

function Accueil() {
  return (
    <div className="">
      {/* Header */}
      <div className="w-full flex justify-between items-center bg-[#F9F9F9] h-19 border-b-2 border-[#EEEEEE] px-6 py-4 mb-6">
        <h2 className="font-bold text-2xl ml-80">Accueil</h2>
        <img className="w-12 h-12 rounded-full" src={avatar} alt="avatar" />
      </div>

      {/* Container des cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-20 ml-75">

        <NavLink to="/personnel" className="rounded-lg overflow-hidden shadow hover:shadow-lg transition">
          <div className="flex flex-col h-60 items-center gap-y-5">
            <img src={imagePersonnel} alt="Personnel" className="w-full h-40 object-cover" />
            <p className="text-center font-medium p-2 hover:underline cursor-pointer">Gérer les personnels {'>'}</p>
          </div>
        </NavLink>

        <NavLink to="/presence" className="rounded-lg overflow-hidden shadow hover:shadow-lg transition">
          <div className="flex flex-col h-60 items-center gap-y-5">
            <img src={imagePresence} alt="Présence" className="w-full h-40 object-cover" />
            <p className="text-center font-medium p-2 hover:underline cursor-pointer">Fiche de présence {'>'}</p>
          </div>
        </NavLink>

        <NavLink to="/projet" className="rounded-lg overflow-hidden shadow hover:shadow-lg transition">
          <div className="flex flex-col h-60 items-center gap-y-5">
            <img src={imageProjectTache} alt="Tâches" className="w-full h-40 object-cover" />
            <p className="text-center font-medium p-2 hover:underline cursor-pointer">Distribution des tâches {'>'}</p>
          </div>
        </NavLink>

        <NavLink to="/apropos" className="rounded-lg overflow-hidden shadow hover:shadow-lg transition">
          <div className="flex flex-col h-60 items-center gap-y-5">
            <img src={imageApropos} alt="À propos" className="w-full h-40 object-cover" />
            <p className="text-center font-medium p-2 hover:underline cursor-pointer">Informations sur l'entreprise {'>'}</p>
          </div>
        </NavLink>

      </div>

      <Outlet />
    </div>
  )
}

export default memo(Accueil);
