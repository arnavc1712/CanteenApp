$(document).ready(function(){
$(document).load($(window).bind("resize", function(){
	if($(window).width()<=900){
		$(".canteen-cart").unstick();

		
	}

	else{
		$(".canteen-cart").sticky({topSpacing:0});
	}
}));
if (window.location.pathname == '/menu'){
	// if($(window).width()<=600)
	// {$("div.bg-image").css({"height":"64px","overflow":"hidden"});}
	
	
		// $(".menu-list-headers-body-wrapper").remove();
		// $(".canteen-cart-container").remove();

		$("#navItems a").click(function(){
			$(".navbar-head").toggleClass("active");
			$(".mobile-items-menu").slideToggle(function(){mobileItemMenuToggle()});
			
		})

		$(".mobile-items-menu li a").click(function(){
			$(".navbar-head").removeClass("active");
			$(".mobile-items-menu").slideUp(function(){mobileItemMenuToggle()});
		})

		changeMainNav();


		qtyValChangers();

		if($(window).width()<=900){
			if($("#cartItemTable>tbody>tr").length==0){
				$(".mobile-cart-container").css("display","none");
			}

			else{
				$(".mobile-cart-container").css("display","block");
			}
		}

		$(".rmv-btn").unbind().click(function(){
				removeItem(this);
		})

		updateBillValue(2);

	

}







$(".menu-list-headers-container").sticky({topSpacing:0});
$(".canteen-cart").sticky({topSpacing:0});

$(".add-button button").click(function(){
	item_title=addToCart(this);
	title_object=addItem(item_title);

	if($(window).width()<=900)
	{
	$(".mobile-cart-container").css("display","block");}
	

	$(".cart-icon-container").remove();
	$("#cartItemTable tbody").append(title_object);
	qtyValChangers();

	$(".rmv-btn").unbind().click(function(){
		removeItem(this);
	})

    updateBillValue(2);


});


$(".mobile-cart-icon-container, .mobile-item-price").click(function(){
	$(".cart-content").slideToggle(function(){
		cartContentToggler();
	});

})

$(".mobile-cart-content-header a").click(function(){
	$(".cart-content").slideUp(function(){
		cartContentToggler();
	});
})





$("#signup-submitbtn").click(function(){
	var first_name=$("#first_name").val();
	var last_name=$("#last_name").val();

	var sap_id=$("#sap_id").val();
	
	var email=$("#email").val();
	var tel_no=$("#tel_no").val();
	var password=$("#password").val();
	var data={}
	data['first_name']=first_name;
	data['last_name']=last_name;
	data['sap_id']=sap_id;
	data['email']=email;
	data['tel_no']=tel_no;
	data['password']=password;
	console.log(data);
	if ($('#signUpForm').smkValidate()) {
    // Code here
   


    $.ajax({
			url:"/test",
			type: "POST",
			data: JSON.stringify(data,null, '\t'),
			contentType: 'application/json; charset=UTF-8',
			success: function(data)
			{
				console.log(data);
				if(data=="False"){
					if($("#SignUpModal .register-form .form_err_msg ").length!=1){
						$("#SignUpModal .register-form .form-group:eq(5) ").after("<p class='form_err_msg'>User already exists.</p>")
					}
				}
				else{

					$("#SignUpModal .register-form .form_err_msg ").remove()
					 $.smkAlert({
      				 text: 'Validate!',
      				 type: 'success'
    				 });
				}


				
			}});
  }


return false;
}

);



$("#login-submitbtn").click(function(){
	
	var sap_id=$("#login_sap_id").val();
	var password=$("#login_password").val();
	var data={}
	data['sap_id']=sap_id;
	data['password']=password;
	
	if ($('#LoginForm').smkValidate()) {
    // Code here
    $.smkAlert({
      text: 'Validate!',
      type: 'success'
    });
    

    $.ajax({
			url:"/login",
			type: "POST",
			data: JSON.stringify(data,null, '\t'),
			contentType: 'application/json; charset=UTF-8',
			success: function(message)
			{
				console.log(message);
				if(message=="True"){
					$.smkAlert({
      				text: 'Validate!',
      				type: 'success'
    				});
					location.reload();
				}
				else{
					if($("#LoginModal .register-form .form_err_msg").length!=1){
					$("#LoginModal .register-form .form-group:eq(1) ").after("<p class='form_err_msg'>Wrong ID or password</p>")
					}
				}
				
			}});
  }


return false;
}

);



$(".cart-chckout-btn ").click(function(){
	cust_selections=[]
	cust_selections,total_amt=updateUserSelection();
	data={};
	data["cust_selections"]=cust_selections;
	data["total_amt"]=total_amt;

	$.ajax({
		url:"/checkout",
		type:"POST",
		data: JSON.stringify(data,null, '\t'),
		contentType: 'application/json; charset=UTF-8',
		success:function(message){
			window.location.href = "/checkout";
		}

	})
	
})




})

function addToCart(item_name){
	var item_title=$(item_name).parents(".menu-item").find(".menu-item-title").text();
	console.log(item_title);
	return item_title;
}

function addItem(){
	title_object='<tr class="product-item">\
									<td class="item-qty">\
									<div class="item-qty-controls">\
									<button type="button" class="btn item-qty-amount-control btn-increment">+</button>\
									<span class="item-qty-wrapper text-center">1</span>\
\
									<button type="button" class="btn item-qty-amount-control btn-decrement">-</button>\
									</div>\
									</td>\
									<td id="item-name"><p>'+item_title+'</p></td>\
									<td id="item-price"><p>Rs 228</p><button type="button" class="rmv-btn"><span class="glyphicon glyphicon-remove-circle"></span></button></td>\
								</tr>';

	return title_object
}

function removeItem(rmvBtnArgs){
	
	$(rmvBtnArgs).parents("tr").remove();
	if($("#cartItemTable>tbody>tr").length==0){
		$(".canteen-cart div:eq(0)").after(addCartIcon());
		$(".mobile-cart-container").css("display","none");

	}

	updateBillValue(2);
	

}


function addCartIcon(){
	cartIcon='<div class="cart-icon-container">\
						<span class="fa fa-shopping-cart" aria-hidden="true"></span>\
					</div>';
	return cartIcon;
}

function qtyValChangers(){
	$(".btn-increment").unbind().click(function(){
	var item_count=$(this).parent().find("span").text();
	item_count=parseInt(item_count);
	item_count=item_count+1;
	$(this).parent().find("span").text(item_count);
	updateBillValue(1,this);
	
    })

   $(".btn-decrement").unbind().click(function(){
	var item_count=$(this).parent().find("span").text();
	item_count=parseInt(item_count);
	item_count=item_count-1;
	if(item_count<1){
		item_count=1;
		return;
	}
	$(this).parent().find("span").text(item_count);
	updateBillValue(0,this);
  })
}


function updateBillValue(addValue,addBtn){
	var price;
	var temp=0;
	var qty;
	
	price=$(addBtn).parents('.product-item').find('#item-price p').text().split("Rs")[1];
	qty=$(addBtn).parents('.product-item').find('.item-qty-wrapper').text();
	qty=parseInt(qty);
	price=parseInt(price);
	if(addValue==0) //<---If Decrement---->
	{
		
			price=price/(qty+1);
			price=price*qty;	
		
		
	}
	else if(addValue==1)  //<-----If Increment----->
	{
		if(qty!=1)
		{
			price=price/(qty-1);
			
		}
		price=price*qty;
		
		
	}
    price=$(addBtn).parents('.product-item').find('#item-price p').text("Rs "+price);


	$("#item-price p").each(function(index,value){
		price=$(this).text().split("Rs")[1];
		price=parseInt(price);
		temp=temp+price;
})
	console.log(temp);

	total_qty=0;
	$(".item-qty-wrapper").each(function(index,element){
		total_qty+=parseInt($(element).text())
	})

	$(".price p").text('Rs '+temp);
	$(".total-amt p").text('Rs '+temp);
	$(".mobile-item-price p").text('Rs '+ temp);
	$(".mobile-item-qty p").text(total_qty);

	//Storing SESSION INFORMATION
	cust_selections=[]
	cust_selections,total_amt=updateUserSelection();
	console.log("Total price BLAH is "+ total_amt)
	data={}
	data["cust_selections"]=cust_selections;
	data["total_amt"]=total_amt;

	$.ajax({

		url:"/menu",
		type:"POST",
		data: JSON.stringify(data,null, '\t'),
		contentType: 'application/json; charset=UTF-8',
		success:function(message){
			console.log(message);
		}
		
	})


}


function changeMainNav(){
	var scroll_start = 0;
   var startchange = $('.menu-list');
   var offset = startchange.offset();
    if (startchange.length){
   $(document).scroll(function() { 
      scroll_start = $(this).scrollTop();
      if(scroll_start > offset.top) {
          
          // $("#navItems").css('display','block');
          $("#navItems").slideDown();
          $("#navTitle").css('display','none');

          changeItemNav();

       } else if(scroll_start <= offset.top) {

        $("#navItems").css('display','none');
          // $("#navTitle").css('display','block');
          $("#navTitle").slideDown();
          
       }
   });
    }
}

function changeItemNav(){
   var scroll_start = 0;
   var startchange1 = $('#1');
   var offset1 = startchange1.offset();
   var startchange2 = $('#2');
   var offset2 = startchange2.offset();
   $(document).scroll(function(){
   		scroll_start = $(this).scrollTop();
   		if(scroll_start>= offset1.top && scroll_start< offset2.top ){
   			$("#navItems a p").text("Appetizers");

   		}

   		if(scroll_start>= offset2.top)
   		{
   			$("#navItems a p").text("Blah");
   		}


   });
}


function mobileItemMenuToggle(){
	if($('.mobile-items-menu').css('display')=="block"){
				$("#navItems a span").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
				// $(".navbar-head").css("height","100%");
			}

	else if($('.mobile-items-menu').css('display')=="none"){
				$("#navItems a span").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
				// $(".navbar-head").css("height","auto");
			}

}


function cartContentToggler(){
	if($('.cart-content').css('display')=="block"){
		// $(".canteen-cart-container").css("margin-top","100%");
		$(".cart-content").css("margin-top","0px");
	}

	else if($('.cart-content').css('display')=="none"){
		// $(".canteen-cart-container").css("margin-top","auto");
		$(".cart-content").css("margin-top","auto");
	}

}



function updateUserSelection(){
cust_selections=[]
$("#cartItemTable tbody .product-item").each(function(){
	single_selection={}
	single_selection["item-qty"]=$(this).find(".item-qty .item-qty-wrapper").text();
	single_selection["item-name"]=$(this).find("#item-name").text();
	single_selection["item-price"]=$(this).find("#item-price").text().split(" ")[1];
	cust_selections.push(single_selection);
	
})
var total_price=$(".total .total-amt").text().split(" ")[1]

return cust_selections,total_price
}