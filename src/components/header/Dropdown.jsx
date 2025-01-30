import React from 'react';
import MenuItemsBurger from "./MenuItemsBurger";
const Dropdown = ({ submenus, dropdown, depthLevel,onHandleElementClick }) => {
    depthLevel = depthLevel + 1;
    const dropdownClass = depthLevel > 1 ? "dropdown-submenu" : "";
    return (
     <ul 
     className={`dropdown ${dropdownClass} ${dropdown ? "show" : ""}`}>
      {submenus.map((submenu, index) => (
            <MenuItemsBurger items={submenu} key={index} depthLevel={depthLevel}  onHandleElementClick={onHandleElementClick}/>
      ))}
     </ul>
    );
   };
export default Dropdown;