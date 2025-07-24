document.addEventListener('DOMContentLoaded', () => {
    // Элементы
    const hamster = document.getElementById('hamster');
    const clickEffect = document.getElementById('click-effect');
    const balanceDisplay = document.getElementById('balance');
    const clickPowerDisplay = document.getElementById('click-power');
    const autoClickersDisplay = document.getElementById('auto-clickers');
    const autoClickerCostDisplay = document.getElementById('auto-clicker-cost');
    const buyAutoClickerBtn = document.getElementById('buy-auto-clicker');
    const achievementsList = document.getElementById('achievements-list');

    // Звуки
    const clickSound = document.getElementById('click-sound');
    const buySound = document.getElementById('buy-sound');

    // Загрузка из localStorage
    let gameData = JSON.parse(localStorage.getItem('hamsterClickerData')) || {
        balance: 0,
        clickPower: 1,
        autoClickers: 0,
        autoClickerCost: 10,
        totalClicks: 0,
        achievements: []
    };

    // Обновление интерфейса
    function updateUI() {
        balanceDisplay.textContent = gameData.balance;
        clickPowerDisplay.textContent = gameData.clickPower;
        autoClickersDisplay.textContent = gameData.autoClickers;
        autoClickerCostDisplay.textContent = gameData.autoClickerCost;
        buyAutoClickerBtn.textContent = `Купить автокликер (${gameData.autoClickerCost} $)`;

        // Проверка достижений
        checkAchievements();
    }

    // Клик по хомяку
    hamster.addEventListener('click', () => {
        gameData.balance += gameData.clickPower;
        gameData.totalClicks += 1;
        clickSound.currentTime = 0;
        clickSound.play();

        // Эффект клика
        clickEffect.textContent = `+${gameData.clickPower}`;
        clickEffect.style.animation = 'none';
        void clickEffect.offsetWidth;
        clickEffect.style.animation = 'float-up 1s ease-out';

        updateUI();
        saveGame();
    });

    // Покупка автокликера
    buyAutoClickerBtn.addEventListener('click', () => {
        if (gameData.balance >= gameData.autoClickerCost) {
            gameData.balance -= gameData.autoClickerCost;
            gameData.autoClickers += 1;
            gameData.autoClickerCost = Math.floor(gameData.autoClickerCost * 1.5);
            buySound.currentTime = 0;
            buySound.play();
            updateUI();
            saveGame();
        }
    });

    // Автокликер
    setInterval(() => {
        if (gameData.autoClickers > 0) {
            gameData.balance += gameData.autoClickers;
            updateUI();
            saveGame();
        }
    }, 1000);

    // Достижения
    function checkAchievements() {
        const achievements = [
            { id: 'click_10', name: 'Новичок', condition: () => gameData.totalClicks >= 10 },
            { id: 'click_100', name: 'Профи', condition: () => gameData.totalClicks >= 100 },
            { id: 'balance_100', name: 'Богач', condition: () => gameData.balance >= 100 },
            { id: 'auto_5', name: 'Автомагнат', condition: () => gameData.autoClickers >= 5 }
        ];

        achievements.forEach(ach => {
            if (ach.condition() && !gameData.achievements.includes(ach.id)) {
                gameData.achievements.push(ach.id);
                const li = document.createElement('li');
                li.textContent = ach.name;
                achievementsList.appendChild(li);
            }
        });
    }

    // Сохранение игры
    function saveGame() {
        localStorage.setItem('hamsterClickerData', JSON.stringify(gameData));
    }

    // Загрузка при старте
    updateUI();
});