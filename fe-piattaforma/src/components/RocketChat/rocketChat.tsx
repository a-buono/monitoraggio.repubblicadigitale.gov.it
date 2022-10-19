import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RocketChatLogin } from '../../redux/features/user/userThunk';
import { getSessionValues, setSessionValues } from '../../utils/sessionHelper';

// RocketChat Docs https://developer.rocket.chat/rocket.chat/iframe-integration/iframe-events

const RocketChat = () => {
  const [rocketChatToken, setRocketChatToken] = useState<string>();
  const dispatch = useDispatch();

  const authenticateIFrame = () => {
    const target = document.getElementById('rcChannel');
    if (target) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      target.contentWindow.postMessage(
        {
          externalCommand: 'login-with-token',
          token: rocketChatToken,
        },
        '*'
      );
    }
  };

  useEffect(() => {
    if (rocketChatToken) {
      authenticateIFrame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rocketChatToken]);

  const manageNotification = (e: MessageEvent<any>) => {
    console.log('event name', e.data.eventName); // event name
    console.log('event data', e.data.data); // event data
  };

  const handleOnRocketChatLoad = () => {
    window.addEventListener('message', manageNotification);
  };

  const getRocketChatToken = async () => {
    try {
      const token = JSON.parse(getSessionValues('rocketchat'))?.token;
      if (token) {
        setRocketChatToken(token);
      } else {
        const res = await dispatch(RocketChatLogin());
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res) {
          console.log('getRocketChatToken res', res);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setRocketChatToken(res.data?.authToken);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setSessionValues('rocketchat', { token: res.data?.authToken });
        }
      }
    } catch (err) {
      console.log('getRocketChatToken error', err);
    }
  };

  useEffect(() => {
    getRocketChatToken();
    return () => {
      window.removeEventListener('message', manageNotification);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <iframe
        title='rocketchat'
        id='rcChannel'
        name='rcChannel'
        src={`${process.env.REACT_APP_ROCKET_CHAT_BASE_URL}?layout=embedded`}
        width='100%'
        height='400'
        onLoad={handleOnRocketChatLoad}
        frameBorder='0'
      ></iframe>
    </div>
  );
};

export default RocketChat;