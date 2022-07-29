import React, { useEffect, useState } from 'react';
import {
  Breadcrumb as BreadcrumbKit,
  BreadcrumbItem,
  Container,
} from 'design-react-kit';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';
import isEqual from 'lodash.isequal';
import { useSelector } from 'react-redux';
import {
  selectBreadcrumb,
  selectInfoIdsBreadcrumb,
} from '../../redux/features/app/appSlice';

export interface BreadcrumbI {
  label?: string;
  url?: string;
  link: boolean;
}

const Breadcrumb = () => {
  const breadcrumbList = useSelector(selectBreadcrumb);
  const idsBreadcrumb = useSelector(selectInfoIdsBreadcrumb);
  const urlCurrentLocation = useLocation().pathname;
  const location = useLocation()
    .pathname.split('/')
    .filter((elem) => elem !== '');
  const [currentLocation, setCurrentLocation] = useState<string[]>();
  const [navigationList, setNavigationList] = useState<BreadcrumbI[]>([]);

  const createUrl = (index: number) => {
    let url = '';
    (currentLocation || []).map((elem: string, i: number) => {
      if (elem !== '' && i <= index) {
        url = url + '/' + currentLocation?.[i];
      }
    });
    return url;
  };

  const getLabelBreadcrumb = (pathElem: string) => {
    if (idsBreadcrumb.filter((x) => x?.id?.toString() === pathElem)[0]) {
      return idsBreadcrumb.filter((x) => x?.id?.toString() === pathElem)[0].nome;
    } else {
      switch (pathElem) {
        case 'area-amministrativa':
          return 'Area Amministrativa';
        case 'area-cittadini':
          return 'Area cittadini';
        default:
          return (
            pathElem.charAt(0).toUpperCase() +
            pathElem.slice(1, pathElem.length).replace('-', ' ')
          );
      }
    }
  };

  const getUrlBreadcrumbList = () => {
    let urlStore = '';
    breadcrumbList.map((elem) => (urlStore = urlStore + '/' + elem));
    return urlStore;
  };

  useEffect(() => {
    if (!isEqual(location, currentLocation)) {
      setCurrentLocation(location);
    }
  }, [location]);

  useEffect(() => {
    if (
      breadcrumbList?.length > 0 &&
      getUrlBreadcrumbList() === urlCurrentLocation
    ) {
      setNavigationList(breadcrumbList);
    } else if (currentLocation && currentLocation?.length) {
      const newList: { label: string; url: string; link: boolean }[] = [];
      (currentLocation || []).map((elem: string, index: number) => {
        if (elem !== '') {
          if (
            currentLocation?.length > 3 &&
            index < currentLocation?.length - 1
          ) {
            newList.push({
              label: getLabelBreadcrumb(elem),
              url: createUrl(index),
              link:
                index !== 0 && index !== currentLocation?.length - 2
                  ? true
                  : false,
            });
          } else if (currentLocation?.length <= 3) {
            newList.push({
              label: getLabelBreadcrumb(elem),
              url: createUrl(index),
              link: index !== 0 && index !== currentLocation?.length -1 ? true : false,
            });
          }
        }
        setNavigationList(newList);
      });
    }
  }, [currentLocation, currentLocation?.length, idsBreadcrumb]);

  return (
    <Container className='mt-3 pl-0'>
      <BreadcrumbKit className='mt-4 pt-4'>
        {(navigationList || []).map((item, index) => (
          <BreadcrumbItem key={index} className='mb-2'>
            {item.link && item.url ? (
              <NavLink
                to={item.url}
                className='primary-color font-weight-semibold text-decoration-underline'
              >
                {item.label}
              </NavLink>
            ) : (
              <span
                className={clsx(index === 0 && 'font-weight-semibold pl-2')}
                style={{
                  borderLeft: index === 0 ? '4px solid #0073E5' : 'none',
                }}
              >
                {item.label}
              </span>
            )}
            {index < navigationList.length - 1 && (
              <span className='separator'>/</span>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbKit>
    </Container>
  );
};

export default Breadcrumb;
