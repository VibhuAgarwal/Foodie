import React from 'react';
import logoimg from '../assets/logo.jpg'

export default function Header() {
    return (
        <header id='main-header'>
            <div id='title'>
                <img src={logoimg} alt="A restaurant" id='img' />
                <h1>FoodApp</h1>
            </div>
            <nav>
                <button>Cart (0)</button>
            </nav>
        </header>
    )
}
