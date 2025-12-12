import requests

def get_weather(city, api_key):
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        temp = data['main']['temp']
        humidity = data['main']['humidity']
        wind_speed = data['wind']['speed']
        description = data['weather'][0]['description']
        print(f'Weather in {city}:')
        print(f'Temperature: {temp}°C')
        print(f'Humidity: {humidity}%')
        print(f'Wind Speed: {wind_speed} m/s')
        print(f'Description: {description}\n')
    else:
        print("City not found or error in API request.")

if __name__ == "__main__":
    api_key = "7bece2259c4386df4b926032f0dd43bc"  # Replace with your OpenWeatherMap API Key
    while True:
        city = input("Enter city name (or 'exit' to stop): ")
        if city.lower() == 'exit':
            break
        get_weather(city, api_key)
