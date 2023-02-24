const NavigationPages = {
  HOME: "/",
  CREATE: "/create",
  TRANSFER: "/transfer",
  REDEEM: "/redeem",
};

const getSelectedPage = (route) => {
  switch (route) {
    case NavigationPages.HOME:
      return NavigationPages.HOME;
    case NavigationPages.CREATE:
      return NavigationPages.CREATE;
    case NavigationPages.TRANSFER:
      return NavigationPages.TRANSFER;
    case NavigationPages.REDEEM:
      return NavigationPages.REDEEM;
    default:
      return NavigationPages.HOME;
  }
};

const baseURL =`http://localhost:5000`;

export { getSelectedPage, NavigationPages, baseURL };
