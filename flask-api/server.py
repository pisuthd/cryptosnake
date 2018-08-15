

import os
import threading
import requests
import json
import argparse
import sys
import binascii
import logging

# load python flask 
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
app.secret_key = "cryptosnake-dev"

current_dir = os.path.dirname(os.path.abspath(__file__))
PROTOCOL_CONFIG = os.path.join(current_dir, "../neo/data/protocol.testnet.json")


snk = {
    'address' : '',
    'nep2' : '',
    'nep2_pass' : ''
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


#jwt = JWT(app, authenticate, identity)  # /auth
CORS(app, origins="*", allow_headers=["Content-Type", "Authorization",
                                      "Access-Control-Allow-Credentials"], supports_credentials=True)

api.add_resource(Home, '/')

@app.route("/api/public/defaultConfig", methods=['GET'])
def defaultConfig():
    response = {
        'cfg' : game_default,
        'server' : ['devnet'],
        'current_height': Blockchain.Default().Height
    }
    return jsonify(response)


# claim an reward 
@app.route('/api/private/claimReward', methods=['POST'])
def create_item():
    """
        Request Example :
        {
            address: 'ASgTEgv7VEeUGBhB3a9THw9Fai2hK4egpz'
            score: 10
        }
    """
    if not request.json or not 'address' or not 'score' in request.json:
        abort(400)
    body = request.json
    player_address = body["address"]
    amount = body["score"]
    smart_contract.add_invoke("transfer", snk['address'], player_address, amount)
    response = {
        'status': 'ok'
    }
    return jsonify(response)


@app.route("/api/public/chainInfo", methods=['GET'])
def chainInfo():
    response = {
        'name': 'NEO.privnet',
        'current_height': Blockchain.Default().Height,
        'version': settings.VERSION_NAME,
        'peer_count': len(NodeLeader.Instance().Peers)
    }
    return jsonify(response)


class smartContract(threading.Thread):
    smart_contract = None
    contract_hash = None

    wallet_path = None
    wallet_pass = None

    tx_in_progress = None

    invoke_queue = None  # Queue items are always a tuple (method_name, args)
    wallet = None
    _walletdb_loop = None

    def __init__(self, contract_hash, wallet_path, wallet_pass):
        super(smartContract, self).__init__()
        self.daemon = True

        self.contract_hash = contract_hash
        self.wallet_path = wallet_path
        self.wallet_pass = wallet_pass

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
        # hardcode owner key
        NEP2 = snk['nep2']
        passpharse = snk['nep2_pass']
        prikey = KeyPair.PrivateKeyFromNEP2(NEP2, passpharse)
        logger.info("Create a new wallet...")
        self.wallet = UserWallet.Create(WalletFixtureTestCase.new_wallet_dest(), to_aes_key('awesomepassword'))
        keypair = self.wallet.CreateKey(prikey)
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
        # TODO 2: later could bundle multiple invokes into a single tx
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

smart_contract = smartContract('e465ca59ed24e0108233f336bf9f2b0156242ee3', '', '')


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

    #smart_contract.start()
    #smart_contract.add_invoke('circulation')
    
    logger.info("Everything setup and running. Waiting for events...")
    reactor.run()
    logger.info("Shutting down.")



if __name__ =='__main__':
    main()
