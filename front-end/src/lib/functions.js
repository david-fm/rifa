import { $baseUser, $creadorInfo, $isCreador, $token, $refreshToken } from '@/store';

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
    console.log("Logging out");
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
        window.location.href = "/login";
    }
}

export const forbiddenOnLoggedIn = () => {
  if ($token.get() && $refreshToken.get()) 
    window.location.href = "/";
  
}

export const delay = ms => new Promise(res => setTimeout(res, ms));
