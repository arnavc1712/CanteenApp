from flask import Flask
from flask import render_template,flash, request,session
from flask import url_for
from flask_pymongo import PyMongo
from flask import jsonify 
from flask_mail import Mail
from flask_mail import Message
import hashlib
import os
from flask import abort
  
from flask import request, redirect, render_template, url_for, flash  
from flask_login import login_user, logout_user,LoginManager
from flask_login import current_user
# from .forms import LoginForm  
# from .user import User
# from app import lm


app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'arnavdb'
# app.config['MONGO_URI'] = 'mongodb://127.0.0.1:27017/mycustomers'
app.config['MONGO_URI'] = 'mongodb://arnavc:1712nanu@ds145359.mlab.com:45359/arnavdb'

app.secret_key = 'some_secret'
mongo = PyMongo(app)

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'arnav171296@gmail.com'
app.config['MAIL_PASSWORD'] = '1712@Nanu'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

lm = LoginManager()
lm.init_app(app)

# app=os.path.dirname(os.path.abspath(__file__))
# target=os.path.join(app,'images/')

# if not os.path.isdir(target):
#   os.mkdir(targetm)

# session={}


class User():

    def __init__(self, sap_id):
        self.sap_id = sap_id

    def is_authenticated(self):
        if session['username']:
          return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.sap_id

    @staticmethod
    def validate_login(password_hash, password):
        print(password_hash)
        print(hashlib.md5(password).hexdigest())
        if password_hash==hashlib.md5(password.encode('utf-8')).hexdigest():
          print("Validated")
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
    print(request.json)
    sap_id=request.json['sap_id']
    password=request.json["password"]
    if request.method == 'POST':
        user = mongo.db.customers.find_one({"sap_id": sap_id})
        if user and User.validate_login(user['password'],password):
            print("Validated 2")
            user_obj = User(user['sap_id'])
            login_user(user_obj)
            session["username"]=user["first_name"]+ " " + user["last_name"]
            print(session["username"])
            flash("Logged in successfully", category='success')
            return jsonify("True")

            # return render_template('menu.html',session=session)
        flash("Wrong username or password", category='error')
    return jsonify('False')
    # return render_template('home.html')


@app.route('/logout')
def logout():  
    logout_user()
    session.clear()
    # session.pop("username",None)
    # for _ in session:
    #   session.pop(_)
    return redirect(url_for('index'))

@app.route('/')
def index():
    # print session
    # print current_user.get_id()
    if "username" in session:
        print("You are logged in as {}".format(session["username"]))

    return render_template('home.html',session=session) 

# counter=0
# @app.route('/<event_name>')
# def load_event(event_name):
#   global counter
#   print counter
  
#   if counter==2:
#     mongo.db.events.remove({"name":event_name})
#   event=mongo.db.events.find_one({"name":event_name})


#   if event:
#     counter+=1
#     return '<h1> Welcome to '+event["name"]+'Description:'+ event["description"]+'</h1>'

#   else:
#     abort(404)



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
  print("Add customer")
  customers = mongo.db.customers
  first_name = request.json['first_name']
  last_name = request.json['last_name']
  sap_id=request.json['sap_id']
  email=request.json['email']
  tel_no=request.json['tel_no']
  password=hashlib.md5(request.json['password']).hexdigest();

  cust_obj=customers.find({"sap_id":sap_id}).count();
  print(cust_obj)
  if cust_obj==0:
    # print "you are inside"
    cust_id = customers.insert({'first_name':first_name, 'last_name': last_name,'sap_id':sap_id,'email':email,
      'tel_no':tel_no,'password':password})
    new_cust = customers.find_one({'_id': cust_id })
    output = {'First Name' : new_cust['first_name'], 'Last Name' : new_cust['last_name']}
    # print "HELOOOOO"
    msg = Message("Welcome to the Canteen app, "+first_name,sender="arnav171296@gmail.com",recipients=[email])
    # print "SUPP"
    # print email
    msg.body="Whastup "+first_name
    mail.send(msg)

    return jsonify({'result' : output})

  else:
    return jsonify("False")

  

@app.route('/updateMenu',methods=['POST'])
def postMenu():
  if request.method=="POST":
    menu=mongo.db.menu
    food_item=request.json["food_item"]
    price=request.json["price"]
    description=request.json["description"]
    
    if menu.find({"food_item":food_item}).count()==0:
      menu.insert({"food_item":food_item,"price":price,"description":description})
      return "Item added "+str(request.json)
    else:
      return "Item already exists"



@app.route('/getMenu',methods=['GET'])
def getMenuItems():
  if request.method=="GET":
    menu_items=mongo.db.menu
    food_items=menu_items.find()
    

  

@app.route('/register')
def register():
	return render_template('register.html')

@app.route('/menu',methods=['POST','GET'])
def show_menu():
    print(request.method)
    
    if request.method=="GET":
      print("IN GET")
      if current_user.is_authenticated:
        print("LOGGED IN BITCHES")
      if "cust_selections" in session and "total_amt" in session:
        return render_template('menu.html',cust_selections=session["cust_selections"],
          total_amt=session["total_amt"])
      else:
        print("NAY")
        
      return render_template('menu.html',session=session)

    
    if request.method=="POST":
      print("IN POST")
      cust_selections=request.json["cust_selections"]
      total_amt=request.json["total_amt"]
      print("Total amt iss "+ total_amt)
      session["cust_selections"]=cust_selections
      session["total_amt"]=total_amt
    
      return jsonify("SUCCESS BITCHES")
    
    

@app.route('/checkout',methods=['POST','GET'])
def checkout_screen():
  cust_selections={}
  if request.method=="POST":
    cust_selections=request.json["cust_selections"]
    total_amt=request.json["total_amt"]
    return "DONE"

  if request.method=="GET":
    return render_template("checkout.html",cust_selections=session["cust_selections"],total_amt=session["total_amt"])

@app.route('/hello/',methods=['GET', 'POST'])
def hello(name='Arnav'):
	if request.method == 'GET':
		flash("Whastup niggas")
		return 'Hello, %s' % name

with app.test_request_context():
	print(url_for('hello',name='Arnav'))


if __name__== "__main__":
	app.run(debug=True)