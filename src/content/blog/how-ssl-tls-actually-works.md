---
title: 'How SSL/TLS actually works: three designs, one fix'
description: 'Three ways to secure a connection, why the first two fail against an attacker in the middle, and how certificates close the gap.'
pubDate: 2026-08-31
tags: ['Security', 'Networking', 'TLS']
cover: './cover.svg'
coverAlt: 'A padlock icon over a chain linking a browser, an intercepted key exchange, and a signed certificate'
---

There's a padlock in your browser's address bar right now. Most people know it means "secure" and stop thinking about it there. I did too, for years, until I had to configure a certificate myself and realised I could describe what the padlock meant without being able to explain why it worked.

Most explanations don't help with that, because they start with certificates. I think that's the wrong place to begin. Certificates are the answer to a question, and if nobody shows you the question first, the answer looks arbitrary. You end up memorising vocabulary instead of understanding a design.

So this post builds up to certificates instead of starting from them. Three designs, in order. The first two fail, and the way each one fails is what forces the next.

## A note on the name

The protocol behind the padlock is [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security), Transport Layer Security. SSL was the older version, and it's obsolete. TLS 1.0 and 1.1 were formally deprecated in 2021 by [RFC 8996](https://www.rfc-editor.org/rfc/rfc8996.html), which moved them to Historic status because they can't support current cryptographic algorithms. What runs today is TLS 1.2 or 1.3.

Everyone still says SSL anyway. Certificate vendors sell "SSL certificates." Your hosting panel probably has an SSL tab. The name outlived the thing, and fighting it is pointless, so I'll write SSL/TLS and mean TLS.

## Scenario 1: just encrypt the data

Start with the simplest possible version of the problem. A browser wants to send something private to a server. A password, a card number, a message.

Send it as it is and anyone on the network path can read it. That's not a hypothetical: a compromised router, someone running a packet sniffer on the same café WiFi, an ISP that logs traffic. HTTP traffic is plain text and always was.

The obvious fix is to scramble it. The client encrypts with a key, the server decrypts with the same key. One key, both directions. This is [symmetric encryption](https://en.wikipedia.org/wiki/Symmetric-key_algorithm), and it's genuinely good: fast, mature, and the modern algorithms like AES have held up under decades of attack.

Then you try to actually use it and hit a wall.

The server needs that key. It has no way to decrypt anything without it. So the client has to send the key across the network first, and that's the same network the attacker is already watching. He copies the key as it goes past, and every message after that is readable.

We didn't solve anything. We moved the problem. Before, we needed a safe way to send the data. Now we need a safe way to send the key, and we're no better equipped than we were. If a safe channel existed, we could have sent the data over it in the first place.

This is the [key distribution problem](https://en.wikipedia.org/wiki/Key_distribution), and it isn't a small implementation detail. It blocked cryptography for most of its history. Armies and embassies handled it by physically transporting codebooks in locked cases, which works fine when you have couriers and terrible when you have a billion strangers connecting to a website.

## Scenario 2: two keys instead of one

The escape from that trap is [public-key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography), published in the 1970s and still one of the strangest useful ideas I know. Instead of one shared key, you generate a linked pair:

A public key, which you give to anyone who asks. A private key, which never leaves your machine.

The two are mathematically related, but the relationship only runs one way in practice. Anything encrypted with the public key can only be decrypted with the private key, and knowing the public key doesn't let you work out the private one. That's what makes publishing it safe. The public key can lock but can't unlock, so handing it to the world costs you nothing.

Now the exchange has a path forward:

1. The server sends its public key to the client. Everyone can see it, and that's fine.
2. The client generates a symmetric key, encrypts it with the server's public key, and sends it back.
3. Only the private key on the server can decrypt that. The attacker watching the wire has both the public key and the encrypted blob, and neither helps him.

Both sides now share a symmetric key that never travelled in readable form.

A fair question at this point: if asymmetric encryption works, why bring the symmetric key back at all? Speed. Asymmetric operations are enormously slower, and a browser session moves a lot of data. So the expensive tool is used briefly to establish a shared secret, and the fast tool handles the actual traffic. That combination is called a hybrid cryptosystem, and it's what every HTTPS connection does.

This design looks complete. It held up for me the first time I read it. It has a hole.

### The attack that breaks it

Here's the question the design never asks: when that public key arrives at the browser, how does the browser know it came from the server?

It doesn't. A public key is a number. Numbers don't have return addresses.

So put an attacker on the path who doesn't just watch but intervenes:

1. The server sends its public key. The attacker intercepts it and keeps it for himself.
2. The attacker generates his own key pair and sends his public key to the client, claiming it's the server's. The client can't tell the difference, because there is no difference to see.
3. The client encrypts the symmetric key with the attacker's public key and sends it back.
4. The attacker decrypts it with his private key. He now holds the symmetric key.
5. He re-encrypts that same symmetric key with the real server's public key and passes it along.

Now look at what each side sees. The server received a symmetric key encrypted with its public key, exactly as expected. The client got a connection that works. The page loads. Nothing is slow, nothing errors, nothing looks wrong. And the attacker sits in the middle holding the symmetric key, decrypting everything in both directions, reading it, and forwarding it on.

This is a [man-in-the-middle attack](https://en.wikipedia.org/wiki/Man-in-the-middle_attack), and I want to be precise about what failed, because it's easy to blame the wrong thing.

The encryption didn't break. No algorithm was defeated. The maths worked perfectly the entire time. What failed was identity. The client had strong encryption with someone, and no way to find out who.

That distinction is the whole reason certificates exist.

## Scenario 3: bring in someone both sides trust

You can't fix this with more cryptography between the two parties. Two strangers who have never communicated cannot bootstrap trust purely from each other, because every message one sends could have been sent by an impostor. Something has to come from outside the conversation.

That something is a [certificate authority](https://en.wikipedia.org/wiki/Certificate_authority), or CA. [Let's Encrypt](https://en.wikipedia.org/wiki/Let%27s_Encrypt), DigiCert, Google Trust Services, Sectigo, and around a hundred others.

A CA does one job: it vouches that a particular public key belongs to a particular domain name.

### Getting a certificate

When you set up a server, you generate your key pair locally. Then you send the CA a Certificate Signing Request containing your public key and the domain you're claiming. Let's Encrypt's documentation is blunt about the boundary here: your private key is generated and managed on your own servers, and they never see it.

Before signing anything, the CA checks that you actually control the domain. Let's Encrypt does this through the [ACME protocol](https://en.wikipedia.org/wiki/Automatic_Certificate_Management_Environment), which issues you a challenge: put a specific file at a specific URL on that domain, or add a specific DNS record. Only someone with real control can do that. It's a low bar compared to older validation types that checked company registration documents, but it's the bar that matters for the attack we're trying to stop.

Pass the challenge and the CA issues a [certificate](https://en.wikipedia.org/wiki/Public_key_certificate), a structured file in [X.509](https://en.wikipedia.org/wiki/X.509) format. Inside it: your public key, your domain name, validity dates, who issued it, and a signature.

### How signing actually works

This is the part I see explained wrong most often, including on large tech sites, so it's worth slowing down.

Two ingredients. First, a [hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function) like [SHA-256](https://en.wikipedia.org/wiki/SHA-2). Feed it any input, get a fixed-size fingerprint out. Same input always produces the same fingerprint, changing a single byte produces a completely different one, and you can't reverse it to recover the input. Second, a [digital signature](https://en.wikipedia.org/wiki/Digital_signature), which is the key pair used backwards from encryption.

That reversal is the piece to hold onto, because the two operations run in opposite directions:

When you encrypt, anyone can lock with the public key and only the owner can unlock with the private key. When you sign, only the owner can sign with the private key and anyone can verify with the public key.

So when the CA signs your certificate, it hashes the certificate contents, signs that hash with its own private key, and attaches the result.

When your browser checks the certificate, it hashes the contents itself using the same algorithm, then verifies the attached signature against that hash using the CA's public key.

If verification passes, two separate facts are established at once, which is easy to miss.

The CA really issued this, because only its private key produces a signature that verifies against its public key. And nobody modified the certificate afterwards, because the hash the browser computed matches the one sealed inside the signature. Change the domain name in transit and the hashes diverge instantly.

Two mistakes I'd flag, since both are common enough that you'll meet them in the wild.

The CA signs with its private key, not its public key. I've found this error published on mainstream technology sites, and it's worth understanding why it's not a typo but a collapse of the whole idea. The CA's public key is sitting on billions of devices. If signing used it, anyone could produce a valid signature on any certificate they liked, and the signature would prove nothing at all. Hard to produce, easy to check. That asymmetry is the entire product.

The browser doesn't regenerate the signature and compare. It can't, because it has no private key. It verifies one. You'll often see verification described as decrypting the signature with the public key to recover the hash. That's a serviceable mental model for [RSA](https://en.wikipedia.org/wiki/RSA_cryptosystem), but it isn't literally what the operation does, and for [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm), which most modern certificates use, there's no decryption anywhere in it. "Verify the signature against the hash using the public key" is the phrasing that stays correct for both.

### Why the attacker loses now

Go back to the man in the middle and give him a certificate system to work around.

He can still intercept traffic. He can still generate a perfectly good key pair. What he cannot do is get a CA to sign a certificate binding his public key to a domain he doesn't control, because the CA checks that first. And the certificate carries the domain name inside it, which the browser compares against the site it asked for.

That leaves him three moves, all bad. He can forward the real certificate, but then the client encrypts to the real server's public key, and he doesn't have the matching private key, so he's locked out of his own attack. He can send his own unsigned certificate, and the browser rejects it. He can send a valid certificate for a domain he genuinely owns, and the browser sees the name doesn't match and rejects it.

The attack stops working.

## Where the trust actually comes from

One question is still open, and it's the one my own notes originally got wrong. To verify the CA's signature, the browser needs the CA's public key. Where does it get that?

Not from the network. If it fetched the CA's key over the network, the same attacker could intercept that too, and we'd be going in circles.

It's already on your device. Your operating system and browser ship with a trust store, a preinstalled collection of [root certificates](https://en.wikipedia.org/wiki/Root_certificate). Windows keeps it in the Certificate Store, macOS in Keychain, most Linux distributions under `/etc/ssl/certs/`, and Firefox carries its own list independent of the OS entirely, which is why a certificate can sometimes work in Chrome and fail in Firefox on the same machine.

You never picked any of these. Mozilla, Apple, Microsoft and Google decide what goes in, run audit programmes, and remove CAs that misbehave. It's a curated list you inherited by installing software.

Real certificates don't chain straight to a root. Root private keys are too valuable to keep online, so they live offline in hardware security modules and are used rarely. The root signs an intermediate CA, the intermediate signs your certificate, and verification walks up that chain until it reaches something in the trust store.

This is also a practical footgun. If your server sends its own certificate but forgets to send the intermediate, some clients will fail while browsers that cached the intermediate from another site work fine. It's a classic "works on my machine" bug in TLS configuration.

## What a real handshake does

The Scenario 2 exchange I described, where the client encrypts a symmetric key with the server's public key, is called RSA key transport. It's how TLS 1.2 could work. TLS 1.3 removed it completely in 2018.

Modern TLS uses ephemeral [Diffie-Hellman](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) instead. Rather than one side choosing a secret and sending it encrypted, both sides exchange values that let each of them independently derive the same shared secret, which is never transmitted in any form. An observer recording the entire conversation still can't reconstruct it.

The reason this matters is [forward secrecy](https://en.wikipedia.org/wiki/Forward_secrecy). Under RSA key transport, an attacker could record your encrypted traffic today, steal the server's private key in two years, and retroactively decrypt everything. With ephemeral keys there's nothing to steal later, because the keys existed only for that one session and were discarded.

So in TLS 1.3, the certificate's job is narrower than my Scenario 3 suggests. It doesn't carry the key. It only proves identity, which is exactly the thing Scenario 2 was missing.

## What this fix costs

I'd rather not end on a clean note, because the certificate system isn't clean.

Any CA in your trust store can issue a certificate for any domain. Not just your CA. Any of them. So the system is only as trustworthy as its least trustworthy member, across roughly a hundred organisations in a dozen jurisdictions.

That isn't a theoretical worry. In 2011, a Dutch CA called [DigiNotar](https://en.wikipedia.org/wiki/DigiNotar) was breached. The attacker issued fraudulent certificates for Google domains, and those certificates were used against Iranian internet users, whose traffic could then be intercepted while their browsers displayed a padlock. DigiNotar was pulled from every major trust store and was bankrupt within weeks.

The response to that class of failure is [Certificate Transparency](https://en.wikipedia.org/wiki/Certificate_Transparency): CAs now publish every certificate they issue to public append-only logs, so a domain owner can watch for certificates nobody at their company requested. It doesn't prevent misissuance. It makes it loud.

The same interception mechanism also gets used openly. Corporate laptops routinely have an employer's root certificate installed, which lets a proxy generate certificates on the fly for every site an employee visits and read all the traffic inside. The padlock shows the entire time. Developer tools like mitmproxy work the same way, which is genuinely useful and also a good reason to think twice before following a tutorial that tells you to install a root certificate to make an error go away.

Which brings me to the thing I wish someone had told me at the start. The padlock means the connection is encrypted and the certificate chains to something your device was configured to trust. That's it. It doesn't mean the site is honest, it doesn't mean the company is legitimate, and it doesn't mean nobody is reading your traffic. A phishing site can get a free certificate from Let's Encrypt in about thirty seconds, and it will have a padlock too.

## See it yourself

Reading about this is fine. Looking at a real certificate chain is better:

```bash
openssl s_client -connect google.com:443 -showcerts
```

To see what your own machine trusts:

```bash
ls /etc/ssl/certs/ | head -20
```

And to inspect a certificate file directly:

```bash
openssl x509 -in cert.pem -text -noout
```

You'll see the issuer, the subject, the validity dates, the public key, and the Subject Alternative Name field carrying the domains the certificate covers.

Encryption was never the hard part. Knowing who's on the other end was.
