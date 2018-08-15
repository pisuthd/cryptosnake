from snk.txio import *
from snk.token import *
from snk.nep5 import *
from snk.ico import mint, perform_exchange
from boa.interop.Neo.Runtime import GetTrigger, CheckWitness, Log
from boa.interop.Neo.TriggerType import Application, Verification
from boa.interop.Neo.Storage import Get, Put, GetContext, Delete

context = GetContext()
NEP5_METHODS = ['name', 'symbol', 'decimals', 'totalSupply',
                'balanceOf', 'transfer', 'transferFrom', 'approve', 'allowance']

game_address = ''

"""
#deploy NEP5-based SNK Token
#don't forget to change TOKEN_OWNER in snk/token.py with token's owner hash key
testinvoke 3f50d55c3a4e31288bc200ca6663701744996908 deploy []

#inspect circulation
testinvoke 3f50d55c3a4e31288bc200ca6663701744996908 circulation []

#import token into neo-python
import token 3f50d55c3a4e31288bc200ca6663701744996908

"""


def Main(operation, args):
    trigger = GetTrigger()
    if trigger == Verification():
        # check if the invoker is the owner of this contract
        is_owner = CheckWitness(TOKEN_OWNER)
        # If owner, proceed
        if is_owner:
            return True

        return False
    elif trigger == Application():
        for op in NEP5_METHODS:
            if operation == op:
                return handle_nep51(context, operation, args)
        if operation == 'deploy':
            return deploy()
        elif operation == 'circulation':
            return get_circulation(context)
        elif operation == 'create_bet_contract':

        return 'unknown operation'
    return False


def create_bet_contract(uid, owner, bounty, snake, speed):
    """
    :param uid: Unique Id for the contract
    :param owner: Owner address
    :param bounty: Bounty to be used
    :param snake: Total snake to be deployed in the game
    :param speed: Speed of the player in the game
    :return:
        bool: Whether the operation was successful
    """
    if not CheckWitness(owner):
        return False
    Log('Make a bet contract')
    if (bounty <= 0):
        Notify("Bounty need to be > 0")
        return False
    from_balance = Get(context, address)
    if from_balance < bounty:
        print("Insufficient tokens for the contract")
        return False
    balance = from_balance - price
    Put(context, address, balance)
    Put(context, uid, owner)
    key = concat(uid, '/bounty')
    Put(context, key, bounty)
    # set total snake in the game
    key = concat(uid, '/snake')
    Put(context, key, snake)
    # set a player speed
    key = concat(uid, '/speed')
    Put(context, key, speed)

    Log("Done!")

    return True


def claim_challenge(uid, owner,to):
    """
    :param uid: contract id
    :param owner: owner need to release the deposit and get refund 20%
    :param to: winner address
    :return:
        bool: Whether the operation was successful
    """
    if not CheckWitness(owner):
        return False
    Log('Releasing Deposit')
    deposit = Get(context,concat(uid, '/bounty'))
    
    # refund back to the owner 20%
    owner_balance = Get(context, owner)
    # give winner 60%
    to_balance = Get(context, to)
    # game takes commission 20%
    game_balance =  Get(context, game_address)

    update_owner_balance = owner_balance+(deposit*0.2)

    update_to_balance = to_balance+(deposit*0.6)

    update_game_balance = game_address+(deposit*0.2)

    Put(context,owner,update_owner_balance)
    Put(context,to,update_to_balance)
    Put(context,game_address,update_game_balance)

    # clear contract data
    Delete(context, concat(uid)
    Delete(context, concat(uid, '/bounty'))
    Delete(context, concat(uid, '/deposit'))
    Delete(context, concat(uid, '/snake'))
    Log('Deposit has been released!')
    return True



def deploy():
    """
    :return:
        bool: Whether the operation was successful
    """
    if not CheckWitness(TOKEN_OWNER):
        print("Must be owner to deploy")
        return False

    if not Get(context, 'initialized'):
        # do deploy logic
        Put(context, 'initialized', 1)
        Put(context, TOKEN_OWNER, TOKEN_INITIAL_AMOUNT)
        return add_to_circulation(context, TOKEN_INITIAL_AMOUNT)

    return False
