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

export const navItems: NavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  }, {
    name: 'Informes',
    url: '/honesolutions/informes',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Configuración',
    url: '/icons',
    icon: 'icon-star',
    children: [
          {
            name: 'General',
            url: '/honesolutions/configlocalizaciones',
            icon: 'icon-puzzle'
          },
          {
            name: 'Conf. Prestadores',
            url: '/honesolutions/configprestadores',
            icon: 'icon-puzzle'
          }]
      },
      {
        name: 'Reportes',
        url: '/honesolutions/reportes',
        icon: 'icon-puzzle'
      },
  {
    name: 'Clientes',
    url: '/honesolutions/clientes',
    icon: 'icon-puzzle'
  },
  {
    name: 'Prestadores',
    url: '/honesolutions/prestadores',
    icon: 'icon-puzzle'
  },
  {
    name: 'Tarifas P',
    url: '/honesolutions/tarifasprestador',
    icon: 'icon-puzzle'
  }
  ,
  {
    name: 'Upload',
    url: '/upload',
    icon: 'icon-puzzle'
  }
];
