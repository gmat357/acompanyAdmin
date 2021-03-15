exports.nav = ()=>{
    var template = `
    <nav class="menu_container">
        <ul>
            <li>
                <a href="/">
                    <img src="../public/img/nav/consulting.png" alt="메뉴이미지">
                </a>    
            </li>
            <li>
                <a href="/slide">
                    <img src="../public/img/nav/slide.png" alt="메뉴이미지">
                </a>    
            </li>
            <li>
                <a href="/link">
                    <img src="../public/img/nav/link.png" alt="메뉴이미지">
                </a>    
            </li>
            <li>
                <a href="/price">
                    <img src="../public/img/nav/price.png" alt="메뉴이미지">
                </a>    
            </li>
        </ul>
    </nav>
    `
    return template;
}