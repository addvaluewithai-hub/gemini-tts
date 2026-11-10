# techforbadguys — 10 November 2026 — "Four things broke on Earth this week"

Format: fast news recap, no intro and no backstory. The host's own story is
told in a separate clip. Voice: Puck, fast delivery.

## Script

November tenth, twenty twenty six. Four things broke on Earth this week. Let's go.

Number one. Vanderbilt University got hit with ransomware yesterday, and the entire network went dark. The official advice to staff: shut down your devices, disconnect from the Wi-Fi, and remain extremely vigilant. So the security plan is, unplug it, and look around nervously.

One employee watched her laptop announce a system update. Then announce it was deleting old files. Then announce the ransom. Honestly, great communication. Better than most I T departments.

Number two. Fireworks A I, a company that hosts A I models for developers, just disclosed its second breach in about a month. The attackers came in through somebody else's cloud, and got to models that weren't even finished. That's like stealing homework that isn't done yet.

Number three, and this one is a classic. S S H is the front door of basically every server on Earth. Researchers found that if an account has its password turned off, you can still log in, by typing a really long password. Two hundred and fifty seven characters or more. That's it. That's the whole hack.

The bug has been sitting there since twenty sixteen. It was added by a fix for a different bug. It's called S S Hole. And attackers were using it within hours.

Number four. DigiCert. A company whose entire job is proving that people are who they say they are. During a server migration, they left an internal archive open to the internet. Inside: customer passports and driver's licenses. The identity verification company leaked the identities.

That's the report. Patch your servers, check what your last migration left open, and maybe don't use unplugging the Wi-Fi as a strategy. This has been tech for bad guys. See you next time.

## Sources

- Vanderbilt University ransomware, 9 November: Nashville Banner, https://nashvillebanner.com/2026/11/09/vanderbilt-university-cyberattack-byod/
- Fireworks AI second breach, disclosed 10 November: BleepingComputer, https://www.bleepingcomputer.com/news/security/fireworks-ai-discloses-new-breach-after-cloud-provider-hack/
- OpenSSH "SSHole" (CVE-2026-123158), exploited within hours: The Hacker News, https://thehackernews.com/2026/11/hackers-exploited-openssh-sshole-flaw.html
- DigiCert archive exposure, reported 5 to 6 November: BleepingComputer, https://www.bleepingcomputer.com/news/security/digicert-data-breach-exposes-customer-information-identity-documents/ ; The Register, https://www.theregister.com/a/5308097

Accuracy notes: the SSHole bypass needs an account with its password disabled
on a system using musl libc without PAM (Alpine Linux by default). DigiCert
says only a small minority of archived files held identity documents. The
Gemini 4 Carbon item from Field Report 001 was dropped: no primary source
confirms it became generally available on 10 November.
