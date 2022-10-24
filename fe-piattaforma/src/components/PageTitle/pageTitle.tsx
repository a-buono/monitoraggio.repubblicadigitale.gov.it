import React, { memo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Container, Icon } from 'design-react-kit';
import clsx from 'clsx';
import '../SectionInfo/sectionInfo.scss';
import './pageTitle.scss';
import SectionInfo from '../../components/SectionInfo/sectionInfo';

import { surveyBody } from '../SectionInfo/bodies';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';

interface BreadcrumbI {
  label?: string;
  url?: string;
}
export interface PageTitleI {
  breadcrumb?: BreadcrumbI[];
  title?: string;
  subtitle?: string;
  hasBackground?: boolean;
  sectionInfo?: boolean;
  alignTitle?: boolean;
  cta?:
    | {
        action: () => void;
        label: string;
      }
    | undefined;
  innerHTML?: boolean;
  HTMLsubtitle?: string;
  defaultOpen?: boolean;
}

const PageTitle: React.FC<PageTitleI> = (props) => {
  const {
    cta,
    hasBackground,
    title,
    subtitle,
    sectionInfo,
    alignTitle,
    innerHTML,
    HTMLsubtitle = '',
    defaultOpen = false,
  } = props;

  const [sectionInfoOpened, setSectionInfoOpened] = useState<boolean>(defaultOpen);
  const location = useLocation();
  const device = useAppSelector(selectDevice);

  const openSectionInfo = () => {
    setSectionInfoOpened((current) => !current);
  };

  const correctSectionTitle = () => {
    switch (location.pathname) {
      case '/area-amministrativa/questionari':
        return 'Come utilizzare la sezione questionari';
      default:
        return '';
    }
  };

  const correctSectionInfo = () => {
    switch (location.pathname) {
      case '/area-amministrativa/questionari':
        return surveyBody;
      default:
        return '';
    }
  };

  return (
    <div className={clsx('page-title', hasBackground && 'lightgrey-bg-a1')}>
      <Container className={clsx('mt-3 pl-0')}>
        <div
          className={clsx(
            'd-flex',
            'flex-row',
            'align-items-center',
            alignTitle ? 'justify-content-center' : null,
            device.mediaIsPhone && 'container'
          )}
        >
          {title && (
            <h1 className={clsx('h2', 'py-2', 'mb-2', 'primary-color-a9')}>
              {title}
            </h1>
          )}
          {sectionInfo ? (
            <Button
              onClick={() => {
                openSectionInfo();
              }}
            >
              <Icon
                color='primary'
                icon='it-info-circle'
                size='sm'
                aria-label='calendar'
              />
            </Button>
          ) : null}
        </div>
        {subtitle || innerHTML ? (
          <div
            className={clsx(
              'd-flex',
              !device.mediaIsDesktop ? 'flex-column' : 'flex-row',
              'align-items-center',
              alignTitle ? 'justify-content-center' : null,
              cta && 'justify-content-between'
            )}
          >
            {innerHTML ? (
              <div
                dangerouslySetInnerHTML={{ __html: HTMLsubtitle }}
                className='section-info-list'
              />
            ) : (
              <p className={clsx('py-2', 'mb-2')}>{subtitle}</p>
            )}
            {cta ? (
              <Button
                onClick={cta.action}
                color='primary'
                className={clsx(
                  'd-flex',
                  'flex-row',
                  'justify-content-around',
                  'align-items-center',
                  'mb-3'
                )}
              >
                <span className='text-nowrap pr-3'> {cta.label} </span>
                <Icon icon='it-external-link' color='white' size='sm' />
              </Button>
            ) : null}
          </div>
        ) : null}
        {sectionInfo && sectionInfoOpened ? (
          <SectionInfo
            title={correctSectionTitle()}
            body={correctSectionInfo()}
            open={sectionInfoOpened}
            setIsOpen={(value) => {
              setSectionInfoOpened(value);
            }}
          />
        ) : null}
      </Container>
    </div>
  );
};

export default memo(PageTitle);
