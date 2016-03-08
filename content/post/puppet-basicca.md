+++
date = "2014-03-28T23:17:13+13:00"
description = ""
draft = true
tags = ["Puppet", "SSL"]
title = "puppet-basicca"
topics = []
aliases = ["/projects/puppet-basicca/"]
+++

puppet-basicca is a puppet module designed to automate the process of creating SSL certificates, paticularly self-signed certificates. I also use it to create certificate signing requests (CSRs) to submit to the authorities who sign my certificates (at time of writing, <a href="http://www.startssl.com/" target="_blank">StartCOM</a>).

<!--more-->

The readme in the Git repo has some detailed usage examples, but simply:

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
