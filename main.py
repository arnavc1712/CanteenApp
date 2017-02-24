from flask import Flask
from flask import render_template,flash, request
from flask import url_for
from flask_pymongo import PyMongo
from flask import jsonify 
from flask_mail import Mail
from flask_mail import Message


app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'mycustomers'
app.config['MONGO_URI'] = 'mongodb://127.0.0.1:27017/mycustomers'
app.secret_key = 'some_secret'
mongo = PyMongo(app)

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'arnav171296@gmail.com'
app.config['MAIL_PASSWORD'] = '1712nanu'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

@app.route('/')
def index():
    return render_template('home.html') 



@app.route('/test',methods=['GET'])
def get_customers():
	customers=mongo.db.customers
	output=[]
	for cust in customers.find():
		output.append({'First Name':cust['first_name'],'Last name':cust['last_name']})
	# console.log(output)	
	return jsonify({'result' : output})

@app.route('/test/<name>', methods=['GET'])
def get_one_star(name):
  customers = mongo.db.customers
  cust = customers.find_one({'first_name' :name})
  if cust:
    output = {'first_name' : cust['first_name'], 'last_name' : cust['last_name']}
  else:
    output = "No such name"
  return jsonify({'result' : output})

@app.route('/test',methods=['POST'])
def add_customers():
  print "Add customer"
  customers = mongo.db.customers
  first_name = request.json['first_name']
  last_name = request.json['last_name']
  gender=request.json['gender']
  age=request.json['age']
  cust_id = customers.insert({'first_name':first_name, 'last_name': last_name,'gender':gender,'age':age})
  new_cust = customers.find_one({'_id': cust_id })
  output = {'First Name' : new_cust['first_name'], 'Last Name' : new_cust['last_name']}
  msg = Message(first_name+" has been added",sender="arnav171296@gmail.com",recipients=["arnav171296@gmail.com"])
  msg.body="Whastup "+first_name
  mail.send(msg)
  return jsonify({'result' : output})

@app.route('/register')
def register():
	return render_template('register.html')

@app.route('/menu')
def show_menu():
    return render_template('menu.html')

@app.route('/hello/',methods=['GET', 'POST'])
def hello(name='Arnav'):
	if request.method == 'GET':
		flash("Whastup niggas")
		return 'Hello, %s' % name

with app.test_request_context():
	print url_for('hello',name='Arnav')


if __name__== "__main__":
	app.run(debug=True)