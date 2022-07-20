import React from 'react';
import GenericModal from '../../../../../components/Modals/GenericModal/genericModal';
import { Icon } from 'design-react-kit';
import { useAppSelector } from '../../../../../redux/hooks';
import { selectModalPayload } from '../../../../../redux/features/modal/modalSlice';

const id = 'delete-authority';

interface DeleteAuthorityModalI {
  onConfirm: (id: string) => void;
  onClose: () => void;
  text: string;
}

const DeleteAuthorityModal = ({
  text,
  onClose,
  onConfirm,
}: DeleteAuthorityModalI) => {
  const payload = useAppSelector(selectModalPayload);

  return (
    <GenericModal
      id={id}
      primaryCTA={{
        label: 'Conferma',
        onClick: () => onConfirm(payload?.authorityId),
      }}
      secondaryCTA={{
        label: 'Annulla',
        onClick: onClose,
      }}
      centerButtons
      onClose={onClose}
    >
      <div className='d-flex flex-column justify-content-center'>
        <div className='d-flex justify-content-center mb-4'>
          <Icon
            icon='it-error'
            style={{ width: '111px', height: '111px', fill: '#FF9900' }}
            aria-label='Errore'
          />
        </div>
        <div className='text-center'>{text}</div>
      </div>
    </GenericModal>
  );
};

export default DeleteAuthorityModal;