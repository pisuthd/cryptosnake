"""
Settings for SNK Token
"""

from boa.interop.Neo.Storage import *

TOKEN_NAME = 'Snake'

TOKEN_SYMBOL = 'SNK'

TOKEN_DECIMALS = 8



# This is the script hash of the address for the owner of the token
# address : AHjQprtLMWe1ngUH5kvqLsCiadmUJwHqb5 , hash : 157907c32027ab409577803012f2db29a7fc55e9 , pubkey : 02b232aca1442f95648314642768fb8359bcd2d2bb21f81a789e3ad023e8ec7573
TOKEN_OWNER = b'\x15\x79\x07\xc3\x20\x27\xab\x40\x95\x77\x80\x30\x12\xf2\xdb\x29\xa7\xfc\x55\xe9'


TOKEN_CIRC_KEY = b'in_circulation'

TOKEN_TOTAL_SUPPLY = 100000000 * 100000000  # 100m of Total Supply eg. 1B. SNK Token

TOKEN_INITIAL_AMOUNT = 100000000 * 100000000  # then contribute to the owner 100%

# we're accepting GAS in 1 usd per 1 snk
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
