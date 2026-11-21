const rpcUrl = 'https://api.mainnet.solana.com';
const form = document.querySelector('#launch-form');
const prepare = document.querySelector('#prepare');
const publish = document.querySelector('#publish');
const review = document.querySelector('#review');
const summary = document.querySelector('#summary');
const status = document.querySelector('#launch-status');
const result = document.querySelector('#launch-result');
const encoder = new TextEncoder();
let draft;
let busy = false;
let sdk;

function wallet() {
  const phantom = window.phantom?.solana;
  if (!phantom?.isPhantom) throw new Error('Open this page with the Phantom browser extension or in-app browser.');
  return phantom;
}

function addLink(label, href) {
  const link = document.createElement('a');
  link.textContent = label;
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  result.append(link, ' ');
}

function invalidate() {
  draft = undefined;
  review.hidden = true;
}

form.addEventListener('input', invalidate);

async function buildLaunch(values) {
  const provider = wallet();
  const { publicKey } = await provider.connect();
  sdk ??= Promise.all([
    import('https://esm.sh/@solana/web3.js@1.98.4?bundle'),
    import('https://esm.sh/@pump-fun/pump-sdk@4.3.1?bundle&deps=@solana/web3.js@1.98.4'),
  ]).catch((error) => { sdk = undefined; throw error; });
  const [{ Connection, Keypair, PublicKey, TransactionMessage, VersionedTransaction }, { PUMP_SDK }] = await sdk;
  const creator = new PublicKey(publicKey.toBase58());
  const mint = Keypair.generate();
  const instruction = await PUMP_SDK.createV2Instruction({
    mint: mint.publicKey,
    name: values.name,
    symbol: values.symbol,
    uri: values.uri,
    creator,
    user: creator,
    mayhemMode: false,
    holderReward: false,
  });
  const connection = new Connection(rpcUrl, 'confirmed');
  const block = await connection.getLatestBlockhash();
  const message = new TransactionMessage({
    payerKey: creator,
    recentBlockhash: block.blockhash,
    instructions: [instruction],
  }).compileToV0Message();
  const transaction = new VersionedTransaction(message);
  const simulated = await connection.simulateTransaction(transaction, { sigVerify: false });
  if (simulated.value.err) throw new Error('Simulation rejected the launch: ' + JSON.stringify(simulated.value.err));
  const fee = await connection.getFeeForMessage(message);
  if (fee.value === null) throw new Error('Could not estimate the transaction fee. Please review again.');
  transaction.sign([mint]);
  return { provider, connection, transaction, creator, mint: mint.publicKey, block, fee: fee.value };
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy) return;
  invalidate();
  result.replaceChildren();
  const data = new FormData(form);
  const values = {
    name: String(data.get('name')).trim(),
    symbol: String(data.get('symbol')).trim().toUpperCase(),
    uri: String(data.get('uri')).trim(),
  };
  if (!values.name || encoder.encode(values.name).length > 32 || !/^[A-Z0-9]{1,10}$/.test(values.symbol) ||
      !values.uri.startsWith('https://') || encoder.encode(values.uri).length > 200) {
    status.textContent = 'Use a name of at most 32 UTF-8 bytes, a 1–10 character ticker, and an HTTPS metadata URL of at most 200 bytes.';
    return;
  }
  busy = true;
  prepare.disabled = true;
  status.textContent = 'Connecting wallet and simulating the launch…';
  try {
    const prepared = await buildLaunch(values);
    if (Array.from(data).some(([key, value]) => form.elements.namedItem(key).value !== value)) {
      status.textContent = 'The form changed. Review again.';
      return;
    }
    summary.replaceChildren();
    for (const [label, value] of [
      ['Token', values.name + ' (' + values.symbol + ')'], ['Metadata', values.uri],
      ['Wallet', prepared.creator.toBase58()], ['New Mint address', prepared.mint.toBase58()],
      ['Estimated network fee', (prepared.fee / 1e9) + ' SOL, plus on-chain account rent or program costs'],
    ]) {
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = label;
      description.textContent = value;
      summary.append(term, description);
    }
    draft = prepared;
    review.hidden = false;
    status.textContent = 'Simulation passed. Review the details before signing.';
  } catch (error) {
    status.textContent = error?.message || 'Unable to prepare the launch.';
  } finally {
    busy = false;
    prepare.disabled = false;
  }
});

publish.addEventListener('click', async () => {
  if (!draft || busy) return;
  const prepared = draft;
  let signature;
  let sent = false;
  busy = true;
  prepare.disabled = true;
  publish.disabled = true;
  try {
    if (prepared.provider.publicKey?.toBase58() !== prepared.creator.toBase58()) {
      throw new Error('Your wallet account changed. Please review again.');
    }
    if (await prepared.connection.getBlockHeight('confirmed') > prepared.block.lastValidBlockHeight) {
      throw new Error('The transaction expired. Please review again.');
    }
    status.textContent = 'Approve the launch in Phantom.';
    const signed = await prepared.provider.signTransaction(prepared.transaction);
    sent = true;
    addLink('Check Mint on Solscan', 'https://solscan.io/token/' + prepared.mint);
    signature = await prepared.connection.sendRawTransaction(signed.serialize(), { preflightCommitment: 'confirmed' });
    addLink('View transaction', 'https://solscan.io/tx/' + signature);
    status.textContent = 'Transaction submitted. Waiting for confirmation…';
    const confirmation = await prepared.connection.confirmTransaction({ ...prepared.block, signature }, 'confirmed');
    if (confirmation.value.err) {
      status.textContent = 'The transaction failed on-chain. Open the transaction to see the details.';
      return;
    }
    status.textContent = 'Token created. Mint: ' + prepared.mint;
    addLink('Open token on Pump.fun', 'https://pump.fun/coin/' + prepared.mint);
  } catch (error) {
    status.textContent = sent
      ? 'Confirmation is unavailable. Check the Mint or transaction before attempting another launch.'
      : error?.message || 'The wallet did not sign the transaction.';
  } finally {
    invalidate();
    busy = false;
    prepare.disabled = false;
    publish.disabled = false;
  }
});
