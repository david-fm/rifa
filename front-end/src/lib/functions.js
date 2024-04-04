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

export const mustAcceptPoliticas = (politicas) => {
  console.log(politicas);
  console.log(politicas.checked);
  if (!politicas.checked) {
    $alert.set("Debes aceptar las políticas de privacidad para continuar");
    return false;
  }
  return true;
}
// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
export function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}