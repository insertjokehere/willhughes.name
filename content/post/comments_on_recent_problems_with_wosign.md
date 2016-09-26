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

_The situation is ongoing, see updates at the bottom of the post_

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

### Update 07/09/16

* My message to this list has been released by the moderator, read it [here](https://groups.google.com/d/msg/mozilla.dev.security.policy/k9PBmyLCi8I/mi6vaappDgAJ)
* Since I published my message, the WoSign certs I issued{{< ann 1 >}} have been published to WoSigns' CT log
* WoSign have [published](https://groups.google.com/d/msg/mozilla.dev.security.policy/k9PBmyLCi8I/BU85QtmzDQAJ) an [initial report](https://www.wosign.com/report/wosign_incidents_report_09042016.pdf) into the incident. In my opinion, this report is very light on details, and reads more as an ass-covering exercise. WoSign have [promised](https://groups.google.com/d/msg/mozilla.dev.security.policy/k9PBmyLCi8I/3VgNhi42DgAJ) that they will be publishing a further report, exactly what this will cover is unclear
* Peter Bowen also [highlighted](https://groups.google.com/d/msg/mozilla.dev.security.policy/k9PBmyLCi8I/zs9x0nSjDQAJ) that WoSign have issued two certificates using the unapproved 'SM2' algorithm using their live CA cert, in violation of the Baseline Requirements
* I am starting to feel that the problems WoSign are having are not small, isolated screwups but the result of systematic failure on their part:
  - Richard Wang{{< ann 3 >}} [clarified](https://groups.google.com/d/msg/mozilla.dev.security.policy/k9PBmyLCi8I/QE90nepQDgAJ) that the first mis-issued GitHub cert was held for manual review, and approved by a human reviewer. The cert was held for review because it contained the name 'github', which is on WoSigns' list of domains that need to be reviewed to avoid abuse. The mistake was only found when the researcher attempted to issue another GitHub cert abusing the same bug, and the reviewer noticed and checked to see if other certs had been issued the same way
  - WoSigns' insistence that by publishing all certificates to a CT log they ["prevent the mis-issuance in the future"](https://bugzilla.mozilla.org/show_bug.cgi?id=1293366#c4) of invalid certs is either disingenuous or a sign of staggering incompetence. As a certificate authority, their job is to not issue bad certificates in the first place - publishing all certs to CT only helps the public catch them when they break the rules, it does nothing to stop the rule breaking in the first place
* Because of the way WoSigns' roots are cross-signed by other more reputable CAs{{< ann 4 >}}, it is impossible to preemptively distrust WoSign without breaking trust for a large number of legitimate sites using certs from reputable CAs

### Update 19/09/16

* WoSign have published their [final report](https://www.wosign.com/report/WoSign_Incident_Final_Report_09162016.pdf) on the matter

### Update 27/09/16

Mozilla have [announced](https://groups.google.com/forum/#!topic/mozilla.dev.security.policy/NAH6NVf3JPI) plans to remove trust in WoSign and StartCom because of these issues:

> Mozilla’s CA team has lost confidence in the ability of WoSign/StartCom to faithfully and competently discharge the functions of a CA. Therefore we propose that, starting on a date to be determined in the near future, Mozilla products will no longer trust newly-issued certificates issued by either of these two CA brands. We plan to distrust only newly-issued certificates to try and reduce the impact on web users, as both of these CA brands have substantial outstanding certificate corpuses. Our proposal is that we determine “newly issued” by examining the notBefore date in the certificates. It is true that this date is chosen by the CA and therefore WoSign/StartCom could back-date certificates to get around this restriction. And there is, as we have explained, evidence that they have done this in the past. However, many eyes are on the Web PKI and if such additional back-dating is discovered (by any means), Mozilla will immediately and permanently revoke trust in all WoSign and StartCom roots.

The [document they published](https://docs.google.com/document/d/1C6BlmbeQfn4a9zydVi2UvjBGv6szuSB4sMYUcVrR8vQ/edit#heading=h.39xcc9qyz431) goes into a lot of detail as to why this is happening, but the short version is:

* Repeatedly issuing SHA-1 certificates in violation of the Baseline Requirements
* WoSign failing to correctly disclose that they had taken technical control of the StartCom CA

In addition to removing trust in the CAs, Mozilla will no longer accept audits completed by Ernst & Young (Hong Kong) because of their failure to detect and report issues that they should have found.


#### Notes
1. {{< ann_text 1 >}}I issued two certificate via WoSign in May 2016 for hosts that were not internet facing, because it was impractical for me to issue LetsEncrypt certs for those hosts. I have since updated my tooling, issued LetsEncrypt certs and revoked the WoSign certs. I note that neither of the WoSign certs appear on crt.sh
2. {{< ann_text 2 >}}I understand that in the short time frame, a full post-mortem may not be practical, but an initial assessment of the causes of the incident should have already been completed
3. {{< ann_text 3 >}}CEO of WoSign
4. {{< ann_text 4 >}}This is not an uncommon practice, Lets Encrypts' roots are trusted this way
