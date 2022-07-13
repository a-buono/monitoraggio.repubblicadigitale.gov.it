import clsx from 'clsx';
import { CardProps, CardText, CardTitle, Icon } from 'design-react-kit';
import React, { memo } from 'react';

import { selectDevice } from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import AvatarInitials, {
  AvatarSizes,
  AvatarTextSizes,
} from '../AvatarInitials/avatarInitials';
import './cardProfile.scss';
import { UserStateI } from '../../redux/features/user/userSlice';

interface CardProfileI extends CardProps {
  className?: string;
  activeProfile?: boolean;
  user: UserStateI['user'];
  profile?: any;
}

const CardProfile: React.FC<CardProfileI> = (props) => {
  const {
    className, activeProfile, user = {}, profile = {}
  } = props;

  const device = useAppSelector(selectDevice);

  return (
    <div
      className={clsx(
        className,
        activeProfile && 'primary-bg-b1',
        !activeProfile && 'primary-bg-white',
        'card-profile-container',
        'justify-content-center',
        'mb-3'
      )}
    >
      <div
        className={clsx(
          'ml-2',
          'bg-white',
          'px-2',
          'py-3',
          'h-100',
          'd-flex',
          'flex-row',
          'align-items-center',
          'justify-content-between',
          'card-profile-container__white-card'
        )}
      >
        <div
          className={clsx('d-flex', 'flex-row', 'align-items-center', 'pl-2')}
        >
          {activeProfile ? (
            <div
              className={clsx(
                'card-profile-container__icon',
                'mr-2',
                !activeProfile && 'card-profile-container__opacity'
              )}
            >
              <AvatarInitials
                user={{ uName: user?.nome, uSurname: user?.cognome }}
                size={device.mediaIsPhone ? AvatarSizes.Big : AvatarSizes.Small}
                font={
                  device.mediaIsPhone
                    ? AvatarTextSizes.Big
                    : AvatarTextSizes.Small
                }
                lightColor={device.mediaIsPhone}
              />
            </div>
          ) : null}
          <div>
            <CardTitle className='mb-1 primary-color-a12'>
              <span>
                <strong>
                  {profile?.descrizioneRuolo}
                  {profile?.nomeEnte ? (
                    <>
                      &nbsp;&ldquo;<i>{profile?.nomeEnte}</i>&ldquo;
                    </>
                  ) : null}
                </strong>
              </span>
            </CardTitle>
            <CardText
              className={clsx(
                activeProfile && 'primary-color-a12',
                !activeProfile && 'neutral-2-color-a3'
              )}
            >
              {profile?.nomeProgramma}
            </CardText>
          </div>
        </div>
        {activeProfile && (
          <div className='d-flex justify-content-between align-content-center'>
            <Icon
              color='primary'
              icon='it-check'
              size=''
              aria-label='Profilo selezionato'
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CardProfile);
