import { useState, useEffect, useRef } from "react";  //Agregar la funcionalidad del menu y el useEffect para el dropdown
import Dropdown from "./Dropdown";
import React from 'react';
import { NavLink } from "react-router-dom"; 
import { useNavigate } from "react-router-dom"; 
import { Box, Container } from '@mui/material';
const MenuItemsBurger = ({ items, depthLevel, onHandleElementClick }) => {
  const navigate = useNavigate();
  let ref = useRef();  //access the DOM elements of the dropdown
  const [dropdown, setDropdown] = useState(false); //funcionalidad menu
  useEffect(() => {
  const handler = (event) => {
    if (dropdown && ref.current && !ref.current.contains(event.target)) {
    setDropdown(false);
    }
  };
  document.addEventListener("mousedown", handler);
  document.addEventListener("touchstart", handler);
  return () => {
    // Cleanup the event listener
    document.removeEventListener("mousedown", handler);
    document.removeEventListener("touchstart", handler);
  };
  }, [dropdown]);
  /***************************/
  /*******Toggling dropdown on a mouse hover for bigger screens************/
  const onMouseEnter = () => {
  window.innerWidth > 960 && setDropdown(true);
  };
  const onMouseLeave = () => {
  window.innerWidth > 960 && setDropdown(false);
  };
  const handleClick = (parameter,parameter2) => {
    setDropdown(prev => !prev);
    navigate(parameter);
    if(parameter != "#"){
      if (typeof onHandleElementClick === 'function') {//marcaba un error
        onHandleElementClick(depthLevel);
      }
    }
  };
  return (
  <li 
    className="menu-items" 
    ref={ref}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    >
    {items.submenu ? (
    <>
      <button
        className=  {depthLevel > 0 ? "button-menu-secondary":"button-menu" }
        type="button" 
        aria-haspopup="menu" 
        aria-expanded={dropdown ? "true" : "false"}
        onClick={() => {
          handleClick(items.link);
        }}
      >
        {items.title}{" "}
        {depthLevel > 0 ? <span className="arrow-right">&raquo;</span> : <span className="arrow" />}
      </button>
      <Dropdown 
        depthLevel={depthLevel}
        submenus={items.submenu}
        dropdown={dropdown}
        onHandleElementClick={onHandleElementClick}
      />
    </>
    ) : (
    <Box className=  {depthLevel > 0 ? "button-menu-secondary":"button-menu" } onClick ={() => handleClick(items.link)}>
      <NavLink className=  {depthLevel > 0 ? "button-menu-secondary":"button-menu" }  to={items.link}>{items.title}</NavLink>
    </Box>
    )}
  </li>
  );
};
export default MenuItemsBurger;