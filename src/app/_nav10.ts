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

export const navItems10: NavData[] = [
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
    name: 'Terminados',
    url: '/icons',
    icon: 'icon-star',
    children: [
      {
        name: 'Configuración',
        url: '/icons',
        icon: 'icon-star',
        children: [
          {
            name: 'Productos',
            url: '/proveedores/productos',
            icon: 'icon-speedometer'
          },
          {
            name: 'Cajones',
            url: '/proveedores/cajones',
            icon: 'icon-puzzle'
          }

        ]
      },
      {
        name: 'Salidas',
        url: '/proveedores/salidas',
        icon: 'icon-speedometer'
      },
      {
        name: 'Terminados',
        url: '/proveedores/terminados',
        icon: 'icon-speedometer'
      },
      {
        name: 'Asignaciones',
        url: '/proveedores/asignaciones',
        icon: 'icon-puzzle'
      }

    ]
  }

];
