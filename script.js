

const state = {
    coins: [],
    mainUrl: "https://api.coingecko.com/api/v3/coins/",
    checkedCoins: [],
    checkedCoinsCounter: 0,
    tempCheckedCoins: [],
    maxCoins: 5,
    API_REPORT: 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=',
    options: {
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Check your Report"
        },
        subtitles: [{
            text: ""
        }],
        axisX: {
            title: "States"
        },
        axisY: {
            title: "Price in USD",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC",
            includeZero: false
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: [{
            type: "spline",
            name: "USD",
            showInLegend: true,
            xValueFormatString: "DD MMM YYYY",
            dataPoints: []
        },
        {
            type: "spline",
            name: "USD",
            showInLegend: true,
            xValueFormatString: "MMM YYYY",
            dataPoints: []
        },
        {
            type: "spline",
            name: "USD",
            showInLegend: true,
            xValueFormatString: "MMM YYYY",
            dataPoints: []
        },
        {
            type: "spline",
            name: "USD",
            showInLegend: true,
            xValueFormatString: "MMM YYYY",
            dataPoints: []
        },
        {
            type: "spline",
            name: "USD",
            showInLegend: true,
            xValueFormatString: "MMM YYYY",
            dataPoints: []
        },
        ]
    },
    setIntervalId: null

}

const ELEMENTS = {
    $coinsBtn: $('#coins-btn'),
    $reportsBtn: $('#reports-btn'),
    $aboutBtn: $('#about-btn'),
    $coinsConteiner: $('#coins-container'),
    $progressBarContainer: $('#progress-bar'),
    $searchForm: $('#search-form'),
    $clean_search_btn: $('#clean_search'),
    $chartContainer: $('#chartContainer'),
    $checkedBtn: $('#checked-btn'),
    $show_all_btn: $('#show-all-btn'),
    $msgDiv: $('#msg-div'),
    $btn_div: $('#btn-div'),
    $search_input: $('#search-input'),
    $about_div: $('#about_div'),
    $headline: $('#headline'),

}

const id =

    main();
function main() {
    localStorage.clear()
    showMenu();
    ShowProgressBar();
    // onClickCoinsBtn();
    show_coins();
    ELEMENTS.$checkedBtn.on('click', onClickCheckedBtn);
    ELEMENTS.$show_all_btn.on('click', show_all_coins);
    ELEMENTS.$coinsBtn.on('click', onClickCoinsBtn);
    ELEMENTS.$reportsBtn.on('click', onClickReportBtn);
    ELEMENTS.$aboutBtn.on('click', onClickAboutBtn);
    ELEMENTS.$clean_search_btn.on('click', clean_search);
    ELEMENTS.$searchForm.on('submit', getInputFromUser);
}

function stopSetInterval() {
    const id = state.setIntervalId;
    if (!id) {
        return
    };
    clearInterval(id);
}

function onClickCheckedBtn() {
    console.log(state)
    stopSetInterval();
    const coins = state.checkedCoins;
    if (!coins.length > 0) {
        console.log(coins.length)
        const $msg = $(`<p>choose coins</p>`);
        ELEMENTS.$msgDiv.append($msg)
        return;
    }
    // create_show_all_buttom()
    ELEMENTS.$coinsConteiner.empty();
    coins.map(coin => {
        const $coinCard = createCoinCard(coin);
        const $checked = $($coinCard).find('input');
        $checked.prop('checked', true);
        ELEMENTS.$coinsConteiner.append($coinCard)
    })
    ELEMENTS.$show_all_btn.prop('hidden', false);

}

function show_all_coins() {
    ELEMENTS.$coinsConteiner.empty();
    ELEMENTS.$msgDiv.empty();
    const coins = state.coins;
    coins.map(coin => {
        const $coinCard = createCoinCard(coin);
        const $checked = $($coinCard).find('input');
        // $checked.prop('checked', true);
        ELEMENTS.$coinsConteiner.append($coinCard)

    })
    ELEMENTS.$show_all_btn.prop('hidden', true);

}



function ShowProgressBar() {
    const $progressBar = $(
        `
        <div class='ring'>
        LOADING
        <span id='span-ring'></span>
    </div>`
    );
    ELEMENTS.$progressBarContainer.append($progressBar)

}
// ---------------S--E--A--R--C--H----------------------

function getInputFromUser(e) {
    stopSetInterval();
    e.preventDefault();
    const form = e.target;
    const input = form.search.value.toString()
    searchCoin(input)

}

function clean_search() {
    ELEMENTS.$clean_search_btn.prop('hidden', true);
    ELEMENTS.$search_input.val('');
    ELEMENTS.$msgDiv.empty();
    main()

}

function searchCoin(input) {
    ELEMENTS.$clean_search_btn.prop('hidden', false);

    const coins = state.coins;
    const filteredCoinsArray = coins.filter(coin => coin.symbol === input);
    if (!filteredCoinsArray.length) {
        const $msg = $(`<p>coin is invalid</p>`);
        ELEMENTS.$msgDiv.append($msg)
        return;
    }


    const coin = filteredCoinsArray[0];
    const $coinCard = createCoinCard(coin);
    ELEMENTS.$coinsConteiner.empty();
    ELEMENTS.$coinsConteiner.append($coinCard);
}

// -------------------H--O--M--E----P--A--G--E-------------------

function showMenu() {
    $(document).ready(function () {
        $('.menu-icon').on('click', function () {
            $('nav ul').toggleClass('showing');
        });
    });
}

function show_coins() {
    console.log("show_coins")

    ELEMENTS.$chartContainer.hide();
    ELEMENTS.$coinsConteiner.show();
    ShowProgressBar();
    state.coins = [];
    // state.checkedCoins = [];
    state.checkedCoinsCounter = 0;
    $.ajax(`${state.mainUrl}list`, {

        method: 'GET',
        success: (data) => {
            const coins = data.map(extractCoinsFromApiData)
            state.coins = coins.slice(3, 50);
            console.log(data)
            renderCoins();

        }
    });

}
function onClickCoinsBtn() {
    ELEMENTS.$headline.prop('hidden', false);
    ELEMENTS.$about_div.prop('hidden', true);
    ELEMENTS.$msgDiv.empty();
    ELEMENTS.$chartContainer.hide();


    // ELEMENTS.$about_div.prop('hidden', true);
    ELEMENTS.$checkedBtn.prop('hidden', false);
    // ELEMENTS.$coinsConteiner.show();
    ELEMENTS.$coinsConteiner.prop('hidden', false);


    const json_state_from_LS = localStorage.getItem("state");
    const state_from_LS = JSON.parse(json_state_from_LS)
    console.log(state_from_LS)
    state.checkedCoins = state_from_LS.checkedCoins;
    state.checkedCoinsCounter = state_from_LS.checkedCoinsCounter;
    state.tempCheckedCoins = state_from_LS.tempCheckedCoins;



    stopSetInterval();
    ELEMENTS.$chartContainer.hide();
    ELEMENTS.$coinsConteiner.show();
    renderCoins();
    console.log(state)
}

function extractCoinsFromApiData(data) {
    const symbol = data.symbol;
    const name = data.name;
    const id = data.id;
    const checked = false;

    const coin = {
        id,
        name,
        symbol,
        checked
    };
    return coin;

}
// ----------------C--O--I--N--S---------------------
function renderCoins() {
    console.log('render coins', state)
    const coins = state.coins;
    ELEMENTS.$progressBarContainer.empty();
    ELEMENTS.$coinsConteiner.empty();
    coins.forEach(coin => {
        const $coinCard = createCoinCard(coin);
        ELEMENTS.$coinsConteiner.append($coinCard);
    })

}

function createCoinCard(coin) {
    const symbol = coin.symbol;
    const name = coin.name;
    const id = coin.id;
    const is_checked = coin.checked;
    let checked;
    if (is_checked) {
        checked = "checked"
    }
    if (!is_checked) {
        checked = ""
    };
    const $coinCard = document.createElement('div');
    $coinCard.classList.add(`coin-${id}`);
    $coinCard.innerHTML =
        `
     
        <input type="checkbox" data-toggle="toggle" class="checkbox" value="${id}" id="checkbox-${id}" ${checked} autocomplete = "off">
        <span class='coin-name' id="coin-name-${id}">${name}</span>
    <span class='coin-symbol'>${symbol}</span>
    <button class="more-info-btn" id="info-btn-${id}" type="button" data-toggle="collapse"
    data-target="#collapse-${id}" aria-expanded="false" aria-controls="collapseExample">
    MORE INFO
    </button>
    <div class="collapse" id="collapse-${id}">
    
    </div>
    
    `
    const $infoBtn = $($coinCard).find(`#info-btn-${id}`);
    $infoBtn.on('click', (e) => {
        getCoinInfo(id)
    });
    const $checkBtn = $($coinCard).find(`#checkbox-${id}`);
    $checkBtn.on('change', (e) => {
        console.log("coin is checked");
        limitCheckBoxSelection(e, id)
        const state_jason = JSON.stringify(state);
        console.log("the local storage is updated")
        localStorage.setItem("state", state_jason);
    })
    return $coinCard
}

function getCoinInfo(id) {
    $.ajax(`${state.mainUrl}${id}`, {
        method: 'GET',
        success: (data) => {
            state.coins.forEach(coin => {
                if (coin.id === id) {
                    coin.image = data.image.small;
                    coin.priceUSD = data.market_data.current_price.usd;
                    coin.priceEUR = data.market_data.current_price.eur;
                    coin.priceILS = data.market_data.current_price.ils;
                    if (!coin.priceUSD) {
                        coin.priceUSD = 'no rate in'
                    };
                    if (!coin.priceEUR) {
                        coin.priceEUR = 'no rate in'
                    };
                    if (!coin.priceILS) {
                        coin.priceILS = 'no rate in'
                    };
                    const $coinCardbyId = $(`#collapse-${id}`);
                    $coinCardbyId.empty();
                    const $moreInfo = $(`
                    <div class="more-info">   
                         <p id="usd-${id}"> ${coin.priceUSD} &#36;</p>
                         <p id="eur-${id}"> ${coin.priceEUR} &#128;</p>
                         <p id="ils-${id}"> ${coin.priceILS} &#8362;</p>
                    </div>
                    `);
                    $coinCardbyId.append($moreInfo)
                }
            })
        }
    })
}

function limitCheckBoxSelection(e, id) {
    const checked = e.target;
    ELEMENTS.$msgDiv.empty();
    if ($(checked).is(':checked')) {
        if (state.checkedCoinsCounter >= state.maxCoins) {
            $(checked).prop('checked', false);
            showModal();
            return
        }
        if (state.checkedCoinsCounter < state.maxCoins) {
            state.checkedCoinsCounter++,
                state.coins.map(coin => {
                    if (coin.id === id) {
                        coin.checked = true;
                        state.checkedCoins.push(coin)
                    }
                })
            return

        }
    }
    else {
        const coin = state.coins.map(coin => {
            if (coin.id === id) {
                return coin
            }
        })
        const index = state.checkedCoins.indexOf(coin);
        state.checkedCoins.splice(index, 1);
        state.coins.map(coin => {
            if (coin.id === coin.id) {
                coin.checked = false
            }
        })
        state.checkedCoinsCounter--
    }
}
// -------------------M--O--D--A--L--------------------------
function showModal() {
    const $modal = createModal();
    $modal.modal();
}

function createModal() {
    const checkedCoins = []
    state.coins.map(coin => {
        if (coin.checked) {
            checkedCoins.push(coin);
        }
    })
    state.tempCheckedCoins = checkedCoins;
    const tempCoins = state.coins;
    const $modal = $(`
    <div class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">you may choose only 5 coins</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div> 
        <form id="modalForm">
          <div class="modal-body">
           
          </div>
          <div class="modal-footer">
            <button type="button" id="modalCloseBtn" data-dismiss="modal">Close</button>
            <button type="button" id="modalSaveBtn" class="btn btn-primary" data-dismiss="modal">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
 `)
    const $modalBody = $modal.find('.modal-body');
    state.checkedCoins.map(coin => {
        const checkedCoinsComponent = createCheckedCoinsComponent(coin);
        $modalBody.append(checkedCoinsComponent);
    })
    const $saveBtn = $modal.find('#modalSaveBtn');
    $saveBtn.on('click', () => {
        saveChanges()
    });
    const $closeBtn = $modal.find('#modalCloseBtn');
    $closeBtn.on('click', () => {
        state.checkedCoins = state.tempCheckedCoins;
        state.checkedCoinsCounter = state.maxCoins;
        state.coins = tempCoins;
    })
    return $modal
}

function saveChanges() {
    renderCoins();


}

function createCheckedCoinsComponent(coin) {
    const $innerModal = $(
        `
        <div>
        <input id="checkbox-${coin.id}" data-coinid="${coin.id}" type="checkbox" name="coinName2" autocomplete = "off" >${coin.name}<br>
        </div>
        `
    );
    const $checked = $innerModal.find('input');
    $checked.prop('checked', true);
    $checked.on('change', (e) => {
        e.preventDefault();
        const checked = $(e.target);
        const uncheckedCoin = coin.id
        if (!($(checked).is(':checked'))) {
            state.coins.map(coin => {
                if (coin.id === uncheckedCoin) {
                    coin.checked = false;
                    state.checkedCoinsCounter--;
                    const index = state.checkedCoins.indexOf(coin);
                    state.checkedCoins.splice(index, 1);
                    const state_jason = JSON.stringify(state);
                    console.log("the local storage is updated")
                    localStorage.setItem("state", state_jason);
                }
            })
            console.log(state)
            const state_jason = JSON.stringify(state);
            console.log("the local storage is updated")
            localStorage.setItem("state", state_jason);
        }
    })
    return $innerModal
}

// -----------R--E--P--O--R--T--S------------------------

function getPriceFromApi() {
    ELEMENTS.$show_all_btn.prop('hidden', true);
    ELEMENTS.$checkedBtn.prop('hidden', true);

    const coins = state.checkedCoins;
    const url = getURL();
    $.ajax(`${url}`, {
        method: 'GET',
        success: (data) => {
            renderReport(data)
        }
    })
}


function getURL() {
    let API = state.API_REPORT
    state.checkedCoins.forEach(coin => API += (coin.symbol + ","));
    API += "&tsyms=USD";
    return API
};

function onClickReportBtn() {

    stopSetInterval()
    ELEMENTS.$about_div.prop('hidden', true);

    ELEMENTS.$msgDiv.empty();
    ELEMENTS.$coinsConteiner.prop('hidden', true);
    if (!state.checkedCoins.length) {
        const $msg = $(`<p>pls choose at least one coin</p>`);
        ELEMENTS.$msgDiv.append($msg);
        return;
    }
    onClickCheckedBtn();
    ELEMENTS.$chartContainer.show();
    ShowProgressBar();
    const dataPonts = state.options.data;
    dataPonts.map(data => {
        data.dataPoints = [];
    })

    getPriceFromApi();
    const idSetInerval = setInterval(getPriceFromApi, 2000);
    state.setIntervalId = idSetInerval;
};

function addDataToReport(point, i) {
    state.options.data[i].dataPoints.push(point);
    state.options.data[i].name = state.checkedCoins[i].name
}


function renderReport(data) {
    ELEMENTS.$progressBarContainer.empty();
    coins = state.checkedCoins;

    const arrayFromData = Object.values(data);
    const newArr = arrayFromData.map((price, i) => {
        const usd = price.USD;
        const point = { x: new Date(), y: usd };
        addDataToReport(point, i)
    })
    ELEMENTS.$chartContainer.show();
    $("#chartContainer").CanvasJSChart(state.options);
}

function toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    } else {
        e.dataSeries.visible = true;
    }
    e.chart.render();
}

// -----------A--B--O--U--T--------------------------
function onClickAboutBtn() {
    stopSetInterval();
    ELEMENTS.$checkedBtn.prop('hidden', true);
    ELEMENTS.$about_div.prop('hidden', false);
    ELEMENTS.$headline.prop('hidden', true);
    // ELEMENTS.$headline.prop('hidden', true);
    ELEMENTS.$chartContainer.hide();
    ELEMENTS.$coinsConteiner.prop('hidden', true);

    // const $about = $(`
    // <div class='about'>
    //     <h2>
    //         קטיה קוזירובסקי

    //     </h2>
    //     <p class='aboutp'>
    //         עולם הסחר הוירטואלי הפך להיות מאוד פופולארי בשנים האחרונות

    //     </p>
    //     <p class='aboutp'>
    //         להלן אפליקציה המאפשרת קבלת מידע עבור מחירי מטבעות וירטואליות ומעקב אחרי המחירים בזמן אמת
    //     </p>
    //     <img id="pic" src="img/20140504_093145.jpg" />
    // </div>

    // `);

    // ELEMENTS.$about_div.append($about)

}




