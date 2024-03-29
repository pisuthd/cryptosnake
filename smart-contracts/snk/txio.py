
from boa.interop.System.ExecutionEngine import GetScriptContainer, GetExecutingScriptHash
from boa.interop.Neo.Transaction import Transaction, GetReferences, GetOutputs, GetUnspentCoins
from boa.interop.Neo.Output import GetValue, GetAssetId, GetScriptHash


gas_asset_id = b'\xe7-(iy\xeel\xb1\xb7\xe6]\xfd\xdf\xb2\xe3\x84\x10\x0b\x8d\x14\x8ewX\xdeB\xe4\x16\x8bqy,`'


def get_asset_attachments():
    """
    Gets information about Gas attached to an invocation TX
    :return:
        list: A list with information about attached gas
    """

    tx = GetScriptContainer()
    references = tx.References

    receiver_addr = GetExecutingScriptHash()
    sender_addr = None
    sent_amount_gas = 0

    if len(references) > 0:

        reference = references[0]
        sender_addr = reference.ScriptHash
        for output in tx.Outputs:
            if output.ScriptHash == receiver_addr:
                #Only stick with GAS in this Hackathon
                #if output.AssetId == neo_asset_id:
                    #sent_amount_neo += output.Value
                if output.AssetId == gas_asset_id:
                    sent_amount_gas += output.Value

    return [receiver_addr, sender_addr, sent_amount_gas]
