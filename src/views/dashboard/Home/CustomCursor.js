import React, { useState, useEffect } from 'react';
import img1 from '../../../assets/images/Test/drupi.png';
import img2 from '../../../assets/images/Test/suckGorrito.png';
import img3 from '../../../assets/images/Test/sucktion.png';

const CustomCursor = ({ usuarioRollViewMouse }) => {
  const cursorImages = [img1, img2, img3];

  useEffect(() => {
    const changeCursor = (event) => {
      if (usuarioRollViewMouse) {
        const randomIndex = Math.floor(Math.random() * cursorImages.length);

        // Aplicar el estilo del cursor directamente al documento
        document.body.style.cursor = `url(${cursorImages[randomIndex]}), auto`;
      }
      console.log('hola');
    };

    window.addEventListener('mousemove', changeCursor);

    return () => {
      window.removeEventListener('mousemove', changeCursor);
      // Restablecer el cursor al predeterminado cuando el componente se desmonta
      document.body.style.cursor = 'default';
    };
  }, [cursorImages, usuarioRollViewMouse]);

  if (!usuarioRollViewMouse) {
    return null;
  }

  // El componente no necesita renderizar nada
  return null;
};

export default CustomCursor;
