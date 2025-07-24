from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Начальные значения
data = {
    "balance": 0,
    "click_power": 1,
    "auto_clickers": 0,
    "auto_clicker_cost": 10,
    "total_clicks": 0,
    "achievements": []
}

@app.route('/')
def index():
    return render_template('index.html', **data)

@app.route('/click', methods=['POST'])
def handle_click():
    data["balance"] += data["click_power"]
    data["total_clicks"] += 1
    return jsonify(data)

@app.route('/buy_auto_clicker', methods=['POST'])
def buy_auto_clicker():
    if data["balance"] >= data["auto_clicker_cost"]:
        data["balance"] -= data["auto_clicker_cost"]
        data["auto_clickers"] += 1
        data["auto_clicker_cost"] = int(data["auto_clicker_cost"] * 1.5)
        return jsonify({"success": True, **data})
    return jsonify({"success": False})

if __name__ == '__main__':
    app.run(debug=True)