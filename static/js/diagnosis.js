$(".ajax_form").on("submit", function(){
    var comment_text = $("#diagnosis").val();

    if(comment_text.length <= 0) return false;

    $.ajax({
        url: 'diagnosis',
        method: 'POST',
        data: {'text': comment_text},
        beforeSend: function(){
            $("#loader").fadeIn();

        },

        success: function(response){

            $("#result_text").html("");

            $("#result_text").html(response);

        }

    });

    return false;
});
