import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    /* Estilos de hover */
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  background: #014a81;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;

  &:hover {
    /* Estilos de hover */
  }
`;

const SubMenu = ({ item, isSidebarOpen, setSidebarOpen }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => {
    if (item.subNav) {
      setSubnav(!subnav);
      // Cerrar el menú principal cuando se haga clic en un elemento de submenú
      if (isSidebarOpen) {
        setSidebarOpen(false);
      }
    }
  };

  return (
    <>
      <SidebarLink to={item.path} onClick={showSubnav}>
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>
      {subnav &&
        item.subNav.map((subItem, index) => {
          return (
            <DropdownLink to={subItem.path} key={index}>
              {subItem.icon}
              <SidebarLabel>{subItem.title}</SidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};

export default SubMenu;
