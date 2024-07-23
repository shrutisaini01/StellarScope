from flask import Flask, request, jsonify, render_template
from openai import OpenAI
from .env import load_dotenv

load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')
openai_client = OpenAI(api_key=openai_api_key)
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')



@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        user_input = request.json['message']

        # Call OpenAI API to get response
        response = get_openai_response(user_input)

        return jsonify({'response': response}), 200  # Returning (body, status)
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Returning (body, status)


def get_openai_response(user_query):
    system_prompt = """ 
    You are a helpful and will provide the all the information related to space solar system


 """

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_query}
    ]

    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )

    query_str = response.choices[0].message.content.strip()
    print(query_str)
    return response.choices[0].message.content.strip()







if __name__ == '__main__':
    app.run(debug=True)