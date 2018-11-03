$(document).ready(function(){
    $('.add-btn').on('click', function(){
        $('#add-input').click();
    });
    
    $('#add-input').on('change', function(){
        var addInput = $('#add-input');
        
        if(addInput.val() != '') {
            var formData = new FormData();
            formData.append('upload', addInput[0].files[0]);
            $('#completed').html('File Uploaded Successfully');
            
            $.ajax({
                url: '/userupload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(){
                    addInput.val('');
                }
            })
        }
        
        showImage(this);
    });
    
    $('#profile').on('click', function(e){
        e.preventDefault();
        var username = $('#username').val();
        var fullname = $('#fullname').val();
        var country = $('#country').val();
        var gender = $('input[name=gender]:checked').val();
        var mantra = $('#mantra').val();
        var upload = $('#add-input')[0].files &&  $('#add-input')[0].files[0] 
            ? $('#add-input')[0].files[0].name : '';
        var image = $('#user-image').val();

        var valid = true;
        
        if (upload == '' && image) {
            upload = image;
        }

        if (username == '' || fullname == '' || country == '' || gender == '' || mantra == ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger">You cannot submit an empty field</div>');
        } else {
            $('#error').html('');
        }
        
        if(valid == true){
            $.ajax({
                url: '/settings/profile',
                type: 'POST',
                data: {
                    username: username,
                    fullname: fullname,
                    gender: gender,
                    country: country,
                    mantra: mantra,
                    upload: upload
                },
                success: function(){
                    setTimeout(function(){
                        window.location.reload();
                    }, 200);
                }
            });
        } else {
            return false;
        }
    });
});

function showImage(input){
    if(input.files && input.files[0]){
        var reader = new FileReader();
        reader.onload = function(e){
            $('#show_img').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}