$(".ajax_form").on("submit", function(){
    var comment_text = $("#parse").val();

    if(comment_text.length <= 0) return false;

    $.ajax({
        url: 'parse',
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
