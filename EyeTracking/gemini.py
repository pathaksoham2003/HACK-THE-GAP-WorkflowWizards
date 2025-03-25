from google import genai

client = genai.Client(api_key="AIzaSyDhzV_bwGBcitCr8yz5k9gnIcnOyLp6F-4")

question = "What is two plus two"
answer = 10
response = client.models.generate_content(
    model="gemini-2.0-flash", contents=f" {question} My answer is {answer}. Tell me my answer is correct or not. If correct give me 1 or give me 0. Don't give me extra text I only want binary answer to my question from you."
)
print(response.text)