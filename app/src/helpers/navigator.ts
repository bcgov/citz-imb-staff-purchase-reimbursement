export const lastVisitedPage: () => string = () => sessionStorage.getItem('backTarget') || '/';
