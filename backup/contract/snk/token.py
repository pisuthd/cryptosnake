"""
Settings for QPS Token
"""

from boa.interop.Neo.Storage import *

TOKEN_NAME = 'Fruit'

TOKEN_SYMBOL = 'SNK'

TOKEN_DECIMALS = 8



# This is the script hash of the address for the owner of the token
TOKEN_OWNER = b'\x03\x1a\x6c\x6f\xbb\xdf\x02\xca\x35\x17\x45\xfa\x86\xb9\xba\x5a\x94\x52\xd7\x85\xac\x4f\x7f\xc2\xb7\x54\x8c\xa2\xa4\x6c\x4f\xcf\x4a'

TOKEN_CIRC_KEY = b'in_circulation'

TOKEN_TOTAL_SUPPLY = 100000000 * 100000000  # 100m of Total Supply eg. 1B. SNK Token

TOKEN_INITIAL_AMOUNT = 25000000 * 100000000  # 25m contribute to the Lucky Guy (Owner)

# we're accepting GAS in 1 usd per 1 qps
TOKENS_PER_GAS = 20 * 100000000




def crowdsale_available_amount(ctx):
    """
    :return: int The amount of tokens left for sale in the crowdsale
    """

    in_circ = Get(ctx, TOKEN_CIRC_KEY)

    available = TOKEN_TOTAL_SUPPLY - in_circ

    return available


def add_to_circulation(ctx, amount):
    """
    Adds an amount of token to circlulation
    :param amount: int the amount to add to circulation
    """

    current_supply = Get(ctx, TOKEN_CIRC_KEY)

    current_supply += amount
    Put(ctx, TOKEN_CIRC_KEY, current_supply)
    return True


def get_circulation(ctx):
    """
    Get the total amount of tokens in circulation
    :return:
        int: Total amount in circulation
    """
    return Get(ctx, TOKEN_CIRC_KEY)
