import { $baseUser, $creadorInfo, $isCreador, $token, $refreshToken, $alert } from '@/store';

export function isLocalStorageAvailable() {
    try {
      // Local storage is available if the property exists
      return typeof window.localStorage !== 'undefined';
    } catch (error) {
      // If window.localStorage exists but the user is blocking local
      // storage, the attempting to read the property throws an exception.
      // If this happens, consider local storage not available.
      return false;
    }
  }

export  const logOut = () => {
    $baseUser.setKey("username", null);
    $baseUser.setKey("email", null);
    $creadorInfo.setKey("logo", null);
    $creadorInfo.setKey("support_link", null);
    $isCreador.set(false);
    $token.set('');
    $refreshToken.set('');
    window.location.href = "/login";
}

const RESTRICTED_PAGES = ["/dashboard","/perfil","/rifa/crear"];

export const logInRequired = () => {
    if (! $token.get() || !$refreshToken.get()) {
      if (RESTRICTED_PAGES.includes(window.location.pathname)) 
      {
        $alert.set("Debes iniciar sesión para acceder a esta página");
        window.location.href = "/login";
      }

    }
}

const CREATOR_PAGES = ["/rifa/crear"];
export const fullInfoCreadorRequired = () => {
  if (!$isCreador.get() || !$creadorInfo.get("logo") || !$creadorInfo.get("support_link")) {
    if (CREATOR_PAGES.includes(window.location.pathname)) 
    {
      $alert.set("Debes ser un creador y completar tu información de creador para acceder a esta página");
      window.location.href = "/perfil";
    }
    
  }
}

export const forbiddenOnLoggedIn = () => {
  if ($token.get() && $refreshToken.get()) 
    window.location.href = "/";
  
}

export const delay = ms => new Promise(res => setTimeout(res, ms));

export function findScroller(element) {
    element.onscroll = function() { console.log(element)}

    Array.from(element.children).forEach((value) => {
        findScroller(value);
    });
}
