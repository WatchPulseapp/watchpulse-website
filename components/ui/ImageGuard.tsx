'use client';

import { useEffect } from 'react';

/**
 * Keeps images in the page.
 *
 * The screenshots, the brand marks and the poster artwork are the work being
 * advertised, so they do not leave by drag or by the save-image menu. Two
 * listeners cover what CSS cannot: Firefox ignores -webkit-user-drag, and
 * nothing in CSS suppresses a desktop right-click.
 *
 * Only images are guarded. Swallowing every context menu would also take copy,
 * "open link in new tab" and the browser's own accessibility menus away from
 * readers of the Journal — a real cost against a fake protection. This stops
 * the accidental drag onto the desktop and the casual right-click-save; it
 * cannot stop anyone with devtools, and is not meant to.
 */
export default function ImageGuard() {
  useEffect(() => {
    const overImage = (target: EventTarget | null) =>
      target instanceof Element && target.closest('img, picture, canvas') !== null;

    const block = (e: Event) => {
      if (overImage(e.target)) e.preventDefault();
    };

    document.addEventListener('dragstart', block);
    document.addEventListener('contextmenu', block);
    return () => {
      document.removeEventListener('dragstart', block);
      document.removeEventListener('contextmenu', block);
    };
  }, []);

  return null;
}
