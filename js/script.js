// Custom JavaScript for IRD Clone

$(document).ready(function() {
    // Fetch visit counter and display
    $.get("https://ird.gov.np/visits-up", function(data, status) {
        visits = data;
        var str = "Visits: ";
        var dt = data.split("");
        for (var i in dt) {
            str += '<span class="badge badge-info">' + dt[i] + '</span>';
        }
        $("#visits").html(str);
    });
    
    // Highlight active menu item based on current URL
    if ($('.tab-pane li a').length) {
        $('.tab-pane li a').each(function() {
            var curUrl = window.location.href;
            if ($(this).attr('href') == curUrl) {
                $(this).addClass('active-sm');
                return false;
            }
        });
    }
});

// File upload function for feedback form
function uploadFile() {
    var url = 'https://ird.gov.np';
    var file_data = $('#filename').prop('files')[0];
    var form_data = new FormData();
    form_data.append('file', file_data);
    
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $("#_token").val()
        },
        url: url + "/feedback/upload-files",
        dataType: 'text', // what to expect back from the PHP script, if anything
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: "POST",
        success: function(data) {
            $('#filepath').val(data);
        },
        error: function(error) {
            console.error('File upload failed:', error);
        }
    });
}

// Save feedback function
function saveFeedback(e) {
    e.preventDefault();
    var url = 'https://ird.gov.np';
    var urls = url + "/feedback/creates";
    
    $.ajax({
        method: 'post',
        url: urls,
        data: $("#form").serialize(),
        success: function(resp) {
            var a = JSON.parse(resp);
            
            if (a.status == 1) {
                $("#name").val("");
                $("#email").val("");
                $("#filepath").val("");
                $("#filename").val("");
                
                $("#responsediv").html("Feedback Sent.");
            }
        },
        fail: function() {
            console.error('Feedback submission failed');
        }
    });
}
