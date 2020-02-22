const moveMenuBars = (menuSelector, menuOpenBtnSelector, activeClass) => {
    const menu = document.querySelector(menuSelector),
        menuCloseBtn = menu.querySelector('svg'),
        menuOpenBtn = document.querySelector(menuOpenBtnSelector);
    
    const toggleMenuClass = () => menu.classList.toggle(activeClass);

    menuCloseBtn.addEventListener('click', toggleMenuClass );
    menuOpenBtn.addEventListener('click', toggleMenuClass);
} 
moveMenuBars('.bars', '.header--menuBtn', 'bars_active')