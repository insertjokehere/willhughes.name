+++
date = "2016-06-28T22:27:57+12:00"
description = ""
draft = false
tags = ["Soapbox", "UX", "Microwaves"]
title = "Crappy UX and Consumer Electronics"
topics = []

+++

One of the weird things that happens as you go from being a teenager to being a student-who-is-still-a-teenager to being an actual bona fide adult is that you end up putting a lot of time and thought into purchasing decisions that you never really considered relevant before. I recently purchased a microwave.

<!-- more -->

I treated this process much like I would any other purchasing process for a piece of electronic goods; that is I went to a store, assessed which of the available models seemed to best fit my needs. I read reviews. I compared prices. I searched my soul to determine what was more important: a popcorn mode or a soup mode? I compared wattages. I calculated internal volumes. I considered opportunity costs.

At the end of this, I had parted with a small sum of money, and in exchange was now the proud owner of... a microwave. A device which through the magic of physics makes cold things hot, frozen things a uniformly inappropriate temperature and warm things capable of melting through the bench. Sure, the model I settled on has more features than the standard punch-in-the-time-and-press-go model - I am a geek after all - it has a preset for popcorn, it knows how to reheat baked beans, it can melt butter on demand and it has a defrost setting that I guess technically isn't a bold-faced lie, given that things do get less frosty in places. What I am trying to say is that it does, essentially, perform the function that it was advertised to perform.

It is also the most horribly aggravating piece of consumer electronics I have ever purchased, and I paid actual money for a cell phone that ran Windows Mobile.

That's probably a little harsh. For the most part, the microwave does well. The display is clear and well laid out. The controls are reasonably intuitive and it only took me 30 seconds to figure out how to just start the damn timer already. This particular piece of UX aggravation comes about because of something I'm sure the designers of this device considered a bit of a corner case - people are generally speaking quite impatient, and that goes double when they are hungry. Consider this: you are a microwave, and someone has carefully entered - using your expertly designed and intuitive controls - that they want exactly four hundred grams of baked beans to be heated to 12 degrees beyond what a regular human could conceivably eat without causing significant burns. Your algorithms calculate that this will take six minutes and eighteen seconds, but oh! shock! four and a half minutes in someone opens your door.

This is something of a conundrum. You have some state that you wish to preserve, and you want to avoid situations where users are confused because they expect the device to be configured one way - beans, baked, far too hot - and find it reset back to the default, or equally as bad put something in the microwave hours later and press 'Go' expecting their mug of luke warm tea to be reheated for the default 30 seconds, and be shocked to find that is now a well cooked bean. This is mode-confusion: a device has multiple modes that it can be configured in, and performs differently in different modes. If users aren't aware - or able to easily identify - what mode a device is in, they might supply inputs that are inappropriate for the mode without realizing it. This is a real problem for avionics and industrial control systems - several air accidents have occurred because of mode confusion around automated pilot systems - but is less of a big deal in a piece of consumer electronics.

Which leads me back to the aggravation I find with this microwave. In order to avoid mode confusion, the designers of this microwave decided that they needed to make sure the user was made aware of the fact that the microwave had given up waiting, and reset itself back to its default mode.

It does this by beeping at you. Twice.

_beep beep_

<code>Dearest Human,</code>

<code>It has come to my attention that you aborted your preset cooking program one minute and forty-eight seconds from the end and have not instructed me to restart it for two minutes, therefore I am assuming that you are no longer in need of my services at this time. I feel it fitting to inform you of this fact, and to remind you that if you desire my services again, you need only to ask.</code>

<code>Yours Faithfully,<br />
Microwave</code>

<code>Dearest Microwave,</code>

<code>Please kindly shut the hell up.</code>

<code>Yours Sledgehammeringly,<br />
Will</code>

Before you dismiss this complaint as being a minor nit-pick, consider the implicit assumption that caused the designers to implement this feature:

"This Microwave is so good at performing its function, so special, that its state will be an important piece of information to the user - even after they have finished using it. Further more, it will be so important that it is appropriate for the Microwave to interrupt the user, and demand their attention to communicate to them a change in state"

Its about the same as if Firefox were to jump into the foreground after you left it alone for awhile to remind you that you left it open in the background.

Or if your TV made a reassuring *dong* noise when it switched itself into standby mode.

Or if your heatpump played three bars of _Ode to Joy_ when it had reached the desired temperature.

I seem to have gotten sidetracked somewhat, but my point is this: attention is a finite resource, and machines that demand it unnecessarily are selfish; they have - or more, they were designed with - an undue sense of their own importance.
