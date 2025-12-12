import os
from binance.client import Client
from binance.enums import *
from binance.exceptions import BinanceAPIException, BinanceOrderException

# Store API keys as env variables for safety or paste them directly (NOT recommended)
API_KEY = os.getenv("BINANCE_API_KEY") or "YOUR_TESTNET_API_KEY"
API_SECRET = os.getenv("BINANCE_API_SECRET") or "YOUR_TESTNET_API_SECRET"
BASE_URL = 'https://testnet.binancefuture.com'

class BasicBot:
    def __init__(self, api_key, api_secret, testnet=True):
        self.client = Client(api_key, api_secret)
        if testnet:
            self.client.FUTURES_API_URL = BASE_URL

    def place_order(self, symbol, side, order_type, quantity, price=None):
        try:
            if order_type == ORDER_TYPE_MARKET:  # Market Order
                order = self.client.futures_create_order(
                    symbol=symbol,
                    side=side,
                    type=order_type,
                    quantity=quantity
                )
            elif order_type == ORDER_TYPE_LIMIT:  # Limit Order
                order = self.client.futures_create_order(
                    symbol=symbol,
                    side=side,
                    type=order_type,
                    price=price,
                    quantity=quantity,
                    timeInForce=TIME_IN_FORCE_GTC
                )
            else:
                print("Unsupported order type!")
                return None
            print("Order placed:", order)
            return order
        except BinanceAPIException as e:
            print("API Exception:", e)
        except BinanceOrderException as e:
            print("Order Exception:", e)
        except Exception as e:
            print("Other Exception:", e)
        return None

    def show_balance(self):
        balance = self.client.futures_account_balance()
        print("Balance:", balance)
        return balance

if __name__ == "__main__":
    bot = BasicBot(API_KEY, API_SECRET, testnet=True)
    print("Welcome to the CLI Trading Bot!")
    bot.show_balance()
    symbol = input("Enter symbol (e.g., BTCUSDT): ").upper()
    side = input("Buy or Sell? (BUY/SELL): ").upper()
    order_type = input("Order type (MARKET/LIMIT): ").upper()
    quantity = float(input("Quantity: "))
    price = None
    if order_type == "LIMIT":
        price = float(input("Limit price: "))
    bot.place_order(symbol, side, order_type, quantity, price)
