

import os
import threading
import requests
import json
import argparse
import sys
import binascii
import logging



# load python flask 
from functools import wraps
from flask import Flask, request, jsonify, abort
from flask_restful import Resource as flask_resource, Api as flask_api, reqparse
from flask_jwt import JWT, jwt_required
from flask_cors import cross_origin, CORS



# load neo-python
from neocore.UIntBase import UIntBase
from neocore.UInt256 import UInt256
from neo.Prompt.Commands.Invoke import InvokeContract, TestInvokeContract, test_invoke
from neo.Wallets.NEP5Token import NEP5Token
from neocore.KeyPair import KeyPair
from neo.Utils.WalletFixtureTestCase import WalletFixtureTestCase
from neo.Implementations.Wallets.peewee.UserWallet import UserWallet
from neo.Wallets.utils import to_aes_key
from neo.Network.NodeLeader import NodeLeader
from neo.Core.Blockchain import Blockchain
from neo.Implementations.Blockchains.LevelDB.LevelDBBlockchain import LevelDBBlockchain
from neo.Settings import settings
from neo.Network.api.decorators import json_response, gen_authenticated_decorator, catch_exceptions
from neo.contrib.smartcontract import SmartContract
from neo.Settings import settings

from neocore.Cryptography.Helper import *

from neo.Core.State.StorageKey import StorageKey



from datetime import timedelta
from time import sleep
from Crypto import Random
from logzero import logger
from twisted.internet import reactor, task, endpoints
from twisted.web.server import Request, Site
from twisted.web.wsgi import WSGIResource
from klein import Klein, resource

from twisted.web.resource import Resource
from logging import Formatter, FileHandler
from Crypto.Cipher import AES


from queue import Queue
import time


EXPIRES_IN = 1800

app = Flask(__name__)

api = flask_api(app)
app.config['JWT_AUTH_HEADER_PREFIX'] = 'Bearer'
app.secret_key = "cryptosnake-testnet-1234"

current_dir = os.path.dirname(os.path.abspath(__file__))
PROTOCOL_CONFIG = os.path.join(current_dir, "../neo/data/protocol.testnet.json")

# nep5 script hash -  2391290b28f12f92e81750efb3e3047be4381780

SNK = {
    'script_hash' : '0x2391290b28f12f92e81750efb3e3047be4381780',
    #'nep2' : '6PYVEcQPbVcW4NFrwN3Zr1FYyMdCtHRZQZKfmA42uYhNwLE9tsYrSqBzTX',
    #'nep2_pass' : 'Ohm8288&eybok'
}


game_default = {
    "hero_rotation_speed": 10,
    "hero_speed_up": 15,
    "hero_speed": 10,
    "snakes_AI_speed": [10, 10, 10, 10],
    "food_score": [1],
    "fullscreen": True,
    "check_orientation": True 
}

class Home(flask_resource):
    def get(self):
        return {'status': 'ok'}

# simple authorization module to prevent unauthorize access
def require_appkey(view_function):
    @wraps(view_function)
    # the new, post-decoration function. Note *args and **kwargs here.
    def decorated_function(*args, **kwargs):
        if request.headers.get('x-api-key') and request.headers.get('x-api-key') == app.secret_key:
            return view_function(*args, **kwargs)
        else:
            abort(401)
    return decorated_function



#helper class
class UInt160(UIntBase):
    def __init__(self, data=None):
        super(UInt160, self).__init__(num_bytes=20, data=data)

    @staticmethod
    def ParseString(value):
        if value[0:2] == '0x':
            value = value[2:]
        if not len(value) == 40:
            raise Exception("Invalid UInt160 Format: %s chars != 40 chars" % len(value))
        reversed_data = bytearray.fromhex(value)
        reversed_data.reverse()
        return UInt160(data=reversed_data)

CORS(app, origins="*", allow_headers=["Content-Type", "Authorization","x-api-key","Access-Control-Allow-Credentials"], supports_credentials=True)

api.add_resource(Home, '/')

@app.route("/api/config", methods=['GET'])
@require_appkey
def defaultConfig():
    response = {
        'cfg' : game_default,
        'server' : ['testnet'],
        'current_height': Blockchain.Default().Height
    }
    return jsonify(response)



@app.route("/api/chain", methods=['GET'])
@require_appkey
def chainInfo():
    response = {
        'name': 'NEO.testnet',
        'current_height': Blockchain.Default().Height,
        'version': settings.VERSION_NAME,
        'peer_count': len(NodeLeader.Instance().Peers)
    }
    return jsonify(response)


# get user balance
@app.route("/api/user/<pubkey>", methods=['GET'])
@require_appkey
def balance(pubkey):
    try:
        script_hash = UInt160.ParseString(SNK['script_hash'])
        user_script_hash = pubkey_to_pubhash(pubkey.encode('utf-8'))
        #key = binascii.unhexlify(user_script_hash.encode('utf-8'))
        storage_key = StorageKey(script_hash=script_hash, key=user_script_hash)
        storage_item = Blockchain.Default().GetStorageItem(storage_key)
        if storage_item:
            bal = int.from_bytes(storage_item.Value, byteorder="little")
            response = {
                'pubkey': pubkey,
                'balance' : bal
            }
            return jsonify(response)
        else:
            response = {
                'pubkey': pubkey,
                'balance' : 0
            }
            return jsonify(response)
    except Exception as e:
            logger.exception(e)
            abort(500)

# claim a score 
@app.route("/api/claim", methods=['POST'])
@require_appkey
def get_an_reward():
    """
        Request Example :
        {
            pubkey: '02e496e35362f7c625c6386d5adf7e0a61d9a001ca4885ebc26b23e67c1eabfc78'
            score: 10
        }
    """
    data = request.data
    dataJson = json.loads(data)
    if not dataJson or not 'pubkey' in dataJson or not 'score' in dataJson:
        abort(400)
    try:
        player_pubkey = dataJson["pubkey"]
        amount = dataJson["score"]*100000000
         
        user_script_hash = pubkey_to_pubhash(player_pubkey.encode('utf-8'))

        coinbase_script_hash = pubkey_to_pubhash('02b232aca1442f95648314642768fb8359bcd2d2bb21f81a789e3ad023e8ec7573'.encode('utf-8'))

        smart_contract.add_invoke("transfer", coinbase_script_hash, user_script_hash, amount)
        response = {
            'status': 'ok'
        }
        return jsonify(response)
    except Exception as e:
            logger.exception(e)
            abort(500)


# not used
# create a bet contract 
@app.route('/api/bet', methods=['POST'])
def create_bet():
    """
        Request Example :
        {
            uid: '1'
            owner : 'xxxxxxx'
            bounty: 10
            snake : 3
            speed : 2
        }
    """
    if not request.json or not 'uid' or not 'owner' or not 'bounty' or not 'snake' or not 'speed' in request.json:
        abort(400)
    body = request.json
    uid = body["uid"]
    owner = body["owner"]
    bounty = body["bounty"]
    snake = body["snake"]
    speed = body["speed"]
    smart_contract.add_invoke("create_bet_contract", uid,owner,bounty,snake,speed)
    response = {
        'status': 'ok'
    }
    return jsonify(response)


# not used
# claim an challenge
@app.route('/api/bet', methods=['POST'])
def cliam_challenge():
    """
        Request Example :
        {
            uid: '1'
            owner : 'xxxxxxx'
            to: 'yyyyyy'
        }
    """
    if not request.json or not 'uid' or not 'owner' or not 'bounty' or not 'snake' or not 'speed' in request.json:
        abort(400)
    body = request.json
    uid = body["uid"]
    owner = body["owner"]
    bounty = body["bounty"]
    snake = body["snake"]
    speed = body["speed"]
    smart_contract.add_invoke("create_bet_contract", uid,owner,bounty,snake,speed)
    response = {
        'status': 'ok'
    }
    return jsonify(response)






class smartContract(threading.Thread):
    smart_contract = None
    contract_hash = None

    tx_in_progress = None

    invoke_queue = None  # Queue items are always a tuple (method_name, args)
    wallet = None
    _walletdb_loop = None

    def __init__(self, contract_hash):
        super(smartContract, self).__init__()
        self.daemon = True

        self.contract_hash = contract_hash


        self.smart_contract = SmartContract(contract_hash)
        self.invoke_queue = Queue()
        self.tx_in_progress = None
        self.wallet = None

        settings.set_log_smart_contract_events(False)

        @self.smart_contract.on_notify
        def sc_notify(event):
            """ This method catches Runtime.Notify calls, and updates the balances cache """
            logger.info("sc_notify event: %s", str(event))

    def add_invoke(self, method_name, *args):
        logger.info("SmartContractInvokeQueue add_invoke %s %s" % (method_name, str(args)))
        logger.info("- queue size: %s", self.invoke_queue.qsize())
        self.invoke_queue.put((method_name, args))

    def run(self):
        while True:
            task = self.invoke_queue.get()
            logger.info("SmartContractInvokeQueue Task: %s", str(task))
            method_name, args = task
            logger.info("- method_name: %s, args: %s", method_name, task)
            logger.info("- queue size: %s", self.invoke_queue.qsize())

            try:
                self.invoke_method(method_name, *args)

            except Exception as e:
                logger.exception(e)

                # Wait a few seconds
                logger.info("wait 60 seconds...")
                time.sleep(60)

                # Re-add the task to the queue
                logger.info("Re-adding task to queue")
                self.invoke_queue.put(task)

            finally:
                # Always mark task as done, because even on error it was done and re-added
                self.invoke_queue.task_done()

    def open_wallet(self):
        """ Open a wallet. Needed for invoking contract methods. """
        
        assert self.wallet is None
        #NEP2 = SNK['nep2']
        #passpharse = SNK['nep2_pass']
        #prikey = KeyPair.PrivateKeyFromNEP2(NEP2, passpharse)
        #logger.info("Create an relay wallet...")
        #self.wallet = UserWallet.Create(WalletFixtureTestCase.new_wallet_dest(), to_aes_key('awesomepassword'))
        #keypair = self.wallet.CreateKey(prikey)
        # todo: won't use hard code
        self.wallet = UserWallet.Open('../cryptosnake', to_aes_key('Ohm8288&eybok'))
        self._walletdb_loop = task.LoopingCall(self.wallet.ProcessBlocks)
        self._walletdb_loop.start(1)

    def close_wallet(self):
        self._walletdb_loop.stop()
        self._walletdb_loop = None
        self.wallet = None

    def wallet_has_gas(self):
        # Make sure no tx is in progress and we have GAS
        synced_balances = self.wallet.GetSyncedBalances()
        for balance in synced_balances:
            asset, amount = balance
            logger.info("- balance %s: %s", asset, amount)
            if asset == "NEOGas" and amount > 0:
                return True

        return False

    def _wait_for_tx(self, tx, max_seconds=300):
        """ Wait for tx to show up on blockchain """
        sec_passed = 0
        while sec_passed < max_seconds:
            _tx, height = Blockchain.Default().GetTransaction(tx.Hash.ToString())
            if height > -1:
                return True
            # logger.info("Waiting for tx {} to show up on blockchain...".format(tx.Hash.ToString()))
            time.sleep(5)
            sec_passed += 5

        logger.error("Transaction was relayed but never accepted by consensus node")
        return False

    def invoke_method(self, method_name, *args):
        """ invoke a method of the smart contract """
        logger.info("invoke_method: method_name=%s, args=%s", method_name, args)
        logger.info("Block %s / %s" % (str(Blockchain.Default().Height), str(Blockchain.Default().HeaderHeight)))

        self.open_wallet()

        if not self.wallet:
            raise Exception("Open a wallet before invoking a smart contract method.")

        if self.tx_in_progress:
            raise Exception("Transaction already in progress (%s)" % self.tx_in_progress.Hash.ToString())

        logger.info("making sure wallet is synced...")
        time.sleep(3)

        # Wait until wallet is synced:
        while True:
            percent_synced = int(100 * self.wallet._current_height / Blockchain.Default().Height)
            if percent_synced > 99:
                break
            logger.info("waiting for wallet sync... height: %s. percent synced: %s" % (self.wallet._current_height, percent_synced))
            time.sleep(5)

        time.sleep(3)
        logger.info("wallet synced. checking if gas is available...")

        if not self.wallet_has_gas():
            logger.error("Oh now, wallet has no gas! Trying to rebuild the wallet...")
            raise Exception("Wallet has no gas.")

        _args = [self.contract_hash, method_name, str(list(args))]
        logger.info("TestInvokeContract args: %s", _args)
        tx, fee, results, num_ops = TestInvokeContract(self.wallet, _args)
        if not tx:
            raise Exception("TestInvokeContract failed")

        logger.info("TestInvokeContract done, calling InvokeContract now...")
        sent_tx = InvokeContract(self.wallet, tx, fee)

        if sent_tx:
            logger.info("InvokeContract success, transaction underway: %s" % sent_tx.Hash.ToString())
            self.tx_in_progress = sent_tx

            found = self._wait_for_tx(sent_tx)
            if found:
                logger.info("✅ tansaction found! all done!")
            else:
                logger.error("=== TX not found!")

            self.close_wallet()

            # time.sleep(100)
            self.tx_in_progress = None
            logger.info("InvokeContract done, tx_in_progress freed.")

        else:
            raise Exception("InvokeContract failed")

smart_contract = smartContract(SNK['script_hash'])


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-c", "--config", action="store", help="Config file (default. %s)" % PROTOCOL_CONFIG,
                        default=PROTOCOL_CONFIG)
    args = parser.parse_args()
    settings.setup(args.config)
    logger.info("Start server.py")
    # Setup the blockchain
    blockchain = LevelDBBlockchain(settings.chain_leveldb_path)
    Blockchain.RegisterBlockchain(blockchain)
    dbloop = task.LoopingCall(Blockchain.Default().PersistBlocks)
    dbloop.start(.1)
    NodeLeader.Instance().Start()
    # Disable smart contract events for external smart contracts
    settings.set_log_smart_contract_events(False)
    # Start a thread with custom code
    # to be put
    flask_site = WSGIResource(reactor, reactor.getThreadPool(), app)
    reactor.listenTCP(8080, Site(flask_site))

    smart_contract.start()
    #smart_contract.add_invoke('circulation')
    
    logger.info("Everything setup and running. Waiting for events...")
    reactor.run()
    logger.info("Shutting down.")



if __name__ =='__main__':
    main()
