import React from 'react';
import { NavLink as NavReactDom, To, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface NavLinkI {
  onClick?: () => void;
  active?: boolean;
  to?: string;
}

const NavLink: React.FC<NavLinkI> = ({ onClick, children, active, to }) => {
  const navigate = useNavigate();

  return to && !onClick ? (
    <NavReactDom
      to={to as To}
      onKeyDown={() => navigate(to)}
      className={active ? 'nav-link active' : 'nav-link'}
    >
      {children}
    </NavReactDom>
  ) : (
    <div
      tabIndex={0}
      role='button'
      onKeyDown={onClick}
      onClick={onClick}
      className={clsx('nav-link-custom', 'nav-link', !active && 'active')}
    >
      {children}
    </div>
  );
};

export default NavLink;
