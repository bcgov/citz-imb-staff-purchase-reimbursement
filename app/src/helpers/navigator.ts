export const lastVisitedPage: () => string = () =>
  window.sessionStorage.getItem('backTarget') || '/';
