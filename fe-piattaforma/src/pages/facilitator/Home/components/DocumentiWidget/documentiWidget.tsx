import clsx from 'clsx';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CardDocument from '../../../../../components/CardDocument/cardDocument';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import '../../../../../pages/facilitator/Home/components/BachecaDigitaleWidget/bachecaDigitaleWidget.scss';
import { GetDocumentsList } from '../../../../../redux/features/forum/forumThunk';
import Slider, {
  formatSlides,
} from '../../../../../components/General/Slider/Slider';
import { getMediaQueryDevice } from '../../../../../utils/common';

const docsPagination = {
  desktop: 4,
  mobile: 1,
  tablet: 2,
};

const carouselPagination = {
  desktop: 4,
  mobile: 1,
  tablet: 2,
};

const DocumentsWidget = () => {
  const dispatch = useDispatch();
  const device = useAppSelector(selectDevice);
  const [docsList, setDocsList] = useState([]);

  const docsWidgetSet = async () => {
    const itemsPerPage = docsPagination.desktop.toString();
    const res = await dispatch(
      GetDocumentsList(
        {
          page: [{ label: '0', value: '0' }],
          items_per_page: [{ label: itemsPerPage, value: itemsPerPage }],
        },
        false
      )
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setDocsList(res?.data?.data?.items || []);
  };

  useEffect(() => {
    docsWidgetSet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardArray: any[] = [
    docsList.slice(0, docsPagination[getMediaQueryDevice(device)]),
  ];

  return (
    <div
      className={clsx('d-flex', 'py-5', !device.mediaIsDesktop && 'flex-wrap')}
    >
      <div className={clsx(device.mediaIsDesktop ? 'col-4' : 'col-12')}>
        <h2 className='h3 text-primary'>Documenti</h2>

        {device.mediaIsPhone && <div className='title-border-box my-3' />}
        {device.mediaIsPhone ? (
          <p className='text-primary pb-3'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            ipsum velit, tempor at luctus quis.
          </p>
        ) : (
          <p className='text-primary py-3'>
            <b>Lorem ipsum dolor</b> sit amet, consectetur adipiscing elit.
            Nullam ipsum velit, tempor at luctus quis, congue eget justo.
            Quisque auctor massa non dapibus varius.
          </p>
        )}
        {device.mediaIsDesktop && (
          <div>
            <p
              className={clsx(
                'text-primary',
                'py-3',
                !device.mediaIsPhone ? 'mb-4' : 'mb-3'
              )}
            >
              Donec rutrum <b>ipsum in vestibulum tempus</b>. Quisque ac
              lobortis mi. Mauris dapibus rhoncus luctus. Mauris sit amet
              pretium nibh, dictum interdum purus.
            </p>
            <a role='button' className='btn btn-primary' href='/documenti'>
              Accedi alla sezione
            </a>
          </div>
        )}
      </div>
      <div className={clsx(device.mediaIsDesktop ? 'col-8' : 'col-12')}>
        <div className='container d-flex flex-wrap'>
          {!device.mediaIsPhone ? (
            cardArray.map((el: any, i: number) => (
              <div key={`slide-${i}`} className='row'>
                {el.map((e: any, index: any) => (
                  <div
                    key={`card-${i}-${index}`}
                    className={clsx(
                      'col-12',
                      'col-md-6',
                      'col-lg-6',
                      'mb-2',
                      'd-flex',
                      'flex-wrap',
                      el.length === 1
                        ? 'justify-content-between'
                        : 'justify-content-around'
                    )}
                  >
                    <CardDocument {...e} isHome />
                  </div>
                ))}
              </div>
            ))
          ) : (
            <Slider isItemsHome>
              {formatSlides(
                docsList.slice(0, docsPagination[getMediaQueryDevice(device)]),
                carouselPagination[getMediaQueryDevice(device)]
              ).map((el, i) => (
                <div
                  key={`slide-${i}`}
                  className='d-flex flex-wrap justify-content-between w-100'
                >
                  {el.map((e: any, index: any) => (
                    <div
                      key={`card-${i}-${index}`}
                      className='flex-grow-0 my-2'
                    >
                      <CardDocument {...e} isHome />
                    </div>
                  ))}
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
      {!device.mediaIsDesktop && (
        <div className='d-flex justify-content-center mt-5 w-100'>
          <a role='button' className='btn btn-primary' href='/documenti'>
            Accedi alla sezione
          </a>
        </div>
      )}
    </div>
  );
};

export default memo(DocumentsWidget);
