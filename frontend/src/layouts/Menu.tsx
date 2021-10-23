import React from 'react';

import {Link, useLocation} from 'react-router-dom';

const Menu = () => {
    const location = useLocation();

    return (
        <nav className="header__menu">
            <ul className="navigation">
                {location.pathname !== '/' &&
                <li className="nav__item">
                    <Link to="/" className="nav__link">Распознавание</Link>
                </li>
                }
                {location.pathname !== '/tts' &&
                <li className="nav__item">
                    <Link to="/tts" className="nav__link">Синтез</Link>
                </li>
                }
                {location.pathname !== '/documentation' &&
                <li className="nav__item">
                    <Link to="/documentation" className="nav__link">Документация</Link>
                </li>
                }
            </ul>
        </nav>
    )
}

export default Menu;