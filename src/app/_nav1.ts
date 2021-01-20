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

export const navItems1: NavData[] = [
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
        url: '/icons',
        icon: 'icon-star',
        children: [
          {
            name: 'Localizaciones',
            url: '/honesolutions/configlocalizaciones',
            icon: 'icon-puzzle'
          },
          {
            name: 'Ciudades',
            url: '/honesolutions/ciudades',
            icon: 'icon-puzzle'
          },
          {
            name: 'Tipos de Ident.',
            url: '/honesolutions/identificaciontipos',
            icon: 'icon-puzzle'
          }]
      },
      {
        name: 'Conf. Prestadores',
        url: '/icons',
        icon: 'icon-star',
        children: [
          {
            name: 'Departamentos',
            url: '/honesolutions/departamentos',
            icon: 'icon-puzzle'
          },
          {
            name: 'Ciudades',
            url: '/honesolutions/ciudades',
            icon: 'icon-puzzle'
          },
          {
            name: 'Tipos de Ident.',
            url: '/honesolutions/identificaciontipos',
            icon: 'icon-puzzle'
          },
          {
            name: 'Tipos de Prest',
            url: '/honesolutions/prestadortipos',
            icon: 'icon-puzzle'
          },
          {
            name: 'Planes Pres',
            url: '/honesolutions/prestadorplanes',
            icon: 'icon-puzzle'
          }]
      },
      {
        name: 'Seguridad',
        icon: 'icon-puzzle',
        children: [{
          name: 'Roles',
          url: '/honesolutions/roles',
          icon: 'icon-puzzle'
        },
        {
          name: 'Permisos',
          url: '/honesolutions/permisos',
          icon: 'icon-puzzle'
        },
        {
          name: 'Usuarios',
          url: '/honesolutions/usuarios',
          icon: 'icon-puzzle'
        }
        ]
      }
    ]
  },
  {
    name: 'Tarifas',
    url: '/icons',
    icon: 'icon-star',
    children: [
      {
        name: 'Especialidades',
        url: '/honesolutions/especialidades',
        icon: 'icon-puzzle'
      },
      {
        name: 'Servicios',
        url: '/honesolutions/servicios',
        icon: 'icon-puzzle'
      },
      {
        name: 'Esp. Servicios',
        url: '/honesolutions/servicioespecialidades',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tarifas',
        url: '/honesolutions/tarifas',
        icon: 'icon-puzzle'
      }
    ]
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
  }
];