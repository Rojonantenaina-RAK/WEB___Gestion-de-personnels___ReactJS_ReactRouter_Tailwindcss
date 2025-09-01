import { memo } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import iconDashboard from '../../assets/icons/dashboard.png'
import iconPresence from '../../assets/icons/presence.png'
import iconPersonnel from '../../assets/icons/personnel.png'
import iconProjectTache from '../../assets/icons/projettache.png'
import iconApropos from '../../assets/icons/apropos.png'

function Layout() {
  return (
    <>
      <nav className="w-auto h-full bg-[#f9f9f9] fixed border-2 border-t-0 border-[#EEEEEE]">
        <h1 className="text-2xl my-5 mx-3">GESTION DES PERSONNELS</h1>
        <hr className="w-4/5 border-t-2 border-[#EEEEEE] mx-auto" />
        <br />

        {/* Accueil */}
        <p className="m-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-xl h-12 transition-colors
               ${isActive
                ? "bg-[rgba(100,0,159,0.2)] text-black"
                : "text-black hover:bg-[rgba(100,0,159,0.1)]"}`
            }
          >
            <img src={iconDashboard} alt="" className="w-6 h-6" />
            Accueil
          </NavLink>
        </p>

        {/* Présence */}
        <p className="m-3">
          <NavLink
            to="/presence"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-xl h-12 transition-colors
               ${isActive
                ? "bg-[rgba(100,0,159,0.2)] text-black"
                : "text-black hover:bg-[rgba(100,0,159,0.1)]"}`
            }
          >
            <img src={iconPresence} alt="" className="w-6 h-6" />
            Présence
          </NavLink>
        </p>

        {/* Personnel */}
        <p className="m-3">
          <NavLink
            to="/personnel"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-xl h-12 transition-colors
               ${isActive
                ? "bg-[rgba(100,0,159,0.2)] text-black"
                : "text-black hover:bg-[rgba(100,0,159,0.1)]"}`
            }
          >
            <img src={iconPersonnel} alt="" className="w-6 h-6" />
            Personnel
          </NavLink>
        </p>

        {/* Projets et tâches */}
        <p className="m-3">
          <NavLink
            to="/projet"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-xl h-12 transition-colors
               ${isActive
                ? "bg-[rgba(100,0,159,0.2)] text-black"
                : "text-black hover:bg-[rgba(100,0,159,0.1)]"}`
            }
          >
            <img src={iconProjectTache} alt="" className="w-6 h-6" />
            Projets et tâches
          </NavLink>
        </p>

        {/* A propos */}
        <p className="m-3">
          <NavLink
            to="/apropos"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-xl h-12 transition-colors
               ${isActive
                ? "bg-[rgba(100,0,159,0.2)] text-black"
                : "text-black hover:bg-[rgba(100,0,159,0.1)]"}`
            }
          >
            <img src={iconApropos} alt="" className="w-6 h-6" />
            A propos
          </NavLink>
        </p>
      </nav>

      <Outlet />
    </>
  )
}

export default memo(Layout)
