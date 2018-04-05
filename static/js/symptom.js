$(".ajax_form").on("submit", function(){
    var comment_text = $("#symptom").val();

    if(comment_text.length <= 0) return false;

    $.ajax({
        url: 'symptom',
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
