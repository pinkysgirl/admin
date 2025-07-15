


jQuery(document).ready(function($) {

$('#wpadminbar').hide();

$('.consent-button').on('click', (e)=>{
   const consentGiven = $(e.target).data('consent');
   sendDisclaimer(consentGiven).then(data =>{
     if(data === 'yes'){
       console.log('we pass')
       $('.graphic-content-disclaimer-holder-outter').removeClass('open').addClass('closed');
     }
     else if(data === 'no'){
       window.location.href = "https://pinkysgirls.com";
       //console.log('we dont pass')
     }
   });
  
 
});



$('#sendPreferenceSearch').on('click', (e)=>{
  e.preventDefault();
  const preference = $('#preference-choice-form input:checked').val();
  const state = $('#form_state').val();
  const city = $('#form_city').val();
  const zipcode = $('#form_zipcode').val();
  window.location.href = "https://pinkysgirls.com/city/?state="+state+"&city="+city+"&preference="+preference+"&zipcode="+zipcode;
})


// CUSTOM FORM
// add boostrap class to custom form
$('#user-login, #user-pass').addClass('form-control');
$('#bpp-form').addClass('custom-login-form grey-box');
$('#bpp-form input[type="submit"]').addClass('generic-button generic-button-blue');


$('#start-zipcode-search').on('click', (e)=>{
  e.preventDefault();
  const zipcode = $('#zipcode_search').val();
  window.location.href = "https://pinkysgirls.com/choose-preference/?zipcode="+zipcode;
});



// Over 18 popup
$('#18choiceholder button').on('click', function(e){
  e.preventDefault();
  console.log($(this).data('over18'))
  if($(this).data('over18') === 'yes'){
    $('.over18mandatory-holder').addClass('close')
  }
  else{
    window.location.href = "https://google.com";
  }
});




});



async function sendDisclaimer(dataProcess){
  const data = await $.ajax({
    url: nic_tools.ajax_url,
    type: 'POST',
    data: {
      action: 'nic_accept_disclaimer',
      data: {consent: dataProcess}
    },
    beforeSend: function() {
      // $('#contactLoader').show();
    },
    success: function(data){
   //   console.log(data);
    },
  });
  let result = data.data.results;
  return result;
}

