from flask import Flask, render_template, jsonify, request
import time

app = Flask(__name__)


# Инициализация данных
def init_game_data():
    return {
        "balance": 0.0,  # Используем float для денег
        "click_power": 1,
        "click_power_cost": 50,
        "auto_clickers": 0,
        "auto_clicker_cost": 10,
        "last_play_time": int(time.time()),
        "total_clicks": 0
    }


game_data = init_game_data()


@app.route('/')
def index():
    return render_template('index.html', **game_data)


@app.route('/click', methods=['POST'])
def handle_click():
    game_data["balance"] = round(game_data["balance"] + game_data["click_power"], 2)
    game_data["total_clicks"] += 1
    game_data["last_play_time"] = int(time.time())
    return jsonify(game_data)


@app.route('/upgrade', methods=['POST'])
def upgrade():
    upgrade_type = request.json.get('type')

    if upgrade_type == 'click_power' and game_data["balance"] >= game_data["click_power_cost"]:
        game_data["balance"] -= game_data["click_power_cost"]
        game_data["click_power"] += 1
        game_data["click_power_cost"] = int(game_data["click_power_cost"] * 1.5)
        return jsonify({"success": True, **game_data})

    elif upgrade_type == 'auto_clicker' and game_data["balance"] >= game_data["auto_clicker_cost"]:
        game_data["balance"] -= game_data["auto_clicker_cost"]
        game_data["auto_clickers"] += 1
        game_data["auto_clicker_cost"] = int(game_data["auto_clicker_cost"] * 1.8)
        return jsonify({"success": True, **game_data})

    return jsonify({"success": False})


@app.route('/offline_income', methods=['POST'])
def offline_income():
    offline_seconds = max(0, int(time.time()) - game_data["last_play_time"])
    income = round(offline_seconds * game_data["auto_clickers"] * 0.1, 2)
    game_data["balance"] += income
    game_data["last_play_time"] = int(time.time())
    return jsonify({"income": income, **game_data})


if __name__ == '__main__':
    app.run(debug=True)