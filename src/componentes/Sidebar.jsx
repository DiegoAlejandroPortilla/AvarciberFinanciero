import React, { useState, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import logo from '../images/logoAvar.svg';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useAuth } from "../context/AuthContext";
import Typography from '@mui/material/Typography'; // Import Typography from Material-UI

const Nav = styled.div`
background: linear-gradient(to right, #03396c, #005b96);
  height: 80px;
  display: flex;
  justify-content: space-between; /* Adjust the alignment of the elements */
  align-items: center;
  padding: 0 20px; /* Add some padding to the sides */
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px; /* Add some space between the logo and the close icon */
  padding: 20px;
  `;

const LogoImg = styled.img`
  height: 40px; /* Set the height of the logo as per your requirement */
padding-right: 20px;
  `;

const NavIcon = styled(Link)`
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
`;

const PersonIconContainer = styled.div`
  position: relative;
`;

const PersonIcon = styled.div`
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const SubmenuContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #03396c;
  width: 200px;
  display: ${({ showSubmenu }) => (showSubmenu ? "block" : "none")};
  z-index: 11;
`;

const SubmenuOption = styled.div`
  padding: 10px;
  color: #fff;
  cursor: pointer;

  &:hover {
    background: #03396c;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  display: ${({ showSubmenu }) => (showSubmenu ? 'block' : 'none')};
  z-index: 10;
`;

const SidebarNav = styled.nav`
background: linear-gradient(to bottom, #03396c, #03396c, #005b96);  
  width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
  transition: 350ms;
  z-index: 10;
  overflow-y: auto;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;
const GlobalStyle = createGlobalStyle`
  body {
    margin-left: ${({ sidebar }) => (sidebar ? '250px' : '0')};
    transition: margin-left 350ms;
  }
`;

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const personIconRef = useRef(null);
  const { logout, isAuthenticated, errors: registerErrors, user } = useAuth();
  const showSidebar = () => setSidebar(!sidebar);
  const closeSidebar = () => setSidebar(false);
  const toggleSubmenu = () => setShowSubmenu(!showSubmenu);



  return (
    <>
      {isAuthenticated ? (
        <IconContext.Provider value={{ color: '#fff' }}>
          <GlobalStyle sidebar={sidebar} />
          <Nav>
            <NavIcon to="#">
              <FaIcons.FaBars onClick={showSidebar} />
            </NavIcon>
            {/* <PersonIconContainer ref={personIconRef}>
              {user ? (
                <div className="user-name-container">
                user.nombre ? (
                  <Typography variant="body1" style={{ color: '#fff', marginLeft: '1rem' }}>{user.nombre} {user.apellido}</Typography>
                ) : (
                  <Typography variant="body1" style={{ color: '#fff', marginLeft: '1rem' }}>{user.USU_NOMBRE} {user.USU_APELLIDO}</Typography>
                )
                </div>
              ) : (
                null
              )}
              <PersonIcon onClick={toggleSubmenu}>
                <FaIcons.FaUser onClick={closeSidebar} />
              </PersonIcon>
              <SubmenuContainer
                showSubmenu={showSubmenu}
                style={{
                  top: personIconRef.current?.getBoundingClientRect().bottom,
                }}
              >
                {isAuthenticated ? (
                  <SubmenuOption onClick={logout}>Cerrar Sesión</SubmenuOption>
                ) : (
                  <SubmenuOption onClick={() => (window.location.href = "/login")}>Iniciar Sesión</SubmenuOption>
                )}
              </SubmenuContainer>
            </PersonIconContainer> */}
            <PersonIconContainer ref={personIconRef}>

              {user ? (
                <div className="user-name-container">
                <Typography variant="body1" style={{ color: '#fff', marginRight: '6vw' }}>
                  Hola, {user.nombre ? `${user.nombre} ${user.apellido}` : `${user.USU_NOMBRE} ${user.USU_APELLIDO}`}
                </Typography>
                </div>
              ) : null}
              <PersonIcon onClick={toggleSubmenu} style={{ color: '#fff', marginLeft: '10vw', marginTop: '-2rem' }}>
                <FaIcons.FaUser onClick={closeSidebar} />
              </PersonIcon>
              <SubmenuContainer
                showSubmenu={showSubmenu}
                style={{
                  top: personIconRef.current?.getBoundingClientRect().bottom,
                }}
              >
                {isAuthenticated ? (
                  <SubmenuOption onClick={logout}>Cerrar Sesión</SubmenuOption>
                ) : (
                  <SubmenuOption onClick={() => (window.location.href = "/login")}>Iniciar Sesión</SubmenuOption>
                )}
              </SubmenuContainer>
            </PersonIconContainer>
          </Nav>
          <SidebarNav sidebar={sidebar}>
            <SidebarWrap>
              <NavIcon to='#'>
                <LogoContainer>
                  <LogoImg src={logo} alt="Logo" />
                  <ArrowBackIosNewIcon onClick={closeSidebar} style={{ marginLeft: '6vh', color: '#FFFFFF' }} />
                </LogoContainer>
              </NavIcon>
              {SidebarData.map((item, index) => {
                return <SubMenu item={item} key={index} />;
              })}
            </SidebarWrap>
          </SidebarNav>
          <Backdrop showSubmenu={showSubmenu} onClick={toggleSubmenu} />
        </IconContext.Provider>
      ) : (
        null
      )}
    </>
  );

};

export default Sidebar;