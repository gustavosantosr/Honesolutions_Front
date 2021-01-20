interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
  variant: string;
}
interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const navItems4: NavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Informe',
    url: '/proveedores/datastudio',
    icon: 'icon-puzzle'
  },
  {
    name: 'Reporte',
    url: '/proveedores/terminadodashboard',
    icon: 'icon-puzzle'
  },
  {
    name: 'Grupos',
    url: '/proveedores/grupos',
    icon: 'icon-speedometer'
  },
  {
    name: 'Productos',
    url: '/proveedores/productos',
    icon: 'icon-speedometer'
  }


];
