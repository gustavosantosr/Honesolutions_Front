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

export const navItems3: NavData[] = [
  {
    name: 'Dashboard',
    url: '/proveedores/terminadodashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {title: true,
    name: 'Menú Maquinas',
    icon: 'icon-puzzle',
    },
  {
    name: 'Cajones',
    url: '/proveedores/cajones',
    icon: 'icon-puzzle'
  },
  {
    name: 'Asignaciones',
    url: '/proveedores/asignaciones',
    icon: 'icon-puzzle'
  },
  {
    name: 'Terminados',
    url: '/proveedores/terminados',
    icon: 'icon-puzzle'
  }
  
  
];
