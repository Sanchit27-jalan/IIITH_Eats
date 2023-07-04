from flask import Flask, jsonify,json,request
import sqlite3
from flask_cors import CORS
app = Flask(__name__)


CORS(app,supports_credentials=True)

@app.route('/endpoint', methods=['POST'])
def endpoint():
    data = request.get_json()
    dish = data['dish']
    price = data['price']
    count=1
    conn = sqlite3.connect('hack.db')
    cursor = conn.cursor()
    py=""
    for i in price:
        if('0'<=i<='9'):
            py=py+i
    price=int(py)
    cursor.execute(f"SELECT * FROM orders WHERE item='{dish}'")
    rows = cursor.fetchall()
    if len(rows) > 0:
        cursor.execute(f"Update orders set count=count+1 where item='{dish}';")
        conn.commit()
        conn.close()
        response = jsonify({'status': 'updated'})
        return response
    else:
        cursor.execute(f"INSERT INTO orders (item, price, count) VALUES ('{dish}', '{price}', '{count}')")
        conn.commit()
        conn.close()
        response = jsonify({'status': 'success'})
        return response
@app.route('/remove',methods=['POST'])
def remove():
    data = request.get_json()
    dish = data['dish']
    conn = sqlite3.connect('hack.db')
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM orders WHERE item='{dish}'")
    rows = cursor.fetchall()
    if len(rows) > 0:
        cursor.execute(f"Update orders set count=count-1 where item='{dish}';")
        cursor.execute(f"SELECT count FROM orders WHERE item='{dish}'")
        r=cursor.fetchall()
        if(r[0][0]==0):
            cursor.execute(f"DELETE FROM orders WHERE item='{dish}'")
        conn.commit()
        conn.close()
        response = jsonify({'status': 'decreased'})
        return response
    else:
        response = jsonify({'status': 'this dish is not there'})
        return response

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    name=data['Name']
    c_no=data['number']
    canteen=data['canteen']
    conn = sqlite3.connect('hack.db')
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM orders")
    rows = cursor.fetchall()
    for i in (rows):
        cursor.execute(f"INSERT INTO submit (canteen,name,number,item, price, count) VALUES ('{canteen}','{name}','{c_no}','{i[0]}', '{i[1]}', '{i[2]}')")
    cursor.execute("DELETE FROM orders")
    conn.commit()
    conn.close()
    response = jsonify({'status': 'submitted'})
    return response

@app.route('/rider', methods=['POST'])
def rider():
    data = request.get_json()
    name=data['Name']
    c_no=data['number']
    count=0
    conn = sqlite3.connect('hack.db')
    cursor = conn.cursor()
    cursor.execute(f"SELECT name FROM rider where name='{name}' and number='{c_no}'")
    rows = cursor.fetchall()
    if len(rows)>0:
        cursor.execute(f"SELECT delivery_count FROM rider where name='{name}' and number='{c_no}'")
        r=cursor.fetchall()
        ct=r[0][0]
        cursor.execute(f"DELETE from rider where name='{name}'")
        cursor.execute(f"INSERT INTO rider (name,number,delivery_count) VALUES ('{name}','{c_no}','{ct}')")
        conn.commit()
        conn.close()
    else:
        cursor.execute(f"INSERT INTO rider (name,number,delivery_count) VALUES ('{name}','{c_no}','{count}')")
        conn.commit()
        conn.close()
    response = jsonify({'status': 'submitted'})
    return response
@app.route('/cart')
def cart():
    conn = sqlite3.connect('hack.db')
    cursor = conn.cursor()
    cursor.execute("SELECT item, count FROM orders")
    rows = cursor.fetchall()
    data = [{'item': row[0], 'count': row[1]} for row in rows]
    return jsonify(data)

    

@app.route('/display')
def displayorder():
    conn = sqlite3.connect('hack.db')
    cursor = conn.cursor()
    cursor.execute('SELECT DISTINCT canteen,name, number FROM submit')
    data = cursor.fetchall()

    json_list = []
    for row in data:
        canteen=row[0]
        name = row[1]
        number = row[2]

        cursor.execute('SELECT item, price, count FROM submit WHERE name = ? AND number = ?', (name, number))
        items_data = cursor.fetchall()

        items = []
        total_price = 0
        for item_data in items_data:
            item = item_data[0]
            price = item_data[1]
            count = item_data[2]

            item_dict = {}
            item_dict['item'] = item
            item_dict['price'] = price
            item_dict['count'] = count

            total_price += price * count
            items.append(item_dict)
        if(total_price<=50):
            total_price=total_price+20
        elif(total_price<=100):
            total_price=total_price+30
        else:
            total_price=total_price+50
        json_dict = {}
        json_dict['canteen']=canteen
        json_dict['name'] = name
        json_dict['number'] = number
        json_dict['no_of_items'] = len(items)
        json_dict['total_price'] = total_price
        json_dict['items'] = items
        json_list.append(json_dict)

    return jsonify(json_list)

@app.route('/delivery')
def delivery():
    conn = sqlite3.connect('hack.db')
    cursor = conn.cursor()
    cursor.execute('SELECT DISTINCT canteen,name, number FROM submit')
    data = cursor.fetchall()

    json_list = []
    for row in data:
        canteen=row[0]
        name = row[1]
        number = row[2]

        cursor.execute('SELECT item, price, count FROM submit WHERE name = ? AND number = ?', (name, number))
        items_data = cursor.fetchall()

        items = []
        total_price = 0
        for item_data in items_data:
            item = item_data[0]
            price = item_data[1]
            count = item_data[2]

            item_dict = {}
            item_dict['item'] = item
            item_dict['price'] = price
            item_dict['count'] = count

            total_price += price * count
            items.append(item_dict)
        if(total_price<=50):
            total_price=total_price+20
        elif(total_price<=100):
            total_price=total_price+30
        else:
            total_price=total_price+50
        json_dict = {}
        json_dict['canteen']=canteen
        json_dict['name'] = name
        json_dict['number'] = number
        json_dict['no_of_items'] = len(items)
        json_dict['total_price'] = total_price
        json_dict['items'] = items

        json_list.append(json_dict)

    return jsonify(json_list)

@app.route('/delivery/delete',methods=['POST','GET'])
def del_data():
    response = {'message': 'Order Delivered Succesfuly'}
    id=request.json.get('name')
    conn = sqlite3.connect('hack.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM rider")
    data=cursor.fetchall()
    name=data[len(data)-1][0]
    print(name)
    cursor.execute(f"update rider set delivery_count=delivery_count+1 where name='{name}'")
    cursor.execute(f'DELETE FROM SUBMIT WHERE NAME="{id}";')
    conn.commit()
    conn.close()
    return jsonify(response),200

@app.route('/portal')
def portal():
    conn = sqlite3.connect('hack.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM rider")
    rows = cursor.fetchall()
    data = [{'name': row[0],'number':row[1] ,'count': row[2]} for row in rows]
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True,port=8000)