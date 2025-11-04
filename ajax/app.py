from flask import Flask, jsonify, render_template

app = Flask(__name__)

# 学生数据
students = {
    'S1': {'name': '张三', 'age': 18, 'grade': '高三', 'class': '1班'},
    'S2': {'name': '李四', 'age': 17, 'grade': '高二', 'class': '2班'},
    'S3': {'name': '王五', 'age': 18, 'grade': '高三', 'class': '3班'},
    'S4': {'name': '赵六', 'age': 17, 'grade': '高二', 'class': '4班'},
    'S5': {'name': '赵七', 'age': 17, 'grade': '高二', 'class': '4班'}
}

@app.route('/')
def index():
    return render_template('try.html')

@app.route('/students')
def get_students():
    return jsonify(students)


if __name__ == '__main__':
    app.run(debug=True)
