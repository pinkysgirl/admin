jQuery(document).ready(function($) {
//console.log("start");


// Company dropdown in menu
$(document).on('click', (e)=>{
 // e.preventDefault();
  let target = e.target;
 
  if($(target).hasClass('nav-dropdown')){
   // console.log('I cliked on nav');
    
    // we OPEN the nav
    if(!$(target).hasClass('drop-open')){
      $(target).addClass('drop-open');
      $(target).find('.sub-menu').first().addClass('sub-menu-open').show();
      
      // checking siblings
      if($(target).siblings().hasClass('drop-open')){
        $(target).siblings().removeClass('drop-open').find('.sub-menu').first().removeClass('.sub-menu-open').hide();
      }
      
      
    //  console.log('I opened the nav');
    }
    // we CLOSE the nav
    else{
      $(target).find('.sub-menu').first().removeClass('sub-menu-open').hide();
      $(target).removeClass('drop-open');
     // console.log('I closed the nav');
    }
    
    } // 
    
  })


// Mobile Navigation Menu
$(document).on('click', (e)=>{
  let target = e.target;
  
  // the click was on the icon
  if($(target).hasClass('nav-icon')){
    // the nav was not open
    if(!$(target).hasClass('topNavOpen')){
      $('.nav-holder > ul').show(500);
      $('#nav-icon').addClass('topNavOpen');
    }
    else{
      $('.nav-holder > ul').hide(500);
      $('#nav-icon').removeClass('topNavOpen');
    }// nav
  }
  else{
    // the click was not on 
    // if()
  } // not nav-icon

});











// Disclaimer
$('.expandable-text h5').on('click', (e)=>{
 exandableText(e, 'h5');

});


$('#important-message, #close-important-message').on('click', function(){
  if($('.important-message').hasClass('close')){
    $('.important-message').removeClass('close');
  }
  else $('.important-message').addClass('close');
});




}); // document ready

// EXPANDABLE TEXT
function exandableText(elem, parent){
let target;
 if($(elem.target).hasClass('material-symbols-outlined')){ 
   target = $(elem.target).parents(parent).siblings('.expandable-text-container');
 }
 else target = $(elem.target).siblings('.expandable-text-container');
  
 if($(target).hasClass('active')) $(target).removeClass('active');
 else $(target).addClass('active');
}






