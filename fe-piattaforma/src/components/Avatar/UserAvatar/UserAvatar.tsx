import clsx from 'clsx';
import React from 'react';
import { selectDevice } from '../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../redux/hooks';
import AvatarInitials, {
  AvatarSizes,
  AvatarTextSizes,
} from '../AvatarInitials/avatarInitials';

interface UserAvatarI {
  avatarImage?: string | undefined;
  user?: {
    uName: string | undefined;
    uSurname: string | undefined;
  };
  lightColor?: boolean | undefined;
  size?: AvatarSizes;
  font?: AvatarTextSizes;
}

const UserAvatar: React.FC<UserAvatarI> = (props) => {
  const {
    avatarImage = '',
    size,
    user = { uName: '', uSurname: '' },
    /*  lightColor = false,
    font, */
  } = props;

  const device = useAppSelector(selectDevice);
  return (
    <div
      className={clsx(
        'rounded-circle',
        'd-flex',
        'align-items-center',
        'justify-content-center',
        'font-weight-light',
        `avatar-user-container__circle-width${size}`,
        'mr-2',
        avatarImage && 'border border-primary'
      )}
      style={{
        width: device.mediaIsDesktop ? '35px' : '53px',
        height: device.mediaIsDesktop ? '35px' : '53px',
      }}
    >
      {avatarImage ? (
        <img
          src={avatarImage}
          alt='avatar'
          className='avatar-user-container__avatar-image'
          style={{ borderRadius: '50%', width: '100%', height: '100%' }}
        />
      ) : (
        <AvatarInitials
          user={user}
          lightColor={device.mediaIsPhone}
          size={device.mediaIsPhone ? AvatarSizes.Big : AvatarSizes.Small}
          font={
            device.mediaIsPhone ? AvatarTextSizes.Big : AvatarTextSizes.Small
          }
        />
      )}
    </div>
  );
};

export default UserAvatar;