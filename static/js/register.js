$(document).ready(function(){

if (window.location.pathname == '/menu'){
	if($(window).width()>600)
	{$("div.bg-image").css({"height":"64px","overflow":"hidden"});}
	
	else{
		$(".menu-list-headers-body-wrapper").remove();
		$(".canteen-cart-container").remove();
		$("#navItems a").click(function(){
			$(".mobile-items-menu").slideToggle(function(){mobileItemMenuToggle()});
			
		})

		$(".mobile-items-menu li a").click(function(){
			$(".mobile-items-menu").slideUp(function(){mobileItemMenuToggle()});
		})

		changeMainNav();

	}

}

$(".menu-list-headers-container").sticky({topSpacing:0});
$(".canteen-cart").sticky({topSpacing:0});

$(".add-button button").click(function(){
	item_title=addToCart(this);
	title_object=addItem(item_title);

	$(".cart-icon-container").remove();
	$("#cartItemTable tbody").append(title_object);
	qtyValChangers();

	$(".rmv-btn").unbind().click(function(){
		removeItem(this);
	})

    updateBillValue(2);


});








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
    $.smkAlert({
      text: 'Validate!',
      type: 'success'
    });

    $.ajax({
			url:"/test",
			type: "POST",
			data: JSON.stringify(data,null, '\t'),
			contentType: 'application/json; charset=UTF-8',
			success: function(data)
			{
				console.log(data);
				window.location.replace('/test');
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
    data=JSON.stringify(data,null, '\t');
    console.log(data);

   //  $.ajax({
			// url:"/test",
			// type: "POST",
			// data: JSON.stringify(data,null, '\t'),
			// contentType: 'application/json; charset=UTF-8',
			// success: function(data)
			// {
			// 	console.log(data);
			// 	window.location.replace('/test');
			// }});
  }


return false;
}

);



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
									<td id="item-price"><p>Rs 128</p><button type="button" class="rmv-btn"><span class="glyphicon glyphicon-remove-circle"></span></button></td>\
								</tr>';

	return title_object
}

function removeItem(rmvBtnArgs){
	
	$(rmvBtnArgs).parents("tr").remove();
	if($("#cartItemTable>tbody>tr").length==0){
		$(".canteen-cart").append(addCartIcon());

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

	$(".price p").text(temp);
	$(".total-amt p").text(temp);
}


function changeMainNav(){
	var scroll_start = 0;
   var startchange = $('.menu-item-container-wrapper');
   var offset = startchange.offset();
    if (startchange.length){
   $(document).scroll(function() { 
      scroll_start = $(this).scrollTop();
      if(scroll_start > offset.top) {
          
          // $("#navItems").css('display','block');
          $("#navItems").slideDown();
          $("#navTitle").css('display','none');

          changeItemNav();

       } else {

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
			}

	else if($('.mobile-items-menu').css('display')=="none"){
				$("#navItems a span").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
			}

}



