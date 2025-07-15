
// Variables





jQuery(document).ready(function($) {
  let usernameAvailable = null;
  let emailAvailable = null;
  let passwordValid = null;
  let passwordMatches = null;
  let emailValid = null;
  let phoneValid = null;

$('#checkUsername').on('click', function(e){
  e.preventDefault();
  $('#checkUsernameResult').empty();
  const usernameToCheck = $('#reg_username').val();
  
  if(usernameToCheck.length > 0){
    checkUsernameExists(usernameToCheck).then(data=>{
    if(data == false){
      $('#checkUsernameResult').html('<p style="color: green;">This username available.</p>');
      usernameAvailable = true;
      }
      else{
        $('#checkUsernameResult').html('<p style="color: red;">This username already exits, please use another one.</p>');
        usernameAvailable = false;
      }
    })
  }
})

// check that the password is properly formated
$('#reg_password').on('input', function() {
  const password = $(this).val();
  const isValid = validatePassword(password);
  const validFormat = $(this).siblings('.validFormat');
  

  if (isValid) {
    validFormat.empty().html('<span class="material-symbols-outlined" style="color: green">done</span>');
    passwordValid = true;
  } else {
    validFormat.empty().html('<span class="material-symbols-outlined" style="color: red">done</span>');
    passwordValid = false;
  }
});

// allows the user to see the password
$('.toggle-password').click(function() {
    const passwordField = $('#reg_password');
    const icon = $(this).find('i');

    if (passwordField.attr('type') === 'password') {
      passwordField.attr('type', 'text');
      icon.text('visibility_off');
    } else {
      passwordField.attr('type', 'password');
      icon.text('visibility');
    }
  });

// Check that password and password confirm match
$('#reg_password_confirm').on('input', function(){
  const password = $('#reg_password').val();
  const passwordConfirm = $('#reg_password_confirm').val();
  
  const validFormat = $(this).siblings('.validFormat');
  if(password == passwordConfirm){
    validFormat.empty().html('<span class="material-symbols-outlined" style="color: green">done</span>');
    passwordMatches = true;
  } else {
    validFormat.empty().html('<span class="material-symbols-outlined" style="color: red">done</span>');
    passwordMatches = false;
  }
});

$('#reg_email').on('input', function() {
  const email = $(this).val();
  const isValid = validateEmail(email);
  const validFormat = $(this).siblings('.validFormat');

  if (isValid) {
    validFormat.empty().html('<span class="material-symbols-outlined" style="color: green">done</span>');
    emailValid = true;
  } else {
    validFormat.empty().html('<span class="material-symbols-outlined" style="color: red">done</span>');
    emailValid = false;
  }
});

// Check if email is already used
$('#checkEmail').on('click', function(e){
  e.preventDefault();
  $('#checkEmailResult').empty();
  const emailToCheck = $('#reg_email').val();
  
  if(validateEmail(emailToCheck) !== true){
    return $('#checkEmailResult').html('<p style="color: red;">Email not valid. Cannot be checked</p>');
  }
  
  if(emailToCheck.length > 0){
    checkEmailExists(emailToCheck).then(data=>{
    if(data == false){
      $('#checkEmailResult').html('<p style="color: green;">This email can be used to register.</p>');
      emailAvailable = true;
      }
      else{
        $('#checkEmailResult').html('<p style="color: red;">This email is already in use, please use another one. <a href="/profile-login/">Please click here to log into your account.</a></p>');
        emailAvailable = false;
      }
    });
    
  }
})


$('#reg_phone').on('input', function() {
  const phone = $(this).val();
  const isValid = validatePhone(phone);
  const validFormat = $(this).siblings('.validFormat');

  if (isValid) {
    validFormat.empty().html('<span class="material-symbols-outlined" style="color: green">done</span>');
    phoneValid = true;
  } else {
    validFormat.empty().html('<span class="material-symbols-outlined" style="color: red">done</span>');
    phoneValid = false;
  }
});

$('#reg_phone_confirm').on('input', function() {
  const phone = $('#reg_phone').val();
  const phoneConfirm = $('#reg_phone_confirm').val();

  const validFormat = $(this).siblings('.validFormat');
  if (phone == phoneConfirm) {
    validFormat.empty().html('<span class="material-symbols-outlined" style="color: green">done</span>');
  } else {
    validFormat.empty().html('<span class="material-symbols-outlined" style="color: red">done</span>');
  }
});


$('#input_3_39').bind('change', function() {
  const newValue = $('#input_3_39').val();
  // console.log('Hidden field value changed to:', newValue);
});

 $("input[type=hidden]").bind("change", function() {
      // alert($(this).val()); 
 });


// console.log('TESTOS')


$('#verification-popup').on('click', function(){
  setTimeout(function() {
    $('#sendRegistration').removeClass('close');
  }, 5000);
});

/*
$('body').on('change', '#reg_verify-facetime', function(){
  if(!$(this).val()) $('#sendRegistration').addClass('close');
  else $('#sendRegistration').addClass('close'); 
});
*/



// Process Registration form
// this isn't an error
// this is just dreamweaver not recognizing await
$('body').on('click', '#sendRegistration', async function(e){
  e.preventDefault();
  $('#registration-failure-holder').removeClass().addClass('open');

  const firstName = $('#reg_first_name').val() || null;
  const lastName = $('#reg_last_name').val() || null;
  const username = $('#reg_username').val() || null;
  const password = $('#reg_password').val() || null;
  const passwordConfirm = $('#reg_password_confirm').val() || null;
  const email = $('#reg_email').val() || null;
  const address = $('#reg_address').val() || null;
  const address2 = $('#reg_address_two').val() || null;
  const city = $('#reg_city').val() || null;
  const state = $('#reg_state').val() || null;
  const zipcode = $('#reg_zipcode').val() || null;
  const phone = $('#reg_phone').val() || null;
  const hiddenVideo = $('#input_3_39').val() || null;
  const videoRecorded = $('#input_3_39').val() || null;
  const stream = $('#reg_stream').val() || null;
  const videoVerificationFaceTime = $('#reg_verify-facetime').prop('checked') ? 'FaceTime' : null;
  const videoVerificationWhatsApp = $('#reg_verify-whatsapp').prop('checked') ? 'WhatsApp' : null;

  const verdl = $('#uploaded-vdl').attr('data-image') || null;
  const vercc = $('#uploaded-vcc').attr('data-image') || null;
  

  if (firstName === null || lastName === null || password === null || email === null || phone === null) {
    return alert('Please make sure to fill out all the required forms marked by an (*)');
  }
  

  try {
    // Check username availability
    const isUsernameAvailable = await checkUsernameExists(username);
    
   // console.log('USERNAME', isUsernameAvailable)
    if (isUsernameAvailable !== false) {
      return alert('The username you have entered is not available.');
    }

    // Check email existence
    const isEmailExists = await checkEmailExists(email);
    // console.log('did it exist', isEmailExists);
    if (isEmailExists != false) {
      $('#form-holder-spinner').addClass('close');
      $('#registration-form-holder').addClass('close');
      const emailExistsMessage = '<div class="registration-failure-holder-inner"><p>The email you entered is already in use. It is possible your account has not been approved yet. Please contact us at pinkysgirlshelp@gmail.com and ask us to check on your application status. Make sure to email us from '+email+', it will make the process faster.</p></div>';
      $('#registration-failure-holder').removeClass('close').append(emailExistsMessage);
      return;
    
      // return alert('The email you entered is already in use. It is possible your account has not been approved yet. Please contact us at pinkysgirlshelp@gmail.com and ask us to check on your application status. Make sure to email us from '+email+', it will make the process faster.');
    }
    if(validateEmail(email) !== true) return alert('The format of your email is not valid.');

    if (passwordValid !== null && passwordValid == false) {
      return alert('The password you entered does not have a valid format.');
    }

    if (validatePassword(password) !== true) {
      return alert('Your password is not formatted properly. Password must be 6 characters long and contain letters, numbers, and one special character like ! # @ %.');
    }

    if (password !== passwordConfirm) {
      return alert('Your password and "confirm password" must match');
    }
    
    if(!phone){
      return alert('You forgot to share your phone number. The phone number must be a cell phone as it will be used for your video verification.');
    }

    if (validatePhone(phone) !== true) {
      return alert('The format of your phone number is not valid.');
    }
    
    
    
    if(!verdl) return alert('You forgot to upload a picture of the front of your Driver\'s License. This step is necessary as it help confirm your identity.');
    if(!vercc) return alert('You forgot to upload a picture of your credit card. This step is necessary as it helps confirm your identity. The picture should show the number and your name. The name on the credit card must match the name on your Driver\'s License above.');
    
    
    if(!videoVerificationFaceTime && !videoVerificationWhatsApp) return alert('You must choose a way for us to perform the video verification.');
    
    
    

    // Continue with the registration process here
    const registrationData = {
      first_name: firstName,
      last_name: lastName,
      username: username,
      password: password,
      email: email,
      address: address,
      address2: address2,
      city: city,
      state: state,
      zipcode: zipcode,
      phone: phone,
      video: videoRecorded,
      stream: stream,
      verification_methods: (videoVerificationFaceTime || '')+' '+(videoVerificationWhatsApp || ''),
      verdl: verdl,
      vercc: vercc,
    };
    
    // console.log('reg data', registrationData);
    
    $('#registration-form-holder').addClass('close');
    $('#form-holder-spinner').removeClass('close');


    // Process the registration data
    const result = await processRegistration(registrationData);
    // console.log('reg results :: ', result)
    if(result == null){
      $('#registration-form-holder').removeClass('close');
      $('#form-holder-spinner').addClass('close');
      return alert('An unknown error has occured');
    }

    if(result.success == false){
      $('#registration-form-holder').removeClass('close');
      $('#form-holder-spinner').addClass('close');
      $('#custom-vid-record').removeClass().css({"display":"block"})
      const failureMessage = '<div class="registration-failure-holder-inner"><p>'+result.message+'</p></div>';
      $('#registration-failure-holder').removeClass('close').html(result.message);
      return;
      //alert(failureMessage);
    }
    else if(result.success == true){
      $('#form-holder-spinner').addClass('close');
      
      const successMessage = '<div class="registration-success-holder-inner"><p>'+result.message+'</p></div>';
      $('#registration-success-holder').removeClass('close').html(successMessage);
      
      return;
    }

  } catch (err) {
    console.error(err);
  }
});



// /////////
// START PIPE
// Video Recording
// if($('#custom-vid-record').length > 0){
/*
  let pipeParams = {size:{width:640,height:390}, qualityurl:"avq/360p.xml", accountHash:"7b6b29b730da9f4769d01ccd21bc4bc7", eid:"md5msW", mrt:600, avrec:1 ,dup:0,dpv:1};

  PipeSDK.insert("custom-vid-record",pipeParams,function(recorderObject){
    let accountHash = "7b6b29b730da9f4769d01ccd21bc4bc7";
    let formFieldId = "input_3_39";
    
    recorderObject.onSaveOk = function(recorderId, streamName, streamDuration, cameraName, micName, audioCodec, videoCodec, fileType, videoId, audioOnly, location) {

      document.getElementById(formFieldId).value = "https://" + location + "/" + accountHash + "/" + streamName + ".mp4";
  };
  
  recorderObject.onVideoUploadSuccess = function(recorderId, filename, filetype, videoId, audioOnly, location) {
    document.getElementById(formFieldId).value = "https://" + location + "/" + accountHash + "/" + filename + ".mp4";
  };
  
  recorderObject.onDesktopVideoUploadSuccess = function(recorderId, filename, filetype, videoId, audioOnly, location) {
    document.getElementById(formFieldId).value = "https://" + location + "/" + accountHash + "/" + filename + ".mp4";
  };

});// PipeSDK
*/
//} // check if 

// END pipe


// 



if($('#custom-vid-record').length > 0){

var pipeParams = {size:{width:640,height:390}, qualityurl:"avq/360p.xml", accountHash:"7b6b29b730da9f4769d01ccd21bc4bc7", eid:"md5msW", mrt:600, avrec:1 ,dup:0,dpv:1};
PipeSDK.insert("custom-vid-record",pipeParams,function(recorderObject){

  let accountHash = "7b6b29b730da9f4769d01ccd21bc4bc7";
  let formFieldId = "input_3_39";

  // USED FOR DESKTOP
  recorderObject.onSaveOk = function(recorderId, streamName, streamDuration, cameraName, micName, audioCodec, videoCodec, fileType, videoId, audioOnly, location) {

  //onSaveOK is part of the desktop recorder's JS events API (recording from camera or screen)
   document.getElementById(formFieldId).value = "https://" + location + "/" + accountHash + "/" + streamName + ".mp4";
    $('#reg_stream').val(streamName);
    $('#video-success').removeClass().addClass('open, green').html('<p>Your video was successfully processed. You can continue.</p>')
    $('#custom-vid-record').removeClass().addClass('close').css({"display":"none"});
   // alert('DONE 1') // Finish
  };


  // USED FOR MOBILE
  recorderObject.onVideoUploadSuccess = function(recorderId, filename, filetype, videoId, audioOnly, location) {
  //onVideoUploadSuccess is part of the native mobile recorder's JS events API (upload new or existing recording)

    document.getElementById(formFieldId).value = "https://" + location + "/" + accountHash + "/" + filename + ".mp4";
    // alert('DONE 2')
    $('#reg_stream').val(streamName);
    
    $('#video-success').removeClass().addClass('open, green').html('<p>Your video was successfully processed. You can continue.</p>')
    
    $('#custom-vid-record').removeClass().addClass('close').css({"display":"none"});

  };

  recorderObject.onDesktopVideoUploadSuccess = function(recorderId, filename, filetype, videoId, audioOnly, location) {
  //onDesktopVideoUploadSuccess is part of the desktop recorder's JS events API (upload existing file from desktop) 

   // document.getElementById(formFieldId).value = "https://" + location + "/" + accountHash + "/" + filename + ".mp4";

  };

});


}


$('#sendApproval').on('click', async (e)=>{
  e.preventDefault();
  const password = $('#areg_password').val() || null;
  const stream = $('#areg_stream').val() || null;
  
  if(password === null || stream === null){
    return alert('Incomplete information');
  }
  const verObj = {
    stream: stream,
    password: password
  }
  
  const verified = await processVer(verObj);
  console.log('verified', verified);
  if(verified.success === true){
    $('#approve-registration').addClass('close')
    $('#approve-registration-success').removeClass('close').addClass('approve-registration-success-inner').html('<p>'+verified.message+'</p>');
  }
  else{
    return alert('Approval was not successful');
  }
  
  
})



$('.delete_ad_listing').on('click', function (e){
  e.preventDefault();
  $(this).siblings('.delete_ad_listing_popup').removeClass('close');
  
})


$('.do_not_delete').on('click', function(){
    $('.delete_ad_listing_popup').addClass('close');
    console.log('do not delete')
})
$('.please_delete').on('click', async function (){
   $('.delete_ad_listing_popup').addClass('close');
   const idToDeleted = $(this).data('listing-id');
   
   const deletedListing = await deleteListing(idToDeleted);
   if(deletedListing.success === true){
     $(this).closest('li').addClass('close');
     console.log('listing deleted', deletedListing.message)
   }
   else alert(deletedListing.message);

})







// NEW
$('.each-verification .continue').on('click', async function(e){
  e.preventDefault();
  

  const file =  $(this).siblings('input[type="file"]').prop('files')[0]; //$('#profile_image_upload').prop('files')[0];
  const tp = $(this).attr('data-type') || null;

  if(!tp || !file) return alert('You forgot to choose an image.');
  
  if (!tp || !file.type.startsWith('image') || (file.type !== 'image/jpeg' && file.type !== 'image/png')) {
    return alert('Please select a valid JPG or PNG image.');
  }
  if(file.size > 8500000){
    return alert('The image you submitted is too large. Our system accepts files 8MB or less.');
  }
  // console.log('ready to upload', file);
  // console.log('type of file :: ', tp);
 
  const uploadedImage = await uploadVerre(file, tp);
  console.log('uploaded :: ', uploadedImage)
  if(uploadedImage == null) return alert('An unexpected error happened during the upload of your file. Please try again.');
  

  if(uploadedImage.success === null || uploadedImage.success === false) return alert('There was an issue uploading your image.');
  
  $(this).parent().addClass('close').siblings('.each-verification-result').append('<span class="material-symbols-outlined close-icon">close</span><img src="'+uploadedImage.image+'" /><p>'+uploadedImage.message+'</p>');
  $(this).parent().addClass('close').siblings('.each-verification-result').eq(0).attr("data-image", uploadedImage.image);
  
  

  return;

});



// NEW
$('body').on('click', '.each-verification-result .close-icon', function(){
  $(this).parent().attr("data-image", '');
  $(this).parent().empty().siblings().removeClass('close');
});




});  // document.ready
// ///////////////////////////////////

// custom-vid-record






















// FUNCTIONS


function validatePassword(password) {
  const hasMinimumLength = password.length >= 6;
  const hasSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
  return hasMinimumLength && hasSpecialCharacter;
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePhone(phoneNumber){
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  return digitsOnly.length === 10;
}






// ASYNC

async function checkUsernameExists(username) {
  try{
    const data = await $.ajax({
      url: nic_create.ajax_url,
      type: 'POST',
        data: {
          action: 'nic_check_username_exists',
          data: { username: username },
        },
        beforeSend: function () {
              //  $('#usernameLoader').show();
        },
        success: function (data) {
               // console.log('Success:', data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error:', errorThrown);
        }
    });
        let result = data.data.exists;
  return result;
    }catch (error) {
        console.log('Error:', error);
    }
}



async function checkEmailExists(emailProvided) {
  try{
    const data = await $.ajax({
      url: nic_create.ajax_url,
      type: 'POST',
        data: {
          action: 'nic_check_email_exists',
          data: { email: emailProvided },
        },
        beforeSend: function () {
              //  $('#usernameLoader').show();
        },
        success: function (data) {
             //  console.log('Success:', data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error:', errorThrown);
        }
    });
    let result = data.data.exists;
    return result;
    } catch (error) {
        console.log('Error:', error);
    }
}




async function processRegistration(registration) {
  try {
    const response = await $.ajax({
      url: nic_create.ajax_url,
      type: 'POST',
      data: {
        action: 'nic_process_registration',
        data: {
          first_name: registration.first_name,
          last_name: registration.last_name,
          username: registration.username,
          password: registration.password,
          email: registration.email,
          address: registration.address,
          address2: registration.address2,
          city: registration.city,
          state: registration.state,
          zipcode: registration.zipcode,
          phone: registration.phone,
          video: registration.video,
          stream: registration.stream,
          verification_methods: registration.verification_methods,
          ver_dl: registration.verdl,
          ver_cc: registration.vercc,
        }
      },
      
    });
    if(!response || !response.data) return null;
    

    return response.data;
  } catch (err) {
    console.error(err);
  }
}




async function processVer(dataP) {
  try {
    const data = await $.ajax({
      url: nic_create.ajax_url,
      type: 'POST',
      data: {
        action: 'nic_verify_user',
        data: {
          stream: dataP.stream,
          password: dataP.password
        }
      },
      beforeSend: function () {

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);

      }
    });

    return data.data;
  } catch (err) {
    console.error(err);
  }
}



async function deleteListing(id){
  try{
    const data = await $.ajax({
      url: nic_create.ajax_url,
      type: 'POST',
      data: {
        action: 'nic_delete_listing',
        data: {listing_id: id}
      },
      
    });
    
    return data.data;
  
  }catch (err) {
    console.error(err);
  }


}






// upload verre
async function uploadVerre(file, verreType){
  if(!file || !verreType) return null;
  try{
    const formData = new FormData(); // Create a FormData object
    formData.append('action', 'nic_upload_verre');
    formData.append('image', file); // Append the image file to the FormData
    formData.append('verre_type', verreType);

    const response = await jQuery.ajax({
      url: nic_create.ajax_url, // nic_post_an_ad
      type: 'POST',
      data: formData, // Use the FormData object as the data
      processData: false, // Prevent jQuery from processing the data
      contentType: false, // Prevent jQuery from setting the content type
    });
    // console.log('from ajax :: ', response)
    if(!response || !response.data) return null;
    return response.data;
    
  }catch (error) {
    console.log('Error:', error);
    return null;
  }
}


