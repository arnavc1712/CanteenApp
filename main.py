from flask import Flask
from flask import render_template,flash, request
from flask import url_for
from flask_pymongo import PyMongo
from flask import jsonify 
from flask_mail import Mail
from flask_mail import Message
import hashlib
  
from flask import request, redirect, render_template, url_for, flash  
from flask_login import login_user, logout_user,LoginManager
from flask_login import current_user
# from .forms import LoginForm  
# from .user import User
# from app import lm


app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'mycustomers'
app.config['MONGO_URI'] = 'mongodb://127.0.0.1:27017/mycustomers'
app.secret_key = 'some_secret'
mongo = PyMongo(app)

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'arnav171296@gmail.com'
app.config['MAIL_PASSWORD'] = '*****'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

lm = LoginManager()
lm.init_app(app)



class User():

    def __init__(self, sap_id):
        self.sap_id = sap_id

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.sap_id

    @staticmethod
    def validate_login(password_hash, password):
        if password_hash==hashlib.md5(password).hexdigest():
          return True
        
        return False


@lm.user_loader
def load_user(sap_id):  
    u = mongo.db.customers.find_one({"sap_id": sap_id})
    if not u:
        return None
    return User(u['sap_id'])


@app.route('/login', methods=['GET', 'POST'])
def login():  
    print request.json
    sap_id=request.json['sap_id']
    password=request.json["password"]
    if request.method == 'POST':
        user = mongo.db.customers.find_one({"sap_id": sap_id})
        if user and User.validate_login(user['password'],password):
            user_obj = User(user['sap_id'])
            login_user(user_obj)
            flash("Logged in successfully", category='success')
            return jsonify("True")
            # return redirect(request.args.get("next") or url_for("index"))
        flash("Wrong username or password", category='error')
    return jsonify('False')
    # return render_template('home.html')


@app.route('/logout')
def logout():  
    logout_user()
    return redirect(url_for('index'))

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
  sap_id=request.json['sap_id']
  email=request.json['email']
  tel_no=request.json['tel_no']
  password=hashlib.md5(request.json['password']).hexdigest();

  cust_obj=customers.find({"sap_id":sap_id}).count();
  print cust_obj;
  if cust_obj==0:

    cust_id = customers.insert({'first_name':first_name, 'last_name': last_name,'sap_id':sap_id,'email':email,
      'tel_no':tel_no,'password':password})
    new_cust = customers.find_one({'_id': cust_id })
    output = {'First Name' : new_cust['first_name'], 'Last Name' : new_cust['last_name']}
    print "HELOOOOO"
    # msg = Message("Welcome to the Canteen App, "+first_name,sender="arnav171296@gmail.com",recipients=[email])
    # msg.body="Whastup "+first_name
    # mail.send(msg)
    return jsonify({'result' : output})

  else:
    return jsonify("False")

  
 
  

@app.route('/register')
def register():
	return render_template('register.html')

@app.route('/menu')
def show_menu():
    if current_user.is_authenticated:
      print "LOGGED IN BITCHES"
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