+++
date = "2016-09-04T17:18:20+12:00"
description = ""
draft = false
tags = ["Security", "Policy"]
title = "Comments on recent problems with the WoSign CA"
topics = []

+++

I recently sent the following to the `mozilla.dev.security.policy` mailing list as a response to [a thread](https://groups.google.com/forum/#!topic/mozilla.dev.security.policy/k9PBmyLCi8I%5B1-25%5D) detailing misbehavior by the Chinese 'WoSign' CA.

<!--more-->

For context, WoSign are a certificate authority who participate in (among others) the Mozilla Root Trust program, and as such are able to issue TLS certificates which are trusted by most internet users. Recently it has been discovered that WoSign have mis-issued a number of certificates, some through software bugs and some through bad policy.

### The Original Message

Hello,

First of all let me state that I am in no way involved in the operation of a certificate authority, nor am I involved in setting CA policy for any organization; I am merely an interested observer. I am a user of Mozillas' trust store, both directly through Firefox and Thunderbird, and indirectly by using pieces of software that rely on NSS. I have previously been a customer of WoSign, but am not currently{{< ann 1 >}}.

Addressing Mozillas' response to WoSigns' breach:

* Surely there is precedent from previous violations by other CAs that can be used to inform this decision? How did Mozilla handle the [October 2015 incident](https://security.googleblog.com/2015/10/sustaining-digital-certificate-security.html) in which Symantec mis-issued over 2500 certificates? While the scale appears to be different, the facts of that incident are not too dissimilar to this one; a CA mis-issued a number of certificates, and failed to adequately notify trust store operators of this.

* While there doesn't seem to be a great deal of dispute over the facts of this incident, it seems to me that in the very short term (ie, the next fortnight) it would be useful if WoSign were required to produce an incident report detailing:
    - The precise extent of the incident, detailing every certificate that was mis-issued and to whom, to reassure the community that these bugs are not being used maliciously
    - The current status (revocation, CT presence) of all mis-issued certificates.
    - An assessment as to the cause of the incident{{< ann 2 >}}
    - Details as to the measures already undertaken to rectify the defects
    - Details of future measures that will be undertaken to prevent further problems
  The purpose of this is to re-establish some small amount of trust that WoSign can be permitted to continue operating while a longer-term plan is discussed

* I do not know what should be done in the longer term, but I suggest that the focus of this discussion be on finding ways to permit WoSign to prove that they are fit to participate in the Root Trust programme, so long as WoSign are willing to engage and proactively work to restore trust. If WoSign do not wish to work to restore trust, then removal from the programme would have to be considered. Care must be taken to not unduly punish WoSigns' customers, while at the same to the safety of the wider internet community must be assured.

Addressing this issue in general; WoSign have claimed that their failure to report this incident came about from a misunderstanding of the English language documents by their staff who do not all speak English. While this is clearly not a valid excuse, is this something Mozilla needs to consider to prevent similar incidents in the future? Surely a significant proportion of CA operators face a similar language barrier?

Thank you all for your time,

Will Hughes

#### Notes
1. {{< ann_text 1 >}}I issued two certificate via WoSign in May 2016 for hosts that were not internet facing, because it was impractical for me to issue LetsEncrypt certs for those hosts. I have since updated my tooling, issued LetsEncrypt certs and revoked the WoSign certs. I note that neither of the WoSign certs appear on crt.sh
2. {{< ann_text 2 >}}I understand that in the short time frame, a full post-mortem may not be practical, but an initial assessment of the causes of the incident should have already been completed
