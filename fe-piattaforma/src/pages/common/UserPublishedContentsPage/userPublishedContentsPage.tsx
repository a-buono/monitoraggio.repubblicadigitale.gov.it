import clsx from 'clsx';
import { Container } from 'design-react-kit';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Accordion, CardCommunity, EmptySection } from '../../../components';
import CardDocument from '../../../components/CardDocument/cardDocument';
import CardShowcase from '../../../components/CardShowcase/cardShowcase';
import PageTitle from '../../../components/PageTitle/pageTitle';
import { selectDevice } from '../../../redux/features/app/appSlice';
import {
  selectDocsList,
  selectNewsList,
  selectTopicsList,
} from '../../../redux/features/forum/forumSlice';
import { GetItemsByUser } from '../../../redux/features/forum/forumThunk';
import { useAppSelector } from '../../../redux/hooks';
import '../HomeSearch/homeSearch.scss';

const PageTitleMock = {
  title: 'I miei contenuti pubblicati',
};

const UserPublishedContentsPage = () => {
  const dispatch = useDispatch();
  const device = useAppSelector(selectDevice);
  const newsList = useAppSelector(selectNewsList);
  const topicsList = useAppSelector(selectTopicsList);
  const docsList = useAppSelector(selectDocsList);

  useEffect(() => {
    dispatch(GetItemsByUser('userId'));
  }, []);

  return (
    <div>
      <div className={clsx(device.mediaIsPhone && 'pl-4')}>
        <PageTitle {...PageTitleMock} />
      </div>
      <Container className='mb-5'>
        <Accordion title='Bacheca' totElem={newsList.length}>
          <div className='row'>
            {newsList.length ? (
              newsList.map((showCaseElement, i) => (
                <div
                  key={i}
                  className={clsx(
                    'col-12',
                    'col-md-6',
                    'col-lg-4',
                    'my-2',
                    'align-cards'
                  )}
                >
                  <CardShowcase {...showCaseElement} />
                </div>
              ))
            ) : (
              <EmptySection title='Non ci sono news' />
            )}
          </div>
        </Accordion>
        <Accordion title='Community' totElem={topicsList.length}>
          <div className='row'>
            {topicsList.length ? (
              topicsList.map((communityElement, i) => (
                <div
                  key={i}
                  className={clsx(
                    'col-12',
                    'col-md-6',
                    'col-lg-4',
                    'my-2',
                    'align-cards'
                  )}
                >
                  <CardCommunity {...communityElement} />
                </div>
              ))
            ) : (
              <EmptySection title='Non ci sono topic' />
            )}
          </div>
        </Accordion>
        <Accordion title='Documenti' totElem={docsList.length}>
          <div className='row'>
            {docsList.length ? (
              docsList.map((doc, i) => (
                <div
                  key={i}
                  className={clsx(
                    'col-12',
                    'col-md-6',
                    'col-lg-4',
                    'my-2',
                    'align-cards'
                  )}
                >
                  <CardDocument {...doc} />
                </div>
              ))
            ) : (
              <EmptySection title='Non ci sono documenti' />
            )}
          </div>
        </Accordion>
      </Container>
    </div>
  );
};

export default UserPublishedContentsPage;
