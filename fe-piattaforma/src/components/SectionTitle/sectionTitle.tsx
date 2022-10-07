import React, { useRef } from 'react';
import './sectionTitle.scss';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import clsx from 'clsx';
import {
  AvatarSizes,
  AvatarTextSizes,
} from '../Avatar/AvatarInitials/avatarInitials';
import StatusChip from '../StatusChip/statusChip';
import { Button, Icon } from 'design-react-kit';
import { useDispatch } from 'react-redux';
import { UploadUserPic } from '../../redux/features/user/userThunk';
import UserAvatar from '../Avatar/UserAvatar/UserAvatar';

interface SectionTitleI {
  title: string;
  status?: string | undefined;
  upperTitle?: {
    icon: string | any;
    text: string;
  };
  subTitle?: string;
  iconAvatar?: boolean;
  name?: string | undefined;
  surname?: string | undefined;
  isUserProfile?: boolean | string | undefined;
  enteIcon?: boolean;
  profilePicture?: string | undefined;
}

const SectionTitle: React.FC<SectionTitleI> = (props) => {
  const {
    title = '',
    status,
    upperTitle,
    subTitle,
    iconAvatar,
    name,
    surname,
    isUserProfile = false,
    enteIcon = false,
    profilePicture,
  } = props;

  const device = useAppSelector(selectDevice);
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null);
  const addProfilePicture = () => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };

  const updateImage = async () => {
    if (isUserProfile) {
      const input: HTMLInputElement = document.getElementById(
        'profile_pic'
      ) as HTMLInputElement;

      if (input.files?.length) {
        const selectedImage = input.files[0];
        await dispatch(UploadUserPic(selectedImage));
        // TODO reload is temporary
        window.location.reload();
        /*
        const reader = new FileReader();
        //reader.readAsBinaryString(selectedImage);
        reader.readAsDataURL(selectedImage);
        reader.onloadend = () => {
          console.log(reader);
          //return reader.result;
          dispatch(UploadUserPic(reader.result));
        };*/
      }
    }
  };

  return (
    <div className='d-flex w-100 flex-wrap'>
      {upperTitle ? (
        <div className='d-flex flex-row justify-content-center w-100'>
          <Icon
            icon={upperTitle.icon}
            size={'sm'}
            className={clsx('icon-color', enteIcon && 'ente-icon', 'mr-2')}
            aria-label='Sezione'
          />

          <p
            className={clsx(
              'h6',
              'custom-section-title__upper-text',
              'primary-color-a9',
              'text-uppercase'
            )}
          >
            {upperTitle.text}
          </p>
        </div>
      ) : null}

      <div
        className={clsx(
          'd-flex',
          'w-100',
          'justify-content-center',
          'align-items-center',
          device.mediaIsPhone && 'flex-column'
        )}
      >
        {iconAvatar && !device.mediaIsPhone ? (
          <div className={clsx('position-relative', 'ml-4')}>
            <UserAvatar
              avatarImage={profilePicture}
              user={{ uSurname: surname, uName: name }}
              size={device.mediaIsPhone ? AvatarSizes.Big : AvatarSizes.Small}
              font={
                device.mediaIsPhone
                  ? AvatarTextSizes.Big
                  : AvatarTextSizes.Small
              }
              lightColor={device.mediaIsPhone}
            />

            {isUserProfile && (
              <div
                className={clsx(
                  'camera-icon',
                  'primary-bg',
                  'position-absolute',
                  'rounded-circle',
                  'section-title__icon-container'
                )}
                style={{
                  bottom: device.mediaIsDesktop
                    ? '-10px'
                    : device.mediaIsPhone
                    ? '90px'
                    : '',
                  left: device.mediaIsDesktop
                    ? '-10px'
                    : device.mediaIsPhone
                    ? '75px'
                    : '',
                }}
              >
                <input
                  type='file'
                  id='profile_pic'
                  onChange={updateImage}
                  accept='.png, .jpeg, .jpg'
                  capture
                  ref={inputRef}
                  className='sr-only'
                />
                <Button
                  onClick={addProfilePicture}
                  size='xs'
                  className='profile-picture-btn'
                >
                  <Icon
                    size='xs'
                    icon='it-camera'
                    color='white'
                    aria-label='Foto'
                    className='position-absolute'
                    style={{
                      top: '4px',
                      left: '5px',
                    }}
                  />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className='placeholder-div'></div>
        )}
        <div
          style={{ minWidth: '150px', maxWidth: '350px' }}
          className='text-center mx-3'
        >
          <div
            className={clsx(
              'custom-section-title__section-title',
              'main-title',
              'primary-color-a9',
              'text-center',
              'd-block'
            )}
          >
            {/*  <span
              aria-level={1}
              className={clsx(
                'custom-section-title',
                'custom-section-title__section-title',
                'main-title',
                !iconAvatar && 'pl-5',
                !status && 'pr-5'
              )}
            > */}
            <p> {title} </p>
            {/* </span> */}
          </div>
        </div>
        {status ? (
          <div>
            <StatusChip
              className={clsx(
                'table-container__status-label',
                'primary-bg-a9',
                'ml-4',
                'section-chip',
                'no-border',
                device.mediaIsPhone ? 'mx-0 ml-2 my-3' : 'mx-3'
              )}
              status={status}
              rowTableId={name?.replace(/\s/g, '') || new Date().getTime()}
            />
          </div>
        ) : (
          <div className='placeholder-div'></div>
        )}
      </div>
      {subTitle ? (
        <div className='d-flex w-100 justify-content-center'>
          <p className='primary-color-a9 mb-0'> {subTitle} </p>
        </div>
      ) : null}
    </div>
  );
};

export default SectionTitle;
