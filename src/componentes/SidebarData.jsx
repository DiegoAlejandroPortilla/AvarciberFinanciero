import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as RiIcons from 'react-icons/ri';
import DiamondSharpIcon from '@mui/icons-material/DiamondSharp';
import DescriptionSharpIcon from '@mui/icons-material/DescriptionSharp';
import RuleIcon from '@mui/icons-material/Rule';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

export const SidebarData = [
  {
    title: 'Inicio',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'General',
        path: '/inicio/general',
        //icon: <IoIcons.IoIosPaper />
      }

    ]
  },
  {
    title: 'Parametrización',
    icon: <DiamondSharpIcon/>,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Activos',
        path: '/medicion/activos',
        //icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      },
      {
        title: 'Unidades',
        path: '/parametrizacion/unidades',
        cName: 'sub-nav'
      },
      {
        title: 'Tipos de activos',
        path: '/parametrizacion/tipo-de-activos',
        cName: 'sub-nav'
      },
      {
        title: 'Tipos de vulnerabilidades',
        path: '/parametrizacion/tipo-de-vulnerabilidades',
        //icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Tipos de amenazas',
        path: '/parametrizacion/tipo-de-amenazas',
        //icon: <IoIcons.IoIosPaper />
      },
      /*{
        title: 'Dimensiones de valoración',
        path: '/parametrizacion/dimensiones-de-valoracion',
        //icon: <IoIcons.IoIosPaper />
      },*/
      {
        title: 'Probabilidades',
        path: '/parametrizacion/probabilidades',
        //icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Amenazas',
        path: '/parametrizacion/amenazas',
        //icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Vulnerabilidades',
        path: '/parametrizacion/vulnerabilidades',
        //icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      }
     

    ]
  },
  {
    title: 'Medición',
    icon: <RuleIcon />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Vulnerabilidad - Amenaza',
        path: '/gestionar/vulnerabilidad-amenaza',
        //icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      },
      {
        title: 'Activo - Vulnerabilidad',
        path: '/gestionar/nuevo-proceso',
        //icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      },
      // {
      //   title: 'Valor de Impacto',
      //   path: '/medicion/valor-de-impacto',
      //   //icon: <IoIcons.IoIosPaper />
      // },
      // {
      //   title: 'Amenazas por vulnerabilidad',
      //   path: '/medicion/amenazas-por-vulnerabilidad',
      //   //icon: <IoIcons.IoIosPaper />,
      //   cName: 'sub-nav'
      // }
    ]
  },
  {
    title: 'Gestionar',
    icon: <ModeEditOutlineIcon />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      
      {
        title: 'Cálculo de Riesgo',
        path: '/gestionar/Calculo-Riesgo',
        //icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      }
    ]
  },
  {
    title: 'Historico',
    icon: <DescriptionSharpIcon/>,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      
      {
        title: 'Historico de Procesos',
        path: '/gestionar/editar-vulnerabilidades',
        //icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      }
    ]
  }

];
