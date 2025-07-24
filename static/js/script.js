document.addEventListener('DOMContentLoaded', () => {
    // Элементы интерфейса
    const balanceElement = document.getElementById('balance');
    const clickPowerElement = document.getElementById('click-power');
    const clickPowerCostElement = document.getElementById('click-power-cost');
    const autoClickerCostElement = document.getElementById('auto-clicker-cost');
    const hamster = document.getElementById('hamster');
    const clickEffect = document.getElementById('click-effect');
    const offlineIncomeElement = document.getElementById('offline-amount');

    // Загрузка сохранённых данных
    let gameState = JSON.parse(localStorage.getItem('hamsterGame')) || {
        balance: 0,
        click_power: 1,
        click_power_cost: 50,
        auto_clickers: 0,
        auto_clicker_cost: 10,
        last_play_time: Date.now()
    };

    // Обновление интерфейса
    function updateUI() {
        balanceElement.textContent = gameState.balance.toFixed(2);
        clickPowerElement.textContent = gameState.click_power;
        clickPowerCostElement.textContent = gameState.click_power_cost;
        autoClickerCostElement.textContent = gameState.auto_clicker_cost;
        document.getElementById('click-value').textContent = gameState.click_power;
    }

    // Проверка оффлайн-дохода
    function checkOfflineIncome() {
        const now = Date.now();
        const offlineTime = Math.floor((now - gameState.last_play_time) / 1000);

        if (offlineTime > 0 && gameState.auto_clickers > 0) {
            const income = offlineTime * gameState.auto_clickers * 0.1;
            gameState.balance += income;
            offlineIncomeElement.textContent = income.toFixed(2);
            gameState.last_play_time = now;
            updateUI();
            saveGame();
        }
    }

    // Клик по хомяку
    hamster.addEventListener('click', () => {
        gameState.balance += gameState.click_power;
        gameState.last_play_time = Date.now();

        // Анимация клика
        clickEffect.style.display = 'block';
        clickEffect.style.animation = 'none';
        void clickEffect.offsetWidth;
        clickEffect.style.animation = 'clickEffect 0.5s';

        setTimeout(() => {
            clickEffect.style.display = 'none';
        }, 500);

        updateUI();
        saveGame();
    });

    // Покупка улучшений
    document.getElementById('buy-click-power').addEventListener('click', () => {
        if (gameState.balance >= gameState.click_power_cost) {
            gameState.balance -= gameState.click_power_cost;
            gameState.click_power += 1;
            gameState.click_power_cost = Math.floor(gameState.click_power_cost * 1.5);
            updateUI();
            saveGame();
        }
    });

    document.getElementById('buy-auto-clicker').addEventListener('click', () => {
        if (gameState.balance >= gameState.auto_clicker_cost) {
            gameState.balance -= gameState.auto_clicker_cost;
            gameState.auto_clickers += 1;
            gameState.auto_clicker_cost = Math.floor(gameState.auto_clicker_cost * 1.8);
            updateUI();
            saveGame();
        }
    });

    // Автокликер
    setInterval(() => {
        if (gameState.auto_clickers > 0) {
            gameState.balance += gameState.auto_clickers * 0.1;
            gameState.last_play_time = Date.now();
            updateUI();
            saveGame();
        }
    }, 1000);

    // Сохранение игры
    function saveGame() {
        localStorage.setItem('hamsterGame', JSON.stringify(gameState));
    }

    // Инициализация
    checkOfflineIncome();
    updateUI();
});