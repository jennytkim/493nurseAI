import os, requests
from watson_developer_cloud import ConversationV1, LanguageTranslatorV2
from flask import Flask, jsonify, json, request, render_template
import infermedica_api


infermedica_api.configure(app_id='8eab6cb8', app_key='ff87a9caf26433944a6236f19e70173f')

conversation = ConversationV1(
username= '77580160-50e6-4687-968a-b4b78b8199f9',
password= '30IMzwWyQjfq',
version= '2017-05-26'
)
workspace_id = '957755fd-3d4c-4b76-854e-92154d6887d0'

language_translator = LanguageTranslatorV2(
  url= "https://gateway.watsonplatform.net/language-translator/api",
  username= "6da4c027-d554-4c56-89e4-4046e9771d3e",
  password= "tB1aSACjOSGx"
)

app = Flask(__name__)

global context
context = {}

@app.route('/')
def Welcome():
    return app.send_static_file('webpage.html')

@app.route('/conversation', methods=['GET', 'POST'])
def manage_conversation():
    global context

    if request.method == 'GET':
        return render_template('conversation.html')

    if "message" not in request.form or len(request.form["message"]) <= 0:
        return jsonify({'message': 'No message was provided.'}), 404

    message_response = conversation.message(workspace_id = workspace_id,
    message_input = {'text': request.form['message']}, context=context)
    context = message_response["context"]

    return jsonify(message_response)

@app.route('/symptom', methods=['GET', 'POST'])
def symptom():

    if request.method == 'GET':
        return render_template('symptom.html') 

    payload = request.form['text'] 

    translation = language_translator.translate(text=payload, model_id='fr-en')

    result = json.dumps(translation, indent=2) 

    return result

@app.route('/parse', methods=['GET', 'POST'])
def parse():

    if request.method == 'GET':
        return render_template('parse.html')

    url = "https://api.infermedica.com/v2/parse"

    data = json.dumps({'text': request.form['text']})

    headers = {
        'App-Id': "8eab6cb8",
        'App-Key': "ff87a9caf26433944a6236f19e70173f",
        'Content-Type': "application/json", 
        'Cache-Control': "no-cache",
        'Postman-Token': "d8f0311f-9bde-5f03-13ae-76c7698fa53f"
    }

    response = requests.request("POST", url, data= data, headers=headers)

    return (response.text)

@app.route('/diagnosis', methods=['GET', 'POST'])
def diagnosis():

    if request.method == 'GET':
        return render_template('diagnosis.html')

    url = "https://api.infermedica.com/v2/diagnosis"

    data = request.form['text']

    headers = {
        'App-Id': "8eab6cb8",
        'App-Key': "ff87a9caf26433944a6236f19e70173f",
        'Content-Type': "application/json", 
        'Cache-Control': "no-cache",
        'Postman-Token': "d8f0311f-9bde-5f03-13ae-76c7698fa53f"
    }

    final = requests.request("POST", url, data= data, headers=headers)

    return (final.text)

@app.route('/report')
def report():
    return app.send_static_file('report.html')
    
port = os.getenv('PORT', '5000')
if __name__ == "__main__":
	app.run(host='0.0.0.0', port=int(port), debug=True)
