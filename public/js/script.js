var hexagon = Hexagon('#hexagon');

function init() {
    if (!location.hash) {
        location.hash = "title=Demo project&score=0,1,2,3,4,5";
    } else {
        onHashChange();
    }
    
    window.addEventListener('hashchange', onHashChange);
}

function onHashChange(e) {
    var hash = location.hash.replace('#', ''),
        hashObj = {},
        values = [];
    if (!hash) return;

    hashObj = hash.split('&').reduce((prev, item) => {
        return Object.assign({
			[item.split('=')[0]]: item.split('=')[1]
        }, prev);
    }, {});

    values = hashObj.score.split(',').map((v) => {
        return parseInt(v);
    });

    hexagon.setTitle(hashObj.title);
    hexagon.setScore(values);
    
    // only track user initiated hash change event
    if (e) ga('send', 'hashchange');
}

init();
