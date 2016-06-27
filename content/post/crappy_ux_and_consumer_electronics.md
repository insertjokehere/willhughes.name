+++
date = "2016-06-27T22:49:23+12:00"
description = ""
draft = true
tags = []
title = "crappy_ux_and_consumer_electronics"
topics = []

+++

One of the weird things that happens as you go from being a teenager to being a student-who-is-still-a-teenager to being an actual bonafide adult is that you end up putting a lot of time and thought into purchacing decisions that you never really considered relevant before. I recently purchaced a microwave. I treated this process much like I would any other purchacing process for a piece of electronic goods; that is I went to a store, assessed which of the available

At the end of this, I had parted with a small sum of money, and in exchange was now the proud owner of... a microwave. A device which through the magic of physics makes cold things hot, frozen things a uniformly inappropriate temperature and warm things capable of melting through the bench. Sure, it has more features than the standard punch-in-the-time-and-press-go model - I am a bit of a geek after all - it has a preset for popcorn, it knows how to reheat baked beans, and it has a defrost setting that I guess technically isn't a bold-faced lie, given that things do get less frosty in places. What I am trying to say is that it does, essentially, perform the function that it is designed to perform.

It is also the most horribly agravating piece of consumer electronics I have ever purchaced, and I paid actual money for a cell phone that ran Windows Mobile.

Thats probably a little harsh. For the most part, the microwave does well. The display is clear and well laid out. The controls are reasonably intuitive and it only took me 30 seconds to figure out how to just start the damn timer already. This paticular piece of UX agravation comes about because of something I'm sure the designers of this device considered a bit of a corner case - people are generally speaking quite impatitiant, and that goes double when they are hungry. Consider this: you are a microwave, and someone has carefully entered - using your expertly designed and intuitive controls - that they want exactly four hundred grams of baked beans to be heated to 12 degrees beyond what a regular human could concieveably eat without causing significant burns. Your algorithms calculate that this will take six minutes and eighteen seconds, but oh! shock! four and a half minutes in someone opens your door.

This is something of a conundrum. You have some state that you wish to preserve, and you want to avoid situations where users are confused because they expect the device to be configured one way - beans, baked, far too hot - and find it reset back to the default, or equally as bad put something in the microwave hours later and press 'Go' expecting their mug of luke warm tea to be reheated for the default 30 seconds, and be shocked to find that is now a well cooked bean. This is mode-confusion: a device has multiple modes that it can be set to, and performs differently in different modes. If users aren't aware - or able to easily identify - what mode a device is in, they might supply inputs that are inappropriate for the mode without realizing it. This is a real problem for avionics and industrial control systems - several air accidents have occured because of mode confusion around automated pilot systems - but is less of a big deal for a piece of consumer electronics.

Which leads me back to the agravation I find with this microwave. In order to avoid mode confusion, the designers of this microwave decided that they needed to make sure the user was made aware of the fact that the microwave had given up waiting, and reset itself back to its default mode.

It does this by beeping at you. Twice.

_beep beeep_

Dearist Human,
It has come to my attention that you aborted your preset cooking program ninety percent through and have not instructed me to restart it for two minutes, therefore I am assuming that you are no longer in need of my services at this time. I feel it fitting to inform you of this fact, and to remind you that if you desire my services again, you need only to ask.

Yours Faithfully,
Microwave


Dearist Microwave,
Please kindly shut the hell up.

Yours Sledgehammeringly,
Will

Before you dismiss this complaint as being a minor nit-pick, consider the implicit assumption that caused the designers to implement this feature:

"This Microwave is so good at performing its function, so special, that its state will be an important piece of information to the user - even after they have finished using it. Further more, it will be so important that it is appropriate for the Microwave to interupt the user, and demand their attention to communicate to them a change in state"

Its about the same as if Firefox were to jump into the foreground after you left it alone for awhile to remind you that you left it open in the background.

Or if a game on your phone popped up a notification when you hadn't played it for a day to remind you it was still installed.
