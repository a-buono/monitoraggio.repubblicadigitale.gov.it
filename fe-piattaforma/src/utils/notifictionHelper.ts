import store from '../redux/store';
import { NotifyI } from '../redux/features/notification/notificationSlice';
import { NewNotify } from '../redux/features/notification/notificationThunk';

export const dispatchNotify = (notify?: NotifyI) => {
  store.dispatch(NewNotify(notify) as any);
};

const getErrorMessage = ({ response }: any) => {
  console.log('response', response);
  switch (response?.status) {
    // TODO map here all error codes
    case 400:
      return 'Errore 400';
    case 500:
      return 'Errore 500';
    default:
      return 'Si è verificato un errore';
  }
};

export const errorHandler = (error: unknown) => {
  console.log('error', error);
  if (error instanceof TypeError) {
    // statements to handle TypeError exceptions
    console.log(1);
  } else if (error instanceof RangeError) {
    // statements to handle RangeError exceptions
    console.log(2);
  } else if (error instanceof EvalError) {
    // statements to handle EvalError exceptions
    console.log(3);
  } else {
    // statements to handle any unspecified exceptions
    console.log(4);
    dispatchNotify({
      status: 'error',
      message: getErrorMessage(error),
    });
  }
};
