import React from 'react';
import Menu from './Menu';
import LogoSvg from '../assets/logo.svg';
import MosLogoSvg from '../assets/mos_logo.svg';
import LeaderSvg from '../assets/newlogo.svg';

const Header = () => {
    return (
        <header className="header">
            <div className="header__wrapper">
                <div className="header__logo">
                    <a href="/" className="header__link">
                        <img className="header__img" src={LogoSvg} alt="logo"/>
                    </a>
                </div>
                <div className="header__logo">
                    <a href="https://www.mos.ru/" className="header__link">
                        <img className="header__img" src={MosLogoSvg} alt="logo"/>
                    </a>
                </div>
                <div className="header__logo">
                    <a href="https://leaders2021.innoagency.ru/" className="header__link">
                        <img className="header__img" src={LeaderSvg} alt="logo"/>
                    </a>
                </div>
                {/*<Menu />*/}
            </div>
        </header>
    )
}

export default Header;
