import React, { useState } from 'react'
import { SidebarData } from './SidebarData'
import { FaBars } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import SidebarItem from './SidebarItem'
import Logo from '../../assets/images/centenaria-logo.png'
import Mg from '../../assets/images/Logo_mgcomerciales.jpg'
import LogoRestaurant from '../../assets/images/centenaria-logo.png'
import { MdLogout } from 'react-icons/md'

import { RiSideBarLine } from 'react-icons/ri'

/* Provider (estado global)*/
import { useStore, useSubItem } from '../../providers/GlobalProvider'
import '../../styles/App.scss'

function Sidebar(props) {
  const { children, pageTitle } = props
  /* Estado global de la sidebar */
  const isOpen = useStore((state) => state.sidebar)
  const toggle = useStore((state) => state.showSidebar)
  const subNav = useSubItem((state) => state.subNav)

  // console.log(isOpen);

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('rol')
    window.location.href = '/'
  }

  return (
    <>
      <header className="header">
        <div
          className={
            isOpen
              ? 'nav-icon-open nav-icon bars'
              : 'nav-icon-close nav-icon bars'
          }
        >
          <RiSideBarLine onClick={toggle} />

          <h3 className="page-title">{pageTitle}</h3>
        </div>
        <div className="header-info-user">
          <span>Carmen</span>
          <span>Admin</span>
        </div>
        <div>
          <img
            className="header-avatar"
            src="https://b2472105.smushcdn.com/2472105/wp-content/uploads/2022/11/10-Poses-para-foto-de-Perfil-Profesional-Mujer-04-2022-7-819x1024.jpg?lossy=1&strip=1&webp=1"
            width="50px"
            height="50px"
            alt="Perfil del usuario"
          />
        </div>
      </header>
      <div className="container-sidebar">
        <aside
          className={isOpen ? 'sidebar sidebarOpen' : 'sidebar sidebarClose'}
        >
          <section
            className="top_section"
            style={{ paddingLeft: !isOpen ? '12px' : '0px' }}
          >
            {/* Sidebar completa o incompleta  */}
            {/* isOpen === true -> se mostrará el h1 por defecto, de lo contrario se oculta */}
            <div className="logo">
              <figure className="m-0">
                {/* <img className={isOpen ? "logo-restaurante logo-restaurante-open" : "logo-restaurante logo-restaurante-close"} width="20px" src={Logo} alt="Logo restaurante" /> */}
                <img
                  style={{ borderRadius: '20px' }}
                  className={
                    isOpen
                      ? 'logo-restaurante logo-restaurante-open'
                      : 'logo-restaurante logo-restaurante-close'
                  }
                  src={Mg}
                  alt="Logo restaurante"
                />
              </figure>
              {/* <p className="logo-text-right m-0" style={{ display: isOpen ? "inline" : "none"}}>Café Y Restaurante <br /> La Centenaria</p> */}
            </div>
          </section>
          <br />
          <br />
          <br />
          <br />
          {/* Items de la sidebar */}
          {SidebarData.map((item, index) => {
            // return <SidebarItem item ={item} isOpen={isOpen} key={index} />;
            return <SidebarItem item={item} key={index} />
          })}
          {/* <button
              type="button"
              className="btn btn-light d-block m-auto mt-5"
              onClick={cerrarSesion}
            >
              {isOpen ? (
                <>
                  <MdLogout color="#b23124" size={28} />
                  <span style={{ color: "#b23124" }}> Cerrar sesión</span>
                </>
              ) : (
                <>
                  <MdLogout color="#b23124" size={28} />
                </>
              )}

            </button> */}
          {/* <div
            className="d-flex justify-content-center"
            style={{ position: "relative", bottom: "-16em" }}
          >
            
          </div> */}
        </aside>
        {/* Componentes */}
        <main>{children}</main>
      </div>
    </>
  )
}

export default Sidebar
