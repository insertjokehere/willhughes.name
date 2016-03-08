+++
date = "2014-03-28T23:17:13+13:00"
description = ""
draft = true
tags = ["Puppet", "SSL"]
title = "puppet-basicca"
topics = []
aliases = ["/projects/puppet-basicca/"]
+++

[puppet-basicca](https://github.com/insertjokehere/puppet-basicca) is a puppet module designed to automate the process of creating SSL certificates, paticularly self-signed certificates. I also use it to create certificate signing requests (CSRs) to submit to the authorities who sign my certificates (at time of writing, ~~[StartCOM](http://www.startssl.com/")~~ [Namecheap](https://www.namecheap.com/security/ssl-certificates/domain-validation.aspx){{< ann 1 >}}).

<!--more-->

The readme in the [Git repo](https://github.com/insertjokehere/puppet-basicca/blob/master/readme.md) has some detailed usage examples, but simply:

{{< highlight puppet >}}
basicca::certrequest{ $fqdn:
  keypath => "/etc/ssl/${::fqdn}.key",
  csrpath => "/etc/ssl/${::fqdn}.csr",
  subject => {
    'CN' => $::fqdn,
  },
}
{{< /highlight >}}

will produce a signing request for the FQDN of the node the manifest is running on

#### Notes
1. {{< ann_text 1 >}}And only when I need a cert for a year - like this blog for instance, because replacing a cert on Cloudfront in a pain, and Amazon didn't have their own CA when I set things up. Most of my things now use Lets Encrypt certs
