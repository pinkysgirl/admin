

jQuery(document).ready(function($) {

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const state = urlParams.get('state');
const city = urlParams.get('city');
const preference = urlParams.get('preference');
const zipcode = urlParams.get('zipcode');


let offset = 0;
let onPageCount = 0;
let incremented = false;

let params = new URLSearchParams(window.location.search);
let maxCount = params.get('count') ? parseInt(params.get('count'), 10) : 10;
let maxCountForURL = maxCount;
let profileIdFromUrl = params.get('profileId');

if(incremented !== true){
  offset = 0;
}
else{
  offset = maxCount -10;
}

const searchData = {
  city: city,
  state: state,
  zipcode: zipcode,
  preference: preference,
  offset: offset,
  maxcount: maxCount,
}



getListings(searchData).then(data=>{
  if(!data){
    $('#load-more').addClass('close');
    $('#empty-results').removeClass().addClass('open')
    const emptyResults = '<div class="empty-results-inner grey-box"><p>No Entertainers are available in this area today.<br />If you are an entertainer in this area, you can create an Ad Listing by <a href="/post-an-ad/">clicking here</a></p></div>';
    $('#empty-results').html(emptyResults);
    // TODO: finish the '#city-list' empty results
    
  }
  if(data.success == true){
  // console.log('FORMATED', formatList(data.data))
    $('#city-list').append(formatList(data.data));
    
    if(profileIdFromUrl && profileIdFromUrl !== null) {
    // Select the element
    const element = $('#city-list li[data-listing-id="'+profileIdFromUrl+'"]');
    if (element.length) {
      // Scroll smoothly to the element
      $('html, body').animate({
        scrollTop: element.offset().top
      }, 'slow');
    }
    profileIdFromUrl = null;
  }
  
   // console.log(data)
  }
});



$('#load-more').on('click', ()=>{

  if(maxCount > 10){
    offset = maxCount;
    maxCount = 10;
    
  }
  else{
    offset = offset + 10;
    maxCount = 10;
  }
 incremented = true;
  
  
  searchData.offset = offset;
  searchData.maxcount = maxCount;
  
  getListings(searchData).then(data=>{
    if(!data) return $('#load-more').addClass('close')
    if(data.success == true){
      
      
      $('#city-list').append(formatList(data.data))
      
      let currentUrl = new URL(window.location.href);

      // Use URLSearchParams to modify the query parameters
      let searchParams = currentUrl.searchParams;
      searchParams.set('count', offset + 10); // Set or update the 'count' parameter

      // Update the URL without affecting other parameters
      currentUrl.search = searchParams.toString();

      // Push a new state to the history with the updated URL
      history.pushState({ count: offset + 10 }, '', currentUrl.toString());
      
      
      
      // history.pushState({ count: offset }, '', '?count=' + offset);

    }
  });

  
})


// TEST
window.addEventListener('popstate', function(event) {
    if (event.state) {
        console.log('EVENT COUNT', event.state.count);
    }
});



// history.pushState({ businessId: businessId }, '', `?businessId=${businessId}`);
    
$('body').on('click', '#city-list li', function() {
    const profileId = $(this).data('listing-id') || null;

    // Get the existing state
    const existingState = history.state || {};

    // Merge the new state with the existing state
    const newState = Object.assign({}, existingState, { profileId: profileId });

    // Create a new URL with the existing parameters and the new one
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('profileId', profileId);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

    // Update the history state
    history.pushState(newState, '', newUrl);
});


});



const formatDate = (dateProvided = null)=>{
  if(dateProvided === null) return false;
  
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if(regex.test(dateProvided) === false) return false;
  
  const date = new Date(dateProvided);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate;
}


function formatList(profilesArray){

// TODO: add the sticker 

const profiles = profilesArray.map(profile=>{
  let sticker = profile.listing_sticker || null;
  let stickerDisplay;
  if(sticker !== null){
   const modifiedSticker = sticker.replace('https://bbpro-images.s3.us-west-1.amazonaws.com/utilities', 'https://backpagepro.com/images');
   stickerDisplay = ' style="background-image: url(\''+modifiedSticker+'\')  "';
  }
  
  let to_page = '<li data-listing-id="'+profile.listing_id+'" '+stickerDisplay+'>'
  // to_page = '<li>';
  + '<a href="/profile-sigle/?profile_id='+profile.listing_id+'"><img src="'+profile.listing_main_image+'" /></a>'
  
  + '<div class="short-desc"><p><strong>Name:</strong> '+profile.listing_display_name+'<br /><strong>Age:</strong> '+profile.listing_age+'<br />';
  
  //to_page += '';//$additionalCities;
  
  if(profile.listing_phone_display == 1) to_page += '<strong>Phone:</strong> '+formatPhone(profile.listing_phone, true)+'<br />';
  if(profile.listing_display_email) to_page += '<strong>Email:</strong> '+profile.listing_display_email+'<br />';
      
  to_page += '</p></div>'
  
  + '<button class="generic-button generic-button-pink"><a href="../profile-sigle/?profile_id='+profile.listing_id+'">View Profile</button>'
  
  + '</li>';
  
  
  return to_page
  
})

return profiles

}


  /*
    $to_page = '<ul>';
    foreach ( $listings as $listing ) {
    $additionalCities = '';
    if($listing->listing_additional_cities != ''){
      $additionalCitiesArray = json_decode($listing->listing_additional_cities, true);
      $additionalCities = implode(', ', $additionalCitiesArray['additional_cities']);
      $additionalCities = '<strong>Additional Cities:</strong> '.$additionalCities.'<br />';
    }
    
      $featured_image = wp_get_attachment_image_src($listing->listing_main_image, 'full');
      $listingId = $listing->listing_id;
      $to_page.= '<li>';
      $to_page .= '<a href="/profile-sigle/?profile_id='.$listingId.'"><img src="'.$listing->listing_main_image.'" /></a>';
      $to_page .= '<div class="short-desc">
      <p><strong>Name:</strong> '.$listing->listing_display_name.'<br />
      <strong>Age:</strong> '.$listing->listing_age.'<br />';
      $to_page .= $additionalCities;
      if($listing->listing_phone_display == 1) $to_page .= '<strong>Phone:</strong> '.formatPhone($listing->listing_phone, true).'<br />';
      if($listing->listing_display_image) $to_page .= '<strong>Email:</strong> '.$listing->listing_display_email.'<br />';
      
      
      $to_page .= '</p><button class="generic-button generic-button-green"><a href="../profile-sigle/?profile_id='.$listingId.'">View Profile</button></div></li>';
   
      
    }
    $to_page .= '</ul>';
*/




function formatPhone(phone, link = false) {
  const cleaned = ('' + phone).replace(/\D/g, ''); // Remove any non-digit characters
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);     // Split into three groups
  if (match){
    const formatedPhone = '(' + match[1] + ') ' + match[2] + '-' + match[3];
    if(link == false){
      return formatedPhone;
    }
    return '<a href="tel:'+cleaned+'">'+formatedPhone+'</a>';
  }
  return null;
}




async function getListings(searchData){
 // console.log('received data', searchData)
  try{ 
    const response = await $.ajax({
      url: nic_listdisp.ajax_url,
      type: 'POST',
     // contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
   //   data: formData, // Use the FormData object as the data
  
  data: {
          action: 'nic_display_list_listings',
          data: {
            state: searchData.state || null,
            city: searchData.city || null,
            zipcode: searchData.zipcode || null,
            preference: searchData.preference || null,
            offset: searchData.offset,
            maxcount: searchData.maxcount,
          },
        },
        
        beforeSend: function () {
              //  $('#usernameLoader').show();
        },
    });
    
   // console.log('REPLY', response)
    
    if(response.success){
      return response.data;
    }
    if(response.error){
    console.log('THE ERROR', response)
      return response;
    }
    // return null;


    
  }catch (error) {
    console.error('Error:', error);
    return null;
  }
}







