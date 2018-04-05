/* 
    * parseMessage(message): Defined to handle what happens with
    *       the messages object which is returned from Watson Conversation
*/
function parseMessage(message) {
    if (! "output" in message || message['output']['text'].length <= 0) {
        // Return an Error Since the Messages Object is not well-formed
        $error_alert = $('<div class="alert alert-danger alert-dismissable fade show" role="alert" />');
        $error_alert.append('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        $error_alert.append('Watson Conversation is Experiencing an Issue Currently...');

        $("#messages").prepend($error_alert);
        return false;
    }

    // Clear any previous results
    $(".remove").remove();

    // Add the message
    $message = $('<div class="alert alert-dark col-md-7" />');
    $message.append("<strong>NurseAI: </strong>");
    $message.append(message['output']['text']);

    $("#messages-content").append($message);
}

/* 
    * The following code submits any arbitrary form with the class ajax_form
    * to the endpoint, with the method that is specified. In this sense, you 
    * can easily add this on to improve the functioning of an HTML form that 
    * you get to work without the jQuery;
    * In this case the success is programmed directly, given the data-attribute of
    * the form. This logic could be extracted outside of the success call relatively
    * easily.
*/ 
$(".ajax_form").on("submit", function(){
    var url = $(this).attr("action"),
        method = $(this).attr("method"),
        data = $(this).serializeArray(),
        form_id = $(this).data("id");

    $.ajax({
        url: url,
        method: method,
        data: data,
        beforeSend: function() {
            if (form_id === 'conversation') {
                // Add the submitted message to the conversation, after ensuring that "remove" are removed
                $(".remove").remove();
                $message = $('<div class="alert alert-primary col-md-7 ml-auto" />');
                $message.append("<strong>You: </strong>");
                $message.append($("textarea[name='message']").val());
                $("textarea[name='message']").val("");
                $("#messages-content").append($message);
            }
        },
        success: function(response) {
            if (form_id === "conversation") {
                // Call the parseMessage on the response
                parseMessage(response);
            }
        }
    });

    // Prevent Form Submission
    return false;
});

