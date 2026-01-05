import React, { useEffect, useState } from 'react';
import { getMenus } from '../lib/database';

function MenuList() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    async function fetchMenus() {
      try {
        const data = await getMenus();
        setMenus(data);
      } catch (error) {
        console.error('Erro ao carregar cardápios:', error);
      }
    }
    fetchMenus();
  }, []);

  return (
    <div>
      <h1>Cardápios</h1>
      <ul>
        {menus.map((menu) => (
          <li key={menu.id}>{menu.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default MenuList;