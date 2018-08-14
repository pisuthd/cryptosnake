from snk.txio import *
from snk.token import *
from snk.nep5 import *
from snk.ico import mint, perform_exchange
from boa.interop.Neo.Runtime import GetTrigger, CheckWitness, Log
from boa.interop.Neo.TriggerType import Application, Verification
from boa.interop.Neo.Storage import Get, Put, GetContext, Delete

context = GetContext()
NEP5_METHODS = ['name', 'symbol', 'decimals', 'totalSupply', 'balanceOf', 'transfer', 'transferFrom', 'approve', 'allowance']

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

        return 'unknown operation'
    return False


def deploy():
    """
    :param token: Token The token to deploy
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






